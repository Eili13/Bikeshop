const Product = require('../models/product'); // Ensure the correct path to your Product model

// Create
exports.newProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product // Corrected from 'products' to 'product'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
// Update
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
}

// Delete
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
            message: 'Product is deleted'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// single product
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

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
}

// Get All Products
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find(); // Query the database to get all products
        res.status(200).json({
            success: true,
            message: 'This route will show all products in database',
            products // Return the queried products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}