import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
  Select, MenuItem, FormControl, InputLabel, Paper, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const getToken = () => {
    return localStorage.getItem('token'); // Adjust this based on where you store your token
  };

  const retrieveOrders = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage('Login first to access this resource');
        return;
      }

      const res = await axios.get('http://localhost:4001/api/v1/orders/all', {
        headers: {
          Authorization: `Bearer ${token}` // Add token to the request header
        }
      });
      setOrders(res.data.orders);
    } catch (e) {
      console.error(e);
      setErrorMessage('Failed to retrieve orders');
    }
  };

  useEffect(() => {
    retrieveOrders();
  }, []);

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      setErrorMessage('Login first to access this resource');
      return;
    }

    try {
      await axios.delete(`http://localhost:4001/api/v1/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (e) {
      console.error(e);
      setErrorMessage('Failed to delete order');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = getToken();
    if (!token) {
      setErrorMessage('Login first to access this resource');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:4001/api/v1/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      // Show success Snackbar
      setSnackbarMessage("Order status updated successfully!");
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      setErrorMessage('Failed to update order status');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'Order Name', width: 150 },
    { field: 'user', headerName: 'User Name', width: 180 },
    { field: 'city', headerName: 'Address', width: 220 },
    { field: 'totalPrice', headerName: 'Total Price', width: 150 },
    {
      field: 'orderStatus',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={params.row.orderStatus}
            label="Order Status"
            name="orderStatus"
            onChange={(e) => handleStatusChange(params.row._id, e.target.value)}
            fullWidth
          >
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
          </Select>
        </FormControl>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleDelete(params.row._id)}>
            <Delete />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Orders Management</Typography>
      {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={orders.map((order) => ({
            id: order._id, // Use _id as the unique id for each row
            ...order // Spread the rest of the order data
          }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Paper>

      {/* Snackbar for success messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersManagement;
