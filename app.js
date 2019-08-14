const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')

const app = express();

//ejs //to embed js code in html
app.use(expressLayouts);
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


app.use('/contact',require('./routes/contact'));


const port = process.env.port || 5001;
//starts server 
app.listen(port, ()=>{
    console.log(`Server started at ${port}`); 
}); 