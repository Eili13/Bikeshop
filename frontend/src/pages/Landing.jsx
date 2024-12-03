import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
} from "@mui/material";
import axios from "axios";

const Landing = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Ensure products is an empty array initially
  const [selectedProduct, setSelectedProduct] = useState(null); // For modal state
  const [open, setOpen] = useState(false); // For modal visibility

  const [page, setPage] = useState(1); // Track the current page
  const itemsPerPage = 10; // Number of items per page

  // Retrieve products from the API
  const retrieve = async () => {
    try {
      const res = await axios.get(`http://localhost:4001/api/v1/products`);
      setProducts(res.data.products || []); // Safeguard against undefined
      console.log(res.data.products); // Log the products
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  useEffect(() => {
    retrieve();
  }, []);

  // Handle the click event for a product
  const handleProductClick = (product) => {
    // Log the product ID or perform any actions you want with it
    console.log('Product ID:', product._id);
    
    setSelectedProduct(product);
    setOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleShopNowClick = () => {
    navigate("/products");
  };

  // Navigate to the reviews section or page
  const handleAddReviewClick = () => {
    // Navigate to a review page or a section for adding a review
    navigate(`/reviews`); // Example navigation to reviews page with the product ID
  };

  // Pagination: Calculate the products to display based on the current page
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Get the products for the current page
  const paginatedProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle, #0b192f, #172a45)",
        padding: "3rem 0",
        overflow: "hidden",
        position: "relative",
        color: "#ffffff",
      }}
    >
      {/* Hero Section */}
      <Container
        maxWidth="md"
        sx={{
          textAlign: "center",
          marginBottom: "4rem",
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(to right, #ffffff, #42a5f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
            letterSpacing: "1px",
            fontSize: "3.5rem",
          }}
        >
          Ride the Future
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginBottom: "2rem",
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.1rem",
          }}
        >
          Discover the perfect bike for every journey, from city streets to mountain trails.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ padding: "1rem 2rem", fontSize: "1rem", borderRadius: "50px" }}
          onClick={handleShopNowClick}
        >
          Shop Now
        </Button>
      </Container>

      {/* Product Grid Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Paper
                sx={{
                  backgroundColor: "#2b3a42",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  position: "relative",
                  height: "100%",
                }}
              >
                <Card onClick={() => handleProductClick(product)}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ backgroundColor: "#1e2a33" }}>
                    <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: "1rem", color: "#ffffff" }}
                    >
                      {product.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pagination */}
      <Box sx={{ marginTop: "2rem" }}>
        <Pagination
          count={Math.ceil((products?.length || 0) / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#ffffff",
            },
          }}
        />
      </Box>

      {/* Product Modal */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>{selectedProduct?.name}</DialogTitle>
        <DialogContent>
          <CardMedia
            component="img"
            height="250"
            image={selectedProduct?.imageUrl}
            alt={selectedProduct?.name}
            sx={{
              objectFit: "cover",
              marginBottom: "1rem",
            }}
          />
          <Typography variant="body1">{selectedProduct?.description}</Typography>
          {/* Add Review Button */}
          <Box sx={{ marginTop: "1rem" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: "0.8rem", borderRadius: "8px" }}
              onClick={handleAddReviewClick}
            >
              Add Review
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Landing;
