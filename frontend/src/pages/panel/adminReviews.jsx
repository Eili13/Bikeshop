import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminReviews = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4001/api/v1/products');
                setProducts(response.data.products);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setErrorMessage('Failed to load products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const fetchReviews = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:4001/api/v1/products/${productId}`);
            setReviews(response.data.product.reviews || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setErrorMessage('Failed to load reviews.');
        }
    };

    const handleProductChange = (event) => {
        const productId = event.target.value;
        setSelectedProductId(productId);
        fetchReviews(productId);
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete('http://localhost:4001/api/v1/products/review', {
              data: { productId: selectedProductId, reviewId }
            });
      
            setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
          } catch (e) {
            setErrorMessage('Failed to delete the review.');
          }
    };

    const columns = [
        { field: 'name', headerName: 'User Name', width: 150 },
        { field: 'rating', headerName: 'Rating', width: 110 },
        { field: 'comment', headerName: 'Comment', width: 300 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteReview(params.row._id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Product Reviews
            </Typography>

            {errorMessage && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="product-select-label">Select Product</InputLabel>
                <Select
                    labelId="product-select-label"
                    id="product-select"
                    value={selectedProductId}
                    onChange={handleProductChange}
                    label="Select Product"
                    disabled={loading}
                >
                    {loading ? (
                        <MenuItem disabled>
                            <CircularProgress size={24} />
                        </MenuItem>
                    ) : (
                        products.map((product) => (
                            <MenuItem key={product._id} value={product._id}>
                                {product.name}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            <Box style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={reviews.map((review, index) => ({ ...review, id: index }))}
                    columns={columns}
                    pageSize={10}
                    loading={loading}
                    disableSelectionOnClick
                />
            </Box>
        </Container>
    );
};

export default AdminReviews;
