import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// API Route to Get All Users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Connect to database
  if (req.method === "GET") {
    try {
      const users = await User.find({}); // Retrieve all users from the database
      res.status(200).json(users); // Return users in response
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch users" });
    }
  } else {
    res.status(400).json({ error: "Invalid request method." });
  }
}
