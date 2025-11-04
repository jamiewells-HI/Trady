import { Upload, X } from "lucide-react";
import { useState } from "react";

export function NewListingPage() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Create New Listing</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              placeholder="What are you trading?"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Describe your item in detail..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Category</label>
              <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black">
                <option>Select category</option>
                <option>Water Sports</option>
                <option>Camping</option>
                <option>Clothing</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Condition</label>
              <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black">
                <option>Select condition</option>
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block mb-2">Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-black transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* What you're looking for */}
          <div>
            <label className="block mb-2">What are you looking to trade for?</label>
            <input
              type="text"
              placeholder="e.g., Bicycle, Camera, etc."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Listing
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
