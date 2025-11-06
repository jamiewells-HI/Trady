import { Upload, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { toast } from "sonner@2.0.3";

export function NewListingPage() {
  const { accessToken } = useAuth();
  const [images, setImages] = useState<{ file: File; preview: string; uploaded?: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    lookingFor: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error("Please sign in to create a listing");
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.condition) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      // Upload images first
      setUploading(true);
      const uploadedUrls: string[] = [];
      
      for (const image of images) {
        if (!image.uploaded) {
          const result = await api.uploadImage(image.file, accessToken);
          uploadedUrls.push(result.url);
        }
      }
      setUploading(false);

      // Create listing with uploaded image URLs
      const listing = {
        ...formData,
        images: uploadedUrls,
      };

      await api.createListing(listing, accessToken);
      toast.success("Listing created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        condition: "",
        lookingFor: "",
      });
      setImages([]);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create listing");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Create New Listing</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2">Title *</label>
            <input
              type="text"
              placeholder="What are you trading?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2">Description *</label>
            <textarea
              rows={4}
              placeholder="Describe your item in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Category *</label>
              <select 
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                <option value="water-sports">Water Sports</option>
                <option value="camping">Camping</option>
                <option value="clothing">Clothing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Condition *</label>
              <select 
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                required
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block mb-2">Images</label>
            
            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mb-3">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={image.preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-black transition-colors cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </label>
          </div>

          {/* What you're looking for */}
          <div>
            <label className="block mb-2">What are you looking to trade for?</label>
            <input
              type="text"
              placeholder="e.g., Bicycle, Camera, etc."
              value={formData.lookingFor}
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading images..." : submitting ? "Creating..." : "Create Listing"}
            </button>
            <button
              type="button"
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}