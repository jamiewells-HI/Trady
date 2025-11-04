import { Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ItemCardProps {
  id?: string | number;
  title: string;
  description: string;
  image?: string;
  isAd?: boolean;
  onSave?: () => void;
  onClick?: () => void;
}

export function ItemCard({ 
  id,
  title, 
  description, 
  image, 
  isAd = false,
  onSave,
  onClick 
}: ItemCardProps) {
  return (
    <div 
      className="bg-white rounded-md shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-square bg-gray-200 rounded-t-md overflow-hidden">
          {image ? (
            <ImageWithFallback 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              <span className="transform -rotate-12">Filler Image</span>
            </div>
          )}
        </div>
        
        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Heart className="w-3 h-3" />
        </button>

        {/* Ad badge */}
        {isAd && (
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
            Ad
          </div>
        )}
      </div>

      <div className="p-1.5">
        <h3 className="mb-0.5 line-clamp-1 text-xs">{title}</h3>
        <p className="text-gray-600 line-clamp-1 text-xs">{description}</p>
      </div>
    </div>
  );
}
