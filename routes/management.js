// routes/managementRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/products");

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 🏠 Admin Dashboard — show all products
router.get("/admin", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render("management/admin-dashboard", { products });
  } catch (err) {
    console.error(err);
    res.send("Error loading dashboard");
  }
});

// 🆕 Create Product Form
router.get("/create-product", (req, res) => {
  res.render("management/create-product");
});

// ➕ Handle new product
router.post("/create-product", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await Product.create({ name, description, price, category, image });
    res.redirect("/management/admin");
  } catch (err) {
    console.error(err);
    res.send("Error creating product");
  }
});

// 👁️ Show Single Product (View/Edit/Delete)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("management/show-product", { product });
  } catch (err) {
    console.error(err);
    res.send("Error loading product");
  }
});

// ❌ Delete Product
router.post("/:id/delete", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/management/admin");
  } catch (err) {
    console.error(err);
    res.send("Error deleting product");
  }
});

module.exports = router;