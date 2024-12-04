import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Pagination,
  IconButton,
  Badge,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [category, setCategory] = useState(""); // Selected category
  const [priceRange, setPriceRange] = useState([0, 100000000]); // Selected price range
  const [categories, setCategories] = useState([]); // Available categories
  const [page, setPage] = useState(1); // Current page
  const [cart, setCart] = useState([]); // Cart state to store added products
  const itemsPerPage = 20; // Number of items per page
  const navigate = useNavigate(); // For navigation to the cart page

  // Fetch products from the API
  const retrieve = async () => {
    try {
      const res = await axios.get("http://localhost:4001/api/v1/products");
      setProducts(res.data.products || []);
      setFilteredProducts(res.data.products || []);
      extractCategories(res.data.products || []);
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  // Extract unique categories from the fetched products
  const extractCategories = (productsData) => {
    const uniqueCategories = [
      ...new Set(productsData.map((product) => product.category)),
    ];
    setCategories(uniqueCategories);
  };

  // Update the selected category
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  // Update the selected price range
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Filter products based on category and price range
  const filterProducts = () => {
    const filtered = products.filter((product) => {
      const isCategoryMatch =
        category && category !== "All Categories"
          ? product.category.trim().toLowerCase() === category.trim().toLowerCase()
          : true;
      const isPriceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];

      return isCategoryMatch && isPriceMatch;
    });

    setFilteredProducts(filtered);
    setPage(1); // Reset to the first page after filtering
  };

  // Handle page change
  const handleChangePage = (event, value) => {
    setPage(value); // Update the page number
  };

  // Get the products for the current page
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Add to Cart function
  const addToCart = (product) => {
    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      // If the product is already in the cart, increase the quantity
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // If the product is not in the cart, add it
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Navigate to the cart page
  const goToCart = () => {
    navigate("/cart", { state: { cart } }); // Redirect to /cart page with cart state
  };

  // Run the `retrieve` function when the component mounts
  useEffect(() => {
    retrieve();
  }, []);

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
        color: "#ffffff",
      }}
    >
      {/* Cart Icon */}
      <IconButton onClick={goToCart} sx={{ position: "absolute", top: 16, right: 16 }}>
        <Badge badgeContent={cart.length} color="secondary">
          <ShoppingCartIcon sx={{ color: "#fff" }} />
        </Badge>
      </IconButton>

      {/* Filters Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Category Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#ffffff" }}>Category</InputLabel>
              <Select
                value={category}
                onChange={handleCategoryChange}
                label="Category"
                sx={{
                  backgroundColor: "#1e2a33",
                  color: "#ffffff",
                }}
              >
                <MenuItem value="All Categories">All Categories</MenuItem>
                {categories.map((cat, index) => (
                  <MenuItem key={index} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Price Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              valueLabelFormat={(value) => `$${value}`}
            />
          </Grid>

          {/* Apply Filter Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={filterProducts}
              sx={{ marginTop: "1rem" }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Product Grid Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Box
                sx={{
                  backgroundColor: "#2b3a42",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  position: "relative",
                  height: "100%",
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "400px", // Set image height to 400px
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ padding: "1rem", backgroundColor: "#1e2a33" }}>
                  <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "1rem", color: "#ffffff" }}>
                    {product.description}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "1rem", color: "#ffffff" }}>
                    Price: ${product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: "1rem" }}
                    onClick={() => addToCart(product)} // Add product to the cart
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pagination */}
      <Box sx={{ marginTop: "2rem" }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default Landing;
