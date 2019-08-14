const express = require('express');
const router = express.Router();

//login
router.get('/login', (req, res) => {
    res.render("login");

})
//register
router.get('/register', (req, res) => {
    res.render("register");

})
// contact
// router.get('/contact', (req, res) => {
//     res.render("contactform")
// })

//post contact
// router.post("/contact", (req, res) => {

//     transporter.sendMail({
//         from: '"Irene Inc" <me@ireneann.com>', // sender address
//         to: "irenephantrash@gmail.com", // list of receivers
//         subject: "Contact form details ", // Subject line
//         text: "Hello world?", // plain text body
//         html: `<b>${req.body.message}</b>` // html body
//     }).then((info) => {
//         console.log("Message sent: %s", info.messageId);
//     }).catch(() => {
//         console.log("something went wrong.")
//     })


//     res.redirect("/success");
// });

module.exports = router;