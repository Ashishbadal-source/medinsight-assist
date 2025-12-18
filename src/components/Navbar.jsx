import { Link, useLocation } from "react-router-dom";
import { Activity, Menu, X, UserCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import LogoutButton from "./LogoutButton.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const publicLinks = [
    { path: "/", label: "Home" },
    { path: "/login", label: "Login" },
    { path: "/signup", label: "Signup" },
    { path: "/disclaimer", label: "Disclaimer" },
  ];

  const authenticatedLinks = [
    { path: "/profile", label: "Profile" },
    { path: "/upload", label: "Upload Report" },
    { path: "/how-it-works", label: "How It Works" },
  ];

  const navLinks = isAuthenticated ? authenticatedLinks : publicLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                MedInsight AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>
                <LogoutButton />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {isAuthenticated && (
              <div className="flex items-center gap-2 px-4 py-3 mb-2 border-b border-border">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {user?.name}
                </span>
              </div>
            )}
            
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <div className="mt-2 px-4">
                <LogoutButton />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
