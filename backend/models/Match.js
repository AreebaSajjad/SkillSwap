const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'cancelled'], default: 'pending' },
  matchScore: { type: Number, default: 0 },
  teachSkill: String,
  learnSkill: String,
  message: { type: String, maxlength: 300 },
}, { timestamps: true });

MatchSchema.index({ requester: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Match', MatchSchema);
