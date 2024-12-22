import React, { useState, useCallback } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // New success message state

  const handleSigninNavigation = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the error for the current field as the user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!formData.firstName)
      validationErrors.firstName = "First Name is required.";
    if (!formData.lastName)
      validationErrors.lastName = "Last Name is required.";
    // Email Validation
    if (!formData.email) {
      validationErrors.email = "Email Address is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
      if (!emailRegex.test(formData.email)) {
        validationErrors.email = "Please enter a valid Email Address.";
      }
    }
    if (!formData.password) validationErrors.password = "Password is required.";
    if (!formData.confirmPassword)
      validationErrors.confirmPassword = "Confirm Password is required.";
    else if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match.";
    if (!formData.contactNumber)
      validationErrors.contactNumber = "Contact Number is required.";

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Show validation errors
      return;
    }

    try {
      await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/auth/signup",
        formData
      );

      // Show success message and clear form data
      setSuccessMessage(
        `Account created successfully for ${formData.firstName} ${formData.lastName}!`
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
      });

      // Optionally, navigate to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: "Signup failed. Please try again.",
      }));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Lock Icon */}
      <Box
        sx={{
          backgroundColor: "#ff4081",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <LockIcon sx={{ color: "white", fontSize: "30px" }} />
      </Box>

      {/* Title */}
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Sign Up
      </Typography>

      {/* Success Message */}
      {successMessage && (
        <Typography
          color="success.main"
          sx={{
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {successMessage}
        </Typography>
      )}

      {/* General Error */}
      {errors.general && (
        <Typography color="error" sx={{ marginBottom: "10px" }}>
          {errors.general}
        </Typography>
      )}

      {/* Form */}
      {!successMessage && ( // Hide form after success
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          {/* First Name */}
          <TextField
            label="First Name *"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
            margin="normal"
          />

          {/* Last Name */}
          <TextField
            label="Last Name *"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
            margin="normal"
          />

          {/* Email Address */}
          <TextField
            label="Email Address *"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
          />

          {/* Password */}
          <TextField
            label="Password *"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
          />

          {/* Confirm Password */}
          <TextField
            label="Confirm Password *"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
            margin="normal"
          />

          {/* Contact Number */}
          <TextField
            label="Contact Number *"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            error={!!errors.contactNumber}
            helperText={errors.contactNumber}
            fullWidth
            margin="normal"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#3f51b5",
              color: "white",
              padding: "10px 0",
              marginTop: "10px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            Sign Up
          </Button>
        </form>
      )}

      {/* Sign in Link */}
      {!successMessage && ( // Hide link after success
        <Typography
          variant="body2"
          sx={{ textAlign: "center", marginTop: "10px" }}
        >
          Already have an account?{" "}
          <span
            onClick={handleSigninNavigation}
            style={{
              color: "#3f51b5",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Sign in
          </span>
        </Typography>
      )}
    </Box>
  );
};

export default Signup;
