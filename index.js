const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
const multer = require('multer');
const path = require('path')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const Product = require('./models/products')
const Cart = require('./models/cart')



const { resolve } = require('path');


const app = express()
let port = process.env.port || 3000

const DBURL = "mongodb+srv://admin:majoje1582@cluster0.cqudxbr.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DBURL);



app.set('view engine', 'ejs');
app.use(express.static("public1"));
app.use(express.urlencoded())
// Set up session
app.use(methodOverride('_method'));

app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  
  store: MongoStore.create({ mongoUrl: DBURL })
}));

/*app.use(
  session({
    secret: "mooohdhfhgfgfggggbb55544@@!@#$$FTtvsvv4435ffv",
    resave: false,
    saveUninitialized: true,
    proxy: true,
    name: "BolbukCookie",
    cookie:{
      secure:true,
      httpOnly: false,
      sameSite: 'none'
    }
  })
);*/
app.use('/uploads', express.static(resolve(__dirname, 'uploads')));


app.use(function(req, res, next){
  res.locals.session = req.session
  next()
})




app.get('/', (req, res)=>{
  Product.find()
  .then(data=>{
    console.log(data)
    res.render('index', {data})
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
    console.log(snacks)
    res.render('snacks', {data:snacks})
  })
})
app.get('/oil', (req, res)=> {
  Product.find()
  .then(data=>{
    const oil = data.filter(product => product.category === 'oil');
    //console.log(snacks)
    res.render('snacks', {data:oil})
  })
})
app.get('/flour', (req, res)=> {
  Product.find()
  .then(data=>{
    const oil = data.filter(product => product.category === 'Flour Products');
   // console.log(snacks)
    res.render('flour', {data:oil})
  })
})
app.get('/beverages', (req, res)=> {
  Product.find()
  .then(data=>{
    const oil = data.filter(product => product.category === 'Beverages');
   // console.log(snacks)
    res.render('flour', {data:oil})
  })
})
app.get('/dairy', (req, res)=> {
  Product.find()
  .then(data=>{
    const oil = data.filter(product => product.category === 'dairy');
   // console.log(snacks)
    res.render('flour', {data:oil})
  })
})
app.get('/paste', (req, res)=> {
  Product.find()
  .then(data=>{
    const oil = data.filter(product => product.category === 'Paste and puree');
   // console.log(snacks)
    res.render('flour', {data:oil})
  })
})
app.get('/sauces', (req, res)=> {
  Product.find()
  .then(data=>{
    const oil = data.filter(product => product.category === 'Sauces');
   // console.log(snacks)
    res.render('flour', {data:oil})
  })
})
app.get('/vegetablesandfruits', (req, res)=> {
  Product.find()
  .then(data=>{
    const oil = data.filter(product => product.category === 'Vegetables and Fruits');
   // console.log(snacks)
    res.render('flour', {data:oil})
  })
})
app.get('/seasoning', (req, res)=> {
  Product.find()
  .then(data=>{
    const oil = data.filter(product => product.category === 'Seasoning');
   // console.log(snacks)
    res.render('flour', {data:oil})
  })
})
app.get('/drinks', (req, res)=> {
  Product.find()
  .then(data=>{
    const oil = data.filter(product => product.category === 'Drinks');
   // console.log(snacks)
    res.render('flour', {data:oil})
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
  

  app.post('/createproduct', upload.single('image'), function(req, res){
    var name = req.body.name
    var image = req.file.filename;
    //console.log(req.file)
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



app.listen(port,  ()=>{
    console.log(`server started listening on ${port}` )
})