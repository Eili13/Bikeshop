import React from 'react';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, Button
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get cart from state (passed from ProductManagement)
  const { cart } = location.state || { cart: [] };

  // Navigate back to ProductManagement page
  const handleBackToProducts = () => {
    navigate('/');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Shopping Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Your cart is empty!
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {cart.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Button to go back to the product page */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleBackToProducts}>
          Back to Products
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
