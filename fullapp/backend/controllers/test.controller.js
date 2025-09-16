import mongoose from 'mongoose';
import Test from '../models/Test.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function toPlain(doc) {
  return doc && typeof doc.toObject === 'function' ? doc.toObject() : doc;
}

function sanitizeTestForUser(testDoc) {
  const t = toPlain(testDoc);
  return {
    ...t,
    questions: (t.questions || []).map((q) => ({
      prompt: q.prompt,
      options: q.options,
      points: q.points ?? 1,
    })),
  };
}

function totalPoints(testLike) {
  const t = toPlain(testLike);
  return (t.questions || []).reduce((sum, q) => sum + (q.points || 0), 0);
}

export async function listTests(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit || '10', 10))
    );
    const skip = (page - 1) * limit;
    const q = (req.query.q || '').trim();
    const byCourse = (req.query.course || '').trim();
    const isAdmin = req.user?.role === 'admin';
    const all = req.query.all === '1' || req.query.all === 'true';

    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (byCourse) {
      if (!isValidId(byCourse))
        return res.status(400).json({ message: 'Invalid course id' });
      filter.course = byCourse;
    }
    if (!isAdmin || !all) filter.isActive = true;

    const [items, total] = await Promise.all([
      Test.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('course', 'title isPublished'),
      Test.countDocuments(filter),
    ]);

    const prepared = (isAdmin ? items : items.map(sanitizeTestForUser)).map(
      toPlain
    );

    res.json({
      items: prepared.map((it) => ({ ...it, totalPoints: totalPoints(it) })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('listTests error:', err);
    res.status(500).json({ message: 'Failed to fetch tests' });
  }
}

export async function getTest(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });

    const test = await Test.findById(id).populate(
      'course',
      'title isPublished'
    );
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin && !test.isActive) {
      return res.status(403).json({ message: 'Test not available' });
    }

    const withAnswers = isAdmin
      ? req.query.withAnswers !== '0' && req.query.withAnswers !== 'false'
      : false;

    const payload = toPlain(withAnswers ? test : sanitizeTestForUser(test));

    res.json({ test: { ...payload, totalPoints: totalPoints(payload) } });
  } catch (err) {
    console.error('getTest error:', err);
    res.status(500).json({ message: 'Failed to fetch test' });
  }
}

export async function createTest(req, res) {
  try {
    const {
      course,
      title,
      questions = [],
      passingScorePercent = 60,
      durationMinutes = 0,
      isActive = true,
    } = req.body || {};

    if (!course || !isValidId(course))
      return res.status(400).json({ message: 'Valid course is required' });
    if (!title) return res.status(400).json({ message: 'title is required' });

    const exists = await Course.findById(course);
    if (!exists) return res.status(404).json({ message: 'Course not found' });

    const test = await Test.create({
      course,
      title,
      questions,
      passingScorePercent,
      durationMinutes,
      isActive,
    });

    const plain = toPlain(test);
    res.status(201).json({ test: plain, totalPoints: totalPoints(plain) });
  } catch (err) {
    console.error('createTest error:', err);
    res.status(500).json({ message: 'Failed to create test' });
  }
}

export async function updateTest(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });

    const payload = {};
    [
      'title',
      'questions',
      'passingScorePercent',
      'durationMinutes',
      'isActive',
      'course',
    ].forEach((k) => {
      if (k in req.body) payload[k] = req.body[k];
    });

    if (payload.course) {
      if (!isValidId(payload.course))
        return res.status(400).json({ message: 'Invalid course id' });
      const exists = await Course.findById(payload.course);
      if (!exists) return res.status(404).json({ message: 'Course not found' });
    }

    const test = await Test.findByIdAndUpdate(id, payload, { new: true });
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const plain = toPlain(test);
    res.json({ test: plain, totalPoints: totalPoints(plain) });
  } catch (err) {
    console.error('updateTest error:', err);
    res.status(500).json({ message: 'Failed to update test' });
  }
}

export async function deleteTest(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });

    const test = await Test.findByIdAndDelete(id);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    res.json({ ok: true });
  } catch (err) {
    console.error('deleteTest error:', err);
    res.status(500).json({ message: 'Failed to delete test' });
  }
}

export async function submitTest(req, res) {
  try {
    const { id } = req.params;
    const { answers } = req.body || {};
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!Array.isArray(answers))
      return res
        .status(400)
        .json({
          message: 'answers must be an array of selected option indexes',
        });

    // Load full test with answers (admin only can get via GET; here we use it server-side)
    const test = await Test.findById(id).populate('course', '_id title');
    if (!test) return res.status(404).json({ message: 'Test not found' });
    if (!test.isActive)
      return res.status(403).json({ message: 'Test is not active' });

    const qs = test.questions || [];
    const total = qs.reduce((sum, q) => sum + (q.points || 0), 0);

    // normalize answers length; missing answers treated as incorrect
    let score = 0;
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const a = answers[i];
      if (typeof a === 'number' && a === q.correctIndex) {
        score += q.points || 0;
      }
    }

    const pct = total > 0 ? (score / total) * 100 : 100;
    const passed = pct >= (test.passingScorePercent ?? 60);

    let certificate = null;
    if (passed) {
      // try to create certificate if one doesn't exist yet (unique by user+course)
      const existing = await Certificate.findOne({
        user: req.user._id,
        course: test.course._id,
      });
      if (!existing) {
        const created = await Certificate.create({
          user: req.user._id,
          course: test.course._id,
          test: test._id,
          score,
        });
        certificate = await Certificate.findById(created._id).lean();
      } else {
        certificate = existing.toObject ? existing.toObject() : existing;
      }
    }

    res.json({ passed, score, totalPoints: total, certificate });
  } catch (err) {
    console.error('submitTest error:', err);
    res.status(500).json({ message: 'Failed to submit test' });
  }
}