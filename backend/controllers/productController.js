
const mongoose = require("mongoose");
const Product = require("../models/Product");

// Check whether a product ID is valid
const isValidId = (id) => mongoose.isValidObjectId(id);

// GET: Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products"
    });
  }
};

// GET: Get one product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product"
    });
  }
};

// POST: Add a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, quantity, description } = req.body;

    const newProduct = new Product({
      name,
      category,
      price,
      quantity,
      description
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct
    });
  } catch (error) {
    res.status(400).json({
      message: "Error adding product",
      error: error.message
    });
  }
};

// PUT: Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating product",
      error: error.message
    });
  }
};

// DELETE: Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product"
    });
  }
};
