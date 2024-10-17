import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log(`Received request to fetch result for user: ${userId}`);

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.questionnaireResult) {
        return res.status(200).json({ message: "No questionnaire result found for this user", questionnaireResult: null });
      }

      console.log("Questionnaire result fetched successfully:", user.questionnaireResult);
      res.status(200).json({ message: "Questionnaire result fetched successfully", questionnaireResult: user.questionnaireResult });
    } catch (error) {
      console.error("Error fetching user result:", error);
      res.status(500).json({ error: "Server Error: Unable to fetch questionnaire result" });
    }
  } else {
    res.status(405).json({ error: "Invalid request method" });
  }
}
