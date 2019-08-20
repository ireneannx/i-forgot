const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'cohortdths@gmail.com',
    pass: 'classof2019'
  }
});

// render contact form
router.get('/', (req, res) => {
  res.render('contactform', {title: 'Contact'});
});

// posts message to email
router.post('/', (req, res) => {
  transporter
    .sendMail({
      from: '"passLock Inc" <cohortdths@gmail.com>', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: 'Contact form details ', // Subject line
      text: 'Hello world?', // plain text body
    html: `
    <p>Hi ${req.body.name}, <br> 
    Thank you for reaching out to us. We have received your message and one of our representatives will be in contact with you shortly.</p>
    <p> ---------------- </p>
    <p> Name: ${req.body.name} </p>
    <p> Subject: ${req.body.subject} </p>
    <p> Message: ${req.body.message} </p>
    ` // html body
    })
    .then(info => {
      console.log('Message sent: %s', info.messageId);
    })
    .catch(() => {
      console.log('something went wrong.');
    });

  res.redirect('/contact');
});

router.get('/success', (req, res) => {
  res.send('<h1><center>Sent email successfully</h1></centre>');
});

module.exports = router;
