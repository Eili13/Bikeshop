const mongoose = require('mongoose');
const Product = require('../models/product'); // Ensure the correct path to your Product model
const APIFeatures = require('../utils/apiFeatures');
const Category = require('../models/category'); // Ensure this import is present



// Create new product
exports.newProduct = async (req, res, next) => {
    try {
        const { name, price, category, description, seller, ratings, images, stock, numOfReviews, reviews } = req.body;
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
            reviews
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
exports.updateProduct = async (req, res, next) => {
    try {
        const { category, ...productData } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, {
            ...productData,
            category: mongoose.Types.ObjectId(category)
        }, {
            new: true,
            runValidators: true
        });
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
        res.status(400).json({
            success: false,
            message: error.message
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
