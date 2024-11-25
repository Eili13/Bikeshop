import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#1976d2",
    },
  },
});

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser)); // Ensure the user data is parsed from JSON
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogoutClick = async () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.clear();
      setIsLoggedIn(false);
      setUser({});
      navigate("/");
    }, 1500);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        sx={{
          background: "radial-gradient(circle, #0b192f, #172a45)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "0.5rem 1rem",
          borderBottom: `2px solid ${theme.palette.secondary.main}`,
        }}
      >
        <Toolbar>
          <Box
            onClick={handleTitleClick}
            sx={{
              flexGrow: 1,
              cursor: "pointer",
            }}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(to right, #1976d2, #42a5f5, #bbdefb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Riellie Wheelie
            </Typography>
          </Box>

          {isLoggedIn ? (
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "#1976d2",
                  marginRight: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={handleMenuClick}
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <IconButton color="inherit" onClick={handleMenuClick}>
                <ArrowDropDown sx={{ color: theme.palette.secondary.main }} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 4,
                  style: {
                    marginTop: "0.5rem",
                    borderRadius: "8px",
                    minWidth: "200px",
                    border: `1px solid ${theme.palette.secondary.main}`,
                    background: "#f5f5f5",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: "#333",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                  }}
                >
                  My Profile
                </MenuItem>

                {user?.role === "admin" && (
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/admin");
                    }}
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "#333",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                      },
                    }}
                  >
                    Admin Dashboard
                  </MenuItem>
                )}

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogoutClick();
                  }}
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: "#d32f2f",
                    "&:hover": {
                      backgroundColor: "#fdecea",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={20} color="secondary" /> : "Logout"}
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box display="flex" gap="1rem">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/register")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
