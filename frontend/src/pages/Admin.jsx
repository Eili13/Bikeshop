import React from "react";
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Grid, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Sidebar width
const drawerWidth = 240;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#0b192f", color: "#fff" }}>
      {/* AppBar */}


      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", backgroundColor: "#1e293b", color: "#fff" },
        }}
      >
        <Toolbar />
        <h1>Dashboard</h1>
        <List>

        
        <ListItem button onClick={() => navigate("/")}>
            <ListItemText primary="Home" />
          </ListItem>
          
            
          
          <ListItem button onClick={() => navigate("/crud/product")}>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button onClick={() => navigate("/crud/category")}>
            <ListItemText primary="Category" />
          </ListItem>
          <ListItem button onClick={() => navigate("/crud/users")}>
            <ListItemText primary="User" />
          </ListItem>
          <ListItem button onClick={() => navigate("/Order")}>
            <ListItemText primary="Order" />
          </ListItem>
          <ListItem button onClick={() => navigate("/Charts")}>
            <ListItemText primary="Charts" />
          </ListItem>
          <ListItem button onClick={() => navigate("/Reviews")}>
            <ListItemText primary="Reviews" />
          </ListItem>
        </List>
      </Drawer>

      
    </Box>
  );
};

export default AdminDashboard;
