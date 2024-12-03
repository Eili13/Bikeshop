import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';

const ReviewSection = () => {
  const [products, setProducts] = useState([]);  // To store products
  const [selectedProductId, setSelectedProductId] = useState('');  // For selected product
  const [reviews, setReviews] = useState([]); // Reviews for the selected product
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' }); // New review form
  const [errorMessage, setErrorMessage] = useState(''); // Error messages
  const [loading, setLoading] = useState(true); // Loading state for fetching products
  const [editingReview, setEditingReview] = useState(null); // Review being edited

  // Fetch products from the server
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:4001/api/v1/products');
      setProducts(res.data.products); // Assuming the response contains the list of products
      setLoading(false);
    } catch (e) {
      setErrorMessage('Failed to load products.');
      setLoading(false);
    }
  };

  // Fetch reviews for the selected product
  const fetchReviews = async (productId) => {
    try {
      const res = await axios.get(`http://localhost:4001/api/v1/productss/${productId}`);
      console.log('Fetched reviews:', res.data.product.reviews);  // Check if reviews are returned correctly
  
      if (res.data.product.reviews) {
        setReviews(res.data.product.reviews);  // Set reviews state
      } else {
        setReviews([]);  // No reviews available
      }
    } catch (e) {
      setErrorMessage('Failed to load reviews.');
    }
  };

  // Handle when a product is selected from the dropdown
  const handleProductChange = (event) => {
    const productId = event.target.value;
    setSelectedProductId(productId);
    fetchReviews(productId); // Fetch reviews for the selected product
  };

  // Handle review form submission
  const handleSubmitReview = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    const { rating, comment } = newReview;
    if (rating <= 0 || rating > 5 || !comment) {
      setErrorMessage('Rating must be between 1 and 5 and comment is required.');
      return;
    }
  
    try {
      const res = await axios.post(
        'http://localhost:4001/api/v1/products/review',
        { productId: selectedProductId, rating, comment }
      );
  
      if (res.data && res.data.review) {
        setReviews((prevReviews) => [...prevReviews, res.data.review]); // Add new review to the list
      } else {
        setErrorMessage('Review data is not properly structured.');
      }
  
      setNewReview({ rating: 0, comment: '' }); // Reset the review form
      setErrorMessage(''); // Clear any error messages

      handleRefreshPage(); // Refresh the page after submitting the review
    } catch (e) {
      setErrorMessage('Failed to submit the review.');
      console.error('Error submitting review:', e.response ? e.response.data : e); // Log error response
    }
  };

  // Handle updating an existing review
  const handleUpdateReview = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const { rating, comment } = newReview;
  
    if (rating <= 0 || rating > 5 || !comment) {
      setErrorMessage('Rating must be between 1 and 5 and comment is required.');
      return;
    }
  
    try {
        const res = await axios.put('http://localhost:4001/api/v1/products/review', {
            productId: selectedProductId,  // Ensure this is set correctly
            reviewId: editingReview._id,  // Ensure this is set correctly
            rating,
            comment,
          });
  
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === editingReview._id ? res.data.review : review
        )
      );
  
      setNewReview({ rating: 0, comment: '' });
      setEditingReview(null);
      setErrorMessage('');
  
      handleRefreshPage(); // Refresh the page after updating the review
    } catch (e) {
      setErrorMessage('Failed to update the review.');
      console.error('Error updating review:', e.response ? e.response.data : e);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete('http://localhost:4001/api/v1/products/review', {
        data: { productId: selectedProductId, reviewId }
      });

      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
    } catch (e) {
      setErrorMessage('Failed to delete the review.');
    }
  };

  // Handle edit review click
  const handleEditClick = (review) => {
    setNewReview({ rating: review.rating, comment: review.comment });
    setEditingReview(review);  // This should set the editingReview state to the selected review
  };

  // Function to refresh the page
  const handleRefreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, []);

  return (
    <Box sx={{ p: 4, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Product Reviews
      </Typography>

      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {/* Dropdown for selecting product */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="product-select-label">Select Product</InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          value={selectedProductId}
          onChange={handleProductChange}
          label="Select Product"
          disabled={loading}
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            products.map((product) => (
              <MenuItem key={product._id} value={product._id}>
                {product.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {/* Review List */}
      {selectedProductId && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reviews for Product {selectedProductId}
          </Typography>

          <List sx={{ mb: 4 }}>
            {reviews.length === 0 ? (
              <Typography>No reviews yet. Be the first to review!</Typography>
            ) : (
              reviews.map((review) => (
                <ListItem key={review._id}>
                  <ListItemText
                    primary={`Rating: ${review.rating}`}
                    secondary={`Comment: ${review.comment}`}
                  />
                  <Button onClick={() => handleEditClick(review)} variant="contained" color="secondary" sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteReview(review._id)} variant="outlined" color="error">
                    Delete
                  </Button>
                </ListItem>
              ))
            )}
          </List>

          {/* Review Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Rating (1-5)"
              value={newReview.rating}
              onChange={(e) => {
                const value = Math.max(1, Math.min(5, parseInt(e.target.value, 10) || 0));
                setNewReview({ ...newReview, rating: value });
              }}
              fullWidth
              type="number"
              inputProps={{ min: 1, max: 5 }}
            />
            <TextField
              label="Comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={editingReview ? handleUpdateReview : handleSubmitReview}
            >
              {editingReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ReviewSection;
