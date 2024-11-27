import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData, cart } = location.state || {};

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isOrderSuccess, setIsOrderSuccess] = useState(false); // For handling success snackbar
  const [openDialog, setOpenDialog] = useState(false); // Confirmation dialog

  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Calculate total price
  const calculateTotalPrice = () => {
    let itemTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingPrice = 5.99;
    const taxPrice = 10.99;
    return itemTotal + shippingPrice + taxPrice;
  };

  // Handle Checkout button click
  const handleCheckout = async () => {
    try {
      const orderData = {
        user: '671a920550032448006a5bf5', // Example user ID (should be dynamically fetched)
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image || "default-image-url.jpg", // Use default image if not provided
          price: item.price,
          product: item._id, // Ensure correct product ID
        })),
        ShippingInfo: {
          address: 'Blk 7 lot 4 sampaloc street.',
          city: 'Taguig City',
          postalCode: '1630',
          country: 'Philippines',
        },
        paymentInfo: {
          id: 'pi_1F8v8JF8v8Jf8v8Jf8v8Jf8v',
          status: 'Succeeded',
        },
        itemPrice: calculateTotalPrice(),
        taxPrice: 10.99,
        shippingPrice: 5.99,
        totalPrice: calculateTotalPrice(),
        orderStatus: 'Processing',
      };

      const response = await axios.post('http://localhost:4001/api/v1/order', orderData);
      console.log('Order placed successfully:', response.data);

      // Show success message
      setSnackbarMessage('Order placed successfully!');
      setIsOrderSuccess(true);
      setOpenSnackbar(true);

      // Clear cart and redirect after 2 seconds
      setTimeout(() => {
        navigate('/'); // Navigate to a thank-you page
      }, 2000);
    } catch (error) {
      console.error('Error during checkout:', error.response ? error.response.data : error.message);
      setSnackbarMessage(error.message || 'Error during checkout. Please try again.');
      setIsOrderSuccess(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Order Status
      </Typography>

      {orderData ? (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Order Status: {orderData.orderStatus}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Total Price: ${calculateTotalPrice().toFixed(2)}
          </Typography>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Items in Your Order:
          </Typography>
          <TableContainer sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Checkout Button */}
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" color="error">
          No order data available.
        </Typography>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Checkout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to proceed with the checkout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={() => {
            handleCloseDialog();
            handleCheckout();
          }} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success or error messages */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={isOrderSuccess ? "success" : "error"} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderStatusPage;
