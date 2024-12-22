import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Container,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductAdd = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    manufacturer: "",
    availableItems: "",
    imageUrl: "",
  });
  const [categories, setCategories] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get("https://dev-project-ecommerce.upgrad.dev/api/products/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });

    // Clear validation error on field change
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const validateFields = () => {
    const errors = {};
    if (!product.name) errors.name = "Product name is required.";
    if (!product.category) errors.category = "Category is required.";
    if (!product.price || product.price <= 0)
      errors.price = "Valid price is required.";
    // if (!product.imageUrl) errors.imageUrl = "Image URL is required.";
    if (!product.description) errors.description = "Description is required.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const handleSubmit = () => {
    // Validate fields
    if (!validateFields()) {
      setMessage("Please fix the validation errors.");
      setMessageType("error");
      setOpenSnackbar(true);
      return;
    }

    if (!token) {
      setMessage("Authentication token is missing. Please log in.");
      setMessageType("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    axios
      .post("https://dev-project-ecommerce.upgrad.dev/api/products", product, {
        headers: { "x-auth-token": token },
      })
      .then((response) => {
        setMessage(`Product ${response.data.name} added successfully`);
        setMessageType("success");
        setOpenSnackbar(true);
        setProduct({
          name: "",
          category: "",
          price: "",
          description: "",
          manufacturer: "",
          availableItems: "",
          imageUrl: "",
        }); // Reset form fields
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate("/list");
        }, 3000);
      })
      .catch((error) => {
        setMessage(`Error adding product: ${error.message}`);
        setMessageType("error");
        setOpenSnackbar(true);
        console.error("Error adding product:", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Add Product
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        {/* Product Name */}
        <TextField
          label="Product Name"
          name="name"
          value={product.name}
          onChange={handleChange}
          fullWidth
          required
          error={!!validationErrors.name}
          helperText={validationErrors.name}
        />

        {/* Category Select */}
        <FormControl fullWidth required error={!!validationErrors.category}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="error">
            {validationErrors.category}
          </Typography>
        </FormControl>

        {/* Price */}
        <TextField
          label="Price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          fullWidth
          required
          error={!!validationErrors.price}
          helperText={validationErrors.price}
        />

        {/* Image URL */}
        <TextField
          label="Image URL"
          name="imageUrl"
          value={product.imageUrl}
          onChange={handleChange}
          fullWidth
          // // required
          // error={!!validationErrors.imageUrl}
          // helperText={validationErrors.imageUrl}
        />

        {/* Product Description */}
        <TextField
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={4}
          error={!!validationErrors.description}
          helperText={validationErrors.description}
        />

        {/* Manufacturer */}
        <TextField
          label="Manufacturer"
          name="manufacturer"
          value={product.manufacturer}
          onChange={handleChange}
          fullWidth
        />

        {/* Available Items */}
        <TextField
          label="Available Items"
          name="availableItems"
          type="number"
          value={product.availableItems}
          onChange={handleChange}
          fullWidth
        />

        {/* Save Product Button */}
        {/* Save Product Button */}
        <Button
          variant="contained"
          // color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={loading}
          sx={{
            mt: 1,
            height: "46px",
            backgroundColor: "#3f51b5",
            color: "white",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save Product"
          )}
        </Button>
      </Box>

      {/* Snackbar for Success/Error Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={messageType}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductAdd;
