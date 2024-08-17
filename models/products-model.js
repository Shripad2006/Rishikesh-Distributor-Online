const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName: String,
    companyName: String,
    schemes: String,
    productImage: Buffer,
    productCompositions: String,
    productPacking: [String],
    productPrice: [String],
});


module.exports = mongoose.model('product', productSchema )

