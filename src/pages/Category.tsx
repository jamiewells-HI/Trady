import { ItemCard } from "../components/ItemCard";

interface CategoryPageProps {
  category: string;
  onProductClick?: (productId: string) => void;
}

const categoryItems: Record<string, Array<{ id: number; title: string; description: string; isAd?: boolean }>> = {
  "water-sports": [
    { id: 1, title: "Kayak", description: "Single person kayak with paddle", isAd: true },
    { id: 2, title: "Surfboard", description: "Longboard, excellent condition" },
    { id: 3, title: "Paddle Board", description: "Inflatable SUP with accessories" },
    { id: 4, title: "Wetsuit", description: "Full body, size M" },
    { id: 5, title: "Snorkel Set", description: "Mask, snorkel and fins included" },
    { id: 6, title: "Water Skis", description: "Professional grade equipment" },
    { id: 7, title: "Life Jacket", description: "Adult size, coast guard approved" },
    { id: 8, title: "Diving Fins", description: "Ad: Premium diving gear", isAd: true },
  ],
  camping: [
    { id: 1, title: "Tent - 4 Person", description: "Easy setup, weatherproof", isAd: true },
    { id: 2, title: "Sleeping Bag", description: "Winter rated, -10°C" },
    { id: 3, title: "Camping Stove", description: "Portable gas stove" },
    { id: 4, title: "Backpack", description: "60L hiking backpack" },
    { id: 5, title: "Camping Chair", description: "Foldable and lightweight" },
    { id: 6, title: "Cooler Box", description: "Large 50L capacity" },
    { id: 7, title: "Headlamp", description: "Ad: Rechargeable LED", isAd: true },
    { id: 8, title: "Water Filter", description: "Portable purification system" },
  ],
  clothing: [
    { id: 1, title: "Hiking Boots", description: "Size 10, waterproof", isAd: true },
    { id: 2, title: "Rain Jacket", description: "Breathable, size L" },
    { id: 3, title: "Fleece Pullover", description: "Warm and cozy, size M" },
    { id: 4, title: "Cargo Pants", description: "Outdoor pants, size 32" },
    { id: 5, title: "Winter Gloves", description: "Insulated, touchscreen compatible" },
    { id: 6, title: "Beanie Hat", description: "Ad: Wool blend, one size", isAd: true },
    { id: 7, title: "Thermal Base Layer", description: "Moisture-wicking, size L" },
    { id: 8, title: "Hiking Socks", description: "Merino wool, size 9-11" },
  ],
};

export function CategoryPage({ category, onProductClick }: CategoryPageProps) {
  const items = categoryItems[category] || [];
  const categoryName = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-6">{categoryName}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {items.map((item) => (
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
