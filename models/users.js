const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
require('dotenv').config();

// Connecting Mongoose
/*mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

const URL = "mongodb+srv://admin:majoje1582@cluster0.cqudxbr.mongodb.net/?retryWrites=true&w=majority"
// Connecting Mongoose
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Setting up the schema
const User = new mongoose.Schema({
  username: String,
  isAdmin:{
    type: Boolean,
    default: false
  },
  pin: String
});

// Setting up the passport plugin
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);