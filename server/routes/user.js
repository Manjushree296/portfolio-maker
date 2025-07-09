const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/update', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const data = req.body;

    ['socials', 'skills', 'hobbies', 'languages', 'achievements', 'experiences', 'education', 'certifications'].forEach(field => {
      if (data[field]) {
        try {
          data[field] = JSON.parse(data[field]);
        } catch (e) {
          console.warn(`Could not parse ${field}`);
        }
      }
    });

    if (req.file) {
      data.profileImage = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, data, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error('PUT /update error:', err);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load user' });
  }
});

module.exports = router;