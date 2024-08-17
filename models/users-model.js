const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    quantity: { type: Number, default: 1 },
    packing: String,  // Add packing field
    price: Number     // Add price field
});

const orderSchema = new mongoose.Schema({
    products: [cartItemSchema],
    date:{type:Date, default: Date.now}
})

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        minLength: 3,
        trim: true,
    },
    userName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: String,
    profession: {
        type: String,
        enum: ['doctor', 'medicalStore', 'mr'],
        required: [true, 'Profession is required'],
    },
    profilePicture: String,
    address: String,
    pinCode: String,
    taluka: String,
    city: String,
    password: {
        type: String,
        required: true
    },
    cart: [cartItemSchema], // Use the updated cartItemSchema

    isAdmin: {
        type: Boolean,
        default:false,
    },
    orders: [orderSchema],
    comments:[
        {type: mongoose.Schema.Types.ObjectId,ref:"Comments"}
    ]
});

module.exports = mongoose.model('User', userSchema);
