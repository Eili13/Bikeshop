import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Container,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AccountCircle, Mail, Lock } from "@mui/icons-material"; // Updated icon for email

const MyProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Changed from address to email
  const [password, setPassword] = useState(""); // Add state for password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility

  const navigate = useNavigate(); // Hook for navigation

  // Load user profile information on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setName(userData.name);
      setEmail(userData.email || ""); // Load email if available
    }
  }, []);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleConfirmSave = async () => {
    setLoading(true);
    setError(null);
    setOpenDialog(false); // Close dialog after confirmation

    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem("token");

      // Create the request body
      const userData = { name, email, password }; // Send email instead of address

      // Make API call to update profile
      const response = await axios.put(
        "http://localhost:4001/api/v1/me/update", // Endpoint to update profile
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );

      setLoading(false);
      if (response.data.success) {
        setSuccess(true);
        setError(null);
        // Update localStorage with the new name and email
        localStorage.setItem("user", JSON.stringify({ name, email }));
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    setOpenDialog(false); // Close dialog on cancel
  };

  // Navigate to home page
  const handleBackToHome = () => {
    navigate("/"); // Use navigate to redirect to the home page
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: "2rem" }}>
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Edit Profile
        </Typography>

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: "1rem" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Email Address" // Updated label to email
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Updated to email state
          sx={{ marginBottom: "1.5rem" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail /> {/* Updated icon to Mail */}
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: "1.5rem" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
        />

        {error && <Typography color="error">{error}</Typography>}
        {success && (
          <Typography color="primary" sx={{ marginBottom: "1rem" }}>
            Profile updated successfully!
          </Typography>
        )}

        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ width: "100%" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Box>

        {/* Button to go back to Home */}
        <Box display="flex" justifyContent="center" sx={{ marginTop: "1rem" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBackToHome}
            sx={{ width: "100%" }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog open={openDialog} onClose={handleCancel}>
          <DialogTitle>Confirm Save</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to save the changes to your profile?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MyProfile;
