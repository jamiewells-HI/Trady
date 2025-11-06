import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { Handshake, User as UserIcon, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function OffersPage() {
  const { user, accessToken } = useAuth();
  const [offersMade, setOffersMade] = useState<any[]>([]);
  const [offersReceived, setOffersReceived] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && accessToken) {
      loadOffers();
    }
  }, [user, accessToken]);

  const loadOffers = async () => {
    try {
      const data = await api.getOffers(accessToken!);
      setOffersMade(data.offersMade || []);
      setOffersReceived(data.offersReceived || []);
    } catch (error) {
      console.error("Error loading offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Handshake className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="mb-2">Sign in to view offers</h2>
          <p className="text-gray-600">You need to be signed in to view your trade offers.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Loading offers...</p>
      </div>
    );
  }

  const renderOffersList = (offers: any[], type: "made" | "received") => {
    if (offers.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Handshake className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="mb-2">No {type} offers</h2>
          <p className="text-gray-600">
            {type === "made"
              ? "Offers you make to other traders will appear here."
              : "Offers from other traders will appear here."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">
                      {type === "made" ? "You" : offer.offererName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Offered: {offer.offeredItems}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        offer.status
                      )}`}
                    >
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </span>
                  </div>
                </div>
                {offer.message && (
                  <p className="text-gray-700 mt-2">{offer.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Trade Offers</h1>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="received">
            Received ({offersReceived.length})
          </TabsTrigger>
          <TabsTrigger value="made">Made ({offersMade.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          {renderOffersList(offersReceived, "received")}
        </TabsContent>
        <TabsContent value="made">
          {renderOffersList(offersMade, "made")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
