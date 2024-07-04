const mongoose = require('mongoose')


const productSchema = mongoose.Schema({

    productImage : String,
    productName : String,
    productPrice : Number,
    discountPrice : {
        type : Number,
        default : 0,
    },
    companyName : String,
    productPacking : String,
    productComposition : String,

})
   

    module.exports = mongoose.model('products', productSchema)