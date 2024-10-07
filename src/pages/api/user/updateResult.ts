import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "POST") {
    const { userId } = req.query;
    const { questionnaireResult } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log(`Received request to update user: ${userId}`);
    console.log(`Questionnaire Result to Update:`, questionnaireResult);

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { questionnaireResult } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found or update failed" });
      }

      console.log("User updated successfully:", updatedUser);
      res.status(200).json({ message: "User questionnaire result updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user result:", error);
      res.status(500).json({ error: "Server Error: Unable to update questionnaire result" });
    }
  } else {
    res.status(405).json({ error: "Invalid request method" });
  }
}
