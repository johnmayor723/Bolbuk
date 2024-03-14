// uploads/upload.js

const express = require('express');


//const Product = require('../models/products')
const {uploadImage, createproduct } = require ('../controllers/product.controller')

const uploadrouter = express().router


uploadrouter.post('/', uploadImage, createproduct)




module.exports = uploadrouter;
