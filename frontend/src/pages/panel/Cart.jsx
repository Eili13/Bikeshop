import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, Button, Modal, Snackbar, Alert, TextField
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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

  // Handle updating quantity in the cart
  const handleQuantityChange = (index, event) => {
    const newCart = [...cart];
    const quantity = Math.max(1, Number(event.target.value)); // Ensure quantity is at least 1
    newCart[index].quantity = quantity;
    setCart(newCart);
  };

  // Handle order status navigation instead of checkout
  const handleOrderStatus = async () => {
    if (cart.length === 0) {
      setSnackbarMessage("Your cart is empty. Please add products to the cart before proceeding.");
      setOpenSnackbar(true);
      return;
    }

    // Check if each item has a valid productId
    const invalidItem = cart.find(item => !item._id);
    if (invalidItem) {
      setSnackbarMessage(`Item "${invalidItem.name}" is missing a valid productId.`);
      setOpenSnackbar(true);
      return;
    }

    // Calculate total price (product price * quantity + shipping + tax)
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0) + 10.99 + 5.99; // Example: shipping and tax

    // Simulate order data (you can adjust this if you want to send it to the server)
    const orderData = {
      orderStatus: "Processing",
      totalPrice,
    };

    // Passing order details to Order Status page
    navigate('/OrderStatus', { state: { orderData, cart } });
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
                  {/* Quantity Input */}
                  <TextField
                    label="Quantity"
                    type="number"
                    value={product.quantity || 1}
                    onChange={(e) => handleQuantityChange(index, e)}
                    sx={{ mt: 2 }}
                    inputProps={{ min: 1 }}
                  />
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
          onClick={handleOrderStatus} // Change to Order Status navigation
          startIcon={<ShoppingCartIcon />} // Add the icon here
        >
          Proceed to Your Order Status
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
