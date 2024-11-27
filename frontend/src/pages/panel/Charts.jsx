import React from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

// Dummy data for products and users
const productData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Furniture", value: 200 },
  { name: "Toys", value: 100 }
];

const userData = [
  { name: "Active Users", value: 500 },
  { name: "Inactive Users", value: 200 }
];

const barChartData = [
  { name: "Electronics", users: 2400, products: 240 },
  { name: "Clothing", users: 3000, products: 221 },
  { name: "Furniture", users: 2000, products: 120 },
  { name: "Toys", users: 1000, products: 90 }
];

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to navigate back to Admin Dashboard
  const handleGoBack = () => {
    navigate("/admin"); // Replace with the actual route of your Admin Dashboard
  };

  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={4}>
        {/* Pie Chart for Products */}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, backgroundColor: "#1e293b", color: "#fff" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Product Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={productData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#8884d8" 
                  label
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#00C49F" : "#FFBB28"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bar Chart for Products and Users */}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, backgroundColor: "#1e293b", color: "#fff" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Products and Users Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" />
                <Bar dataKey="products" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Go Back Button */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleGoBack}>
          Go Back to Admin Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
