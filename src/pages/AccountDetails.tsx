import { Mail, Phone, MapPin, Calendar } from "lucide-react";

export function AccountDetailsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Account Details</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <div>
            <h2 className="mb-1">John Doe</h2>
            <p className="text-gray-600">Member since November 2024</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p>john.doe@example.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p>(555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p>San Francisco, CA</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p>November 4, 2024</p>
            </div>
          </div>
        </div>

        <button className="mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
