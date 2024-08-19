// Load environment variables at the top
require('dotenv').config();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const debug = require('debug')("development:mongoose");
const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require("path");
const expressSession = require('express-session');
const flash = require('connect-flash');

const PORT = process.env.PORT || 3000;
const JWT_KEY = process.env.JWT_KEY || 'default_jwt_key'; 

// Connect to MongoDB

const MONGODB_URI= "mongodb+srv://shripadrkatta:vWtERiMGt3a2NMpm@rishikesh-distributor-o.oyhww.mongodb.net/?retryWrites=true&w=majority&appName=Rishikesh-Distributor-Online";


mongoose.connect(MONGODB_URI)
  .then(() => {
    debug("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

module.exports = mongoose.connection;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSession({
    secret:JWT_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }), 
    cookie: { secure: true }
}));
app.use(flash());

// Attach flash messages to response locals
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Attach user to locals
const attachUserToLocals = require('./middlewares/authMiddleware');
app.use(attachUserToLocals);

// Static files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Import Routes
const welcomeRouter = require("./routes/welcome");
const ownerRouter = require("./routes/ownerRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const homePageRouter = require("./routes/homePageRouter");
const profileRouter = require("./routes/profileRouter");
const orderRouter = require('./routes/orderRouter');
const servicesRouter = require('./routes/services');
const contactRouter = require('./routes/contact');

// Routes
app.use('/', welcomeRouter);
app.use('/owner', ownerRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/home', homePageRouter);
app.use('/profile', profileRouter);
app.use('/order', orderRouter);
app.use('/services', servicesRouter);
app.use('/contact', contactRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
