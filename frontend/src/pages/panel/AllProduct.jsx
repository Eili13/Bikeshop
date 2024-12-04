import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardMedia, CardContent, Badge, IconButton, Select, MenuItem, FormControl, InputLabel, Slider, Pagination
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]); // All products fetched from API
  const [cart, setCart] = useState([]); // Cart state to store added products
  const [errorMessage, setErrorMessage] = useState(""); // Error message in case API fetch fails
  const [categoryFilter, setCategoryFilter] = useState(""); // Category filter state
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Price range filter state
  const [categories, setCategories] = useState([]); // Available categories for filtering
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages for pagination
  const navigate = useNavigate(); // Hook to navigate to cart page

  // Function to fetch products from API with applied filters and pagination
  const retrieve = async (page = 1) => {
    try {
      const res = await axios.get('http://localhost:4001/api/v1/products', {
        params: {
          limit: 10,  // Limit products per page
          page: page,
          category: categoryFilter,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        },
      });
      console.log(res.data);

      // Set fetched products and total pages for pagination
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setCategories([...new Set(res.data.products.map(product => product.category))]); // Set unique categories
    } catch (e) {
      console.log(e);
      setErrorMessage('Failed to retrieve products');
    }
  };

  // Fetch products when currentPage, categoryFilter, or priceRange changes
  useEffect(() => {
    retrieve(currentPage);
  }, [currentPage, categoryFilter, priceRange]);

  // Handle adding a product to the cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      // Check if the product is already in the cart
      const isProductInCart = prevCart.some(item => item._id === product._id);
      
      if (isProductInCart) {
        // If the product is already in the cart, return previous cart state
        return prevCart;
      }
      
      // Add the product to the cart if not already there
      return [...prevCart, { ...product }];
    });
  };

  // Handle click on cart icon to navigate to the cart page
  const handleCartClick = () => {
    navigate('/cart', { state: { cart } }); // Pass the current cart to the cart page
  };

  // Handle change in category filter
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Reset to page 1 when category changes
  };

  // Handle change in price range filter
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1); // Reset to page 1 when price range changes
  };

  // Handle pagination (page change)
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Product Management
      </Typography>
      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {/* Filters Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ minWidth: 300 }}>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={1000000}
          />
        </Box>
      </Box>

      {/* Product Grid Section */}
      <Grid container spacing={4}>
        {products.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No products found
            </Typography>
          </Grid>
        ) : (
          products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images.length > 0 ? product.images[0].url : 'https://placehold.co/600x400'}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    ${product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleAddToCart(product)} // Add to Cart Button
                    sx={{ mt: 2 }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Cart Icon with Badge showing number of items */}
      <Box sx={{ position: 'fixed', top: 20, right: 20 }}>
        <IconButton color="primary" onClick={handleCartClick}>
          <Badge badgeContent={cart.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProductManagement;
