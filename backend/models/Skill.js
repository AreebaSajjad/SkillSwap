const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: {
    type: String,
    enum: ['Programming', 'Design', 'Marketing', 'Language', 'Academic', 'Creative', 'Life Skills', 'Religion'],
    default: 'Programming',
  },
  icon: { type: String, default: '💡' },
  description: String,
  popularityScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
