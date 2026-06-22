const Session = require('../models/Session');
const User = require('../models/User');
const { Notification } = require('../models/Review');
const { sendEmail } = require('../utils/email');

// @desc  Book a session
// @route POST /api/sessions
exports.bookSession = async (req, res) => {
  try {
    const { teacherId, skill, scheduledAt, duration, notes } = req.body;
    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    const agoraChannel = `skillswap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session = await Session.create({
      teacher: teacherId,
      learner: req.user.id,
      skill,
      scheduledAt,
      duration: duration || 60,
      notes,
      agoraChannel,
    });

    await session.populate(['teacher', 'learner']);

    // Notifications
    await Notification.create({
      user: teacherId,
      type: 'session_booked',
      title: 'New Session Booked!',
      message: `${session.learner.name} booked a session with you for ${new Date(scheduledAt).toLocaleString()}`,
      link: '/sessions',
    });

    // Email to teacher
    sendEmail({
      to: teacher.email,
      subject: `📅 New Session Booked - ${skill}`,
      html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;background:#0f1629;color:#fff;border-radius:12px">
        <h2 style="color:#6c63ff">New Session Booked! 📅</h2>
        <p><strong>${session.learner.name}</strong> has booked a session with you.</p>
        <p>Skill: <strong>${skill}</strong></p>
        <p>Time: <strong>${new Date(scheduledAt).toLocaleString()}</strong></p>
        <p>Duration: ${duration || 60} minutes</p>
        <a href="${process.env.CLIENT_URL}/sessions" style="background:#6c63ff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">View Session →</a>
      </div>`,
    }).catch(console.log);

    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get sessions for current user
// @route GET /api/sessions
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacher: req.user.id }, { learner: req.user.id }],
    })
      .populate('teacher', 'name avatar rating')
      .populate('learner', 'name avatar')
      .sort('-scheduledAt');

    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Complete a session
// @route PUT /api/sessions/:id/complete
exports.completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('teacher learner');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const isParticipant = [session.teacher._id.toString(), session.learner._id.toString()].includes(req.user.id.toString());
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not authorized' });

    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    if (!session.pointsAwarded) {
      // Award points to both participants
      const teacherUser = await User.findById(session.teacher._id);
      const learnerUser = await User.findById(session.learner._id);

      teacherUser.sessionsCompleted += 1;
      await teacherUser.addPoints(100);

      learnerUser.sessionsCompleted += 1;
      await learnerUser.addPoints(50);

      session.pointsAwarded = true;
      await session.save();

      // Notifications
      await Notification.create({
        user: session.teacher._id,
        type: 'badge_earned',
        title: '🎉 Session Complete! +100 points',
        message: 'Great job! You earned 100 points for teaching.',
      });
      await Notification.create({
        user: session.learner._id,
        type: 'badge_earned',
        title: '🎉 Session Complete! +50 points',
        message: 'Great job! You earned 50 points for learning.',
      });
    }

    res.json({ success: true, data: session, message: 'Session completed! Points awarded.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
