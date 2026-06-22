const User = require('../models/User');
const Match = require('../models/Match');
const { Notification } = require('../models/Review');
const { sendEmail } = require('../utils/email');

// Cosine similarity between two skill arrays
function cosineSimilarity(skillsA, skillsB) {
  if (!skillsA.length || !skillsB.length) return 0;
  const setA = new Set(skillsA.map(s => s.toLowerCase()));
  const setB = new Set(skillsB.map(s => s.toLowerCase()));
  const intersection = [...setA].filter(s => setB.has(s)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

// Calculate match score between two users
function calculateMatchScore(currentUser, candidate) {
  const myTeaching = currentUser.skillsTeaching.map(s => s.skill);
  const myLearning = currentUser.skillsLearning.map(s => s.skill);
  const theirTeaching = candidate.skillsTeaching.map(s => s.skill);
  const theirLearning = candidate.skillsLearning.map(s => s.skill);

  // I can teach them what they want to learn
  const iTeachThem = cosineSimilarity(myTeaching, theirLearning);
  // They can teach me what I want to learn
  const theyTeachMe = cosineSimilarity(theirTeaching, myLearning);

  // Weighted score: mutual exchange preferred
  const score = (iTeachThem * 0.5 + theyTeachMe * 0.5) * 100;
  return Math.round(score);
}

// @desc  Get AI match suggestions
// @route GET /api/matches/suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Get all existing match IDs to exclude
    const existingMatches = await Match.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
    });
    const excludeIds = existingMatches.map(m =>
      m.requester.toString() === req.user.id ? m.recipient : m.requester
    );
    excludeIds.push(req.user.id);

    const candidates = await User.find({
      _id: { $nin: excludeIds },
      isActive: true,
      role: 'user',
    }).select('name email avatar bio skillsTeaching skillsLearning points level rating sessionsCompleted');

    // Score each candidate
    const scored = candidates
      .map(candidate => ({
        user: candidate,
        score: calculateMatchScore(currentUser, candidate),
      }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.json({ success: true, count: scored.length, data: scored });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Send match request
// @route POST /api/matches/request/:id
exports.sendRequest = async (req, res) => {
  try {
    const { message, teachSkill, learnSkill } = req.body;
    const recipientId = req.params.id;

    if (recipientId === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot match with yourself' });
    }

    const existing = await Match.findOne({
      $or: [
        { requester: req.user.id, recipient: recipientId },
        { requester: recipientId, recipient: req.user.id },
      ],
    });
    if (existing) return res.status(400).json({ success: false, message: 'Match already exists' });

    const currentUser = await User.findById(req.user.id);
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ success: false, message: 'User not found' });

    const score = calculateMatchScore(currentUser, recipient);

    const match = await Match.create({
      requester: req.user.id,
      recipient: recipientId,
      message,
      teachSkill,
      learnSkill,
      matchScore: score,
    });

    // Create notification
    await Notification.create({
      user: recipientId,
      type: 'match_request',
      title: 'New Match Request!',
      message: `${currentUser.name} wants to skill swap with you`,
      link: '/matches',
    });

    // Email notification
    sendEmail({
      to: recipient.email,
      subject: `🤝 ${currentUser.name} wants to SkillSwap with you!`,
      html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;background:#0f1629;color:#fff;border-radius:12px">
        <h2 style="color:#6c63ff">New Match Request! 🎉</h2>
        <p><strong>${currentUser.name}</strong> wants to skill swap with you.</p>
        ${message ? `<p style="color:#aaa">"${message}"</p>` : ''}
        <a href="${process.env.CLIENT_URL}/matches" style="background:#6c63ff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">View Request →</a>
      </div>`,
    }).catch(console.log);

    res.status(201).json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Respond to match request
// @route PUT /api/matches/:id/respond
exports.respondToMatch = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    const match = await Match.findById(req.params.id).populate('requester', 'name email');

    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });
    if (match.recipient.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    match.status = status;
    await match.save();

    if (status === 'accepted') {
      await Notification.create({
        user: match.requester._id,
        type: 'match_accepted',
        title: 'Match Accepted! 🎉',
        message: `Your match request was accepted. Start chatting!`,
        link: '/chat',
      });

      sendEmail({
        to: match.requester.email,
        subject: '🎉 Your SkillSwap match was accepted!',
        html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;background:#0f1629;color:#fff;border-radius:12px">
          <h2 style="color:#6c63ff">Match Accepted! 🎉</h2>
          <p>Your skill swap request has been accepted. Start chatting and book a session!</p>
          <a href="${process.env.CLIENT_URL}/chat" style="background:#6c63ff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Start Chatting →</a>
        </div>`,
      }).catch(console.log);
    }

    res.json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all matches for current user
// @route GET /api/matches
exports.getMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
    })
      .populate('requester', 'name avatar skillsTeaching skillsLearning rating')
      .populate('recipient', 'name avatar skillsTeaching skillsLearning rating')
      .sort('-createdAt');

    res.json({ success: true, count: matches.length, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
