import { ArrowLeft, Heart, MapPin, Calendar, User as UserIcon, MessageCircle, Handshake } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { toast } from "sonner@2.0.3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

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
    seller: "John Doe",
    userId: "mock-user-1"
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
    seller: "Sarah M.",
    userId: "mock-user-2"
  },
};

export function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const { user, accessToken } = useAuth();
  const product = mockProducts[productId] || mockProducts["1"];
  
  const [isSaved, setIsSaved] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerItems, setOfferItems] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Check if listing is saved
    if (user && accessToken) {
      api.getSavedListings(accessToken)
        .then(data => {
          setIsSaved(data.savedListings?.includes(productId) || false);
        })
        .catch(err => console.error("Error checking saved status:", err));
    }
  }, [user, accessToken, productId]);

  const handleSave = async () => {
    if (!user || !accessToken) {
      toast.error("Please sign in to save listings");
      return;
    }

    try {
      if (isSaved) {
        await api.removeSavedListing(productId, accessToken);
        setIsSaved(false);
        toast.success("Removed from saved listings");
      } else {
        await api.saveListing(productId, accessToken);
        setIsSaved(true);
        toast.success("Added to saved listings");
      }
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error("Failed to update saved listings");
    }
  };

  const handleContact = () => {
    if (!user || !accessToken) {
      toast.error("Please sign in to contact the seller");
      return;
    }
    setShowContactDialog(true);
  };

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);
    try {
      await api.sendMessage({
        listingId: productId,
        recipientId: product.userId,
        subject: `Inquiry about: ${product.title}`,
        message: contactMessage,
      }, accessToken!);
      
      toast.success("Message sent successfully!");
      setShowContactDialog(false);
      setContactMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleMakeOffer = () => {
    if (!user || !accessToken) {
      toast.error("Please sign in to make an offer");
      return;
    }
    setShowOfferDialog(true);
  };

  const handleSubmitOffer = async () => {
    if (!offerItems.trim()) {
      toast.error("Please describe what you're offering");
      return;
    }

    setSending(true);
    try {
      await api.createOffer({
        listingId: productId,
        recipientId: product.userId,
        offeredItems: offerItems,
        message: offerMessage,
      }, accessToken!);
      
      toast.success("Offer sent successfully!");
      setShowOfferDialog(false);
      setOfferItems("");
      setOfferMessage("");
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send offer");
    } finally {
      setSending(false);
    }
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
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleContact}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Seller
                </button>
                <button
                  onClick={handleSave}
                  className={`px-6 py-3 border-2 rounded-lg transition-colors ${
                    isSaved 
                      ? "bg-red-50 border-red-300 hover:bg-red-100" 
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>

              <button
                onClick={handleMakeOffer}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Handshake className="w-5 h-5" />
                Make an Offer
              </button>
            </div>

            {!user && (
              <p className="text-sm text-gray-600 mt-3 text-center">
                Sign in to contact the seller or make an offer
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>
              Send a message to {product.seller} about {product.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <textarea
              rows={6}
              placeholder="Write your message..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSendMessage}
                disabled={sending}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
              <button
                onClick={() => setShowContactDialog(false)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Make Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Trade Offer</DialogTitle>
            <DialogDescription>
              Propose what you'd like to trade for {product.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block mb-2 text-sm">What are you offering? *</label>
              <input
                type="text"
                placeholder="e.g., Canon Camera EOS R5, Mountain Bike"
                value={offerItems}
                onChange={(e) => setOfferItems(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Additional message (optional)</label>
              <textarea
                rows={4}
                placeholder="Add any additional details about your offer..."
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmitOffer}
                disabled={sending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {sending ? "Sending..." : "Send Offer"}
              </button>
              <button
                onClick={() => setShowOfferDialog(false)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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