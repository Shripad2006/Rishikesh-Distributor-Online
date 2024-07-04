const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require("path");
const mongodb = require('./config/mongoose-connection')
const ownerRouter = require("./routes/ownerRouter")
const productsRouter =require("./routes/productsRouter")
const usersRouter = require("./routes/usersRouter") 

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json());


// Static files
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");

app.use('/owner', ownerRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);

app.listen(3000);