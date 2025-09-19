import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Test from '../models/Test.js';
import Certificate from '../models/Certificate.js';

const oid = (id) => new mongoose.Types.ObjectId(id);

function dateNDaysAgo(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export async function getStats(req, res) {
  try {
    const since30 = dateNDaysAgo(29);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Totals
    const [usersTotal, coursesTotal, testsTotal, certsTotal] =
      await Promise.all([
        User.countDocuments({}),
        Course.countDocuments({}),
        Test.countDocuments({}),
        Certificate.countDocuments({}),
      ]);

    // Certificates per day (last 30 days)
    const certsByDayRaw = await Certificate.aggregate([
      { $match: { issuedAt: { $gte: since30 } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$issuedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build full 30-day series with zeros
    const series = [];
    const idx = new Map(certsByDayRaw.map((r) => [r._id, r.count]));
    for (let i = 0; i < 30; i++) {
      const d = new Date(since30.getTime());
      d.setDate(since30.getDate() + i);
      const label = d.toISOString().slice(0, 10);
      series.push({ date: label, count: idx.get(label) || 0 });
    }

    // Pass rate this month
    const certsThisMonth = await Certificate.countDocuments({
      issuedAt: { $gte: monthStart },
    });

    const passRate = { month: { passed: certsThisMonth, failed: 0 } };

    const topCoursesAgg = await Certificate.aggregate([
      { $match: { issuedAt: { $gte: since30 } } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },
      {
        $project: {
          _id: 0,
          courseId: '$course._id',
          title: '$course.title',
          count: 1,
        },
      },
    ]);

    res.json({
      totals: {
        users: usersTotal,
        courses: coursesTotal,
        tests: testsTotal,
        certificates: certsTotal,
      },
      certificatesByDay: series,
      passRate,
      topCourses: topCoursesAgg,
      since: since30,
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
}