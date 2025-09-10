import mongoose from 'mongoose';

const TextSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const ResourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    sections: { type: [TextSectionSchema], default: [] },
    resources: { type: [ResourceSchema], default: [] },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CourseSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Course', CourseSchema);