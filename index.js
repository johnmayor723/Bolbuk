const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
const multer = require('multer');
const path = require('path')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const Product = require('./models/products')
const Cart = require('./models/cart')
const Order = require('./models/order')



const { resolve } = require('path');


const app = express()
let port = process.env.port || 3000

const DBURL = "mongodb+srv://admin:majoje1582@cluster0.cqudxbr.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DBURL);



app.set('view engine', 'ejs');
app.use(express.static("public1"));
app.use(express.urlencoded())
// Set up session

//setting session parameters
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  
  store: MongoStore.create({ mongoUrl: DBURL })
}));
app.use(methodOverride('_method'));

app.use('/uploads', express.static(resolve(__dirname, 'uploads')));


app.use(function(req, res, next){
  res.locals.session = req.session
  next()
})


app.get('/demo', function(req, res){
  res.render('paymentdemo')
})

app.get('/', (req, res)=>{
  Product.find()
  .then(data=>{
    //console.log(data)
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');
    const snacks = data.filter(product => product.category === 'snacks');
    //console.log(oil)
    res.render('index', {data , oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
    
})
app.get('/show', (req, res)=>{
  Product.find()
  .then(data=>{
    console.log(data)
    res.render('showall', {data})
  })
    
})
//product/<%=product._id%>
app.get("/products/:id", function(req, res){
 let id = req.params.id
  
  
Product.findOne({_id:id })
  .then(data=>{
   console.log(data)
   //res.render('product', {data})
   res.render('edit', {data})
  })

})
app.put('/products/:id', async (req, res) => {
  const {id} = req.params;
  
  const data = req.body.products
  await Product.findByIdAndUpdate(id, {...data})
  .then(data=>{
    res.send(data);
  })
  
  

})
app.delete('/products/:id', async (req, res) => {
  await Product.findOneAndDelete(req.params.id)

  Product.find()
    .then(data=>{
      res.render('showall', {data});
    })
})

app.get('/admin', (req, res)=>{
  Product.find()
  .then(data=>{
    console.log(data)
    res.render('admin', {data})
  })
    
})



app.get('/products', (req, res)=>{
  if(req.session){
    var cart = req.session.cart
    Product.find()
    .then(data=>{
      console.log(data)
      res.render('products', {products:data, cart})
    })
  } else{
  var cart = {
    totalQty:0
  }
  var cart = req.session.cart
  res.render('products', {products:data, cart})
  }
})

app.post('/cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart.items : {});
  
  Product.findById(productId) 
  .then(product=>{
    cart.add(product, product.id);
      req.session.cart = cart;
      console.log(cart)
      res.redirect('/');
     
  })
      
 
 
});


app.delete('/product/:id', async (req, res) => {
  await Product.findOneAndDelete(req.params.id)
   console.log('hi')
  Product.find()
    .then(data=>{
      console.log(data)
      res.redirect('/admin');
    })
})

app.get('/about', function (req, res){
  res.render('contact')
})

app.get('/contact', function (req, res){
  res.render('contact')
})

app.get('/snacks', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:snacks, name:"Snacks", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})
app.get('/oil', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:oil, name:"Oil", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})
app.get('/flour', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:flour, name:"Flour products", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})
app.get('/beverages', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:beverages, name:"Beverages", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})
app.get('/dairy', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:dairy, name:"Dairy products", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})
app.get('/paste', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:pastes, name:"Pastes and puree", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})
app.get('/sauces', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:sauces, name:"Sauces", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})
app.get('/vegetablesandfruits', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:vegetables, name:"Vegetables and Fruits", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})
app.get('/seasoning', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:seasoning, name:"Seasoning", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})
app.get('/drinks', (req, res)=> {
  Product.find()
  .then(data=>{
    const snacks = data.filter(product => product.category === 'snacks');
    const flour = data.filter(product => product.category === 'Flour Products');
    const drinks = data.filter(product => product.category === 'Drinks');
    const seasoning = data.filter(product => product.category === 'Seasoning');
    const vegetables = data.filter(product => product.category === 'Vegetables and Fruits');
    const sauces = data.filter(product => product.category === 'Sauces');
    const pastes = data.filter(product => product.category === 'Paste and puree');
    const dairy = data.filter(product => product.category === 'dairy');
    const beverages = data.filter(product => product.category === 'Beverages');
    const oil = data.filter(product => product.category === 'oil');

    res.render('singleproduct', {data:drinks, name:"Drinks", oil, snacks, beverages, dairy, pastes, sauces, vegetables, seasoning, drinks, flour})
  })
})



app.get('/cart', function (req, res, next) {
  if (!req.session.cart) {
      return res.render('shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart.items);
  //let products = cart.generateArray()
  //let totalPrice = cart.totalPrice
  //console.log(products)
  res.render('shopping-cart', { products:cart.generateArray(), totalPrice:cart.totalPrice});
});
app.get('/payments', function (req, res, next) {
  if (!req.session.cart) {
      return res.render('shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart.items);
  //let products = cart.generateArray()
  //let totalPrice = cart.totalPrice
  //console.log(products)
  res.render('payments', { products:cart.generateArray(), totalPrice:cart.totalPrice});
});

//products creation and editing routes

app.get('/createproduct', (req, res) => {
  res.render('createproduct')
})

// upload handler



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })
  

  app.post('/createproduct',  function(req, res){
    var name = req.body.name
    var image = req.body.imgUrl

    console.log(image)
    var category = req.body.category
    var price = req.body.price
  
    var newProduct = {name, image, category, price}
    console.log(newProduct)
    Product.create(newProduct)
    .then(data=>{
      console.log(data)
     res.send(data)
    })
  })

app.get('/checkout', function(req, res){
  res.render('payment')
} )
// payments integration/////////////////////////////////////////////////////////


//const stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
let secret = "pk_test_51P8IdV00gH7PcBWd8U0sdblVIa4uXmjSmgKkvLOurvDDwandn13EyiUixkTa7WbZeYfbe6ktSx43aOVv3IWMzWEP00qsPoODKu"
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(secret);

app.post('/charge',  function(req, res, next) {
  if (!req.session.cart) {
      return res.redirect('/products');
  }
  var cart = new Cart(req.session.cart);
  
  var stripe = require("stripe")(
      "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"
  );

  stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: "gbp",
      source: req.body.token, // obtained with Stripe.js
      description: "Test Charge"
  }, function(err, charge) {
      if (err) {
          req.flash('error', err.message);
          return res.redirect('/charge');
      }
      var order = new Order({
         // user: req.user
          cart: cart,
          address: req.body.address,
          name: req.body.name,
          paymentId: charge.id
      });
      order.save(function(err, result) {
          req.flash('success', 'Successfully bought product!');
          req.session.cart = null;
          res.redirect('/');
      });
  }); 
});




app.listen(port,  ()=>{
    console.log(`server started listening on port ${port}` )
})