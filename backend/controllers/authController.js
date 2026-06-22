const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// @desc  Register user
// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password });

    // Welcome email
    await sendEmail({
      to: email,
      subject: '🎉 Welcome to SkillSwap!',
      html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;background:#0f1629;color:#fff;border-radius:12px">
        <h2 style="color:#6c63ff">Welcome to SkillSwap, ${name}! 🚀</h2>
        <p>You've joined Pakistan's first peer-to-peer skill exchange platform.</p>
        <p>Start by adding skills you can teach and skills you want to learn.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="background:#6c63ff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Go to Dashboard →</a>
      </div>`,
    }).catch(e => console.log('Email error:', e.message));

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    user.lastSeen = Date.now();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get current user
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Logout
// @route POST /api/auth/logout
exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      points: user.points,
      level: user.level,
      badges: user.badges,
    },
  });
};
