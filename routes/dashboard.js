const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const SimpleCrypto = require('simple-crypto-js').default;
const _secretKey = require('../config/keys').encryptionKey;
const simpleCrypto = new SimpleCrypto(_secretKey);

// User model
const User = require('../models/User');

// Dashboard
router.get('/', ensureAuthenticated, async (req, res) => {
  global.user = req.user;
  const accounts = await showAccounts().then(data => data);
  res.render('dashboard', {
    name: req.user.name,
    accounts
  });
});

router.post('/', (req, res) => {
  // Pull variables out
  const { website, email, password } = req.body;
  let errors = [];

  // Check required fields
  if (!website || !email || !password) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (errors.length > 0) {
    res.render('dashboard', {
      errors,
      accounts: ``
    });
  } else {

    // Encrypt Password
    let encryptedPass = simpleCrypto.encrypt(password);
    
    // Update Record
    User.updateOne(
      { email: user.email },
      {
        $push: {
          account: [
            [{ website: website }, { email: email }, { password: encryptedPass }]
          ]
        }
      },
      (err, collection) => {
        if (err) throw err;
        console.log('Record updated successfully');
        console.log(collection);
      }
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
                    <td>${simpleCrypto.decrypt(account[2].password)}</td>
                    </tr>`;
      });
    }
    return output;
  });
  return output;
};

module.exports = router;
