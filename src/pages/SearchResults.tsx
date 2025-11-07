import { ChevronDown } from "lucide-react";
import { ItemCard } from "../components/ItemCard";
import { useState, useEffect } from "react";
import { api } from "../utils/api";

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  lookingFor: string;
  images: string[];
  userId: string;
  createdAt: string;
}

interface SearchResultsPageProps {
  searchQuery?: string;
  onProductClick?: (productId: string) => void;
}

export function SearchResultsPage({ searchQuery = "", onProductClick }: SearchResultsPageProps) {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const response = await api.getListings();
      setAllListings(response.listings || []);
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredListings = allListings.filter((listing) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.lookingFor?.toLowerCase().includes(query);

    const matchesCategory = category === "All" || listing.category === category;
    const matchesCondition = condition === "All" || listing.condition === condition;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  // Sort logic
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortOrder) {
      case "Newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "Oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "Title A-Z":
        return a.title.localeCompare(b.title);
      case "Title Z-A":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="mb-6">
        {searchQuery ? `Showing Trades With "${searchQuery}"...` : "All Trades"}
      </h1>

      {/* Filters */}
      <div className="bg-gray-200 rounded-lg p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <FilterDropdown 
            label="Category" 
            value={category} 
            options={["All", "water-sports", "camping", "clothing", "other"]}
            onChange={setCategory} 
          />
          <FilterDropdown 
            label="Condition" 
            value={condition} 
            options={["All", "new", "like-new", "good", "fair", "used"]}
            onChange={setCondition} 
          />
          <FilterDropdown 
            label="Sort By" 
            value={sortOrder} 
            options={["Newest", "Oldest", "Title A-Z", "Title Z-A"]}
            onChange={setSortOrder} 
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="mb-4 text-gray-600">
        Found {sortedListings.length} result{sortedListings.length !== 1 ? 's' : ''}
      </div>

      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {sortedListings.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.images?.[0]}
              onClick={() => onProductClick?.(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No items found matching your search criteria.
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ 
  label, 
  value, 
  options,
  onChange 
}: { 
  label: string; 
  value: string; 
  options: string[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span>{label}: {value}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[150px]">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  value === option ? 'bg-gray-100' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}