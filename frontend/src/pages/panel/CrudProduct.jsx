import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "", price: "", description: "", category: "", seller: "", stock: 0, images: [], ratings: 0, numOfReviews: 0
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const retrieveProducts = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage('Login first to access this resource');
        return;
      }

      const res = await axios.get('http://localhost:4001/api/v1/products/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(res.data.products);
    } catch (e) {
      console.error(e);
      setErrorMessage('Failed to retrieve products');
    }
  };

  useEffect(() => {
    retrieveProducts();
  }, []);

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setFormValues(product || { name: "", price: "", description: "", category: "", seller: "", stock: 0, images: [], ratings: 0, numOfReviews: 0 });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormValues({ name: "", price: "", description: "", category: "", seller: "", stock: 0, images: [], ratings: 0, numOfReviews: 0 });
    setErrorMessage("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) {
      setErrorMessage('Login first to access this resource');
      return;
    }

    const { name, price, description, category, seller, stock, ratings, numOfReviews } = formValues;
    if (!name || !price || !description || !category || !seller || stock < 0 || ratings < 0 || numOfReviews < 0) {
      setErrorMessage('Please fill in all required fields with valid values');
      return;
    }

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:4001/api/v1/products/${editingProduct._id}`,
          formValues,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts((prev) =>
          prev.map((product) =>
            product._id === editingProduct._id ? { ...product, ...formValues } : product
          )
        );
      } else {
        const response = await axios.post(
          'http://localhost:4001/api/v1/product',
          formValues,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts((prev) => [...prev, response.data.product]);
      }
      handleCloseDialog();
    } catch (e) {
      console.error(e);
      if (e.response) {
        if (e.response.status === 401) {
          setErrorMessage('Unauthorized: Please login as an admin to perform this action.');
        } else {
          setErrorMessage(e.response.data.message || 'Failed to save product');
        }
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      setErrorMessage('Login first to access this resource');
      return;
    }

    try {
      await axios.delete(`http://localhost:4001/api/v1/productsss/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        setErrorMessage('Unauthorized: Please login as an admin to delete products.');
      } else {
        setErrorMessage('Failed to delete product');
      }
    }
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
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.seller}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(product._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Move Back Button below the table */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate('/admin')}
        sx={{ mt: 4 }} // Add margin-top to separate it from the table
      >
        Back to Admin
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add Product'}
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
              label="Price"
              name="price"
              value={formValues.price}
              onChange={handleFormChange}
              type="number"
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formValues.description}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Category"
              name="category"
              value={formValues.category}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Seller"
              name="seller"
              value={formValues.seller}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Stock"
              name="stock"
              value={formValues.stock}
              onChange={handleFormChange}
              type="number"
              fullWidth
            />
            <TextField
              label="Ratings"
              name="ratings"
              value={formValues.ratings}
              onChange={handleFormChange}
              type="number"
              fullWidth
            />
            <TextField
              label="Number of Reviews"
              name="numOfReviews"
              value={formValues.numOfReviews}
              onChange={handleFormChange}
              type="number"
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

export default ProductManagement;
