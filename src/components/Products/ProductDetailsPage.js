import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import CategoryFilter from "./CategoryFilters";

const ProductDetailsPage = () => {
  const { id } = useParams(); // Extract product ID from the URL
  const navigate = useNavigate(); // Navigation for category changes

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]); // Categories state
  const [selectedCategory, setSelectedCategory] = useState("All"); // Selected category state
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0); // Total amount for the order
  const [loading, setLoading] = useState(true); // Loading state
  const placeholderImage = "https://placehold.jp/400x400.png";

  useEffect(() => {
    // Fetch product details and categories
    setLoading(true);
    Promise.all([
      fetch(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`),
      fetch(`https://dev-project-ecommerce.upgrad.dev/api/products/categories`),
    ])
      .then(([productRes, categoriesRes]) =>
        Promise.all([productRes.json(), categoriesRes.json()])
      )
      .then(([productData, categoriesData]) => {
        setProduct(productData);
        setCategories(["All", ...categoriesData]);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // Update total amount when quantity or product price changes
  useEffect(() => {
    if (product) {
      setTotalAmount(product.price * quantity);
    }
  }, [quantity, product]);

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    navigate(`/products?category=${newCategory}`);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Number(e.target.value)); // Ensure value is at least 1
    setQuantity(value);
  };

  // Pass product details and quantity
  const handlePlaceOrder = () => {
    navigate("/create-order", {
      state: {
        product: {
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl || placeholderImage,
          availableItems: product.availableItems,
          category: product.category,
        },
        quantity: quantity, // Pass quantity as well
      },
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Product not found. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Product Details Section */}

      <Box display="flex" justifyContent="center" gap={4} p={4}>
        {/* Product Image */}
        <Card sx={{ maxWidth: 400 }}>
          <CardMedia
            component="img"
            height="400"
            image={product.imageUrl || placeholderImage}
            alt={product.name || "Product Image"}
            sx={{
              objectFit: "cover",
            }}
          />
        </Card>

        {/* Product Information */}
        <Box
          display="flex"
          flexDirection="column"
          gap={1.5}
          sx={{ maxWidth: 500 }}
          mt={5}
        >
          {/* Product Name and Available Quantity */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5">{product.name}</Typography>
            <Typography
              variant="h7"
              sx={{
                backgroundColor: "#3f51b5",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: 15,
                // fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              Available Quantity: {product.availableItems}
            </Typography>
          </Box>

          {/* Category */}
          <Typography variant="subtitle1">
            <strong>Category:</strong> {product.category}
          </Typography>

          {/* Description */}
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            {product.description}
          </Typography>

          {/* Price */}
          <Typography variant="h5" color="error">
            ₹ {totalAmount}
          </Typography>

          {/* Quantity Input */}
          <TextField
            label="Enter Quantity"
            type="number"
            variant="outlined"
            value={quantity}
            onChange={handleQuantityChange}
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ width: "300px" }}
          />

          {/* Place Order Button */}
          <Button
            variant="contained"
            size="small"
            onClick={handlePlaceOrder}
            sx={{
              mt: 1,
              width: "150px",
              backgroundColor: "#3f51b5",
              "&:hover": { backgroundColor: "#303f9f" },
            }}
          >
            PLACE ORDER
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetailsPage;
