import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { SearchResultsPage } from "./pages/SearchResults";
import { DashboardPage } from "./pages/Dashboard";
import { CategoryPage } from "./pages/Category";
import { AccountDetailsPage } from "./pages/AccountDetails";
import { HistoryPage } from "./pages/History";
import { NewListingPage } from "./pages/NewListing";
import { SavedListingsPage } from "./pages/SavedListings";
import { AuthPage } from "./pages/Auth";
import { ProductDetailPage } from "./pages/ProductDetail";

type Page = 
  | "home" 
  | "search" 
  | "dashboard" 
  | "water-sports" 
  | "camping" 
  | "clothing"
  | "account-details"
  | "history"
  | "new-listing"
  | "saved-listings"
  | "auth"
  | "product-detail";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentPage("search");
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage("product-detail");
  };

  const handleBackFromProduct = () => {
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "auth":
        return <AuthPage onSuccess={() => setCurrentPage("dashboard")} />;
      case "search":
        return <SearchResultsPage searchQuery={searchQuery} onProductClick={handleProductClick} />;
      case "dashboard":
        return <DashboardPage onNavigate={handleNavigate} />;
      case "water-sports":
        return <CategoryPage category="water-sports" onProductClick={handleProductClick} />;
      case "camping":
        return <CategoryPage category="camping" onProductClick={handleProductClick} />;
      case "clothing":
        return <CategoryPage category="clothing" onProductClick={handleProductClick} />;
      case "account-details":
        return <AccountDetailsPage />;
      case "history":
        return <HistoryPage />;
      case "new-listing":
        return <NewListingPage />;
      case "saved-listings":
        return <SavedListingsPage onProductClick={handleProductClick} />;
      case "product-detail":
        return <ProductDetailPage productId={selectedProductId} onBack={handleBackFromProduct} />;
      default:
        return <HomePage onProductClick={handleProductClick} />;
    }
  };

  if (currentPage === "auth") {
    return renderPage();
  }

  return (
    <Layout onSearch={handleSearch} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
