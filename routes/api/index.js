const express = require('express');
const router = express.Router();
const Product = require('../../models/products');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const categoryMap = {
      flour: 'Flour Products',
      beverages: 'Beverages',
      dairy: 'Dairy Products',
      paste: 'Paste and Puree',
      sauces: 'Sauces',
      vegetablesandfruits: 'Vegetables and Fruits',
      seasoning: 'Seasoning',
      oil: 'Oil Products',
      snacks: 'Snacks'
    };

    const categoryName = categoryMap[category.toLowerCase()];
    if (!categoryName)
      return res.status(404).json({ success: false, message: 'Category not found' });

    const products = await Product.find({ category: categoryName });
    res.json({
      success: true,
      count: products.length,
      category: categoryName,
      products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
