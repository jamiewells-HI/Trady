import { Navigation } from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  onNavigate?: (page: string) => void;
}

export function Layout({ children, onSearch, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onSearch={onSearch} onNavigate={onNavigate} />
      <main>{children}</main>
    </div>
  );
}
