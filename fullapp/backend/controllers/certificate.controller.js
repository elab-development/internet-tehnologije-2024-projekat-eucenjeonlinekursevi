import mongoose from 'mongoose';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import Test from '../models/Test.js';
import User from '../models/User.js';

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function listCertificates(req, res) {
  try {
    const isAdmin = req.user?.role === 'admin';
    const userId = req.query.user && isAdmin ? req.query.user : req.user._id;

    const certs = await Certificate.find({ user: userId })
      .populate('course', 'title description')
      .populate('test', 'title');

    res.json({ items: certs });
  } catch (err) {
    console.error('listCertificates error:', err);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
}

export async function getCertificate(req, res) {
  try {
    const { certificateId } = req.params;
    const cert = await Certificate.findOne({ certificateId })
      .populate('user', 'name email')
      .populate('course', 'title description')
      .populate('test', 'title');
    if (!cert)
      return res.status(404).json({ message: 'Certificate not found' });

    res.json({ certificate: cert });
  } catch (err) {
    console.error('getCertificate error:', err);
    res.status(500).json({ message: 'Failed to fetch certificate' });
  }
}

export async function createCertificate(req, res) {
  try {
    const isAdmin = req.user?.role === 'admin';
    const { userId, courseId, testId, score = 0 } = req.body || {};
    const uid = userId && isAdmin ? userId : req.user._id;

    if (!courseId || !isValidId(courseId)) {
      return res.status(400).json({ message: 'Valid courseId required' });
    }
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let test = null;
    if (testId) {
      if (!isValidId(testId))
        return res.status(400).json({ message: 'Invalid testId' });
      test = await Test.findById(testId);
      if (!test) return res.status(404).json({ message: 'Test not found' });
    }

    const user = await User.findById(uid);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let cert = await Certificate.findOne({ user: uid, course: courseId });
    if (cert) {
      return res
        .status(409)
        .json({ message: 'Certificate already issued for this course' });
    }

    cert = await Certificate.create({
      user: uid,
      course: courseId,
      test: testId,
      score,
    });

    const populated = await Certificate.findById(cert._id)
      .populate('course', 'title description')
      .populate('test', 'title');

    res.status(201).json({ certificate: populated });
  } catch (err) {
    console.error('createCertificate error:', err);
    res.status(500).json({ message: 'Failed to create certificate' });
  }
}