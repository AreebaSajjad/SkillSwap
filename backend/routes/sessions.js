const express = require('express');
const router = express.Router();
const { bookSession, getSessions, completeSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.post('/', protect, bookSession);
router.get('/', protect, getSessions);
router.put('/:id/complete', protect, completeSession);

router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const Session = require('../models/Session');
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    session.status = 'cancelled';
    await session.save();
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
