"use client";

import { useState } from "react";
import questionsData from "../../static/QuestionsData.json";
import DotPattern from "@/components/magicui/dot-pattern";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { CircleHelp, SquarePlay, Gamepad2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import GradualSpacing from "@/components/magicui/gradual-spacing";

export default function Activity() {
  const [currentScreen, setCurrentScreen] = useState("default");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const questions = questionsData.questionnaire.sections.flatMap(section => section.questions);
  const router = useRouter();
  const handleQuestionClick = () => {
    setCurrentScreen("questions");
  };

  const handleGameOrVideoClick = () => {
    setCurrentScreen("coming-soon");
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
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
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex h-[90vh] w-[90vw] flex-col justify-start overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-teal-400 text-white">
          <GradualSpacing
            className="text-2xl font-bold tracking-wider"
            text="Interactive Quiz"
          />
          <RainbowButton  onClick={gotohome}>
            Home
          </RainbowButton>
        </div>

        {/* Button Row */}
        <div className="flex justify-center space-x-6 mt-8">
          <RainbowButton onClick={handleQuestionClick}>
            Questions <CircleHelp />
          </RainbowButton>
          <RainbowButton onClick={handleGameOrVideoClick}>
            Video <SquarePlay />
          </RainbowButton>
          <RainbowButton onClick={handleGameOrVideoClick}>
            Game <Gamepad2 />
          </RainbowButton>
        </div>

        {/* Main Content */}
        <div className="relative flex h-[70%] w-[70%] flex-col items-center justify-center overflow-hidden rounded-lg bg-white shadow-lg mt-12 mx-auto">
          {currentScreen === "default" && (
            <GradualSpacing
              className="text-5xl font-semibold text-center text-gray-800"
              text="Click Any Option"
            />
          )}

          {currentScreen === "questions" && (
            <div className="flex flex-col w-full p-8">
              <p className="text-2xl font-bold mb-4 text-gray-800">
                {questions[currentQuestionIndex].question_text}
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
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                </RainbowButton>
              </div>
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
