import { ChevronDown } from "lucide-react";
import { ItemCard } from "../components/ItemCard";
import { useState } from "react";

const searchResults = [
  { id: 1, title: "Kayak", description: "Ad: Premium water sports", isAd: true },
  { id: 2, title: "Paddle Board", description: "Inflatable SUP with pump" },
  { id: 3, title: "Snorkel Set", description: "Mask, snorkel, and fins" },
  { id: 4, title: "Water Skis", description: "Professional grade skis" },
  { id: 5, title: "Life Vest", description: "Adult size, coast guard approved" },
  { id: 6, title: "Wetsuit", description: "Ad: Full body protection", isAd: true },
  { id: 7, title: "Diving Mask", description: "Anti-fog professional mask" },
  { id: 8, title: "Swim Fins", description: "Ad: High performance fins", isAd: true },
  { id: 9, title: "Beach Umbrella", description: "Large UV protection" },
  { id: 10, title: "Surfboard", description: "Longboard, great condition" },
  { id: 11, title: "Boogie Board", description: "Perfect for kids" },
  { id: 12, title: "Water Shoes", description: "Size 9, quick dry" },
];

interface FilterOption {
  label: string;
  value: string;
}

interface SearchResultsPageProps {
  searchQuery?: string;
  onProductClick?: (productId: string) => void;
}

export function SearchResultsPage({ searchQuery = "water sports", onProductClick }: SearchResultsPageProps) {
  const [category, setCategory] = useState("None");
  const [type, setType] = useState("None");
  const [gender, setGender] = useState("None");
  const [sortOrder, setSortOrder] = useState("None");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="mb-6">Showing Trades With "{searchQuery}"...</h1>

      {/* Filters */}
      <div className="bg-gray-200 rounded-lg p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <FilterButton label="Category" value={category} onChange={setCategory} />
          <FilterButton label="Type" value={type} onChange={setType} />
          <FilterButton label="Gender" value={gender} onChange={setGender} />
          <FilterButton label="Sort Order" value={sortOrder} onChange={setSortOrder} />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {searchResults.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            isAd={item.isAd}
            onClick={() => onProductClick?.(String(item.id))}
          />
        ))}
      </div>
    </div>
  );
}

function FilterButton({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors">
      <span>{label}: {value}</span>
      <ChevronDown className="w-4 h-4" />
    </button>
  );
}
