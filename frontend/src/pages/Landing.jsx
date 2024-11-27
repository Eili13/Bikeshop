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
  Pagination
} from "@mui/material";
import { PedalBike, Shield, CheckCircle, Star, StarBorder } from "@mui/icons-material";
import axios from "axios";

const Landing = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // For modal state
  const [reviews, setReviews] = useState([]); // Store reviews for the selected product
  const [open, setOpen] = useState(false); // For modal visibility

  const [page, setPage] = useState(1); // Track the current page
  const itemsPerPage = 6; // Number of items per page

  // Retrieve products from the API
  const retrieve = async () => {
    try {
      const res = await axios.get(`http://localhost:4001/api/v1/products`);
      setProducts(res.data.products);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch reviews for a specific product
  const fetchReviews = async (productId) => {
    try {
      const res = await axios.get(`http://localhost:4001/api/v1/reviews/product/${productId}`);
      setReviews(res.data.reviews); // Store the reviews
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    retrieve();
  }, []);

  // Handle the click event for a product
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    fetchReviews(product._id); // Fetch reviews when a product is selected
    setOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleShopNowClick = () => {
    navigate("/products");
  };

  const features = [
    {
      icon: <PedalBike fontSize="large" sx={{ color: "#0b192f" }} />,
      title: "Eco-Friendly Rides",
      description: "Choose bicycles for a healthier planet and a healthier you.",
    },
    {
      icon: <Shield fontSize="large" sx={{ color: "#0b192f" }} />,
      title: "Safety First",
      description: "Our bikes are equipped with safety features for a secure ride.",
    },
    {
      icon: <CheckCircle fontSize="large" sx={{ color: "#0b192f" }} />,
      title: "Easy Accessibility",
      description: "Rent or buy bicycles easily, anytime, anywhere.",
    },
  ];

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <Star key={i} sx={{ color: "#fbc02d" }} /> : <StarBorder key={i} sx={{ color: "#fbc02d" }} />);
    }
    return stars;
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
          onClick={handleShopNowClick}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "30px",
            padding: "0.75rem 2rem",
            fontSize: "1.1rem",
            background: "#42a5f5",
            color: "#0b192f",
            boxShadow: "0px 4px 15px rgba(66, 165, 245, 0.4)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 8px 20px rgba(66, 165, 245, 0.6)",
            },
          }}
        >
          Shop Now
        </Button>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ marginTop: "4rem" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            marginBottom: "2rem",
          }}
        >
          Our Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                sx={{
                  padding: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "15px",
                  backgroundColor: "#fff",
                  color: "#0b192f",
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box sx={{ marginRight: "1.5rem" }}>{feature.icon}</Box>
                <Box>
                  <Typography variant="h6">{feature.title}</Typography>
                  <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bike Models Section */}
      <Container maxWidth="lg" sx={{ marginTop: "4rem" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            marginBottom: "2rem",
          }}
        >
          Our Best-Selling Bikes
        </Typography>
        <Grid container spacing={4}>
          {paginatedProducts.map((bike, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => handleProductClick(bike)} // Open modal on product click
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={bike.images.length > 0 ? bike.images[0].url : "https://placehold.co/600x400"}
                  alt={bike.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {bike.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {bike.price}
                  </Typography>
                  {/* Display Stars */}
                  <Box sx={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                    {renderStars(bike.rating)} {/* Assuming each product has a 'rating' property */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Pagination */}
        <Box sx={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(products.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Container>

      {/* Product Details Modal */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>{selectedProduct?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selectedProduct?.description}</Typography>
          <Typography variant="h6" sx={{ marginTop: "1rem" }}>
            Reviews:
          </Typography>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Box key={index} sx={{ marginBottom: "1rem" }}>
                <Typography variant="body2">{review.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  - {review.author}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No reviews yet.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Landing;
