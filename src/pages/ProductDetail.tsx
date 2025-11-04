import { ArrowLeft, Heart, MapPin, Calendar, User as UserIcon } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
}

// Mock product data - in real app, this would come from API
const mockProducts: Record<string, any> = {
  "1": { 
    id: "1", 
    title: "Mountain Bike", 
    description: "Excellent condition, barely used. This bike has been meticulously maintained and is perfect for trail riding and mountain adventures.",
    category: "Sports",
    condition: "Like New",
    lookingFor: "Kayak or camping gear",
    location: "San Francisco, CA",
    postedDate: "Nov 1, 2024",
    seller: "John Doe"
  },
  "2": { 
    id: "2", 
    title: "Kayak Set", 
    description: "Complete with paddles and life vest. Great for beginners or experienced paddlers. Includes storage bag.",
    category: "Water Sports",
    condition: "Good",
    lookingFor: "Bicycle or hiking equipment",
    location: "Portland, OR",
    postedDate: "Oct 28, 2024",
    seller: "Sarah M."
  },
};

export function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const { user, accessToken } = useAuth();
  const product = mockProducts[productId] || mockProducts["1"];

  const handleSave = () => {
    console.log("Save product:", productId);
    // TODO: Implement save functionality with API
  };

  const handleContact = () => {
    console.log("Contact seller");
    // TODO: Implement messaging
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="transform -rotate-12 text-2xl">Product Image</span>
            </div>
          </div>
          
          {/* Thumbnail gallery */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  <span>{i}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {product.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {product.postedDate}
              </span>
            </div>
          </div>

          {/* Condition & Category */}
          <div className="flex gap-4">
            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Condition</p>
              <p>{product.condition}</p>
            </div>
            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p>{product.category}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Looking For */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="mb-2">Looking to trade for:</h3>
            <p className="text-gray-700">{product.lookingFor}</p>
          </div>

          {/* Seller Info */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p>Posted by</p>
                <p className="text-sm text-gray-600">{product.seller}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleContact}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Contact Seller
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {!user && (
              <p className="text-sm text-gray-600 mt-3 text-center">
                Sign in to contact the seller
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div className="mt-12">
        <h2 className="mb-6">Similar Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-md shadow-sm p-4">
              <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
              <p className="text-sm">Related Item {i}</p>
              <p className="text-xs text-gray-600">Brief description</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
