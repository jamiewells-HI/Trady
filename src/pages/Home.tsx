import { ChevronRight } from "lucide-react";
import { ItemCard } from "../components/ItemCard";
import { useEffect, useState } from "react";
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

interface HomePageProps {
  onProductClick?: (productId: string) => void;
}

export function HomePage({ onProductClick }: HomePageProps) {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

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

  const featuredItems = allListings.slice(0, 6);
  const otherTrades = allListings.slice(6);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Section */}
      {featuredItems.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2>Featured</h2>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {featuredItems.map((item) => (
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
          </div>
        </section>
      )}

      {/* All Trades Section */}
      {otherTrades.length > 0 && (
        <section>
          <h2 className="mb-6">All Trades</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {otherTrades.map((item) => (
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
        </section>
      )}

      {allListings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No listings available yet. Be the first to create one!
        </div>
      )}
    </div>
  );
}