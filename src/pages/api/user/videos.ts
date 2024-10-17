import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { userId } = req.query;

  // Ensure userId is valid
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the video URLs (from public/uploads)
    res.status(200).json({
      videos: {
        videoUpload1: user.videoUpload1 ? `/uploads/${user.videoUpload1.split('\\').pop()}` : null, // Handle backslashes
        videoUpload2: user.videoUpload2 ? `/uploads/${user.videoUpload2.split('\\').pop()}` : null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
