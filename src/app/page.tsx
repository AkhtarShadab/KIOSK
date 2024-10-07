"use client"; // Ensures compatibility with client-side rendering

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Particles from "@/components/magicui/particles";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    age: 0,
    gender: "",
    state: "",
  });

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#212121");
  }, [theme]);

  // Function to handle form submission
  const handleRegistration = async () => {
    const response = await fetch("/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.push("/activity");
    } else {
      alert("Registration Failed!");
    }
  };

  // Function to handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to navigate to login page
  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-row min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-indigo-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black">
      {/* Left Section: Information & Image */}
      <div className="flex w-[60vw] flex-col justify-center items-start p-12">
        <h2 className="mb-4 font-display text-left text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          <GradualSpacing text="Personality Assessment Test" />
        </h2>
        <p className="text-left mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          This test is designed to assess key aspects of your personality using scientifically validated measures. It will help you gain deeper insights into your emotional, social, and behavioral tendencies, ultimately enhancing your self-awareness and personal development.
        </p>
        <div className="relative w-full h-[500px] mb-6">
          <Image
            src="/Big-5-Personality-Test-Assessment.jpg"
            alt="Personality Assessment Test"
            fill
            className="rounded-lg shadow-lg object-contain"
          />
        </div>
        <p className="text-left text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          The test covers the "Big Five" personality traits, including Neuroticism, Extraversion, Openness, Agreeableness, and Conscientiousness, offering a comprehensive overview of your character.
        </p>
      </div>

      {/* Right Section: Registration Form */}
      <div className="flex w-[40vw] flex-col justify-center items-center p-12 bg-white shadow-2xl rounded-xl dark:bg-gray-800 dark:shadow-lg border-l border-gray-300 dark:border-gray-700 relative">
        <GradualSpacing
          className="mb-8 font-display text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          text="Registration Form"
        />
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          ease={50}
          color={color}
          refresh
        />
        <div className="relative z-10 flex flex-col items-center space-y-6 w-full">
          {/* Input fields */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 text-gray-900 dark:text-gray-100 dark:bg-gray-900"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 text-gray-900 dark:text-gray-100 dark:bg-gray-900"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 text-gray-900 dark:text-gray-100 dark:bg-gray-900"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 text-gray-900 dark:text-gray-100 dark:bg-gray-900"
          />
          <select
            name="gender"
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 text-gray-900 dark:text-gray-100 dark:bg-gray-900"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="state"
            placeholder="State of Residence"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 text-gray-900 dark:text-gray-100 dark:bg-gray-900"
          />
          {/* Registration and Login Buttons */}
          <div className="w-full p-4 text-lg font-semibold">
            <RainbowButton onClick={handleRegistration}>Register</RainbowButton>
          </div>
          <div className="w-full p-4 text-lg font-semibold">
            <RainbowButton onClick={navigateToLogin}>Already Registered? Login</RainbowButton>
          </div>
        </div>
      </div>
    </div>
  );
}
