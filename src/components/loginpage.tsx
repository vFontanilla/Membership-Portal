// src/components/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:5000/api/users/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: username, password }),
//       });

//       const data = await response.json();
//       console.log("Login response:", data);

//     if (response.ok) {
//         login(data.token); // 👈 this saves token and updates context
//         navigate("/dashboard");
//     } else {
//         alert(data.message || "Login failed");
//     }
//     } catch (err) {
//       console.error("Login error:", err);
//       alert("Something went wrong.");
//     }
//   };

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password); // your context handles fetch + setUser

    if (success) {
        navigate("/dashboard");
    } else {
        alert("Invalid email or password");
    }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] shadow-md">
        <CardContent className="py-8">
          <h2 className="text-xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-black text-white hover:bg-zinc-800">
              Login
            </Button>
            <div className="text-sm text-center mt-4">
              <p>
                Don’t have an account?{" "}
                <a className="text-blue-600" href="/signup">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
