import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment,
    CircularProgress,
    Card,
    CardContent,
    Snackbar,
    Alert,
    Switch,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import api from "../api";
import "../styles/Home.css";

const Home = () => {
    const [bikes, setBikes] = useState([]);
    const [bikeName, setBikeName] = useState("");
    const [bikeDescription, setBikeDescription] = useState("");
    const [bikePrice, setBikePrice] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        fetchBikes();
    }, []);

    const fetchBikes = () => {
        api
            .get("/api/bikes/")
            .then((res) => setBikes(res.data))
            .catch((err) => alert("Error fetching bikes: " + err));
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const filteredBikes = bikes.filter((bike) =>
        bike.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderDashboard = () => (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#0ea5e9" }}>
                Welcome to Riellie Wheelie!
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "1.5rem", color: "#94a3b8" }}>
                Explore our wide range of bikes to find your perfect ride.
            </Typography>
            <Card sx={{ backgroundColor: "#172a45", marginBottom: "1.5rem", padding: "1rem" }}>
                <CardContent>
                    <Typography variant="h6" sx={{ color: "#0ea5e9", fontWeight: "bold" }}>
                        "Life is like riding a bicycle. To keep your balance, you must keep moving."
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94a3b8", marginTop: "0.5rem" }}>
                        – Albert Einstein
                    </Typography>
                </CardContent>
            </Card>
            <Box sx={{ marginBottom: "2rem", textAlign: "center" }}>
                <CircularProgress
                    variant="determinate"
                    value={(bikes.length % 10) * 10}
                    size={80}
                />
                <Typography variant="body1" sx={{ marginTop: "0.5rem", color: "#94a3b8" }}>
                    Progress: {bikes.length} bikes available
                </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "#94a3b8" }}>
                Find your dream bike today!
            </Typography>
        </Box>
    );

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: darkMode ? "#0b192f" : "#f0f4f8",
                color: darkMode ? "#fff" : "#333",
                transition: "background-color 0.3s, color 0.3s",
            }}
        >
            {/* Sidebar */}
            <Box
                sx={{
                    width: "25%",
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    padding: "1.5rem",
                    boxShadow: darkMode ? "0 4px 10px rgba(0, 0, 0, 0.6)" : "0 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRight: darkMode ? "none" : "1px solid #ccc",
                    borderRadius: "8px 0 0 8px",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <TextField
                        placeholder="Search bikes..."
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#94a3b8" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: darkMode ? "#fff" : "#333",
                                backgroundColor: darkMode ? "#172a45" : "#f9f9f9",
                                "& fieldset": {
                                    borderColor: darkMode ? "#475569" : "#ddd",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#0ea5e9",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#0ea5e9",
                                },
                            },
                            "& .MuiInputBase-input::placeholder": {
                                color: darkMode ? "#94a3b8" : "#aaa",
                            },
                        }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}>
                        <Typography variant="body2" sx={{ color: darkMode ? "#94a3b8" : "#555", marginRight: "0.5rem" }}>
                            {darkMode ? "Dark Mode" : "Light Mode"}
                        </Typography>
                        <Switch
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            color="primary"
                            inputProps={{ "aria-label": "dark mode toggle" }}
                        />
                    </Box>
                </Box>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        color: "#0ea5e9",
                        marginBottom: "1rem",
                    }}
                >
                    Featured Bikes
                </Typography>
                <Box sx={{ overflowY: "auto", maxHeight: "70vh" }}>
                    {filteredBikes.map((bike) => (
                        <Paper
                            key={bike.id}
                            sx={{
                                padding: "1rem",
                                marginBottom: "1rem",
                                backgroundColor: darkMode ? "#172a45" : "#fff",
                                transition: "transform 0.2s ease",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        >
                            <Typography variant="h6" sx={{ color: "#0ea5e9", fontWeight: "bold" }}>
                                {bike.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#94a3b8", marginTop: "0.5rem" }}>
                                {bike.description}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#0ea5e9", fontWeight: "bold", marginTop: "0.5rem" }}>
                                ₱{bike.price}
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddShoppingCartIcon />}
                                sx={{
                                    marginTop: "1rem",
                                    borderColor: "#0ea5e9",
                                    color: "#0ea5e9",
                                    "&:hover": {
                                        backgroundColor: "#0ea5e9",
                                        color: "#fff",
                                    },
                                }}
                            >
                                Add to Cart
                            </Button>
                        </Paper>
                    ))}
                </Box>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                {renderDashboard()}
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Home;
