import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardMedia, CardContent, Badge, IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import ShoppingCart icon
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);  // State for cart items
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();  // Initialize navigate function

  // Function to retrieve products from the API
  const retrieve = async () => {
    try {
      const res = await axios.get('http://localhost:4001/api/v1/products');
      setProducts(res.data.products);
    } catch (e) {
      console.log(e);
      setErrorMessage('Failed to retrieve products');
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    retrieve();
  }, []);

  // Handle "Add to Cart" button click
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const isProductInCart = prevCart.some(item => item._id === product._id);
      if (isProductInCart) {
        // If product is already in cart, just return the existing cart
        return prevCart;
      }
      // Add new product to cart
      return [...prevCart, { ...product }];
    });
  };

  // Handle click on Cart Icon to navigate to Cart Page
  const handleCartClick = () => {
    navigate('/cart', { state: { cart } });  // Pass cart state while navigating
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
                  {/* Add to Cart Button */}
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
