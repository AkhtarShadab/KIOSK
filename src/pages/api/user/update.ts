import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { userId, questionnaireResult } = req.body;

  if (req.method === 'PUT') {
    try {
      const user = await User.findByIdAndUpdate(userId, { questionnaireResult });
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
      } else {
        res.status(200).json({ message: 'User updated successfully!' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method.' });
  }
}
