require('dotenv').config();
const mongoose = require('mongoose');
const debug = require('debug')("development:mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    debug("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

module.exports = mongoose.connection;
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require("path");
const expressSession = require('express-session');
const flash = require('connect-flash');
const PORT = process.env.PORT;

// Import Routes
const welcomeRouter = require("./routes/welcome");
const ownerRouter = require("./routes/ownerRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const homePageRouter = require("./routes/homePageRouter");
const profileRouter = require("./routes/profileRouter")
const orderRouter = require('./routes/orderRouter');
const services = require('./routes/services')
const attachUserToLocals = require('./middlewares/authMiddleware')

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSession({
    secret: process.env.JWT_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});
app.use(attachUserToLocals)

// Static files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use('/', welcomeRouter);
app.use('/owner', ownerRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/home', homePageRouter);
app.use('/profile',profileRouter);
app.use('/order', orderRouter);
app.use('/services', services);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
