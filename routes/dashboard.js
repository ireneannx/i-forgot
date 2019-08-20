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
      name: user.name,
      errors,
      accounts: ``
    });
  } else {
    // Encrypt Password
    let encryptedPass = simpleCrypto.encrypt(password);

    let unique_id = Math.floor(Math.random() * 1000);
    // Update Record
    User.updateOne(
      { email: user.email },
      {
        $push: {
          account: [
            [
              { _id: unique_id },
              { website: website },
              { email: email },
              { password: encryptedPass }
            ]
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
// router.get('/delete', (req,res)=>{
//   console.log("hello")
// })

router.delete('/delete/', async(req, res) => {
  let accountId = req.body.accountId;
  let userId = req.body.userId;
  let updatedAccount;
  await User.findOne({ _id: userId }).then(user => {
    if (user) {
      // User exists
      let tempdata = user;
      updatedAccount = tempdata.account.filter(
        accounts => accounts[0]._id != accountId
      );
    }
  });
  if (typeof updatedAccount != 'undefined') {
    User.updateOne(
      { _id:  userId },
      {
        $set: { account: updatedAccount }
      },
      (err, collection) => {
        if (err) throw err;
        console.log('Record updated successfully');
      }
    );
  }
});

const showAccounts = async () => {
  let output = ``;
  output = await User.findOne({ email: user.email }).then(local_user => {
    if (local_user) {
      let user_id = local_user._id;
      local_user.account.forEach(account => {
        output += `<tr id=${user_id}>
                    <td>${account[1].website}</td>
                    <td>${account[2].email}</td>
                    <td>${simpleCrypto.decrypt(account[3].password)}</td>
                    <td class="delete" id=${
                      account[0]._id
                    }><a href="#"><i class="far fa-trash-alt"></i>

                    </i>
                    </a></td>
                    </tr>`;
      });
    }
    return output;
  });
  return output;
};

module.exports = router;
