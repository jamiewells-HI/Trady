import { Search, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

interface NavigationProps {
  onSearch?: (query: string) => void;
  onNavigate?: (page: string) => void;
}

export function Navigation({ onSearch, onNavigate }: NavigationProps) {
  const { user, signOut } = useAuth();
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch?.(searchInput);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    // Also trigger search on every keystroke for live results
    onSearch?.(e.target.value);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate?.("home")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="bg-black text-white px-3 py-1 rounded-md">
                TRADY
              </div>
            </button>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => onNavigate?.("home")} className="hover:text-gray-600 transition-colors">
                Home
              </button>
              <button onClick={() => onNavigate?.("water-sports")} className="text-gray-600 hover:text-gray-900 transition-colors">
                Water Sports
              </button>
              <button onClick={() => onNavigate?.("camping")} className="text-gray-600 hover:text-gray-900 transition-colors">
                Camping
              </button>
              <button onClick={() => onNavigate?.("clothing")} className="text-gray-600 hover:text-gray-900 transition-colors">
                Clothing
              </button>
            </div>
          </div>

          {/* Search & Account */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={handleSearchChange}
                className="pl-9 pr-3 py-1.5 border-2 border-gray-300 rounded-full w-48 focus:outline-none focus:border-black transition-colors"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            {user ? (
              <>
                <button 
                  onClick={() => onNavigate?.("dashboard")}
                  className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                  title={user.name || user.email}
                >
                  <User className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => signOut()}
                  className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => onNavigate?.("auth")}
                className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}