"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const router = useRouter();

  // Fetch user's result
  useEffect(() => {
    const fetchUserResult = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          console.error("User not authenticated. No token found.");
          return;
        }

        // Decode token to get user id
        let userId;
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          userId = JSON.parse(jsonPayload).id;
        } catch (e) {
          console.error("Failed to decode the token.");
          return;
        }

        // Fetch the result for the user
        const response = await fetch(`/api/user/getResult?userId=${userId}`);
        const data = await response.json();

        if (response.ok && data.questionnaireResult) {
          setResult(data.questionnaireResult);
        } else {
          console.log("No result found for user.");
          setResult(null); // No result available
        }
      } catch (error) {
        console.error("Error fetching user result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserResult();
  }, []);

  // Render the page based on the result
  if (loading) {
    return <p className="text-center mt-8 text-2xl">Loading...</p>;
  }

  if (!result) {
    // If result is empty, show "Complete Questionnaire"
    return (
      <div className="text-5xl font-semibold text-center text-gray-800">
        <GradualSpacing text="Complete Questionnaire" />
        <div className="mt-8">
          <RainbowButton onClick={() => router.push("/activity/questions")}>
            Go to Questionnaire
          </RainbowButton>
        </div>
      </div>
    );
  }

  // Calculate percentages for each category level
  const categoryPercentages = calculateCategoryPercentages(result);

  // If result exists, display it with proper styling
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Results</h1>
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-5 gap-8">
          {Object.entries(result).map(([field, score], index) => (
            <div key={index} className="flex flex-col items-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{field}</h2>
              <div className="relative w-full h-2.5 bg-gray-200 rounded-full">
                <div
                  className={`h-2.5 rounded-full ${getScoreColor(score)}`}
                  style={{ width: `${categoryPercentages[field]}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2">
                {score} - {categoryPercentages[field]}%
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <RainbowButton onClick={() => router.push("/activity")}>
          Back to Activity
        </RainbowButton>
      </div>
      <div className="mt-8">
        <RainbowButton onClick={() => router.push("/activity/results/video")}>
          Video Analysis Result
        </RainbowButton>
      </div>
    </div>
  );
}

// Utility function to map category levels to percentages
// Utility function to map category levels to percentages and ensure the total is exactly 100%
function calculateCategoryPercentages(result: { [key: string]: string }) {
    const levelWeights = {
      "Weak": 1,
      "Slightly Weak": 2,
      "Neutral": 3,
      "Slightly Strong": 4,
      "Strong": 5
    };

    let totalWeight = 0;
    const rawPercentages: { [key: string]: number } = {};

    // Calculate total weight and raw percentages
    for (let category in result) {
      totalWeight += levelWeights[result[category]];
    }

    for (let category in result) {
      const weight = levelWeights[result[category]];
      rawPercentages[category] = (weight / totalWeight) * 100;
    }

    // Round the percentages and calculate the difference
    let roundedPercentages: { [key: string]: number } = {};
    let totalRounded = 0;

    for (let category in rawPercentages) {
      const roundedValue = Math.round(rawPercentages[category]);
      roundedPercentages[category] = roundedValue;
      totalRounded += roundedValue;
    }

    // Adjust the total to make sure it sums to exactly 100%
    const difference = 100 - totalRounded;

    if (difference !== 0) {
      // Sort categories by the decimal remainder of the raw percentage
      const sortedCategories = Object.keys(rawPercentages).sort((a, b) => {
        return (rawPercentages[b] % 1) - (rawPercentages[a] % 1);
      });

      // Add or subtract 1 to the highest remainder categories until difference is resolved
      for (let i = 0; i < Math.abs(difference); i++) {
        const category = sortedCategories[i];
        roundedPercentages[category] += Math.sign(difference);  // Either +1 or -1 based on difference
      }
    }

    return roundedPercentages;
  }


// Utility function to get color for score categories
function getScoreColor(score: string) {
  switch (score) {
    case "Weak":
      return "bg-red-500";
    case "Slightly Weak":
      return "bg-orange-500";
    case "Neutral":
      return "bg-yellow-500";
    case "Slightly Strong":
      return "bg-green-500";
    case "Strong":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}
