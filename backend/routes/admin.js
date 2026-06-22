const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Match = require('../models/Match');
const Session = require('../models/Session');
const { Course } = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

// Platform stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalMatches, totalSessions, totalCourses, newUsersToday] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Match.countDocuments(),
      Session.countDocuments({ status: 'completed' }),
      Course.countDocuments(),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
    ]);

    const topSkills = await User.aggregate([
      { $unwind: '$skillsTeaching' },
      { $group: { _id: '$skillsTeaching.skill', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({ success: true, data: { totalUsers, totalMatches, totalSessions, totalCourses, newUsersToday, topSkills } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Ban/unban user
router.put('/users/:id/toggle-ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user, message: user.isActive ? 'User activated' : 'User banned' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
