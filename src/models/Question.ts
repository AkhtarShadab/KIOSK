import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  question_id: string;
  question_text: string;
  options: string[];
}

const QuestionSchema: Schema = new Schema({
  question_id: { type: String, required: true },
  question_text: { type: String, required: true },
  options: { type: [String], required: true },
});

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
