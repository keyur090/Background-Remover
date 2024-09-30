import React, { useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Container,
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Removebg() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(""); // Uploaded image URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Handle image file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setSelectedImageUrl(URL.createObjectURL(file));
    }
  };

  // Remove background from the uploaded image
  const handleRemoveBackground = async () => {
    if (!selectedImage) {
      setError("Please upload an image first");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:5000/remove-background",
        formData,
        { responseType: "blob" }
      );

      const imageUrl = URL.createObjectURL(response.data);

      // Navigate to the edit background page with the processed image
      navigate("/edit-background", {
        state: { image: imageUrl, selectedImage: selectedImageUrl },
      });
    } catch (err) {
      setError("Error removing background");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Close the Snackbar notification
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 , mb: 4}}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        {/* Header */}
        <Typography variant="h4" gutterBottom>
          Remove Background from Your Image
        </Typography>

        {/* Image Upload Section */}
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            width: "100%",
            textAlign: "center",
            borderStyle: "dashed",
            bgcolor: "#f9f9f9",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
              setSelectedImage(file);
              setSelectedImageUrl(URL.createObjectURL(file));
            }
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            id="image-upload"
            style={{ display: "none" }}
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span" sx={{ mb: 2 }}>
              Select Image
            </Button>
          </label>
          <Typography variant="body2" color="textSecondary">
            Drag and drop an image here, or click "Select Image" to upload.
          </Typography>
        </Paper>

        {/* Display Uploaded Image */}
        {selectedImageUrl && (
          <Box mt={4} width="100%">
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography textAlign='center' variant="h6" gutterBottom>
                Uploaded Image:
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  overflow: "hidden",
                  maxHeight: "400px",
                }}
              >
                <img
                  src={selectedImageUrl}
                  alt="Uploaded"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Paper>
          </Box>
        )}

        {/* Action Buttons */}
        <Box mt={4} display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRemoveBackground}
            disabled={loading || !selectedImage}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Remove Background"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setSelectedImage(null);
              setSelectedImageUrl("");
            }}
            disabled={loading || !selectedImage}
          >
            Clear Image
          </Button>
        </Box>
      </Box>

      {/* Snackbar for Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Removebg;
