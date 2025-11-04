import { ItemCard } from "../components/ItemCard";

const savedItems = [
  { id: 1, title: "Mountain Bike", description: "Excellent condition, barely used" },
  { id: 2, title: "Kayak Set", description: "Complete with paddles and life vest" },
  { id: 3, title: "Surfboard", description: "Perfect for beginners" },
  { id: 4, title: "Hiking Boots", description: "Size 10, waterproof" },
  { id: 5, title: "Camping Stove", description: "Portable gas stove with fuel" },
  { id: 6, title: "Wetsuit", description: "Full body, size medium" },
  { id: 7, title: "Backpack", description: "60L hiking backpack" },
  { id: 8, title: "Sleeping Bag", description: "Winter rated, -10°C" },
];

interface SavedListingsPageProps {
  onProductClick?: (productId: string) => void;
}

export function SavedListingsPage({ onProductClick }: SavedListingsPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Saved Listings</h1>

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {savedItems.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              onClick={() => onProductClick?.(String(item.id))}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">You haven't saved any listings yet.</p>
          <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Browse Listings
          </button>
        </div>
      )}
    </div>
  );
}
