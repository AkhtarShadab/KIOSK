"use client";

import { useEffect, useState } from "react";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Cookies from "js-cookie";

export default function VideosPage() {
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [userId, setUserId] = useState<string | null>(null); // State to hold the user ID

  const videoLinks: { [key: string]: string[] } = {
    Happy: ["https://www.youtube.com/embed/Ct3NAyFGmsA"],
    Anger: ["https://www.youtube.com/embed/gO_KyTtJg10"],
    Sad: ["https://www.youtube.com/embed/guWh063nsAQ"],
    Fear: ["https://www.youtube.com/embed/j5v8D-alAKE"],
  };

  // Retrieve the user ID from the authentication token in cookies
  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      try {
        // Decode the token to extract the user ID
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        setUserId(decoded.id); // Set the user ID in the state
      } catch (error) {
        console.error("Failed to parse token", error);
      }
    }
  }, []);

  // Handle emotion card click
  const handleCardClick = (emotion: string) => {
    setCurrentEmotion(emotion);
    setCurrentVideoIndex(0);
  };

  // Function to start recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setRecordedChunks([]); // Clear previous chunks
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      // Handle recording events
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Recording chunk added: ", event.data);
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      // Start recording
      recorder.start(1000); // Capture every second of data
      setIsRecording(true);
      console.log("Recording started...");
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Failed to start recording. Please ensure camera access is allowed.");
    }
  };

  // Function to stop recording
  const handleStopRecording = () => {
    if (!mediaRecorder) {
      alert("Recording is not started yet. Please start recording first.");
      return;
    }

    mediaRecorder.stop(); // Stop recording
    setIsRecording(false);
    mediaRecorder.onstop = () => {
      if (recordedChunks.length === 0) {
        alert("No data recorded. Please try recording again.");
        return;
      }

      // Create a video file from the recorded chunks
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const file = new File([blob], `${currentEmotion}_recording.webm`, { type: "video/webm" });
      setVideoFile(file);
      setRecordedChunks([]); // Clear chunks after creating the file
      console.log("Recording complete. File created:", file);
      uploadVideo(file); // Upload video
    };
  };

  // Function to upload video to the server
  const uploadVideo = async (file: File) => {
    // Check if userId is available
    if (!userId) {
      alert("User ID not available. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("videoFile", file);
    formData.append("userId", userId); // Ensure `userId` is correctly passed

    const response = await fetch("/api/video/stopRecording", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Video uploaded successfully!");
    } else {
      const errorData = await response.json();
      console.error("Video upload failed:", errorData);
      alert(`Video upload failed! Error: ${errorData.error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full w-full">
      {/* Render Emotion Grid */}
      {!currentEmotion && (
        <div className="grid grid-cols-2 gap-8">
          {["Happy", "Anger", "Sad", "Fear"].map((emotion) => (
            <div
              key={emotion}
              className="flex flex-col items-center justify-center p-8 border-2 rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-teal-500 cursor-pointer transform transition duration-300 hover:scale-105"
              onClick={() => handleCardClick(emotion)}
              style={{ minWidth: "220px", minHeight: "130px" }}
            >
              <GradualSpacing className="text-3xl font-semibold text-white" text={emotion} />
            </div>
          ))}
        </div>
      )}

      {/* Render Video Player and Recording Buttons */}
      {currentEmotion && (
        <div className="flex flex-col items-center space-y-4 w-[90%] h-full">
          {/* Emotion Title */}
          <GradualSpacing className="text-4xl font-bold text-gray-800 mb-2" text={currentEmotion} />

          {/* Video Player */}
          <iframe
            width="80%"
            height="300"
            src={videoLinks[currentEmotion][currentVideoIndex]}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
          ></iframe>

          {/* Start/Stop Recording Buttons */}
          <div className="flex space-x-4 mt-4">
            <RainbowButton onClick={handleStartRecording} disabled={isRecording}>
              Start Recording
            </RainbowButton>
            <RainbowButton onClick={handleStopRecording} disabled={!isRecording}>
              Stop Recording
            </RainbowButton>
          </div>

          {/* Preview of Recorded Video */}
          {videoFile && (
            <div className="mt-4">
              <h4 className="text-xl font-semibold">Recorded Video Preview:</h4>
              <video width="320" height="240" controls src={URL.createObjectURL(videoFile)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
