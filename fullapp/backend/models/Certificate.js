import mongoose from 'mongoose';
import { randomId } from '../utils/id.js';

const CertificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, unique: true, index: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
    score: { type: Number, default: 0, min: 0 },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CertificateSchema.pre('save', function (next) {
  if (!this.certificateId) this.certificateId = randomId();
  next();
});

CertificateSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Certificate', CertificateSchema);