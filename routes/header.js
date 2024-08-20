const express = require('express');
const router = express.Router(); 
const usersModel = require('../models/users-model');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/', isLoggedIn, async (req, res) => {
    let cartItemCount = 0;
    if (req.user) {
        let user = await usersModel.findOne({ email: req.user.email });
        cartItemCount = user.cart.reduce((total, item) => total + item.quantity, 0);
    }

    res.render('header',{ cartItemCount },);
});

module.exports = router;
