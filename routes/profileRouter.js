const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const usersModel = require('../models/users-model');
const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
    try {
        const user = await usersModel.findOne({ email: req.user.email })
        .populate({
            path: 'orders.products.product', // Adjust based on actual schema
            select: 'productName companyName' // Select the fields you need
        });
        
        // Check if user was found
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Prepare userOrders array
        let userOrders = user.orders.map(order => ({
            date: new Date(order.date),
            products: order.products
        }));
        userOrders.sort((a, b) => b.date - a.date);


        // Render the profile page with user and userOrders data
        res.render('profile', { user, orders: userOrders });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
