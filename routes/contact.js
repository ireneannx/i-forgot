const express = require('express');
const app = express()
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'cohortdths@gmail.com',
        pass: 'classof2019'
    }
});

// render contact form
router.get('/', (req, res) => {
    res.render("contactform")
})

// posts message to email
router.post("/", (req, res) => {

    transporter.sendMail({
        from: '"Irene Inc" <cohortdths@gmail.com>', // sender address
        to: "irenephantrash@gmail.com",             // list of receivers
        subject: "Contact form details ",           // Subject line
        text: "Hello world?",                       // plain text body
        html: `<b>${req.body.message}</b>`          // html body
    }).then((info) => {
        console.log("Message sent: %s", info.messageId);
    }).catch(() => {
        console.log("something went wrong.")
    })

    res.redirect("/contact/success");
});

router.get("/success",(req,res)=>{
    res.send("<h1><center>Sent email successfully</h1></centre>")
})

module.exports = router;