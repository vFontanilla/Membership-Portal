import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Try to fetch user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // 🔐 Login and store token + user info
  const login = async (email: string, password: string) => {
  try {
    const response = await axios.post("http://localhost:5000/api/users/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("authToken", token);
    setUser(user); // contains role, email, etc.
    setIsAuthenticated(true);
    console.log("User logged in:", token,user);

    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

  // 🔓 Logout clears all session info
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
