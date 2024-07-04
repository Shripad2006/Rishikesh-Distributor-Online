const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Owner route');
  });
  
  module.exports = router;