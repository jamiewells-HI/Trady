import { Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface ItemCardProps {
  id?: string | number;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string; // Support both prop names
  isAd?: boolean;
  onSave?: () => void;
  onClick?: () => void;
}

export function ItemCard({ 
  id,
  title, 
  description, 
  image, 
  imageUrl,
  isAd = false,
  onSave,
  onClick 
}: ItemCardProps) {
  const { user, accessToken } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if this item is saved
    if (user && accessToken && id) {
      api.getSavedListings(accessToken)
        .then(data => {
          setIsSaved(data.savedListings?.includes(String(id)) || false);
        })
        .catch(err => console.error("Error checking saved status:", err));
    }
  }, [user, accessToken, id]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user || !accessToken) {
      toast.error("Please sign in to save listings");
      return;
    }

    if (!id) {
      toast.error("Cannot save this item");
      return;
    }

    try {
      if (isSaved) {
        await api.removeSavedListing(String(id), accessToken);
        setIsSaved(false);
        toast.success("Removed from saved listings");
      } else {
        await api.saveListing(String(id), accessToken);
        setIsSaved(true);
        toast.success("Added to saved listings");
      }
      onSave?.();
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error("Failed to update saved listings");
    }
  };

  // Use either image or imageUrl prop
  const imageSrc = image || imageUrl;

  return (
    <div 
      className="bg-white rounded-md shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-square bg-gray-200 rounded-t-md overflow-hidden">
          {imageSrc ? (
            <ImageWithFallback 
              src={imageSrc} 
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
          onClick={handleSaveClick}
          className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-3 h-3 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
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