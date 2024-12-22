import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  Box,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
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
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data
    axios
      .get(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product:", error));

    // Fetch categories for the select dropdown
    axios
      .get("https://dev-project-ecommerce.upgrad.dev/api/products/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, [id]);

  const validateFields = () => {
    const errors = {};
    if (!product.name) errors.name = "Product name is required.";
    if (!product.category) errors.category = "Category is required.";
    if (!product.price || product.price <= 0)
      errors.price = "Valid price is required.";
    if (!product.imageUrl) errors.imageUrl = "Image URL is required.";
    if (!product.description) errors.description = "Description is required.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });

    // Clear field-specific validation errors
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      setMessage("Please fix the validation errors.");
      setMessageType("error");
      setOpenSnackbar(true);
      return;
    }

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setMessage("Authentication token is missing. Please log in.");
      setMessageType("error");
      setOpenSnackbar(true);
      return;
    }

    axios
      .put(
        `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`,
        product,
        { headers: { "x-auth-token": token } }
      )
      .then((response) => {
        setMessage(`Product ${response.data.name} modified successfully.`);
        setMessageType("success");
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/list");
        }, 3000);
      })
      .catch((error) => {
        setMessage(`Error updating product: ${error.message}`);
        setMessageType("error");
        setOpenSnackbar(true);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
          Modify Product
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 1,
          }}
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
          <FormControl fullWidth error={!!validationErrors.category}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={product.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {validationErrors.category && (
              <Typography variant="caption" color="error">
                {validationErrors.category}
              </Typography>
            )}
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
            required
            error={!!validationErrors.imageUrl}
            helperText={validationErrors.imageUrl}
          />

          {/* Product Description */}
          <TextField
            label="Product Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
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

          {/* Modify Product Button */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{
              mt: 1,
              height: "46px",
              backgroundColor: "#3f51b5",
              color: "white",
            }}
          >
            Modify Product
          </Button>
        </Box>
      </Box>

      {/* Snackbar for Success/Error Messages */}
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

export default EditProduct;
