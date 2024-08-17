const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/products-model");
const flash = require('connect-flash');

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(flash());

// POST /products/create
router.post('/create', upload.single("productImage"), async (req, res) => {

    let { productName, companyName, schemes, productCompositions, productPacking, productPrice } = req.body;



    // Ensure productPacking and productPrice are arrays
    productPacking = Array.isArray(productPacking) ? productPacking : [productPacking];
    productPrice = Array.isArray(productPrice) ? productPrice : [productPrice];

    try {
        let product = await productModel.create({
            productName,
            companyName,
            schemes,
            productImage:req.file ? req.file.buffer : null,
            productCompositions,
            productPacking,
            productPrice,
        });
        req.flash('success', 'product created Successfully')
        res.redirect("/owner/add-product");
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send("Error creating product");
    }
});

module.exports = router;

