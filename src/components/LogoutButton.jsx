import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const LogoutButton = ({ variant = "default" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
};

export default LogoutButton;
