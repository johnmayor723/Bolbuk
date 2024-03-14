const multer = require('multer');

const Product = require('../models/products')


const findproducts = (req, res) => {
    Product.find()
  .then(data=>{
    res.render('shop', {data});
  })
  .catch(err=>{
    console.log(err)
     res.render('index')
  })

}




// Express route to handle file upload
  const uploadImage = () => {
    let storage = multer.diskStorage({

      destination: function (req, file, cb) {
    
        cb(null, './uploads');
    
      },
    
      filename: function (req, file, cb) {
    
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    
      }
    
    });
    
    
    
    let upload = multer({ storage: storage });
    upload()
  }

  uploadrouter.post('/upload', upload.single('image'), async function(req, res, next) {

  // Get the file path

  const filePath = req.file.path;



  try {

    // Insert image reference into MongoDB using Mongoose

    const newImage = new Image({ path: filePath });

    await newImage.save();

    console.log('Image reference inserted into MongoDB');

    res.redirect('/');

  } catch (error) {

    console.error('Error inserting image reference into MongoDB:', error);

    res.status(500).send('Error uploading image');

  }

});





uploadrouter.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});

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

 async function removeproduct(req, res)  {
    await Tracker.findOneAndDelete(req.params.id)
    findproducts()
}

 async function editproduct(req, res){
    let data = req.body
  
  console.log(data)
  await Product.findByIdAndUpdate(id, {...data})
  Product.find()
  .then(data=>{
    res.render('index', {data});
  })
    
}

module.exports = {
    findproducts,
    createproduct,
    removeproduct,
    editproduct,
    uploadImage
}