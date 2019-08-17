const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;
