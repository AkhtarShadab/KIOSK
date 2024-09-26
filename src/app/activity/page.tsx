"use client";

import { useState, useEffect } from "react";
import questionsData from "../../static/1.json";
import DotPattern from "@/components/magicui/dot-pattern";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { CircleHelp, SquarePlay, Gamepad2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import GradualSpacing from "@/components/magicui/gradual-spacing";

export default function Activity() {
  const [currentScreen, setCurrentScreen] = useState("default");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answerTimes, setAnswerTimes] = useState(Array(72).fill(0)); // Initialize array of size 72 with 0
  const [renderTime, setRenderTime] = useState(Date.now()); // Track render time

  const questions = questionsData.questions.flatMap(section => section);
  const router = useRouter();

  // Track the time when the component renders (i.e., a new question is shown)
  useEffect(() => {
    setRenderTime(Date.now());
  }, [currentQuestionIndex]);

  const handleQuestionClick = () => {
    setCurrentScreen("questions");
  };

  const handleVideoClick = () => {
    setCurrentScreen("video");
  };

  const handleGameClick = () => {
    setCurrentScreen("coming-soon");
  };

  const handleNext = () => {
    const currentTime = Date.now();
    const timeSpent = currentTime - renderTime; // Calculate time difference

    // Update the time spent for the current question index
    setAnswerTimes(prevTimes => {
      const updatedTimes = [...prevTimes];
      updatedTimes[currentQuestionIndex] += timeSpent;
      return updatedTimes;
    });

    // If the last question is reached, render the time array
    if (currentQuestionIndex === questions.length - 1) {
      setCurrentScreen("result"); // Switch to result screen
    } else {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    const currentTime = Date.now();
    const timeSpent = currentTime - renderTime; // Calculate time difference

    // Update the time spent for the current question index
    setAnswerTimes(prevTimes => {
      const updatedTimes = [...prevTimes];
      updatedTimes[currentQuestionIndex] += timeSpent;
      return updatedTimes;
    });

    // Move to the previous question
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: option
    });
  };

  const gotohome = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex h-[90vh] w-[90vw] flex-col justify-start overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-teal-400 text-white">
          <GradualSpacing
            className="text-2xl font-bold tracking-wider"
            text="Recommendation Activity"
          />
          <RainbowButton onClick={gotohome}>
            Home
          </RainbowButton>
        </div>

        {/* Button Row */}
        <div className="flex justify-center space-x-6 mt-8">
          <RainbowButton onClick={handleQuestionClick}>
            Questions <CircleHelp />
          </RainbowButton>
          <RainbowButton onClick={handleVideoClick}>
            Video <SquarePlay />
          </RainbowButton>
          <RainbowButton onClick={handleGameClick}>
            Game <Gamepad2 />
          </RainbowButton>
        </div>

        {/* Main Content */}
        <div className="relative flex h-[70%] w-[80%] flex-col items-center justify-center overflow-hidden rounded-lg bg-white shadow-lg mt-12 mx-auto">
          {currentScreen === "default" && (
            <GradualSpacing
              className="text-5xl font-semibold text-center text-gray-800"
              text="Click Any Option"
            />
          )}

          {currentScreen === "questions" && (
            <div className="flex flex-col w-full p-8">
              <p className="text-2xl font-bold mb-4 text-gray-800">
                {questions[currentQuestionIndex].question_id}. {questions[currentQuestionIndex].question_text}
              </p>
              {questions[currentQuestionIndex].options.map((option, index) => (
                <label key={index} className="mb-4 flex items-center text-lg text-gray-600">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    className="mr-3 h-5 w-5"
                    checked={selectedOptions[currentQuestionIndex] === option}
                    onChange={() => handleOptionChange(option)}
                  />
                  {option}
                </label>
              ))}

              <div className="flex justify-between mt-6">
                <RainbowButton
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </RainbowButton>
                <RainbowButton
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length}
                >
                  Next
                </RainbowButton>
              </div>
            </div>
          )}

          {currentScreen === "result" && (
            <div className="p-8 max-h-[60vh] overflow-auto"> {/* Scrollable container */}
              <h2 className="text-2xl font-bold mb-4">Time Spent on Each Question (ms)</h2>
              <div className="grid grid-cols-6 gap-2 mb-2"> {/* Adjusted spacing and layout */}
                {answerTimes.map((time, index) => (
                  <div key={index} className="p-1 text-sm border rounded-lg bg-gray-100 text-center">
                    Q{index + 1}: {time} ms
                  </div>
                ))}
              </div>
              <RainbowButton onClick={gotohome}>
                Go to Home
              </RainbowButton>
            </div>
          )}

          {currentScreen === "video" && (
            <div className="flex justify-center items-center space-x-6 p-6">
              <iframe
                width="350"
                height="325"
                src="https://www.youtube.com/embed/Ct3NAyFGmsA"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-lg transform transition duration-300 hover:scale-110"
              ></iframe>
              <iframe
                width="350"
                height="325"
                src="https://www.youtube.com/embed/gO_KyTtJg10"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-lg transform transition duration-300 hover:scale-110"
              ></iframe>
              <iframe
                width="350"
                height="325"
                src="https://www.youtube.com/embed/guWh063nsAQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-lg transform transition duration-300 hover:scale-110"
              ></iframe>
            </div>
          )}

          {currentScreen === "coming-soon" && (
            <GradualSpacing
              className="text-5xl font-semibold text-center text-gray-800"
              text="Coming Soon"
            />
          )}
        </div>

        {/* Decorative Dots */}
        <DotPattern
          className="absolute bottom-4 right-4 opacity-20"
        />
      </div>
    </div>
  );
}
