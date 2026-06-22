const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

// ⚠️ IMPORTANT: Specific routes BEFORE /:id wildcard

// Get leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const users = await User.find({ role: 'user', isActive: true })
      .select('name avatar points level badges sessionsCompleted rating')
      .sort('-points')
      .limit(20);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update profile — MUST be before /:id
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, skillsTeaching, skillsLearning } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, skillsTeaching, skillsLearning },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get my own profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Upload avatar
router.post('/avatar', protect, async (req, res) => {
  try {
    if (!req.body.image) return res.status(400).json({ success: false, message: 'No image provided' });
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: 'skillswap/avatars',
      transformation: [{ width: 300, height: 300, crop: 'fill' }],
    });
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url }, { new: true });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user profile by ID — wildcard LAST
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
