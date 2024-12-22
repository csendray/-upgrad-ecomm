import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Select,
  MenuItem,
  TextField,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
  Grid,
  StepConnector,
  styled,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { stepConnectorClasses } from "@mui/material/StepConnector";

// Custom styled StepConnector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#bdbdbd", // Custom connector line color
  },
}));

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.product || {};
  const initialQuantity = state?.quantity || 1;

  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [quantity, setQuantity] = useState(initialQuantity);
  const [totalAmount, setTotalAmount] = useState(0);

  const steps = ["Confirm Purchase", "Address Details", "Order Confirmation"];

  // Fetch addresses from API
  const fetchAddresses = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Authentication token missing",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://dev-project-ecommerce.upgrad.dev/api/addresses",
        { headers: { "x-auth-token": token } }
      );
      setAddresses(response.data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error fetching addresses: ${err.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Calculate total amount based on quantity and product price
  useEffect(() => {
    setTotalAmount(product.price * quantity);
  }, [quantity, product.price]);

  // Add a new address via API
  const handleAddAddress = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Authentication token missing",
        type: "error",
      });
      return;
    }

    if (
      !newAddress.name ||
      !newAddress.contactNumber ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zipcode
    ) {
      setSnackbar({
        open: true,
        message: "All fields are required to add a new address.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/addresses",
        { ...newAddress },
        { headers: { "x-auth-token": token } }
      );
      setSnackbar({
        open: true,
        message: "Address created successfully!",
        type: "success",
      });
      setNewAddress({});
      fetchAddresses(); // Refresh address list
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error creating address: ${err.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the next step
  const handleNext = () => {
    if (activeStep === 1 && !selectedAddress) {
      setSnackbar({
        open: true,
        message: "Please select an address before proceeding.",
        type: "error",
      });
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Navigate to the previous step
  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Place the order
  const handlePlaceOrder = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Authentication token missing",
        type: "error",
      });
      return;
    }

    if (!selectedAddress) {
      setSnackbar({
        open: true,
        message: "Please select an address before placing the order.",
        type: "error",
      });
      return;
    }

    // try {
    // const selectedAddr = addresses.find(
    //   (addr) => addr.name === selectedAddress
    // );
    // await axios.post(
    //   "https://dev-project-ecommerce.upgrad.dev/api/orders",
    //   {
    //     quantity,
    //     product: product.id, // Ensure `product.id` contains the product ID
    //     address: selectedAddr?.id, // Ensure `selectedAddr.id` contains the address ID
    //   },
    //   {
    //     headers: { "x-auth-token": token },
    //   }
    // );

    setSnackbar({
      open: true,
      message: "Order placed successfully!",
      type: "success",
    });

    setTimeout(() => {
      navigate("/list"); // Navigate to order list after placing the order
    }, 2000);
    // } catch (err) {
    //   setSnackbar({
    //     open: true,
    //     message: `Error placing order: ${
    //       err.response?.data?.message || err.message
    //     }`,
    //     type: "error",
    //   });
    // }
  };

  // Custom StepIcon
  const CustomStepIcon = (props) => {
    const { active, completed, icon } = props;

    return (
      <div
        style={{
          color: completed || active ? "#3f51b5" : "#bdbdbd", // Adjust active/completed/inactive colors
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {completed ? (
          <CheckCircleIcon style={{ color: "#3f51b5" }} /> // Completed step icon color
        ) : (
          <div
            style={{
              width: 24,
              height: 24,
              border: `2px solid ${active ? "#3f51b5" : "#bdbdbd"}`,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: active ? "#3f51b5" : "#bdbdbd",
            }}
          >
            {icon}
          </div>
        )}
      </div>
    );
  };

  // Get selected address details
  const selectedAddr = addresses.find((addr) => addr.name === selectedAddress);

  return (
    <Box sx={{ width: "100%", p: 4 }}>
      {/* Stepper */}
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<CustomConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Product Details */}
      {activeStep === 0 && (
        <Box mt={4} display="flex" gap={4} justifyContent="center">
          <Box>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "300px", objectFit: "contain" }}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={2} maxWidth={400}>
            <Typography variant="h5" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography>Category: {product.category}</Typography>
            <Typography color="text.secondary">
              {product.description}
            </Typography>
            <Typography variant="h6" color="error">
              Price: ₹{totalAmount}
            </Typography>
            <TextField
              disabled
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleNext}
              sx={{ backgroundColor: "#3f51b5", color: "white" }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {/* Step 2: Address Details */}
      {activeStep === 1 && (
        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Select Address
          </Typography>
          <Select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 2, width: "400px" }}
          >
            <MenuItem value="">Select an address</MenuItem>
            {addresses.map((address, index) => (
              <MenuItem key={index} value={address.name}>
                {`${address.name} --> ${address.street}, ${address.city}`}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="h6" gutterBottom>
            Add Address
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "400px",
            }}
          >
            <TextField
              label="Name *"
              value={newAddress.name || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, name: e.target.value })
              }
            />
            <TextField
              label="Contact Number *"
              value={newAddress.contactNumber || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, contactNumber: e.target.value })
              }
            />
            <TextField
              label="Street *"
              value={newAddress.street || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            <TextField
              label="City *"
              value={newAddress.city || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <TextField
              label="State *"
              value={newAddress.state || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <TextField
              label="Landmark"
              value={newAddress.landmark || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, landmark: e.target.value })
              }
            />
            <TextField
              label="Zip Code *"
              value={newAddress.zipcode || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, zipcode: e.target.value })
              }
            />
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddAddress}
                sx={{ mr: 2, backgroundColor: "#3f51b5", color: "white" }}
              >
                Save Address
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ backgroundColor: "#3f51b5", color: "white" }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Step 3: Order Confirmation */}
      {activeStep === 2 && (
        <Box sx={{ mt: 4, maxWidth: 1200, margin: "0 auto" }}>
          <Grid container spacing={4} mt={4}>
            {/* Left Column: Product Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                <Typography>
                  <strong>Quantity:</strong> {quantity}
                </Typography>
                <Typography>
                  <strong>Category:</strong>{" "}
                  <span style={{ fontWeight: "bold", color: "#3f51b5" }}>
                    {product.category}
                  </span>
                </Typography>
                <Typography sx={{ my: 2 }} color="text.secondary">
                  {product.description}
                </Typography>
                <Typography
                  variant="h6"
                  color="error"
                  fontWeight="bold"
                  sx={{ mt: 2 }}
                >
                  Total Price: ₹ {totalAmount}
                </Typography>
              </Paper>
            </Grid>
            {/* Right Column: Address Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Address Details:
                </Typography>
                {selectedAddr ? (
                  <>
                    <Typography>
                      <strong>{selectedAddr.name}</strong>
                    </Typography>
                    <Typography>
                      Contact Number: {selectedAddr.contactNumber}
                    </Typography>
                    <Typography>
                      {selectedAddr.street}, {selectedAddr.city}
                    </Typography>
                    <Typography>{selectedAddr.state}</Typography>
                    <Typography>{selectedAddr.zipcode}</Typography>
                  </>
                ) : (
                  <Typography>No Address Selected</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Navigation Buttons */}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{ color: "#3f51b5" }}
        >
          Back
        </Button>
        <Button
          disabled={activeStep !== 2}
          variant="contained"
          onClick={handlePlaceOrder}
          sx={{ backgroundColor: "#3f51b5", color: "white" }}
        >
          Place Order
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Loading Spinner */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default CreateOrderPage;
