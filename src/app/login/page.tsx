"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loginStatus, setLoginStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Simplified login handler with debug statements
  const handleLogin = async () => {
    try {
      setLoginStatus("Logging in...");
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Set the token in cookies manually (if necessary)
        document.cookie = `auth_token=${data.token}; path=/;`;
        console.log("Auth Token Cookie:", document.cookie);

        setLoginStatus("Login successful!");

        // Perform redirection after a short delay to allow cookie to be set
        setTimeout(() => {
          if (data.isAdmin) {
            console.log("Redirecting to /admin...");
            router.push("/admin");
          } else {
            console.log("Redirecting to /activity...");
            router.push("/activity");
          }
        }, 1000); // Added delay for redirection
      } else {
        const errorData = await response.json();
        setLoginStatus(errorData.error || "Invalid login credentials!");
        console.log("Login failed:", errorData);
      }
    } catch (error) {
      setLoginStatus("An error occurred during login.");
      console.error("Login error:", error);
    }
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    const isLoggedIn = document.cookie.includes("auth_token");
    if (isLoggedIn) {
      console.log("User already logged in, redirecting...");
      router.push("/activity");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-[40%]">
        <h2 className="text-center text-3xl font-bold mb-6 dark:text-gray-100">Login</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
            className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
          />
          <RainbowButton onClick={handleLogin}>Login</RainbowButton>

          {/* Display Login Status */}
          {loginStatus && <p className="text-center mt-4 text-red-500">{loginStatus}</p>}
          
          {/* Conditionally render button to navigate to /activity */}
          {loginStatus === "Login successful!" && (
            <RainbowButton onClick={() => router.push("/activity")}>
              Go to Activity
            </RainbowButton>
          )}

          {/* Register Now button, always visible */}
          <RainbowButton onClick={() => router.push("/")}>
            Register Now
          </RainbowButton>
        </div>
      </div>
    </div>
  );
}
