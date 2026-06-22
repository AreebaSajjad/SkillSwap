const mongoose = require('mongoose');

// Course Schema
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
  thumbnail: String,
  videoUrl: String,
  content: [{ title: String, body: String, order: Number }],
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number,
  }],
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  progress: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, percent: { type: Number, default: 0 } }],
  rating: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

// Review Schema
const ReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
}, { timestamps: true });

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['match_request', 'match_accepted', 'session_booked', 'session_reminder', 'badge_earned', 'review_received', 'general'] },
  title: String,
  message: String,
  isRead: { type: Boolean, default: false },
  link: String,
}, { timestamps: true });

const Course = mongoose.model('Course', CourseSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { Course, Review, Notification };
