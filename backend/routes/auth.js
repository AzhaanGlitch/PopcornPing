const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// Register with username/password
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const user = await User.create({
      email: email.toLowerCase(),
      username,
      password,
    });
    
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in after registration' });
      }
      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login with username/password
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!user) {
      return res.status(401).json({ message: info.message || 'Invalid credentials' });
    }
    
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in' });
      }
      res.json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
      });
    });
  })(req, res, next);
});

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL + '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL + '/dashboard');
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        avatar: req.user.avatar,
      },
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router;