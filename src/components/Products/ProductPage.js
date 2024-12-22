import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  Box,
  Grid,
  InputLabel,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { UserContext } from "../signup/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard.js";
import CategoryFilter from "./CategoryFilters";

// Define constant for "All" category to avoid hardcoding
const CATEGORY_ALL = "All";

const ProductsPage = ({ searchText }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // State for products, categories, filters, and loading/error
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ALL);
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve authentication token or redirect to login
  const getAuthToken = () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      throw new Error("Authentication token not found");
    }
    return token;
  };

  // Fetch products and categories from API
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getAuthToken();

        // Fetch categories and products concurrently
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get(
            "https://dev-project-ecommerce.upgrad.dev/api/products/categories",
            { headers: { "x-auth-token": token } }
          ),
          axios.get("https://dev-project-ecommerce.upgrad.dev/api/products", {
            headers: { "x-auth-token": token },
          }),
        ]);

        setCategories([CATEGORY_ALL, ...categoriesRes.data]);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        if (err.response?.status === 401) navigate("/login"); // Redirect on auth failure
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesAndProducts();
  }, [navigate]);

  // Memoized filtered products based on category and search text
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === CATEGORY_ALL ||
        product.category === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchText]);

  // Memoized sorted products based on sort option
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortOption === "priceLowToHigh") return a.price - b.price;
      if (sortOption === "priceHighToLow") return b.price - a.price;
      if (sortOption === "newest") return b.id - a.id; // Descending by ID for "Newest"
      return 0; // Default order
    });
  }, [filteredProducts, sortOption]);

  // Handle category filter change
  // const handleCategoryChange = (event, newCategory) => {
  //   if (newCategory) setSelectedCategory(newCategory);
  // };

  // Handle sort option change
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <Box p={4}>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      {/* Sort Dropdown */}
      <Box>
        <FormControl sx={{ m: 1, width: 300, borderBlockColor: "blueviolet" }}>
          <InputLabel variant="standard" id="sort-by-label">
            Sort By
          </InputLabel>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            label="Sort By"
            labelId="sort-by-label"
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
            <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* Loading, Error, and Product Grid */}
      {loading ? (
        <Box display="flex" justifyContent="end" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container>
          {sortedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard product={product} isAdmin={user?.role === "ADMIN"} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductsPage;
