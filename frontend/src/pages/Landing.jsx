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
} from "@mui/material";
import { PedalBike, Shield, CheckCircle } from "@mui/icons-material";
import axios from 'axios'

const Landing = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([])
  const retrieve = async() => {
    try {
      const res = await axios.get(`http://localhost:4001/api/v1/products`)
      setProducts(res.data.products)
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    retrieve()
  }, [])
  const handleShopNowClick = () => {
    navigate("/products"); // Navigate to login page
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

  const bikeModels = [
    {
      image: "https://via.placeholder.com/300x200", // Replace with bike image URLs
      name: "Mountain Explorer",
      price: "$1,299",
    },
    {
      image: "https://via.placeholder.com/300x200", // Replace with bike image URLs
      name: "Urban Commuter",
      price: "$899",
    },
    {
      image: "https://via.placeholder.com/300x200", // Replace with bike image URLs
      name: "Road Racer",
      price: "$1,499",
    },
  ];

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
          onClick={handleShopNowClick} // Updated to navigate to /login
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
      <Container maxWidth="lg" sx={{ zIndex: 1, position: "relative" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            marginBottom: "2rem",
          }}
        >
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "2rem",
                  borderRadius: "20px",
                  background: `rgba(255, 255, 255, 0.2)`,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 12px 40px rgba(255, 255, 255, 0.4)",
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    marginBottom: "1rem",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "#ffffff",
                    fontSize: "1.1rem",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "1rem",
                  }}
                >
                  {feature.description}
                </Typography>
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
          {products.map((bike, index) => (
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
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={bike.images.length > 0 ? bike.images[0].url : 'https://placehold.co/600x400'}
                  alt={bike.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {bike.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {bike.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing;
