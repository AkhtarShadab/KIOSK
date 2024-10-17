"use client";

import { useEffect, useState } from "react";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Cookies from "js-cookie";

export default function VideoAnalysis() {
  const [videos, setVideos] = useState<{ videoUpload1: string | null; videoUpload2: string | null }>({
    videoUpload1: null,
    videoUpload2: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      const token = Cookies.get("auth_token");
      if (!token) {
        setError("User is not authenticated.");
        return;
      }

      // Decode the token to extract the user ID
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const userId = JSON.parse(jsonPayload).id;

      try {
        // Fetch the user's saved videos
        const response = await fetch(`/api/user/videos?userId=${userId}`);
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Failed to fetch videos.");
        } else {
          const { videos } = await response.json();
          setVideos(videos);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Error fetching videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="text-3xl font-semibold text-center text-gray-800">
      <GradualSpacing text="Saved Recordings" />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 gap-4 mt-8">
        {videos.videoUpload1 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Recording 1</h4>
            <video controls className="rounded-lg shadow-lg" width="600">
              {/* Use the direct path from public/uploads */}
              <source src={videos.videoUpload1} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {videos.videoUpload2 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Recording 2</h4>
            <video controls className="rounded-lg shadow-lg" width="600">
              {/* Use the direct path from public/uploads */}
              <source src={videos.videoUpload2} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {!videos.videoUpload1 && !videos.videoUpload2 && !loading && (
          <p>No recordings found. Start recording to save your videos.</p>
        )}
      </div>

      <div className="absolute bottom-8 right-8 text-sm">
        <RainbowButton onClick={() => router.push("/activity/results/question")}>
          Go to Results
        </RainbowButton>
      </div>
    </div>
  );
}
