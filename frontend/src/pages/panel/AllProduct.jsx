import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardMedia, CardContent, Badge, IconButton, Select, MenuItem, FormControl, InputLabel, Slider, Pagination
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Function to retrieve products from the API with pagination
  const retrieve = async (page = 1) => {
    try {
      const res = await axios.get('http://localhost:4001/api/v1/products', {
        params: { limit: 20, page: page }, // Adjust the limit and page for pagination
      });
      console.log(res.data);

      setProducts(res.data.products); // Set the products for the current page
      setTotalPages(res.data.totalPages); // Set total pages for pagination
      setCategories([...new Set(res.data.products.map(product => product.category))]); // Set categories dynamically
    } catch (e) {
      console.log(e);
      setErrorMessage('Failed to retrieve products');
    }
  };

  // Fetch products when the component mounts or page changes
  useEffect(() => {
    retrieve(currentPage);
  }, [currentPage]);

  // Handle "Add to Cart" button click
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const isProductInCart = prevCart.some(item => item._id === product._id);
      if (isProductInCart) {
        return prevCart;
      }
      return [...prevCart, { ...product }];
    });
  };

  // Handle click on Cart Icon to navigate to Cart Page
  const handleCartClick = () => {
    navigate('/cart', { state: { cart } });
  };

  // Handle filter changes
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Reset to page 1 when category changes
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1); // Reset to page 1 when price range changes
  };

  // Filter products based on selected category and price range
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  console.log(filteredProducts);  // Log filtered products to ensure we're showing the right ones

  // Handle pagination change
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

      {/* Filters */}
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

      <Grid container spacing={4}>
        {filteredProducts.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No products found
            </Typography>
          </Grid>
        ) : (
          filteredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
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
                    onClick={() => handleAddToCart(product)}
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

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Cart Icon with Count */}
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
