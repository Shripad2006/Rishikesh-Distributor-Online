const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullname : {
        type:String,
        minLength: 3,
        trim:true,
    },
    username : String,
    email : String,
    phoneNumber : String,
    profession: {
        type: String,
        enum: ['doctor', 'medicalStore', 'mr'],
        required: [true, 'Profession is required']
    },
    picture: String,
    addressForDelivery: String,
    pincode: String,
    Taluka: String,
    city: String,
    password: String,
    confirmPassword: String,
    cart:{
        type:Array,
        default:[],
    },

    isAdmin:{
        type:Boolean
    },
    orders:{
        type:Array,
        default:[]
    }
    })

    module.exports = mongoose.model('users', userSchema)