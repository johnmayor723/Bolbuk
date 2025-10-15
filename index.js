const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const { resolve } = require('path');

const app = express();
const port = process.env.PORT || 3000;
const DBURL = process.env.DB_URL;

// ============================
// 🗄️ Database connection
// ============================
mongoose.connect(DBURL)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));

// ============================
// ⚙️ View Engine (EJS)
// ============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================
// ⚙️ Middleware setup
// ============================
app.use(cors({
  origin: '*', // Change this to your frontend domain later
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(express.static(resolve(__dirname, 'public')));
app.use('/uploads', express.static(resolve(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// ============================
// 💾 Session setup
// ============================
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: DBURL })
}));

// Make session data available in all EJS templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ============================
// 🧭 Routers
// ============================
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/products');
const managementRoutes = require('./routes/management');
const apiIndexRoutes = require('./routes/api');
const apiProductRoutes = require('./routes/api/product');

app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/management', managementRoutes);
app.use('/api/index', apiIndexRoutes);
app.use('/api/product', apiProductRoutes);

// ============================
// 🚀 Start server
// ============================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

