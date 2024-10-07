import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await Question.findByIdAndDelete(id);
      res.status(200).json({ message: 'Question deleted successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete question.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method.' });
  }
}
