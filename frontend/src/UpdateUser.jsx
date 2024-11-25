import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  Grid,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#0b192f",
    },
  },
});

function UpdateUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate an API call
    setTimeout(() => {
      console.log("User Updated:", formData);
      setLoading(false);
    }, 1500);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 80,
                height: 80,
                marginBottom: "1rem",
              }}
            >
              {formData.name ? formData.name[0] : "U"}
            </Avatar>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}
            >
              Update User Details
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%", marginTop: "2rem" }}
            >
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: "1rem" }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: "1rem" }}
              />
              <TextField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: "2rem" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  padding: "0.75rem",
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Update User"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default UpdateUser;
