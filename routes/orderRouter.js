// routes/orderRouter.js
const express = require('express');
const router = express.Router();
const User = require('../models/users-model');
const isLoggedIn = require('../middlewares/isLoggedIn');


router.post('/place-order', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            throw new Error('User ID is missing');
        }

        const user = await User.findById(userId).populate('cart.product');

        if (!user) {
            throw new Error('User not found');
        }

        if (user.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const order = {
            products: user.cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                packing: item.packing,
                price: item.price
            })),
            date: new Date()
        };

        user.orders.push(order);
        user.cart = []; // Empty the cart
        await user.save();

        // Respond with a redirect URL
        res.status(200).json({ message: 'Order placed successfully', redirectUrl: '/order/thanks-for-order' });
    } catch (error) {
        console.error('Error placing order:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/thanks-for-order', isLoggedIn, (req, res) => {
    res.render('thanks-for-order');
  });

module.exports = router;
