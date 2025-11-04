import { Search, User, LogOut } from "lucide-react";
import imgRectangle from "../imports/figma:asset/97dda34dfdbfa15b52892f13402327c43930bb20.png";
import imgRectangle1 from "../imports/figma:asset/d051d24443c4eaabf50ef9f1fc06f06fd74a741d.png";
import { useAuth } from "../contexts/AuthContext";

interface NavigationProps {
  onSearch?: (query: string) => void;
  onNavigate?: (page: string) => void;
}

export function Navigation({ onSearch, onNavigate }: NavigationProps) {
  const { user, signOut } = useAuth();
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative h-8 w-16 overflow-hidden">
              <img 
                src={imgRectangle} 
                alt="Trady Logo" 
                className="absolute inset-0 w-full h-full object-contain"
              />
              <img 
                src={imgRectangle1} 
                alt="Trady Logo" 
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

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
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-1.5 border-2 border-gray-300 rounded-full w-48 focus:outline-none focus:border-black transition-colors"
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

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
