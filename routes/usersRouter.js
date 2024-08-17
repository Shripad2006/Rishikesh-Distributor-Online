const express = require('express');
const router = express.Router();
const { registerUser,
  loginUser,
  logout } = require('..//controllers/authcontroller');
const upload = require('../config/multer-config');



router.get('/', (req, res) => {
  res.render('welcome');
});

// Render the registration form
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', upload.single('profilePicture'), registerUser);

router.get('/login', (req, res) => {
  res.render('login'); // Assuming you have a login view
});

router.post('/login', loginUser);

router.post('/logout', logout);

module.exports = router;
