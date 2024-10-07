import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Question from "@/models/Question";

// API Route to Read All Questions
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Connect to the database
  if (req.method === "GET") {
    try {
      const questions = await Question.find({}); // Retrieve all questions
      res.status(200).json(questions); // Return questions in response
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch questions" });
    }
  } else {
    res.status(400).json({ error: "Invalid request method." });
  }
}
