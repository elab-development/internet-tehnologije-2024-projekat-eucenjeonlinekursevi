import mongoose from 'mongoose';
import Course from '../models/Course.js';
import { cloudinary } from '../utils/cloudinary.js';

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function listCourses(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit || '10', 10))
    );
    const skip = (page - 1) * limit;
    const q = (req.query.q || '').trim();
    const isAdmin = req.user?.role === 'admin';
    const all = req.query.all === '1' || req.query.all === 'true';

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (!isAdmin || !all) {
      filter.isPublished = true;
    }

    const [items, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Course.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('listCourses error:', err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
}

export async function getCourse(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin && !course.isPublished) {
      return res.status(403).json({ message: 'Course not available' });
    }
    res.json({ course });
  } catch (err) {
    console.error('getCourse error:', err);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
}

export async function createCourse(req, res) {
  try {
    const {
      title,
      description = '',
      sections = [],
      isPublished = false,
    } = req.body || {};
    if (!title) return res.status(400).json({ message: 'title is required' });

    const course = await Course.create({
      title,
      description,
      sections,
      isPublished: !!isPublished,
      resources: [],
    });

    res.status(201).json({ course });
  } catch (err) {
    console.error('createCourse error:', err);
    res.status(500).json({ message: 'Failed to create course' });
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });

    const payload = {};
    ['title', 'description', 'sections', 'isPublished'].forEach((k) => {
      if (k in req.body) payload[k] = req.body[k];
    });

    const course = await Course.findByIdAndUpdate(id, payload, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ course });
  } catch (err) {
    console.error('updateCourse error:', err);
    res.status(500).json({ message: 'Failed to update course' });
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });

    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ ok: true });
  } catch (err) {
    console.error('deleteCourse error:', err);
    res.status(500).json({ message: 'Failed to delete course' });
  }
}

export async function uploadResources(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const files = req.files || [];
    if (!files.length)
      return res.status(400).json({ message: 'No files uploaded' });

    const uploaded = [];
    for (const f of files) {
      const result = (await cloudinary.uploader.upload_stream_async)
        ? await cloudinary.uploader.upload_stream_async(f.buffer, {
            folder: process.env.CLOUDINARY_FOLDER || 'e-learning/courses',
            resource_type: 'raw',
            filename_override: f.originalname,
            use_filename: true,
            unique_filename: true,
          })
        : await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: process.env.CLOUDINARY_FOLDER || 'e-learning/courses',
                resource_type: 'raw',
                filename_override: f.originalname,
                use_filename: true,
                unique_filename: true,
              },
              (err, resu) => (err ? reject(err) : resolve(resu))
            );
            stream.end(f.buffer);
          });

      uploaded.push({
        name: f.originalname,
        url: result.secure_url,
        mimeType: f.mimetype,
        size: f.size,
        uploadedAt: new Date(),
      });
    }

    course.resources.push(...uploaded);
    await course.save();

    res.status(201).json({ resources: course.resources });
  } catch (err) {
    console.error('uploadResources error:', err);
    res.status(500).json({ message: 'Failed to upload resources' });
  }
}

export async function removeResource(req, res) {
  try {
    const { id } = req.params;
    const { url } = req.body || {};
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!url) return res.status(400).json({ message: 'url required' });

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const before = course.resources.length;
    course.resources = course.resources.filter((r) => r.url !== url);
    const removed = before - course.resources.length;

    await course.save();
    res.json({ removed });
  } catch (err) {
    console.error('removeResource error:', err);
    res.status(500).json({ message: 'Failed to remove resource' });
  }
}