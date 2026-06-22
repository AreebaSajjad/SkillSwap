const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  skill: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
  meetingLink: String,
  agoraChannel: String,
  notes: String,
  completedAt: Date,
  pointsAwarded: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
