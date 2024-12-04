const mongoose = require('mongoose');
const Product = require('../models/product'); // Ensure the correct path to your Product model
const APIFeatures = require('../utils/apiFeatures');
const Category = require('../models/category'); // Ensure this import is present
const {ObjectId } = require('mongodb');



// Create new product
exports.newProduct = async (req, res, next) => {

    req.body.user = '674a09c5a4eaeacd5f60a5d5';

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
      // Fetch product by ID, including reviews (since it's an embedded field in the Product model)
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      // Return the product data along with its reviews
      res.status(200).json({
        success: true,
        product: {
          name: product.name,
          price: product.price,
          description: product.description,
          ratings: product.ratings,
          reviews: product.reviews  // Ensure reviews are included
        }
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


exports.addReview = async (req, res) => {
    try {
      const { productId, rating, comment } = req.body;
      
      // Log incoming request data
      console.log('Request body:', req.body);
  
      if (!rating || !comment) {
        return res.status(400).json({
          success: false,
          message: 'Rating and comment are required'
        });
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      const review = {
        name: req.user && req.user.name ? req.user.name : 'Eilizon Agcaoili',
        rating,
        comment
      };
  
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
  
      const totalRatings = product.reviews.reduce((acc, review) => acc + review.rating, 0);
      product.ratings = totalRatings / product.reviews.length;
  
      await product.save();
  
      res.status(200).json({
        success: true,
        message: 'Review added successfully',
        product
      });
    } catch (error) {
      console.error('Error in addReview:', error); // Log the error for more info
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
// Update review
exports.updateReview = async (req, res) => {
  const { productId, reviewId } = req.params;  // Get productId and reviewId from the URL
  const { rating, comment } = req.body;  // Get the updated rating and comment from the body

  try {
    // Validate product ID: Check if the product exists
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Validate review ID: Check if the review exists for the selected product
    const review = product.reviews.id(reviewId);  // Use `id()` method to find the review by its _id
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Ensure the rating is between 1 and 5 and the comment is provided
    if (rating <= 0 || rating > 5 || !comment) {
      return res.status(400).json({ success: false, message: 'Invalid rating or missing comment' });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;

    // Save the updated product with the updated review
    await product.save();

    // Send back the updated review
    res.status(200).json({ success: true, review: review });
  } catch (error) {
    console.error("Error in updateReview:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
// Delete review
exports.deleteReview = async (req, res) => {
    try {
      const { productId, reviewId } = req.body;
  
      // Find the product by productId
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
  
      // Find the review by reviewId
      const reviewIndex = product.reviews.findIndex((r) => r._id.toString() === reviewId);
      if (reviewIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Review not found',
        });
      }
  
      // Remove the review from the reviews array
      product.reviews.splice(reviewIndex, 1);
  
      // Update the numOfReviews and ratings fields
      product.numOfReviews = product.reviews.length;
  
      // Calculate the average rating after removal
      const totalRatings = product.reviews.reduce((acc, review) => acc + review.rating, 0);
      product.ratings = product.reviews.length > 0 ? totalRatings / product.reviews.length : 0;
  
      // Save the updated product document
      await product.save();
  
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
        product,
      });
    } catch (error) {
      console.error('Error in deleteReview:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };