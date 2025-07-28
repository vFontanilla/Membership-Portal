// src/components/Signup.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Signup() {
  const [passwordStrength, setPasswordStrength] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
  const checkPasswordStrength = (pass: string) => {
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const medium = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W_])).{6,}$/;

    if (strong.test(pass)) return "Strong";
    if (medium.test(pass)) return "Medium";
    if (pass.length > 0) return "Weak";
    return "";
  };

  setPasswordStrength(checkPasswordStrength(password));
}, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!username || !email || !password || !confirmPassword || !role) {
    alert("All fields are required.");
    return;
  }

  console.log("Form data:", {
    username,
    email,
    password,
    confirmPassword,
    role,
  });

  // Password confirmation check
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please retype them correctly.");
    return;
  }

  // Strong password validation
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!strongPasswordRegex.test(password)) {
    alert(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    );
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created successfully!");
      navigate("/login");
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] shadow-md">
        <CardContent className="py-8">
          <h2 className="text-xl font-semibold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              placeholder="Retype Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {passwordStrength && (
                <p
                    className={`text-sm font-medium ${
                    passwordStrength === "Strong"
                        ? "text-green-600"
                        : passwordStrength === "Medium"
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                >
                    Password Strength: {passwordStrength}
                </p>
            )}
            
            {/* Role Selector */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            >
              <option value="user">User</option>
              <option value="admin">Administrator</option>
            </select>

            <Button type="submit" className="w-full bg-black text-white hover:bg-zinc-800">
              Sign Up
            </Button>

            <div className="text-sm text-center mt-4">
              <p>
                Already have an account?{" "}
                <a className="text-blue-600" href="/login">
                  Login
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
