const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../config/auth');

// User model
const User = require('../models/User');

// Dashboard
router.get('/', ensureAuthenticated, async (req, res) => {
  global.user = req.user;
  const accounts = await showAccounts().then(data => data);
  res.render('dashboard', {
    user: req.user,
    accounts
  });
});

router.post('/', (req, res) => {
  // Pull variables out
  const { website, email, password } = req.body;
  console.log(website, email, password);
  let errors = [];

  // Check required fields
  if (!website || !email || !password) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (errors.length > 0) {
    res.render('dashboard', {
      errors
    });
  } else {
    // Hash Password
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;

        // Update Record
        User.updateOne(
          { email: user.email },
          {
            $push: {
              account: [
                [{ website: website }, { email: email }, { password: hash }]
              ]
            }
          },
          (err, collection) => {
            if (err) throw err;
            console.log('Record updated successfully');
            console.log(collection);
          }
        );
      })
    );
    res.redirect('/dashboard');
  }
});

const showAccounts = async () => {
  let output = ``;
  output = await User.findOne({ email: user.email }).then(local_user => {
    if (local_user) {
      local_user.account.forEach(account => {
        output += `<tr>
                    <td>${account[0].website}</td>
                    <td>${account[1].email}</td>
                    <td>${account[2].password}</td>
                    </tr>`;
      });
    }
    return output;
  });
  return output;
};

module.exports = router;
