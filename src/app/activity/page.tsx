"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function ActivityPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check session and redirect if not logged in
  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("/api/user/checkAuth");
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <div className="text-5xl font-semibold text-center text-gray-800">
      <GradualSpacing text="Click Any Option to Start the Activity" />
    </div>
  );
}
