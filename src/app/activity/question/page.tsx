"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Cookies from "js-cookie";

export default function QuestionsPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for final submission
  const router = useRouter();

  // Log user information when the component is rendered
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = Cookies.get("auth_token");
        console.log("Token Retrieved:", token); // Log the retrieved token value

        if (!token) {
          console.error("User not authenticated. No token found.");
          return;
        }

        // Decode the token to extract the user information
        let userInfo;
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          userInfo = JSON.parse(jsonPayload);
          console.log("User Info Decoded Successfully:", userInfo); // Log user information
        } catch (e) {
          console.error("Failed to decode the token. Token might be malformed.");
          return;
        }
      } catch (error) {
        console.error("Error retrieving user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/question/read");
        if (response.ok) {
          const questionsData = await response.json();
          setQuestions(questionsData);
        } else {
          console.error("Failed to fetch questions.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  // Handle Next Button
  const handleNext = () => {
    if (!selectedOptions[currentQuestionIndex]) {
      setShowModal(true); // Show modal if no option is selected
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowResults(true); // Show results after the last question
      saveResultsToUser();
    }
  };

  // Handle Previous Button
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Handle Option Change
  const handleOptionChange = (optionIndex: number) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: optionIndex + 1, // Save the option score (1, 2, 3, 4, or 5)
    });
  };

  // Close Modal
  const handleGoBack = () => {
    setShowModal(false); // Close the modal and return to the question
  };

  // Calculate average scores for each field and categorize them
  const calculateAndCategorizeScores = () => {
    const fieldIndices = {
      Neuroticism: [0, 5, 10], // Questions: 1, 6, 11
      Extraversion: [1, 6, 11], // Questions: 2, 7, 12
      Openness: [2, 7, 12], // Questions: 3, 8, 13
      Agreeableness: [3, 8, 13], // Questions: 4, 9, 14
      Conscientiousness: [4, 9, 14], // Questions: 5, 10, 15
    };

    const fieldScores: { [key: string]: string } = {};

    const getCategory = (score: number) => {
      switch (score) {
        case 1:
          return "Weak";
        case 2:
          return "Slightly Weak";
        case 3:
          return "Neutral";
        case 4:
          return "Slightly Strong";
        case 5:
          return "Strong";
        default:
          return "N/A";
      }
    };

    Object.keys(fieldIndices).forEach((field) => {
      const indices = fieldIndices[field];
      const answeredQuestions = indices.filter((index) => selectedOptions[index] !== undefined);
      const sum = answeredQuestions.reduce((acc, index) => acc + (selectedOptions[index] || 0), 0);
      const average = answeredQuestions.length > 0 ? Math.round(sum / answeredQuestions.length) : 0;
      fieldScores[field] = getCategory(average);
    });

    return fieldScores;
  };

  // Save results to the user's profile in the backend
  const saveResultsToUser = async () => {
    try {
      setLoading(true); // Set loading state to true during save
      const token = Cookies.get("auth_token");
      if (!token) {
        console.error("User not authenticated. No token found.");
        setLoading(false);
        return;
      }

      // Decode the token to extract the user ID
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
        console.error("Failed to decode the token. Token might be malformed.");
        setLoading(false);
        return;
      }

      // Calculate scores and save to the database
      const scores = calculateAndCategorizeScores();
      console.log("Saving result to the user:", userId, scores); // Debug log

      const response = await fetch(`/api/user/updateResult?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaireResult: scores }),
      });

      const responseData = await response.json();
      console.log("Response from server:", responseData); // Debug the response

      if (response.ok) {
        console.log("Results saved successfully!");
        router.push("/activity/video"); // Redirect to the video page after saving results
      } else {
        console.error("Failed to save results. Server response:", responseData);
      }
    } catch (error) {
      console.error("Error saving results:", error);
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };

  return (
    <div className="flex flex-col w-full p-8 relative">
      {!showResults ? (
        <>
          {questions.length > 0 ? (
            <>
              <p className="text-2xl font-bold mb-4 text-gray-800">
                {questions[currentQuestionIndex].question_id}. {questions[currentQuestionIndex].question_text}
              </p>
              {questions[currentQuestionIndex].options.map((option: string, index: number) => (
                <label key={index} className="mb-4 flex items-center text-lg text-gray-600">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    className="mr-3 h-5 w-5"
                    checked={selectedOptions[currentQuestionIndex] === index + 1}
                    onChange={() => handleOptionChange(index)}
                  />
                  {option}
                </label>
              ))}
              <div className="flex justify-between mt-6">
                <RainbowButton onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  Previous
                </RainbowButton>
                <RainbowButton onClick={handleNext} disabled={loading}>
                  {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
                </RainbowButton>
              </div>
            </>
          ) : (
            <p>Loading questions...</p>
          )}

          {/* Modal Overlay */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">All questions are compulsory</h2>
                <p className="mb-6 text-gray-700">
                  You cannot skip any question. Please select an option to proceed.
                </p>
                <div className="flex justify-center">
                  <RainbowButton onClick={handleGoBack}>Go Back</RainbowButton>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-8 max-h-[60vh] overflow-auto">
          <h2 className="text-2xl font-bold mb-4">{loading ? "Saving your results..." : "Results saved!"}</h2>
        </div>
      )}
    </div>
  );
}
