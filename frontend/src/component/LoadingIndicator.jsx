import React from "react";
import { CircularProgress, Box } from "@mui/material";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 1300, // Higher than the app content
  backdropFilter: "blur(8px)", // Blurs the background
  backgroundColor: "rgba(0, 0, 0, 0.2)", // Adds slight dimming
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const LoadingIndicator = () => {
  return (
    <Box sx={overlayStyle}>
      <CircularProgress size={80} thickness={5} color="primary" />
    </Box>
  );
};

export default LoadingIndicator;