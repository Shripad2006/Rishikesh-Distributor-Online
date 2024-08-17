const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middlewares/isLoggedIn')

router.get('/', isLoggedIn, (req, res) => {
    res.render('contact');
  });
  
  module.exports = router;