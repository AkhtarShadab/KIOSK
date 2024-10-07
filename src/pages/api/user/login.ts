import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { generateToken, setTokenCookie } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { username, password } = req.body;

  if (req.method === "POST") {
    try {
      // Authenticate User
      const user = await User.findOne({ username, password });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT Token
      const token = generateToken(user);

      // Set Cookie with JWT Token
      setTokenCookie(res, token);

      return res.status(200).json({ message: "Login successful!", token, isAdmin: user.isAdmin });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Login failed." });
    }
  } else {
    return res.status(400).json({ error: "Invalid request method." });
  }
}
