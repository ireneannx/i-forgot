const express = require('express');
const router = express.Router();
//creating routes
router.get('/',(req,res)=>{
    res.render("welcome");

})
module.exports = router;