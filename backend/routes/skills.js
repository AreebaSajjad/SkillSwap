// skills.js
const express = require('express');
const router = express.Router();

const popularSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'Data Science',
  'UI/UX Design', 'Figma', 'Adobe Photoshop', 'Video Editing', 'Content Writing',
  'SEO', 'Digital Marketing', 'Graphic Design', 'Flutter', 'Android Development',
  'iOS Development', 'SQL', 'MongoDB', 'DevOps', 'Docker', 'AWS', 'Cybersecurity',
  'Ethical Hacking', 'Urdu', 'English Speaking', 'Public Speaking', 'Photography',
  'Music Production', 'Quran', 'Arabic', 'Mathematics', 'Physics', 'Chemistry',
];

router.get('/', (req, res) => {
  res.json({ success: true, data: popularSkills });
});

module.exports = router;
