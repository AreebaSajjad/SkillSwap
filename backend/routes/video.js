const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/token', protect, async (req, res) => {
  try {
    const { channelName } = req.body;
    if (!channelName) return res.status(400).json({ success: false, message: 'Channel name required' });

    // Generate Agora token using RtcTokenBuilder
    let token = null;
    try {
      const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
      const appId = process.env.AGORA_APP_ID;
      const appCertificate = process.env.AGORA_APP_CERTIFICATE;
      const uid = Math.floor(Math.random() * 100000);
      const role = RtcRole.PUBLISHER;
      const expireTime = 3600;
      const currentTime = Math.floor(Date.now() / 1000);
      const privilegeExpireTime = currentTime + expireTime;

      token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpireTime);
      res.json({ success: true, token, uid, channelName, appId });
    } catch (agoraErr) {
      // Fallback: return appId only (works without token in testing mode)
      res.json({ success: true, token: null, channelName, appId: process.env.AGORA_APP_ID });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
