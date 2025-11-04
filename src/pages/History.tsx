import { Clock, CheckCircle, XCircle } from "lucide-react";

const tradeHistory = [
  { id: 1, item: "Mountain Bike", partner: "Sarah M.", status: "completed", date: "Oct 28, 2024" },
  { id: 2, item: "Kayak Set", partner: "Mike R.", status: "pending", date: "Nov 1, 2024" },
  { id: 3, item: "Camping Tent", partner: "Emily K.", status: "completed", date: "Oct 15, 2024" },
  { id: 4, item: "Surfboard", partner: "Jake P.", status: "cancelled", date: "Oct 10, 2024" },
  { id: 5, item: "Hiking Boots", partner: "Lisa W.", status: "completed", date: "Sep 22, 2024" },
  { id: 6, item: "Wetsuit", partner: "Tom H.", status: "completed", date: "Sep 18, 2024" },
];

export function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Trade History</h1>

      <div className="space-y-4">
        {tradeHistory.map((trade) => (
          <div
            key={trade.id}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              {trade.status === "completed" && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {trade.status === "pending" && (
                <Clock className="w-6 h-6 text-yellow-500" />
              )}
              {trade.status === "cancelled" && (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              
              <div>
                <h3 className="mb-0.5">{trade.item}</h3>
                <p className="text-sm text-gray-600">Traded with {trade.partner}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">{trade.date}</p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                  trade.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : trade.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
