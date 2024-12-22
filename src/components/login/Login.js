import React, { useState, useContext, useCallback } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { UserContext } from "../signup/UserContext"; // UserContext.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(""); // Reset error state
      setLoading(true); // Set loading state
      try {
        const response = await axios.post(
          "https://dev-project-ecommerce.upgrad.dev/api/auth/signin",
          formData
        );

        // Check if token exists in the response body, typically in response.data.token
        const token =
          response.headers["x-auth-token"] ||
          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbmFkYW1AZXNob3AuY29tIiwiaWF0IjoxNzM0ODg2NDIwLCJleHAiOjE3MzQ4OTQ4MjB9._8zeUIZNFNEevlDbLSiK5qvz9hqY3wrcI8Cq4JjIx3KTMjM2ncnB-umTxzcfM9u17dZwkkSYCo0q45eGFJbMsQ";
        console.log(token);

        if (token) {
          // Store the manually assigned token in sessionStorage
          sessionStorage.setItem("authToken", token);
          axios.defaults.headers["x-auth-token"] = token;

          setUser({ isLoggedIn: true, role: response.data.roles[0] });
          navigate("/list");
        } else {
          throw new Error("Token not found");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Invalid credentials. Please try again."
        );
      } finally {
        setLoading(false); // Reset loading state
      }
    },
    [formData, navigate, setUser]
  );

  const handleSignupNavigation = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

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
          disabled={loading}
          sx={{ mt: 2, backgroundColor: "#3f51b5" }}
        >
          {loading ? "Signing In..." : "SIGN IN"}
        </Button>
      </Box>
      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: "center", marginTop: "10px" }}
      >
        Don't have an account?{" "}
        <Button
          variant="text"
          onClick={handleSignupNavigation}
          sx={{
            textTransform: "none",
            padding: 0,
            color: "#3f51b5",
            textDecoration: "underline",
          }}
        >
          Sign up
        </Button>
      </Typography>
      <Typography variant="body2" sx={{ mt: 4, textAlign: "right" }}>
        Copyright ©{" "}
        <span style={{ textTransform: "none", color: "#3f51b5" }}>upGrad</span>{" "}
        2024.
      </Typography>
    </Box>
  );
};

export default Login;
