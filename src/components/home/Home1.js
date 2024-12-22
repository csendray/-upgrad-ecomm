import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../signup/UserContext";

const StyledHeroSection = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  position: "relative",
  display: "flex",
  flexDirection: "column", // Ensures stacking of child components
  justifyContent: "space-between",
}));

const StyledLayer = styled(Box)(({ theme }) => ({
  position: "relative", // Changed from `absolute` to `relative` to avoid overlap
  width: "100%",
  height: "auto", // Automatically adjusts height
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const Hero1 = () => {
  const { user } = useContext(UserContext); // Access user context here
  const navigate = useNavigate(); // Initialize navigate here

  const [currentLayer, setCurrentLayer] = useState(0);

  const products = [
    {
      id: "670505df50a4f058652090c1",
      name: "Sports Shoes By Reebok",
      category: "Shoes",
      price: 5003,
      description: "It's not a shoe, it's your partner!",
      manufacturer: "Reebok",
      imageUrl:
        "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/30691989/2024/8/30/5845ba36-0d50-4220-b5cb-cea57ad594061724996530107-Reebok-Men-Sports-Shoes-8861724996529740-1.jpg",
    },
    {
      id: "67096581c82c184b2f24a4ef",
      name: "Microwave Oven",
      category: "Cooking",
      price: 20000,
      description: "Microwave oven with multiple options.",
      manufacturer: "Philips",
      imageUrl:
        "https://www.shutterstock.com/image-vector/microwave-oven-ad-3d-illustration-260nw-2138158675.jpg",
    },
    {
      id: "67028dd0a987f12c70da77dd",
      name: "Ladies Watch",
      category: "Watches",
      price: 1998,
      description: "It's not a watch, it's your partner!",
      manufacturer: "Fastrack",
      imageUrl: "https://justintime.in/cdn/shop/files/AX5590.jpg",
    },
    {
      id: "670a5ad3f7e88f41a7a97c45",
      name: "iPhone 16",
      category: "Electronics",
      price: 165999,
      description: "iPhone 16 new.",
      manufacturer: "Apple",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwgIIx5_i00huFG3wWcmRnGcjDxQz4yAv2A&s",
    },
    {
      id: "670cd5f310f133252348729a",
      name: "Davidoff Cool Water for Men",
      category: "Perfumes",
      price: 4500,
      description: "One of the coolest and best perfumes for men.",
      manufacturer: "Davidoff",
      imageUrl:
        "https://m.media-amazon.com/images/I/717F397ZGuL._AC_UF894,1000_QL80_.jpg",
    },
    {
      id: "671909c6162b5a7ded803011",
      name: "Running Shoes for Men",
      category: "Shoes",
      price: 899,
      description: "Stylish and comfortable running shoes.",
      manufacturer: "Sparx",
      imageUrl:
        "https://t3.ftcdn.net/jpg/06/12/00/18/360_F_612001823_TkzT0xmIgagoDCyQ0yuJYEGu8j6VNVYT.jpg",
    },
  ];

  const handleNextLayer = () => {
    if (currentLayer < products.length - 1) {
      setCurrentLayer(currentLayer + 1);
    } else {
      setCurrentLayer(0);
    }
  };

  const handleShopNowClick = () => {
    if (user && user.isLoggedIn) {
      navigate("/list"); // Navigate to list page if user is logged in
    } else {
      navigate("/login"); // Navigate to login page if user is not logged in
    }
  };

  return (
    <StyledHeroSection>
      {/* Hero Section */}
      <StyledLayer>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Card
                elevation={8}
                sx={{
                  background: "rgba(255, 255, 255, 0.83)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {products[currentLayer].name}
                  </Typography>
                  <Typography variant="h5" color="textSecondary" gutterBottom>
                    {products[currentLayer].category}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {products[currentLayer].description}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Price: ₹{products[currentLayer].price}
                  </Typography>
                  <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNextLayer}
                      endIcon={<KeyboardArrowDownIcon />}
                    >
                      Next Product
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={products[currentLayer].imageUrl}
                alt={`${products[currentLayer].name} - ${products[currentLayer].category}`}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom color="white">
            Welcome to upGrad E-Shop!
          </Typography>
          <Typography color="Yellow" variant="h6" component="p" paragraph>
            Browse through our exclusive collection of products and enjoy
            amazing offers. Shop now and elevate your lifestyle!
          </Typography>
          <Box>
            <Button
              variant="contained"
              size="large"
              onClick={handleShopNowClick}
            >
              Shop Now
            </Button>
          </Box>
        </Container>
      </StyledLayer>
    </StyledHeroSection>
  );
};

export default Hero1;
