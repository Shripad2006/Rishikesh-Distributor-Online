const user = require('../models/users-model')

const isAdmin = async (req, res, next) => {

    try {

        const user = req.user;

        if (!user.isAdmin) {
            res.redirect("/home")
        }
        next()

    } catch (error) {
        res.status(500).send("Server error.");
    }
}
module.exports = isAdmin;