// matches.js
const express = require('express');
const router = express.Router();
const { getSuggestions, sendRequest, respondToMatch, getMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.get('/suggestions', protect, getSuggestions);
router.get('/', protect, getMatches);
router.post('/request/:id', protect, sendRequest);
router.put('/:id/respond', protect, respondToMatch);

module.exports = router;
