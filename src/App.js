import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { UserProvider } from "./components/signup/UserContext";
import Navbar from "./components/Navbar/Navbar";
import Home1 from "./components/home/Home1";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import ProductsPage from "./components/Products/ProductPage";
import ProductDetailsPage from "./components/Products/ProductDetailsPage";
import CreateOrderPage from "./components/Products/CreateOrderPage";
import ProductAdd from "./components/CUDProduct/ProductAdd";
import EditProduct from "./components/CUDProduct/EditProduct";

// Create Material UI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Customize this color
    },
    secondary: {
      main: "#dc004e", // Customize this color
    },
  },
});

const App = () => {
  const [searchText, setSearchText] = useState(""); // Global state for search text

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures consistent baseline styling */}
      <UserProvider>
        <Router>
          <Navbar searchText={searchText} setSearchText={setSearchText} />
          <Routes>
            {/* Home Routes */}
            <Route path="/" element={<Home1 />} />
            <Route path="/home" element={<Home1 />} />
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Product Management Routes */}
            <Route path="/add-product" element={<ProductAdd />} />
            <Route
              path="/list"
              element={<ProductsPage searchText={searchText} />}
            />
            <Route
              path="/products"
              element={<ProductsPage searchText={searchText} />}
            />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/create-order" element={<CreateOrderPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
