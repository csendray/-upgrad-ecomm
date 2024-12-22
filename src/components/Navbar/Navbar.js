import React, { useContext } from "react"; // Import React and useContext hook
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
} from "@mui/material"; // Import MUI components
import { Link, useNavigate } from "react-router-dom"; // Correct imports for react-router-dom
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Import ShoppingCart icon
import SearchBar from "./SearchBar"; // Import the SearchBar component
import { UserContext } from "../signup/UserContext"; // Import UserContext

const Navbar = ({ searchText, setSearchText }) => {
  // Accept props from App.js
  const { user, setUser } = useContext(UserContext); // Use context to access user state
  const navigate = useNavigate(); // Navigate hook to change routes
  const isMobile = useMediaQuery("(max-width:600px)"); // Check if screen width is less than 600px
  // const location = useLocation(); // Correct way to get the current path using useLocation hook

  const handleLogout = () => {
    try {
      setUser({ isLoggedIn: false, role: "" }); // Reset user state
      sessionStorage.removeItem("authToken"); // Remove the auth token from session storage
      navigate("/login"); // Redirect user to login page
    } catch (error) {
      console.error("Error during logout:", error); // Catch and log any errors during logout
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
      <Toolbar>
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            maxWidth: 800,
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/home"
            sx={{
              color: "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ShoppingCartIcon />
            upGrad E-Shop
          </Typography>
        </Box>

        {/* Search Bar */}
        {!isMobile && (
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        )}

        {/* Dynamic User Links */}
        {user.isLoggedIn ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{ textTransform: "none", textDecoration: "underline" }}
            >
              Home
            </Button>

            {user.role === "ADMIN" && (
              <Button
                color="inherit"
                onClick={() => navigate("/add-product")} // Add Product Navigation
                sx={{
                  textTransform: "none",
                  textDecoration: "underline",
                }}
              >
                Add Product
              </Button>
            )}
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={2}>
            <Button
              color="inherit"
              component={Link}
              to="/home"
              sx={{
                textTransform: "none",
                textDecoration: "underline",
              }}
            >
              Home
            </Button>
            {/* Removed invalid if statement */}

            <Button
              color="inherit"
              sx={{
                textTransform: "none",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/login")} // Add Product Navigation
            >
              Add Product
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
