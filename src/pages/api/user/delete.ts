import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method.' });
  }
}
