import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    res.status(200).json({ message: "Recording started successfully!" });
  } else {
    res.status(400).json({ error: "Invalid request method." });
  }
}
