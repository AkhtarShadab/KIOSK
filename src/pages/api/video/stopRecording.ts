import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import mongoose from 'mongoose';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import path from 'path';
import fs from 'fs';

// Ensure the `uploads` folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure `multer` for file uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `user_${req.body.userId}_${uniqueSuffix}${fileExtension}`);
  },
});

const upload = multer({ storage });

// Disable default body parsing for `Next.js`
export const config = {
  api: {
    bodyParser: false, // Disables Next.js body parser to use `multer`
  },
};

// Middleware wrapper to handle `multer` in Next.js API routes
const runMiddleware = (req: any, res: any, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Custom handler for processing file uploads and updating the database
export default async function handler(req: NextApiRequest & { file: Express.Multer.File }, res: NextApiResponse) {
  // Connect to the database
  await dbConnect();

  // Use the `upload.single` middleware to handle the `videoFile` upload
  try {
    await runMiddleware(req, res, upload.single('videoFile'));

    // Check for uploaded file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { userId } = req.body;

    // Validate `userId` before proceeding
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID.' });
    }

    // Get the file path for the uploaded video
    const videoPath = path.join('/uploads', req.file.filename);

    // Update the user document with the video file path
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Save video file paths to the user's profile
    if (!user.videoUpload1) {
      user.videoUpload1 = videoPath;
    } else if (!user.videoUpload2) {
      user.videoUpload2 = videoPath;
    } else {
      return res.status(400).json({ error: 'User already has two uploaded videos.' });
    }

    await user.save();
    return res.status(200).json({ message: 'Video uploaded and path saved successfully!', videoPath });
  } catch (error) {
    console.error("Error during upload:", error);
    return res.status(500).json({ error: 'Server error during file upload.' });
  }
}
