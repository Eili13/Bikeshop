import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "", email: "", role: "user", avatar: ""  // Include avatar in the state
  });
  const [errorMessage, setErrorMessage] = useState("");
 
  // Function to retrieve the token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');  // Adjust this based on where you store your token
  };

  const retrieveUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage('Login first to access this resource');
        return;
      }

      const res = await axios.get('http://localhost:4001/api/v1/users', {
        headers: {
          Authorization: `Bearer ${token}`  // Add token to the request header
        }
      });
      setUsers(res.data.users);
    } catch (e) {
      console.error(e);
      setErrorMessage('Failed to retrieve users');
    }
  };

  useEffect(() => {
    retrieveUsers();
  }, []);

  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    setFormValues(user || { name: "", email: "", role: "user", avatar: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormValues({ name: "", email: "", role: "user", avatar: "" });
    setErrorMessage("");  // Clear error messages when closing dialog
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = getToken(); // Retrieve the token here
    if (!token) {
      setErrorMessage('Login first to access this resource');
      return;
    }

    try {
      if (editingUser) {
        // Update user
        const res = await axios.put(
          `http://localhost:4001/api/v1/users/${editingUser._id}`,
          formValues,
          { headers: { Authorization: `Bearer ${token}` } }  // Pass the token in headers
        );
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUser._id ? { ...user, ...formValues } : user
          )
        );
      } else {
        // Add new user
        const res = await axios.post(
          'http://localhost:4001/api/v1/users',
          formValues,
          { headers: { Authorization: `Bearer ${token}` } }  // Pass the token in headers
        );
        setUsers((prev) => [...prev, res.data.user]);
      }
      handleCloseDialog();
    } catch (e) {
      console.error(e);
      if (e.response) {
        // Check if the error response is due to unauthorized access
        if (e.response.status === 401) {
          setErrorMessage('Unauthorized: Please login as an admin to perform this action.');
        } else {
          // Otherwise show the message from the server response
          setErrorMessage(e.response.data.message || 'Failed to save user');
        }
      } else {
        // Handle network or other unexpected errors
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  const handleDelete = async (id) => {
    const token = getToken(); // Retrieve the token here
    if (!token) {
      setErrorMessage('Login first to access this resource');
      return;
    }

    try {
      await axios.delete(`http://localhost:4001/api/v1/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`  // Pass the token in headers
        }
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        setErrorMessage('Unauthorized: Please login as an admin to delete users.');
      } else {
        setErrorMessage('Failed to delete user');
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        User Management
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
        Add User
      </Button>
    
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add User'}
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
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Role"
              name="role"
              value={formValues.role}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Avatar URL"
              name="avatar"
              value={formValues.avatar}
              onChange={handleFormChange}
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

export default UserManagement;
