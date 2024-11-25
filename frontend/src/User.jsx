import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Grid,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import axios from "axios";

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

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users (Replace with your API endpoint)
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
          padding: "2rem",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: theme.palette.primary.main,
            marginBottom: "2rem",
          }}
        >
          Users
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress size={50} color="primary" />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card
                  sx={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 60,
                        height: 60,
                        marginBottom: "1rem",
                      }}
                    >
                      {user.name[0]}
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#555",
                        fontStyle: "italic",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {user.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#888", fontWeight: "400" }}
                    >
                      {user.address.city}, {user.address.street}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default Users;
