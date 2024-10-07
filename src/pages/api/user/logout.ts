import { NextApiRequest, NextApiResponse } from "next";
import { removeTokenCookie } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    removeTokenCookie(res);
    res.status(200).json({ message: "Logged out successfully!" });
  } else {
    res.status(400).json({ error: "Invalid request method." });
  }
}
