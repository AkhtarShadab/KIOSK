"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ question_id: "", question_text: "", options: [] });
  const [questionOptions, setQuestionOptions] = useState("");

  // Check session and redirect if not logged in or not an admin
  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("/api/user/checkAuth");
      if (response.status !== 200) {
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);

  // Fetch Users and Questions on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch("/api/user");
        const questionResponse = await fetch("/api/question/read");
        const usersData = await userResponse.json();
        const questionsData = await questionResponse.json();
        setUsers(usersData);
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  // Handle Creating a New Question
  const handleCreateQuestion = async () => {
    const response = await fetch("/api/question/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    });

    if (response.ok) {
      setQuestions([...questions, newQuestion]);
      alert("Question created successfully!");
    } else {
      alert("Failed to create question.");
    }
  };

  // Handle Deleting a Question
  const handleDeleteQuestion = async (id: string) => {
    const response = await fetch(`/api/question/delete?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      setQuestions(questions.filter((q) => q._id !== id));
    }
  };

  // Handle Deleting a User
  const handleDeleteUser = async (id: string) => {
    const response = await fetch(`/api/user/delete?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Question Management Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Question Management</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Question ID"
            value={newQuestion.question_id}
            onChange={(e) => setNewQuestion({ ...newQuestion, question_id: e.target.value })}
            className="p-4 border mb-2 w-full"
          />
          <textarea
            placeholder="Question Text"
            value={newQuestion.question_text}
            onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
            className="p-4 border mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Options (comma-separated)"
            value={questionOptions}
            onChange={(e) => setQuestionOptions(e.target.value)}
            className="p-4 border mb-2 w-full"
          />
          <RainbowButton
            onClick={() => setNewQuestion({ ...newQuestion, options: questionOptions.split(",") })}
          >
            Add Options
          </RainbowButton>
          <span> </span>
          <RainbowButton onClick={handleCreateQuestion} >
            Create Question
          </RainbowButton>
        </div>

        <div>
          {questions.map((question) => (
            <div key={question._id} className="p-4 border mb-4">
              <h3 className="font-semibold">Question ID: {question.question_id}</h3>
              <p>Question: {question.question_text}</p>
              <p>Options: {question.options.join(", ")}</p>
              <RainbowButton onClick={() => handleDeleteQuestion(question._id)}>Delete</RainbowButton>
            </div>
          ))}
        </div>
      </div>

      {/* User Management Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <div>
          {users.map((user) => (
            <div key={user._id} className="p-4 border mb-4">
              <h3 className="font-semibold">Username: {user.username}</h3>
              <p>Email: {user.email}</p>
              <p>Age: {user.age}</p>
              <p>Gender: {user.gender}</p>
              <p>State: {user.state}</p>
              <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>

              {/* Display Questionnaire Results if available */}
              {user.questionnaireResult && (
                <>
                  <h4 className="font-bold mt-2">Questionnaire Result:</h4>
                  <pre className="bg-gray-200 p-2 rounded-md">
                    {JSON.stringify(user.questionnaireResult, null, 2)}
                  </pre>
                </>
              )}

              {/* Delete User Button */}
              <RainbowButton  onClick={() => handleDeleteUser(user._id)}>
                Delete User
              </RainbowButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
