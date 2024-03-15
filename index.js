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
  cookie: {secure: true},
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

app.get('/about', function (req, res){
  res.render('contact')
})

app.get('/contact', function (req, res){
  res.render('contact')
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
    var description = req.body.description
    var price = req.body.price
  
    var newProduct = {name, image, description, price}
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