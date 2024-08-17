const jwt = require('jsonwebtoken')
const userModel = require('../models/users-model')

const attachUserToLocals = async(req,res,next)=>{
    res.locals.user = null;

    if(req.cookies.token){
        try {
           const token = jwt.verify(req.cookies.token, process.env.JWT_KEY)
           const user = await userModel.findById(token.id).exec()

           if (user) {
            res.locals.user = user;
        }
        } catch (error) {
            console.error('Error attaching user to locals:', error);
        }
    }
    next();
}

module.exports = attachUserToLocals;