const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const ProductModel = require('../models/products-model');
const userModel = require('../models/users-model');
const SearchMiddleware = require('../middlewares/search');
const { route } = require('./services');
const productsModel = require('../models/products-model');

// Use SearchMiddleware with the 'products' model for this route
router.get('/' ,SearchMiddleware('products'), isLoggedIn, async (req, res) => {
    try {
        // Use req.results from the middleware
        const products = req.results;
        const success = req.flash('success');
       
        res.render('home', { products, success,searchQuery: req.searchQuery });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products");
    }
});



router.get('/product/:productId', (req, res) => {
    const productId = req.params.productId;

    ProductModel.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.render('viewProduct', { product });
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            res.status(500).send('Error fetching product');
        });
});

router.post('/delete-product/:id', async (req,res)=>{
   try {
    const productId= await ProductModel.findById(req.params.id);
    const deleteProduct = await ProductModel.findByIdAndDelete(req.params.id)
    req.flash('success','Product Deleted Successfuly')
    res.redirect('/home')
   } catch (error) {
    res.status(500)
   }
})

router.get('/cart', isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate('cart.product').exec();
        let totalItems = 0;
        let totalAmount = 0;
        let distinctProducts = new Set();
        let cartItems = user.cart.map((cartItem, index) => {
            if (cartItem.product) {
                totalItems += cartItem.quantity;
                totalAmount += cartItem.quantity * cartItem.price;
                distinctProducts.add(cartItem.product._id.toString());
                return { ...cartItem.toObject(), indexNumber: index + 1 };
            }
        }).filter(cartItem => cartItem); // Filter out any undefined values

        res.render('cart', { user, cartItems, totalAmount, totalItems, totalProducts: distinctProducts.size });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).send("Error fetching cart");
    }
});


router.post('/addtocart/:productId', isLoggedIn, async (req, res) => {
    try {
        if (!req.user) {
            req.flash('error', 'User not authenticated');
            return res.redirect('/home');
        }

        let user = await userModel.findOne({ email: req.user.email }).populate('cart.product').exec();
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/home');
        }

        const { packing, price } = req.body;
        const productId = req.params.productId;
        const product = await ProductModel.findById(productId);

        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/home');
        }

        let cartItem = user.cart.find(item => item.product && item.product._id.toString() === productId && item.packing === packing);

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.cart.push({ product: productId, packing, price: parseFloat(price), quantity: 1 });
        }

        await user.save();

        req.flash('success', 'Added to cart');
        res.redirect('/home');
    } catch (error) {
        console.error('Error adding to cart:', error);
        req.flash('error', 'Unable to add to cart');
        res.redirect('/home');
    }
});

router.post('/updatecartquantity/:productId', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const productId = req.params.productId;
        const { packing, quantityChange } = req.body;

        let cartItem = user.cart.find(item => item.product.toString() === productId && item.packing === packing);

        if (cartItem) {
            cartItem.quantity += quantityChange;
            if (cartItem.quantity <= 0) {
                user.cart = user.cart.filter(item => !(item.product.toString() === productId && item.packing === packing));
            }
            await user.save();
            res.send({ success: true });
        } else {
            res.status(404).send('Cart item not found');
        }
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).send('Error updating cart quantity');
    }
});

router.post('/removefromcart/:productId', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const productId = req.params.productId;
        const { packing } = req.body;

        user.cart = user.cart.filter(cartItem => !(cartItem.product.toString() === productId && cartItem.packing === packing));

        await user.save();

        res.send({ success: true });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).send('Error removing from cart');
    }
});


router.get('/companies', isLoggedIn, (req, res) => {
    res.render('companies');
  });
  

module.exports = router;
