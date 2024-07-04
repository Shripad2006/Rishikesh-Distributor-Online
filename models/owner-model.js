const mongoose = require('mongoose')


const ownerSchema = mongoose.Schema({
    fullname : {
        type:String,
        minLength: 3,
        trim:true,
    },
    username : String,
    email : String,
    phoneNumber : String,
    password: String,
    products:{
        type:Array,
        default:[]
    },
    picture: String,
    })

    module.exports = mongoose.model('owner', ownerSchema) 