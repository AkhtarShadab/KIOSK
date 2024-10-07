import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  age: number;
  gender: string;
  state: string;
  videoUpload1: string; // Path to first video file
  videoUpload2: string; // Path to second video file
  questionnaireResult: object; // Result object for the questionnaire
  isAdmin: boolean; // Indicates if the user is an Admin
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  state: { type: String, required: true },
  videoUpload1: { type: String, default: "" }, // Location of the first video
  videoUpload2: { type: String, default: "" }, // Location of the second video
  questionnaireResult: { type: Object, default: {} },
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
