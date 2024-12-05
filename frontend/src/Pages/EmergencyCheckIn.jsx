import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CircularProgress,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styled button
const StyledButton = styled(Button)(({ theme }) => ({
  color: "white",
  background: "#6363ab",
  padding: "12px 28px",
  fontSize: "18px",
  fontWeight: "bold",
  borderRadius: "30px",
  width: "100%",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
}));

// Custom card
const CheckInCard = styled(Card)(({ theme }) => ({
  padding: "32px",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)",
  maxWidth: "400px",
  margin: "auto",
  backgroundColor: "#f4f4f4",
  [theme.breakpoints.down("sm")]: {
    padding: "24px",
  },
}));

const CheckInComponent = () => {
  const [status, setStatus] = useState(""); // Tracks the check-in status
  const [loadingSafe, setLoadingSafe] = useState(false);
  const [loadingUnsafe, setLoadingUnsafe] = useState(false);
  const [neighbors, setNeighbors] = useState([]);
  const [selectedNeighbor, setSelectedNeighbor] = useState(null);
  const [notifications, setNotifications] = useState({}); // Store notifications by neighbor ID

  const token = sessionStorage.getItem("TOKEN");

  useEffect(() => {
    // Fetch neighbors from the API
    const fetchNeighbors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_PROD}/users/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch neighbors");
        }

        const data = await response.json();
        setNeighbors(data.users_info);
      } catch (error) {
        console.error("Error fetching neighbors:", error);
        setStatus("Failed to load neighbors.");
      }
    };

    fetchNeighbors();
  }, [token]);

  // Function to send an alert to a selected neighbor
  const alertNeighbor = async () => {
    if (selectedNeighbor) {
      try {
        setStatus("Sending alert...");
        const response = await fetch(`${import.meta.env.VITE_BASE_URL_PROD}/emergency_check_in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
          },
          body: JSON.stringify({
            receivers_ids: [selectedNeighbor.id],
            status: status,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send alert.");
        }

        setStatus(`Alert sent to ${selectedNeighbor.name}`);
        setNotifications((prevNotifications) => ({
          ...prevNotifications,
          [selectedNeighbor.name]: `Check-in alert: ${status}`,
        }));
      } catch (error) {
        console.error("Error sending alert:", error);
        setStatus("Failed to send alert.");
      }
    } else {
      setStatus("Please select a neighbor to alert.");
    }
  };

  const handleSafeCheckIn = () => {
    setLoadingSafe(true);
    setStatus("SAFE");
    setLoadingSafe(false);
  };

  const handleUnsafeCheckIn = () => {
    setLoadingUnsafe(true);
    setStatus("DANGER");
    setLoadingUnsafe(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
      <CheckInCard>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
          Emergency
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
          Check-In
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Pick your safety status during this emergency.
        </Typography>

        <Stack spacing={2} sx={{ width: "100%" }}>
          <StyledButton
            onClick={handleSafeCheckIn}
            disabled={loadingSafe || loadingUnsafe}
            variant="contained"
          >
            {loadingSafe ? <CircularProgress size={24} color="inherit" /> : "I'm Safe"}
          </StyledButton>
          <StyledButton
            onClick={handleUnsafeCheckIn}
            disabled={loadingSafe || loadingUnsafe}
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#c62828" },
            }}
          >
            {loadingUnsafe ? <CircularProgress size={24} color="inherit" /> : "I'm Not Safe"}
          </StyledButton>
        </Stack>

        <Typography variant="h6" sx={{ mt: 3, color: "#333" }}>
          Select a Neighbor to Alert
        </Typography>
        <List sx={{ maxHeight: "150px", overflow: "auto", mt: 2 }}>
          {neighbors.map((neighbor) => (
            <ListItem
              key={neighbor.id}
              button
              selected={selectedNeighbor?.id === neighbor.id}
              onClick={() => setSelectedNeighbor(neighbor)}
              sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}
            >
              <ListItemAvatar>
                <Avatar>{neighbor.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={neighbor.name} />
            </ListItem>
          ))}
        </List>

        {/* Alert Button */}
        <Button
          variant="outlined"
          color="primary"
          onClick={alertNeighbor}
          sx={{ mt: 2, color: "white", background: "#6363ab" }}
        >
          Alert Selected Neighbor
        </Button>

        {status && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3, justifyContent: "center" }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: status === "SAFE" ? "#4caf50" : "#d32f2f",
              }}
            >
              {status}
            </Typography>
          </Stack>
        )}

        <Typography variant="h6" sx={{ mt: 4, color: "#333" }}>
          Notifications
        </Typography>
        <List>
          {Object.entries(notifications).map(([name, message]) => (
            <ListItem key={name}>
              <ListItemText primary={`${name}: ${message}`} />
            </ListItem>
          ))}
        </List>
      </CheckInCard>
    </Box>
  );
};

export default CheckInComponent;
