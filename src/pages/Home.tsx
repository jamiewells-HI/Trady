import { ChevronRight } from "lucide-react";
import { ItemCard } from "../components/ItemCard";

const featuredItems = [
  { id: 1, title: "Mountain Bike", description: "Excellent condition, barely used" },
  { id: 2, title: "Kayak Set", description: "Complete with paddles and life vest" },
  { id: 3, title: "Tent - 4 Person", description: "Ad: Premium camping gear", isAd: true },
  { id: 4, title: "Surfboard", description: "Perfect for beginners" },
  { id: 5, title: "Hiking Boots", description: "Size 10, waterproof" },
  { id: 6, title: "Camping Stove", description: "Portable gas stove with fuel" },
];

const allTrades = [
  { id: 7, title: "Wetsuit", description: "Full body, size medium" },
  { id: 8, title: "Fishing Rod", description: "Ad: Professional grade equipment", isAd: true },
  { id: 9, title: "Backpack", description: "60L hiking backpack" },
  { id: 10, title: "Sleeping Bag", description: "Winter rated, -10°C" },
  { id: 11, title: "Climbing Rope", description: "50m dynamic rope" },
  { id: 12, title: "Life Jacket", description: "Coast guard approved" },
  { id: 13, title: "Camping Chair", description: "Foldable, lightweight" },
  { id: 14, title: "Water Filter", description: "Portable purification system" },
  { id: 15, title: "Cooler Box", description: "Large 50L capacity" },
  { id: 16, title: "Headlamp", description: "Rechargeable LED" },
  { id: 17, title: "Compass", description: "Professional navigation tool" },
  { id: 18, title: "First Aid Kit", description: "Complete wilderness kit" },
];

interface HomePageProps {
  onProductClick?: (productId: string) => void;
}

export function HomePage({ onProductClick }: HomePageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2>Featured</h2>
          <button className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors">
            See More
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {featuredItems.map((item) => (
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
      </section>

      {/* All Trades Section */}
      <section>
        <h2 className="mb-6">All Trades</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {allTrades.map((item) => (
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
      </section>
    </div>
  );
}
