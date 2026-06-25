const productCategories = require('./Routes/productCategories')
const express = require('express');
const app = express();
const cors= require('cors');
const products = require('./Routes/products');
const registration = require('./Routes/registration');
const login = require('./Routes/login');
const cookieParser = require('cookie-parser');
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/productCategories',productCategories)
app.use('/products',products);
app.use('/registration',registration)
app.use('/login',login);

const PORT = 5001
app.listen(PORT, () => {
    console.log("start..")
})