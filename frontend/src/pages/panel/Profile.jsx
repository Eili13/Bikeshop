import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, Button, Avatar, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios'; // Import axios for making requests

const ProfileEdit = ({ onUpdateProfile }) => {
  const [user, setUser] = useState(null);  // State for user data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');  // For handling errors during API calls
  const [loading, setLoading] = useState(false);  // For loading state

  // Fetch the user's profile when the component mounts
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:4001/api/v1/me')  // Updated route
      .then(response => {
        const userData = response.data;
        setUser(userData);  // Set user state with the fetched data
        setName(userData.name);
        setEmail(userData.email);
        setPhoneNumber(userData.phoneNumber);
        setAddress(userData.address);
        setAvatar(userData.avatar?.url || '');  // Fallback if no avatar
      })
      .catch(error => {
        setError("Error fetching user profile. Please try again later.");
        console.error("Error fetching user profile:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    if (password) formData.append('password', password);
    if (avatarFile) formData.append('avatar', avatarFile);

    // Make a request to update the user's profile
    axios.put('http://localhost:4001/api/v1/me/update', formData)  // Updated route
      .then(response => {
        onUpdateProfile(response.data);  // Update parent component with new profile data
      })
      .catch(error => {
        setError("Error updating profile. Please try again later.");
        console.error("Error updating profile:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;  // Show loading until user data is fetched or updated
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;  // Show error message if there was an issue
  }

  if (!user) {
    return <Typography>Loading...</Typography>;  // Show loading until user data is fetched
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Edit Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={avatar} sx={{ width: 120, height: 120, mb: 2 }} />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            <Typography variant="body2">Upload a new avatar</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            required
            type="email"
            disabled
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Password (leave blank to keep unchanged)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            type="password"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveProfile}
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileEdit;
