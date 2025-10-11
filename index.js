const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const path = require('path');
const compression = require('compression');

const { resolve } = require('path');

const app = express();
const port = process.env.PORT || 3000;
const DBURL = process.env.DB_URL;

// Database connection
mongoose.connect(DBURL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// View Engine
app.set('view engine', 'ejs');

// Static files
app.use(compression());
app.use(express.static(resolve(__dirname, 'public')));
app.use('/uploads', express.static(resolve(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: DBURL })
}));

// Middleware for session data in EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Routers
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');


app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
