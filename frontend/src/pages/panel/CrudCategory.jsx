import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "", description: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Function to retrieve the token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');  // Adjust this based on where you store your token
  };

  const retrieveCategories = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage('Login first to access this resource');
        return;
      }

      const res = await axios.get('http://localhost:4001/api/v1/category', {
        headers: {
          Authorization: `Bearer ${token}`  // Add token to the request header
        }
      });
      setCategories(res.data.categories);
    } catch (e) {
      console.error(e);
      setErrorMessage('Failed to retrieve categories');
    }
  };

  useEffect(() => {
    retrieveCategories();
  }, []);

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    setFormValues(category || { name: "", description: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormValues({ name: "", description: "" });
    setErrorMessage("");  // Clear error messages when closing dialog
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = getToken(); // Retrieve the token here
    if (!token) {
      setErrorMessage('Login first to access this resource');
      return;
    }

    try {
      if (editingCategory) {
        // Update category
        const res = await axios.put(
          `http://localhost:4001/api/v1/category/${editingCategory._id}`,
          formValues,
          { headers: { Authorization: `Bearer ${token}` } }  // Pass the token in headers
        );
        setCategories((prev) =>
          prev.map((category) =>
            category._id === editingCategory._id ? { ...category, ...formValues } : category
          )
        );
      } else {
        // Add new category
        const res = await axios.post(
          'http://localhost:4001/api/v1/category/new',
          formValues,
          { headers: { Authorization: `Bearer ${token}` } }  // Pass the token in headers
        );
        setCategories((prev) => [...prev, res.data.category]);
      }
      handleCloseDialog();
    } catch (e) {
      console.error(e);
      if (e.response) {
        // Check if the error response is due to unauthorized access
        if (e.response.status === 401) {
          setErrorMessage('Unauthorized: Please login as an admin to perform this action.');
        } else {
          // Otherwise show the message from the server response
          setErrorMessage(e.response.data.message || 'Failed to save category');
        }
      } else {
        // Handle network or other unexpected errors
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  const handleDelete = async (id) => {
    const token = getToken(); // Retrieve the token here
    if (!token) {
      setErrorMessage('Login first to access this resource');
      return;
    }

    try {
      await axios.delete(`http://localhost:4001/api/v1/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`  // Pass the token in headers
        }
      });
      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        setErrorMessage('Unauthorized: Please login as an admin to delete categories.');
      } else {
        setErrorMessage('Failed to delete category');
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Category Management
      </Typography>
      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add Category
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(category._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formValues.name}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formValues.description}
              onChange={handleFormChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
