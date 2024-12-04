import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "", price: "", description: "", category: "", seller: "", stock: 0, images: [], ratings: 0, numOfReviews: 0
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

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
    const { name, value, files } = e.target;

    if (name === 'images') {
      setFormValues((prev) => ({ ...prev, [name]: files })); // Handle file input
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) {
      setErrorMessage('Login first to access this resource');
      return;
    }

    const { name, price, description, category, seller, stock, ratings, numOfReviews, images } = formValues;
    if (!name || !price || !description || !category || !seller || stock < 0 || ratings < 0 || numOfReviews < 0) {
      setErrorMessage('Please fill in all required fields with valid values');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('seller', seller);
      formData.append('stock', stock);
      formData.append('ratings', ratings);
      formData.append('numOfReviews', numOfReviews);

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }

      if (editingProduct) {
        await axios.put(
          `http://localhost:4001/api/v1/products/${editingProduct._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        setProducts((prev) =>
          prev.map((product) =>
            product._id === editingProduct._id ? { ...product, ...formValues } : product
          )
        );
      } else {
        const response = await axios.post(
          'http://localhost:4001/api/v1/product',
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
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
      await axios.delete(`http://localhost:4001/api/v1/products/${id}`, {
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
        <TableCell>Image</TableCell> {/* New column for images */}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
  {products.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6} align="center">
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

        {/* New cell for displaying the image */}
        <TableCell>
  {product.images && product.images.length > 0 ? (
    <img 
    src={`http://localhost:4001/uploads/${product.images[0].filename}`} // Adjust the path if necessary
    // Make sure this path is correct
      alt={product.name} 
      style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
    />
  ) : (
    <span>No Image</span>
  )}
</TableCell>

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


      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate('/admin')}
        sx={{ mt: 4 }}
      >
        Back to Admin Dashboard
      </Button>

      {/* Product Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={formValues.name}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formValues.price}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formValues.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formValues.category}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Seller"
            name="seller"
            value={formValues.seller}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Stock"
            name="stock"
            type="number"
            value={formValues.stock}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Ratings"
            name="ratings"
            type="number"
            value={formValues.ratings}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Number of Reviews"
            name="numOfReviews"
            type="number"
            value={formValues.numOfReviews}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFormChange}
            style={{ marginBottom: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {editingProduct ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
