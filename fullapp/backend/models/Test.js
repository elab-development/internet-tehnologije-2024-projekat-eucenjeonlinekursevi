import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    options: {
      type: [{ type: String, required: true }],
      validate: (v) => Array.isArray(v) && v.length >= 2,
    },
    correctIndex: { type: Number, required: true, min: 0 },
    points: { type: Number, default: 1, min: 0 },
  },
  { _id: false }
);

const TestSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    questions: { type: [QuestionSchema], default: [] },
    passingScorePercent: { type: Number, default: 60, min: 0, max: 100 },
    durationMinutes: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Test', TestSchema);