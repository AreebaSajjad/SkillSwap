const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Match = require('../models/Match');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get chat rooms (accepted matches)
router.get('/rooms', protect, async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
      status: 'accepted',
    })
      .populate('requester', 'name avatar lastSeen')
      .populate('recipient', 'name avatar lastSeen');

    const rooms = await Promise.all(matches.map(async (match) => {
      const partnerId = match.requester._id.toString() === req.user.id.toString()
        ? match.recipient._id : match.requester._id;
      const partner = match.requester._id.toString() === req.user.id.toString()
        ? match.recipient : match.requester;
      const roomId = [req.user.id, partnerId].sort().join('-');
      const lastMessage = await Message.findOne({ room: roomId }).sort('-createdAt');
      const unread = await Message.countDocuments({ room: roomId, readBy: { $ne: req.user.id } });
      return { roomId, partner, lastMessage, unreadCount: unread, matchId: match._id };
    }));

    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get messages for a room
router.get('/rooms/:roomId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate('sender', 'name avatar')
      .sort('createdAt')
      .limit(100);

    // Mark as read
    await Message.updateMany(
      { room: req.params.roomId, readBy: { $ne: req.user.id } },
      { $addToSet: { readBy: req.user.id } }
    );

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
