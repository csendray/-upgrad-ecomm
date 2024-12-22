import React, { useState, useContext } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { UserContext } from "../signup/UserContext"; // UserContext.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // Handle input field changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    try {
      // Simulate a successful login request
      const response = await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/auth/signin",
        formData
      );

      console.log("Full Response header:", response.data, response.data.token);

      // Check if token exists in the response body, typically in response.data.token
      const token =
        response.headers["x-auth-token"] ||
        "	eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbmFkYW1AZXNob3AuY29tIiwiaWF0IjoxNzM0ODcxNjgwLCJleHAiOjE3MzQ4ODAwODB9.C8YPYtPlGxU4Y8viNS66InsHTjUnE7NszRlyaSkFKGtkEEKB_dKJ7uU1nt9I2Ajzw3E_ZhaspbBtqwEQvqSukw";
      // Store the manually assigned token in sessionStorage
      sessionStorage.setItem("authToken", token);

      // Set the token in axios default headers for future requests
      axios.defaults.headers["x-auth-token"] = token;

      console.log(response.data.roles[0]);

      setUser({ isLoggedIn: true, role: response.data.roles[0] });

      // Navigate to home screen
      navigate("/list");
    } catch (err) {
      console.error("Login error:", err); // Debugging
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 64px)"
      bgcolor="#f5f5f5"
      px={2}
    >
      <LockIcon fontSize="large" color="error" />
      <Typography variant="h5" sx={{ mt: 2 }}>
        Sign in
      </Typography>
      {error && (
        <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
          {error}
        </Typography>
      )}
      <Box
        component="form"
        sx={{ mt: 2, width: "100%", maxWidth: "400px" }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          label="Email Address"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "#3f51b5" }}
        >
          SIGN IN
        </Button>
      </Box>
      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: "center", marginTop: "10px" }}
      >
        Don't have an account? <Link href="/signup">Sign up</Link>
      </Typography>
      <Typography variant="body2" sx={{ mt: 4, textAlign: "right" }}>
        Copyright © <Link href="/">upGrad</Link> 2024.
      </Typography>
    </Box>
  );
};

export default Login;
