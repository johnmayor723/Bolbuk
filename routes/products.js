const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const Cart = require('../models/cart');
const Order = require('../models/order');
const multer = require('multer');
const Nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});
const upload = multer({ storage });

// Helper function
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

// Product list (admin)
router.get('/admin', async (req, res) => {
  const data = await Product.find();
  res.render('admin', { data });
});

// Create product form
router.get('/create', (req, res) => res.render('createproduct'));

// Create product
router.post('/create', upload.single('image'), async (req, res) => {
  const { name, category, price } = req.body;
  const image = req.file ? req.file.path : req.body.imgUrl;

  const product = await Product.create({ name, image, category, price });
  res.send(product);
});

// Edit product
router.get('/:id/edit', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('edit', { data: product });
});

router.put('/:id', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body.products);
  res.redirect('/products/admin');
});

// Delete product
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/products/admin');
});

// Add to cart
router.post('/cart/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  const cart = new Cart(req.session.cart ? req.session.cart.items : {});
  cart.add(product, product.id);
  req.session.cart = cart;
  res.redirect('/');
});

router.get('/cart', (req, res) => {
  const cart = req.session.cart;

  if (!cart) {
    return res.render('payments', { products: [], totalPrice: 0 });
  }

  // Convert items object to array
  const products = Object.values(cart.items);

  console.log("🛒 Cart Items Array:", products);

  res.render('payments', {
    products,
    totalPrice: cart.totalPrice
  });
});


/* View cart
router.get('/cart', (req, res) => {
  if (!req.session.cart) return res.render('shopping-cart', { products: null });
  const cart = new Cart(req.session.cart.items);
  res.render('shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});*/

// Checkout
router.get('/checkout', (req, res) => {
  const cart = req.session.cart;

  if (!cart) {
    return res.render('payments', { products: [], totalPrice: 0 });
  }

  // Convert items object to array
  const products = Object.values(cart.items);

  console.log("🛒 Cart Items Array:", products);

  res.render('payments', {
    products,
    totalPrice: cart.totalPrice
  });
});



// Charge
router.post('/charge', async (req, res) => {
   if (!req.session.cart || !req.session.cart.items) {
    console.log("⚠️ No cart found in session");
    return res.redirect('/products');
  }

  const cart = new Cart(req.session.cart);
  const formattedCart = formatCart(cart.generateArray());

  try {
    const charge = await stripe.charges.create({
      amount: cart.totalPrice * 100 * 1.18,
      currency: "gbp",
      source: req.body.token,
      description: "Test Charge"
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

// Email sender
async function sendEmail(content) {
  const transport = Nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mayowaandrews723@gmail.com',
      pass: process.env.GMAIL_PASS
    }
  });

  await transport.sendMail({
    from: 'FoodDeck Team',
    to: 'mayowaandrews723@gmail.com, fooddeck3@gmail.com',
    subject: 'New Order Received',
    text: content
  });
}

module.exports = router;
