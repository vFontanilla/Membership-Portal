import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("You have been logged out");
  };

  return (
    <header className="bg-blue-800 text-white p-4 mb-8">
      <div className="flex items-center justify-between">
        {/* Title */}
        <span className="font-semibold text-lg md:text-xl">
          Membership Onboarding Dashboard
        </span>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user && (
            <>
              <div className="text-right mr-2">
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-gray-300">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-blue-700">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 mr-4">
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <Button variant="ghost" className="text-white hover:bg-blue-700">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-blue-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && isAuthenticated && user && (
        <div className="mt-4 md:hidden flex flex-col gap-2">
          <div className="text-left">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-300">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>

          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-blue-700"
            onClick={() => navigate("/profile")}
          >
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>

          <Button
            variant="ghost"
            className="justify-start text-red-400 hover:bg-red-500 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>

          <Button variant="ghost" className="text-white hover:bg-blue-700">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  );
}
