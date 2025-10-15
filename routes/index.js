const express = require('express');
const router = express.Router();
const Product = require('../models/products');

// Homepage
router.get('/', async (req, res) => {
  try {
    const data = await Product.find();
    const categories = {
      flour: data.filter(p => p.category === 'Flour Products'),
      drinks: data.filter(p => p.category === 'Drinks'),
      seasoning: data.filter(p => p.category === 'Seasoning'),
      vegetables: data.filter(p => p.category === 'Vegetables and Fruits'),
      sauces: data.filter(p => p.category === 'Sauces'),
      pastes: data.filter(p => p.category === 'Paste and puree'),
      dairy: data.filter(p => p.category === 'dairy'),
      beverages: data.filter(p => p.category === 'Beverages'),
      oil: data.filter(p => p.category === 'oil'),
      snacks: data.filter(p => p.category === 'snacks')
    };
    res.render('index', { data, ...categories });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('about');
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact');
});

// Dynamic category routes
// Dynamic category route
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    console.log('Requested category:', category);
    if (!category) return res.status(400).send('No category provided');

    const categoryMap = {
      flour: 'Flour Products',
      beverages: 'Beverages',
      dairy: 'Dairy Products',
      paste: 'Paste and Puree',
      sauces: 'Sauces',
      vegetablesandfruits: 'Vegetables and Fruits',
      seasoning: 'Seasoning',
      oil: 'Oil',
      snacks: 'Snacks',
      alcohol: 'Alcohol',
      grains: 'Grains and ceareals',
      drinks: 'Drinks',
      hair: 'Hair care',
    };

    const categoryName = categoryMap[category.toLowerCase()];
    if (!categoryName) return res.status(404).send('Category not found');

    const products = await Product.find({ category: categoryName });
    console.log(`Found ${products.length} products in category ${categoryName}`);
    res.render('singleproduct', { category: categoryName, products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
