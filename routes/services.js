const express = require('express');
const usersModel = require('../models/users-model');
const productModel = require('../models/products-model');
const commentsModel = require('../models/comments-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();

// Ensure user is logged in before accessing this route
router.get('/', isLoggedIn, async (req, res) => {
    try {
        // Fetch the user based on the logged-in user's email
        const user = await usersModel.findOne({ email: req.user.email }).populate('comments');

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Fetch additional data if needed
        const usersCount = await usersModel.countDocuments(); // Count total users
        const productCount = await productModel.countDocuments(); // Count total products
        const comments = await commentsModel.find().populate('user', 'userName'); // Fetch comments with user data

        // Render the services page with user data and comments
        res.render('services', {
            user: {
                ...user.toObject(), // Convert user document to plain object
                usersCount, // Include total users count
                productCount // Include total products count
            },
            comments, // Pass comments separately
            currentUserId: req.user._id.toString() 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/comment', isLoggedIn, async (req, res) => {
    try {
        let user = await usersModel.findOne({ email: req.user.email });
        let { comments } = req.body;

        let post = await commentsModel.create({
            user: user._id,
            content: comments // Correct the key to match the form field name       
        });

        user.comments.push(post._id);
        await user.save();
        res.redirect("/services");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/like/:commentId', isLoggedIn, async (req, res) => {
    try {
        const user = req.user._id;
        const commentId = req.params.commentId;

        const comment = await commentsModel.findById(commentId);

        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        if (comment.likes.includes(user)) {
            // User already liked this comment, so remove the like
            comment.likes.pull(user);
        } else {
            // User has not liked this comment, so add the like
            comment.likes.push(user);
        }

        await comment.save();
        res.redirect('/services');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/delete-comment/:id', isLoggedIn, async (req, res) => {
    try {
        const comment = await commentsModel.findById(req.params.id);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).send('You can only delete your own comments');
        }
        await commentsModel.findByIdAndDelete(req.params.id);
        await usersModel.updateOne(
            { _id: req.user._id },
            { $pull: { comments: comment._id } }
        );
        res.redirect('/services');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
