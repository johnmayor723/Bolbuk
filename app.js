const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { importSchema } = require('graphql-import');
const { graphqlUploadExpress } = require('graphql-upload');
const uploadRouter = require('./routes/upload.router');
const { resolve } = require('path');


const app = express()

const {
  indexrouter,
  createrouter,
  editrouter,
  removerouter
}   = require('./routes/product.router')

app.set('view engine', 'ejs');
//app.set('view', path.join(__dirnamme, '/views'))
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





// Import GraphQL schema and resolvers
const schema = makeExecutableSchema({
  typeDefs: importSchema('./graphql/schema.graphql.js'),
  resolvers: require('./graphql/resolvers.js'),
});

// Use the graphql-upload middleware
app.use(graphqlUploadExpress());

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

// Serve uploaded files
app.use('/uploads', express.static(resolve(__dirname, 'uploads')));

// Mount the file upload router
app.use('/', uploadRouter);
let port = process.env.port || 3000

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

app.listen(port,  ()=>{
    console.log(`server started listening on ${port}` )
})
