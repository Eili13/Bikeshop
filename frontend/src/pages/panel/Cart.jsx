import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, Button, Modal, Snackbar, Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import the icon
import axios from 'axios'; // Import axios

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state?.cart || []);
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/'); // Navigate to home page after closing the modal
  };
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleBackToProducts = () => {
    navigate('/');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setSnackbarMessage("Your cart is empty. Please add products to the cart before checking out.");
      setOpenSnackbar(true);
      return;
    }

    const orderData = {
      user: "671a920550032448006a5bf5", // Replace with actual user ID
      orderItems: cart.map(item => ({
        name: item.name,
        quantity: 1, // Assuming 1 quantity per item in cart
        image: item.images.length > 0 ? item.images[0].url : '',
        price: item.price,
        product: item._id
      })),
      shippingInfo: {
        address: "Blk 7 lot 4 sampaloc street.", // Replace with actual address
        city: "Taguig City", // Replace with actual city
        postalCode: "1630", // Replace with actual postal code
        country: "Philippines" // Replace with actual country
      },
      paymentInfo: {
        id: "pi_1F8v8JF8v8Jf8v8Jf8v8Jf8v", // Replace with actual payment ID
        status: "Succeeded" // Replace with actual payment status
      },
      paidAt: new Date().toISOString(),
      itemPrice: cart.reduce((total, item) => total + item.price, 0),
      taxPrice: 10.99,
      shippingPrice: 5.99,
      totalPrice: cart.reduce((total, item) => total + item.price, 0) + 10.99 + 5.99,
      orderStatus: "Processing",
      createdAt: new Date().toISOString()
    };

    try {
      await axios.post('http://localhost:4001/api/v1/order', orderData);
      setCart([]);  // Clear the cart after checkout
      handleOpenModal();  // Open the modal after checkout
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to process your order. Please try again.");
      setOpenSnackbar(true);
    }
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

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleBackToProducts}>
          Back to Products
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        {/* Button with icon */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCheckout}
          startIcon={<ShoppingCartIcon />} // Add the icon here
        >
          Proceed to Checkout
        </Button>
      </Box>

      {/* Modal for Checkout Success */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="checkout-modal"
        aria-describedby="checkout-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Checkout Successful!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your order has been successfully placed.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for Error Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;
