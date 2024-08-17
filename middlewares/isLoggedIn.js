const jwt = require('jsonwebtoken');
const userModel = require('../models/users-model');

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        req.flash('error', 'You need to login first');
        console.log('No token found');
        return res.redirect('/users/login');
    }

    try {
        
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        

        let user = await userModel
            .findOne({ email: decoded.email })
            .select('-password');

        if (!user) {
            req.flash('error', 'User not found');
            console.log('User not found for email:', decoded.email);
            return res.redirect('/login');
        }
        req.user = user;
        next();
    } catch (err) {
        console.log('Error verifying token or finding user:', err.message);
        req.flash('error', 'Something went wrong');
        res.redirect('/users/login');
    }
};
