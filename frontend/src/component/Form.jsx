import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import LoadingIndicator from "./LoadingIndicator";
import axios from "axios";

const darkBackgroundStyle = {
  background: "radial-gradient(circle, #0b192f, #172a45)",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
};

const formStyle = {
  padding: "2rem",
  backgroundColor: "#1e293b",
  borderRadius: "10px",
  textAlign: "center",
  maxWidth: "400px",
  width: "100%",
};

const textFieldStyle = {
  "& .MuiInputBase-input": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#475569" },
    "&:hover fieldset": { borderColor: "#0ea5e9" },
    "&.Mui-focused fieldset": { borderColor: "#0ea5e9" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
};

const buttonStyle = {
  backgroundColor: "#0ea5e9",
  color: "#fff",
  "&:hover": { backgroundColor: "#0284c7" },
};

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log({ username, email, password, confirmPassword, route: `${import.meta.env.VITE_API_URL}/register` });

    // Basic Validation
    if (method === "register" && (!username || !email || !password || !confirmPassword)) {
      setError("All fields are required!");
      setOpenSnackbar(true);
      return;
    }

    if (method === "register" && password !== confirmPassword) {
      setError("Passwords do not match!");
      setOpenSnackbar(true);
      return;
    }

    if (method === "login" && (!email || !password)) {
      setError("Email and Password are required!");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      if (method === "register") {
        await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
          name: username,
          email,
          password,
          public_id: "default-avatar-public-id",
          url: "https://example.com/default-avatar.png",
        });
        console.log("Registration successful. Redirecting to login...");
        navigate("/login");
      }

      if (method === "login") {
        const { data } = await axios.post(`http://localhost:4001/api/v1/login`, {
          email,
          password,
        });

        console.log("Login response:", data);

        // Store token and user data in localStorage
        if (data.token && data.user) {
          console.log("Storing token and user info...");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("Login successful. Redirecting to Home...");
          // navigate("/");
          window.location.href = "/"
        } else {
          throw new Error("Invalid login response. Missing token or user data.");
        }
      }
    } catch (err) {
      console.error("Error during submission:", err);
      setError(err.response?.data?.detail || "An error occurred. Please try again.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingIndicator />}
      <div style={darkBackgroundStyle}>
        <Container>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper style={formStyle}>
                <Typography variant="h4" sx={{ marginBottom: 2, color: "#0ea5e9" }}>
                  {method === "register" ? "Register" : "Login"}
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                  {method === "register" && (
                    <TextField
                      fullWidth
                      label="Username"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      sx={textFieldStyle}
                      error={!username}
                      helperText={!username && "Username is required"}
                    />
                  )}
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ ...textFieldStyle, marginTop: "1rem" }}
                    error={!email}
                    helperText={!email && "Email is required"}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ ...textFieldStyle, marginTop: "1rem" }}
                    error={!password}
                    helperText={!password && "Password is required"}
                  />
                  {method === "register" && (
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      variant="outlined"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      sx={{ ...textFieldStyle, marginTop: "1rem" }}
                      error={password !== confirmPassword}
                      helperText={password !== confirmPassword && "Passwords do not match"}
                    />
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    sx={{ ...buttonStyle, marginTop: "1.5rem" }}
                  >
                    {method === "register" ? "Register" : "Login"}
                  </Button>
                </form>
                <Typography sx={{ marginTop: 2, color: "#94a3b8" }}>
                  {method === "login" ? "Don't have an account? " : "Already have an account? "}
                  <Button
                    onClick={() =>
                      method === "login" ? navigate("/register") : navigate("/login")
                    }
                    sx={{ color: "#0ea5e9" }}
                  >
                    {method === "login" ? "Register" : "Login"}
                  </Button>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Form;
