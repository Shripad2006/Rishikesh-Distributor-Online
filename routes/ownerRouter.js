const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner-model");
const isLoggdin = require("../middlewares/isLoggedIn")
const User = require('../models/users-model');
const isAdmin = require("../middlewares/isAdmin")
const Product = require("../models/products-model")


router.post('/create', isAdmin,isLoggdin, async (req, res) => {
    try {
        // Check if there are existing owners
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(503).send("You can't create a new owner because one already exists.");
        }

        // Destructure request body for creating new owner
        let { fullname, email, password } = req.body;

        // Create a new owner
        let createdOwner = await ownerModel.create({ fullname, email, password });

        // Send the created owner as response
        res.status(200).send(createdOwner);
    } catch (error) {
        console.error("Error creating owner:", error);
        res.status(500).send("Internal Server Error");
    }
});

// GET /owner/admin
router.get('/add-product', isLoggdin, isAdmin, (req, res) => {
    try {
        let success = req.flash("success")
        res.render("createProduct.ejs",{success});
    } catch (error) {
        console.error("Error rendering admin page:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/daily-orders', isLoggdin, isAdmin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const users = await User.find({
            orders: { $elemMatch: { date: { $gte: today } } }
        }).populate({
            path: 'orders.products.product',
            select: 'productName companyName' // Ensure these fields exist in your Product schema
        });

        let orders = [];
        users.forEach(user => {
            user.orders.forEach(order => {
                if (order.date >= today) {
                    orders.push({
                        user: user.fullName,
                        products: order.products,
                        date: order.date
                    });
                }
            });
        });
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));


        res.render('daily-orders', { orders , user:req.user});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/total-orders',isLoggdin,isAdmin, async  (req, res) => {
    try {
        const users = await User.find({ "orders.0": { "$exists": true } })
            .populate({
                path: 'orders.products.product',
                select: 'productName companyName'
            }).exec();

            let allOrders = [];
            users.forEach(user => {
                user.orders.forEach(order => {
                    allOrders.push({
                        user: user.fullName,
                        date: order.date,
                        products: order.products
                    });
                });
            });
    
            // Sort all orders by date (newest to oldest)
            allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
            res.render('total-orders', { orders: allOrders });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});



module.exports = router;
