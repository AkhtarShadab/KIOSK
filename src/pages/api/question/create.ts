import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { question_id, question_text, options } = req.body;

  if (req.method === 'POST') {
    try {
      const newQuestion = new Question({ question_id, question_text, options });
      await newQuestion.save();
      res.status(201).json({ message: 'Question created successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create question.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method.' });
  }
}
