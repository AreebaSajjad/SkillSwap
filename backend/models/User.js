const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 50 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  avatar: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  bio: { type: String, maxlength: 500, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  skillsTeaching: [{ skill: String, level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Intermediate' }, description: String }],
  skillsLearning: [{ skill: String, priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' } }],
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ name: String, icon: String, earnedAt: { type: Date, default: Date.now } }],
  sessionsCompleted: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Auto-generate avatar if not set
  if (!this.avatar || this.avatar === '') {
    const seed = encodeURIComponent(this.name || this.email);
    // Use 'adventurer' style for female names, 'avataaars' for male, 'bottts' default
    const femaleNames = ['fatima','hifza','sara','zara','nadia','sana','maham','maryam','iqra','rabea','aisha','hina','amna','lubna','sundus','komal','alina','naila'];
    const nameLower = (this.name || '').toLowerCase().split(' ')[0];
    const isFemale = femaleNames.some(n => nameLower.includes(n));
    const style = isFemale ? 'adventurer' : 'avataaars';
    this.avatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  }
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate level from points
UserSchema.methods.calculateLevel = function () {
  if (this.points >= 1000) return 5;
  if (this.points >= 500) return 4;
  if (this.points >= 250) return 3;
  if (this.points >= 100) return 2;
  return 1;
};

// Add points and check badges
UserSchema.methods.addPoints = async function (pts) {
  this.points += pts;
  this.level = this.calculateLevel();

  // Badge logic
  const badges = [];
  if (this.sessionsCompleted === 1) badges.push({ name: 'First Session', icon: '🎯' });
  if (this.sessionsCompleted === 5) badges.push({ name: 'Active Learner', icon: '📚' });
  if (this.sessionsCompleted === 10) badges.push({ name: 'Skill Master', icon: '🏆' });
  if (this.points >= 100) badges.push({ name: 'Rising Star', icon: '⭐' });
  if (this.points >= 500) badges.push({ name: 'Knowledge Hub', icon: '🧠' });

  badges.forEach(b => {
    if (!this.badges.find(existing => existing.name === b.name)) {
      this.badges.push(b);
    }
  });

  await this.save();
};

module.exports = mongoose.model('User', UserSchema);
