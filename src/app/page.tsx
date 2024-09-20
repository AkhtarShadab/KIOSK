"use client"; // Ensures compatibility with client-side rendering

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Particles from "@/components/magicui/particles"; // Assuming you have this component setup
import GradualSpacing from "@/components/magicui/gradual-spacing";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { useRouter } from "next/navigation"; // Use the `useRouter` hook for client-side routing

export default function Home() {
  const { theme } = useTheme(); // For handling light/dark mode themes
  const [color, setColor] = useState("#ffffff");
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Change particle color based on the theme
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  // Function to handle routing on button click
  const handleButtonClick = () => {
    router.push("/activity"); // Navigate to /activity route
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="relative flex w-full max-w-md flex-col items-center justify-center overflow-hidden p-8 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:shadow-2xl border border-gray-300 dark:border-gray-700">
        <GradualSpacing
          className="mb-8 font-display text-center text-4xl font-bold tracking-[-0.05em] text-gray-900 dark:text-gray-100"
          text="Login"
        />
        <Particles
          className="absolute inset-0 z-0" // Position the particles in the background
          quantity={150} // Number of particles
          ease={80} // Ease of movement
          color={color} // Color changes dynamically based on theme
          refresh // Ensures particles refresh on theme change
        />
        <div className="relative z-10 flex flex-col items-center space-y-4 w-full">
          {/* Input field 1 */}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-900"
          />
          {/* Input field 2 */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-900"
          />
          {/* Rainbow Button */}
          <RainbowButton  onClick={handleButtonClick}>
            Log In
          </RainbowButton>
        </div>
      </div>
    </div>
  );
}
