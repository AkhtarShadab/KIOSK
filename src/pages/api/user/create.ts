import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { username, password, email, age, gender, state } = req.body;

  if (req.method === 'POST') {
    try {
      const newUser = new User({ username, password, email, age, gender, state });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'User registration failed.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method.' });
  }
}
