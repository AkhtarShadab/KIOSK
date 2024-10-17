// File: activity/game/page.tsx
"use client";

import GradualSpacing from "@/components/magicui/gradual-spacing";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function GamePage() {

    const router = useRouter();
  return (
    <div className="text-5xl font-semibold text-center text-gray-800">
      <GradualSpacing text="Coming Soon" />
      <div className="absolute bottom-8 right-8 text-sm">
        <RainbowButton onClick={() => router.push("/activity/results/question")}>
          Go to Results
        </RainbowButton>
      </div>
    </div>
  );
}
