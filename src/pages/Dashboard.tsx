import { User, History, Plus, Heart, MessageCircle, Handshake } from "lucide-react";

const dashboardCards = [
  {
    id: 1,
    title: "Account Details",
    icon: User,
    description: "Manage your profile and settings",
  },
  {
    id: 2,
    title: "Messages",
    icon: MessageCircle,
    description: "View messages from traders",
  },
  {
    id: 3,
    title: "Offers",
    icon: Handshake,
    description: "Manage your trade offers",
  },
  {
    id: 4,
    title: "History",
    icon: History,
    description: "View your trading history",
  },
  {
    id: 5,
    title: "New Listing",
    icon: Plus,
    description: "Create a new trade listing",
  },
  {
    id: 6,
    title: "Saved Listings",
    icon: Heart,
    description: "View your saved items",
  },
];

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const handleCardClick = (title: string) => {
    const pageMap: Record<string, string> = {
      "Account Details": "account-details",
      "Messages": "messages",
      "Offers": "offers",
      "History": "history",
      "New Listing": "new-listing",
      "Saved Listings": "saved-listings",
    };
    const page = pageMap[title];
    if (page && onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Your Account</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.title)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-8 text-left group"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}