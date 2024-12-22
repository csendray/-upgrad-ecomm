import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Snackbar,
  Alert,
  Backdrop,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ProductCard = ({ product, isAdmin }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const token = sessionStorage.getItem("authToken");

  const handleBuyClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleEditClick = () => {
    navigate(`/edit-product/${product.id}`);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleDeleteConfirm = () => {
    if (!token) {
      setMessage("Authentication token is missing. Please log in.");
      setMessageType("error");
      setOpenSnackbar(true);
      return;
    }

    axios
      .delete(
        `https://dev-project-ecommerce.upgrad.dev/api/products/${product.id}`,
        { headers: { "x-auth-token": token } }
      )
      .then((response) => {
        setMessage(`Product ${product.name} deleted successfully`);
        setMessageType("success");
        setOpenModal(false);
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate("/products");
        }, 3000);
      })
      .catch((error) => {
        setMessage(`Error deleting product: ${error.message}`);
        setMessageType("error");
        setOpenSnackbar(true);
        setOpenModal(false);
        console.error("Error deleting product:", error);
      });
  };

  return (
    <Box display="flex" justifyContent="inherit" mb={4}>
      <Card sx={{ maxWidth: 500 }}>
        <CardMedia
          component="img"
          height="300"
          image={product.imageUrl || "https://placehold.jp/150x150.png"}
          alt={product.name}
          sx={{
            objectFit: "cover",
          }}
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="subtitle1">
              ₹{new Intl.NumberFormat("en-IN").format(product.price)}
            </Typography>
          </Box>
          <Box sx={{ maxHeight: 100, overflowY: "auto", mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="contained"
            // color="primary"
            onClick={handleBuyClick}
            sx={{ backgroundColor: "#3f51b5", color: "white" }}
          >
            BUY
          </Button>
          {isAdmin && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                color="default"
                aria-label="edit"
                onClick={handleEditClick}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="default"
                aria-label="delete"
                onClick={handleOpenModal}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </CardActions>
      </Card>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              Confirm Deletion of a Product!
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Are you sure you want to delete this product?
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 4,
                gap: 2,
              }}
            >
              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
                sx={{ backgroundColor: "#3f51b5", color: "white" }}
              >
                OK
              </Button>
              <Button onClick={handleCloseModal}>Cancel</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
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
    </Box>
  );
};

export default ProductCard;
