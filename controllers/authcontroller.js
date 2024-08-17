const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const userModel = require('../models/users-model');
const generateToken = require('../utils/generateToken');

module.exports.registerUser = async (req, res) => {
    const {
        fullName,
        userName,
        email,
        phoneNumber,
        profession,
        address,
        pinCode,
        taluka,
        city,
        password,
        confirmPassword,
        isAdmin,
    } = req.body;

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/users/register');
    }

    let user = await userModel.findOne({ email: email });
    if (user) {
        req.flash("error", "You already have an account, please login.");
        return res.redirect('/users/login');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profilePicture = `/images/Frontend-images/user.png`; // Default image

        if (req.file) {
            
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const filePath = path.join(__dirname, '../public/images/uploads', fileName);
           
            fs.writeFileSync(filePath, req.file.buffer);
            profilePicture = `/images/uploads/${fileName}`;
        }

        const createdUser = await userModel.create({
            fullName,
            userName,
            email,
            phoneNumber,
            profession,
            profilePicture,
            address,
            pinCode,
            taluka,
            city,
            password: hashedPassword,
            isAdmin:false,
        });

        const token = generateToken(createdUser);
        res.cookie("token", token);

        req.flash('success', 'Registration successful');
        res.redirect('/users/login');
    } catch (error) {
        req.flash('error', 'Error registering user: ' + error.message);
        res.redirect('/users/register');
    }
};

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/users/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/users/login');
        }

        const token = generateToken(user);
        res.cookie("token", token);

        req.flash('success', 'Login successful');

        const redirectUrl = user.isAdmin ? '/owner/daily-orders':'/home';
        return res.redirect(redirectUrl)
        
    } catch (error) {
        req.flash('error', 'Error logging in user: ' + error.message);
        res.redirect('/users/login');
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie('token');
    req.flash('success', 'You have successfully logged out');
    res.redirect('/');
};
