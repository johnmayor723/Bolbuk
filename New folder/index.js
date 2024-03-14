const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
const multer = require('multer');

const Product = require('./models/products')

/*const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { importSchema } = require('graphql-import');
const { graphqlUploadExpress } = require('graphql-upload');*/
///const uploadRouter = require('./routes/upload.router');
const { resolve } = require('path');


const app = express()
let port = process.env.port || 3000

/*const {
  indexrouter,
  createrouter,
  editrouter,
  removerouter
}   = require('./routes/product.router')*/

app.set('view engine', 'ejs');
app.set('view', path.join(__dirnamme, '/views'))
app.use(express.static("public"));
app.use(express.urlencoded())
// Set up session
app.use(methodOverride('_method'));
app.use(
  session({
    secret: "mooohdhfhgfgfggggbb55544@@!@#$$FTtvsvv4435ffv",
    resave: false,
    saveUninitialized: true,
  })
);
app.use('/uploads', express.static(resolve(__dirname, 'uploads')));






// Import GraphQL schema and resolvers
/*const schema = makeExecutableSchema({
  typeDefs: importSchema('./graphql/schema.graphql.js'),
  resolvers: require('./graphql/resolvers.js'),
});

// Use the graphql-upload middleware
app.use(graphqlUploadExpress());

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));*/

// Serve uploaded files

// Mount the file upload router
//app.use('/', uploadRouter);


app.get('/', (req, res)=>{
    res.render('index')
})



app.get('/products', (req, res)=>{
  res.render('products')
})


//products creation and editing routes

app.get('/createproduct', (req, res) => {
  res.render('createproduct')
})

// upload handler


  let storage = multer.diskStorage({

    destination: function (req, file, cb) {
  
      cb(null, './uploads');
  
    },
  
    filename: function (req, file, cb) {
  
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  
    }
  
  });
  
  
  
  let upload = multer({ storage: storage });
  

  app.post('/createProduct', upload.single('imagePath'), function(req, res){
    var name = req.body.name
    var image = "files/"+req.file.filename;
    var description = req.body.description
    var price = req.body.price
  
    var newProduct = {name, image, description, price}
  
    Product.create(newProduct)
    .then(data, ()=>{
      console.log(data)
     //res.render('products')
    })
  })
const createproduct = (req, res) => {
  let data = req.body
  Product.create(data)
  .then(data=>{
      res.render('shop', {data})
  })
  .catch(err=>{
      console.log(err)
       res.render('index')
    })
  
}


app.listen(port,  ()=>{
    console.log(`server started listening on ${port}` )
})