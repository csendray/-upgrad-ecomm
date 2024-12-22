import React from "react";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const navigate = useNavigate();

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory) {
      // Update the selected category
      onCategoryChange(newCategory);
      // Navigate to the ProductsPage with the selected category
      navigate(`/products?category=${newCategory}`);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mb={2}>
      <ToggleButtonGroup
        value={selectedCategory}
        exclusive
        onChange={handleCategoryChange}
        aria-label="Product Categories"
        sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
      >
        {categories.map((category) => (
          <ToggleButton
            key={category}
            value={category}
            sx={{ textTransform: "none", padding: "6px 16px" }}
          >
            {category}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default CategoryFilter;
