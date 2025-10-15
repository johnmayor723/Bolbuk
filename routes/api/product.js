const express = require('express');
const router = express.Router();
const Product = require('../../models/products');
const Cart = require('../../models/cart');
const Order = require('../../models/order');
const multer = require('multer');
const Nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// ---------- MULTER ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ---------- HELPER ----------
function formatCart(cartItems) {
  let formattedCart = 'Your cart contains:\n\n';
  let total = 0;
  cartItems.forEach(item => {
    formattedCart += `Name: ${item.name}\nPrice: ₦${item.price}\nQuantity: ${item.qty}\n-----------------\n`;
    total += item.price * item.qty;
  });
  formattedCart += `Total: ₦${total.toFixed(2)}\n`;
  return formattedCart;
}

// ---------- ADMIN PAGE ----------
router.get('/admin', async (req, res) => {
  const data = await Product.find();
  res.render('admin', { data });
});

// ---------- CREATE PRODUCT (FORM) ----------
router.get('/create', (req, res) => res.render('createproduct'));

// ---------- CREATE PRODUCT (POST) ----------
router.post('/create', upload.single('image'), async (req, res) => {
  const { name, category, price, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const product = await Product.create({ name, description, image, category, price });

  // Return JSON if the request is from mobile, otherwise redirect
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({ success: true, product });
  }
  res.redirect('/products/admin');
});

// ---------- EDIT PRODUCT ----------
router.get('/:id/edit', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('edit', { data: product });
});

router.post('/:id/update', async (req, res) => {
  const { name, description, price, category } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, description, price, category });
  res.redirect('/products/admin');
});

// ---------- DELETE PRODUCT ----------
router.post('/:id/delete', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/products/admin');
});

// ---------- ADD TO CART ----------
router.post('/cart/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  const cart = new Cart(req.session.cart ? req.session.cart.items : {});
  cart.add(product, product.id);
  req.session.cart = cart;
  res.redirect('/');
});

// ---------- VIEW CART ----------
router.get('/cart', (req, res) => {
  const cart = req.session.cart;
  if (!cart) {
    return res.render('payments', { products: [], totalPrice: 0 });
  }
  const products = Object.values(cart.items);
  res.render('payments', { products, totalPrice: cart.totalPrice });
});

// ---------- CHECKOUT ----------
router.get('/checkout', (req, res) => {
  const cart = req.session.cart;
  if (!cart) {
    return res.render('payments', { products: [], totalPrice: 0 });
  }
  const products = Object.values(cart.items);
  res.render('payments', { products, totalPrice: cart.totalPrice });
});

// ---------- CHARGE ----------
router.post('/charge', async (req, res) => {
  if (!req.session.cart || !req.session.cart.items) {
    return res.redirect('/products');
  }

  const cart = new Cart(req.session.cart);
  const formattedCart = formatCart(cart.generateArray());

  try {
    const charge = await stripe.charges.create({
      amount: Math.round(cart.totalPrice * 100),
      currency: "usd",
      source: req.body.token,
      description: "Bolbuk Order"
    });

    const order = await Order.create({
      cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });

    await sendEmail(formattedCart);
    req.session.cart = null;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/products/cart');
  }
});

// ---------- EMAIL SENDER ----------
async function sendEmail(content) {
  const transport = Nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mayowaandrews723@gmail.com',
      pass: process.env.GMAIL_PASS
    }
  });

  await transport.sendMail({
    from: 'Bolbuk Foods',
    to: 'mayowaandrews723@gmail.com, fooddeck3@gmail.com',
    subject: 'New Order Received',
    text: content
  });
}

// =========================================================
// ================  JSON API ENDPOINTS  ===================
// =========================================================

// ✅ GET all products (for mobile)
router.get('/api/all', async (req, res) => {
  const products = await Product.find();
  res.json({ success: true, count: products.length, products });
});

// ✅ GET single product
router.get('/api/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, product });
});

// ✅ GET category products
router.get('/api/category/:category', async (req, res) => {
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
  const categoryName = categoryMap[category.toLowerCase()] || category;
  const products = await Product.find({ category: categoryName });
  res.json({ success: true, category: categoryName, count: products.length, products });
});

module.exports = router;
