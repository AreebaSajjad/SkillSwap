// reviews.js
const express = require('express');
const router = express.Router();
const { Review } = require('../models/Review');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { revieweeId, sessionId, rating, comment } = req.body;
    const review = await Review.create({ reviewer: req.user.id, reviewee: revieweeId, session: sessionId, rating, comment });

    // Update user rating
    const reviews = await Review.find({ reviewee: revieweeId });
    const avgRating = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(revieweeId, { rating: Math.round(avgRating * 10) / 10, totalRatings: reviews.length });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id }).populate('reviewer', 'name avatar').sort('-createdAt');
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
