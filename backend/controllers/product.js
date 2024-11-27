const mongoose = require('mongoose');
const Product = require('../models/product'); // Ensure the correct path to your Product model
const APIFeatures = require('../utils/apiFeatures');
const Category = require('../models/category'); // Ensure this import is present
const {ObjectId } = require('mongodb');



// Create new product
exports.newProduct = async (req, res, next) => {

    req.body.user = '6743ea4208371575b986da4a';

    try {
        const { name, price, category, description, seller, ratings, images, stock, numOfReviews, reviews, user } = req.body;
        // Validate the name of the product
        if (!name) {
            return res.status(400).json({ success: false, message: 'Product name is required' });
        }

        // Validate the category name
        if (!category) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        // Check if the category name exists in the Categories collection
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return res.status(400).json({ success: false, message: 'Invalid category name' });
        }

        // Create a new product
        const product = await Product.create({
            name,
            price,
            category: categoryDoc.name, // Use the category name from the Category document
            description,
            seller,
            ratings,
            images,
            stock,
            numOfReviews,
            reviews,
            user // Add the user field to the product
        });

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Get single product
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
      const productId = new ObjectId(req.params.id); // Ensure you're correctly creating a new ObjectId
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({
        success: true,
        product: updatedProduct
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  };

// Delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Products
exports.getProducts = async (req, res, next) => {
    try {
        const resPerpage = 4; // Number of results per page
        const apiFeatures = new APIFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagination(resPerpage);

        const products = await apiFeatures.query; // Execute the query
        const productCount = await Product.countDocuments(); // Get the total count of products

        res.status(200).json({
            success: true,
            message: 'This route will show all products in database',
            count: productCount, // Return the total count of products
            products // Return the queried products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
