"use client";

import { ReactNode } from "react";
import DotPattern from "@/components/magicui/dot-pattern";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { useRouter } from "next/navigation";
import GradualSpacing from "@/components/magicui/gradual-spacing";

export default function ActivityLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Go Home Function
  const goHome = () => {
    router.push("/");
  };

  // Logout Function to call the logout API route
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
      });

      if (response.ok) {
        console.log("Logout successful");
        router.push("/login"); // Redirect to login page after successful logout
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex h-[90vh] w-[90vw] flex-col justify-start overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-teal-400 text-white">
          <GradualSpacing className="text-2xl font-bold tracking-wider" text="Personality Assessment Test" />
          <RainbowButton onClick={goHome}>Home</RainbowButton>
        </div>

        {/* Button Row */}
        <div className="flex justify-center space-x-6 mt-8">
          <RainbowButton onClick={() => router.push("/activity/question")}>Questions</RainbowButton>
          <RainbowButton onClick={() => router.push("/activity/video")}>Videos</RainbowButton>
          <RainbowButton onClick={() => router.push("/activity/game")}>Game</RainbowButton>
        </div>

        {/* Content */}
        <div className="relative flex h-[70%] w-[80%] flex-col items-center justify-center overflow-hidden rounded-lg bg-white shadow-lg mt-12 mx-auto">
          {children}
        </div>

        {/* Decorative Dots */}
        <DotPattern className="absolute bottom-4 right-4 opacity-20" />

        {/* Logout Button */}
        <div className="absolute bottom-4 right-8">
          <RainbowButton onClick={handleLogout}>Logout</RainbowButton>
        </div>
      </div>
    </div>
  );
}
