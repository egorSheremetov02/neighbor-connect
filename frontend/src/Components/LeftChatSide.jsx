LeftChatSide.jsx;

import React, { useEffect, useState } from "react";
import {
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";

const Neighbors = () => {
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null); // Store current user ID
  const navigate = useNavigate();

  const token = sessionStorage.getItem("TOKEN");

  // Fetch neighbors from the API
  useEffect(() => {
    const fetchNeighbors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_PROD}/users/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.substring(1, token.length - 1)}`, // Correct token formatting
            },
          }
        );
        console.error("Users found");

        if (!response.ok) {
          setError("Failed to fetch neighbors");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setNeighbors(data.users_info); // Assuming users_info contains the user data

        // Try to get the current user ID from localStorage
        let storedUserId = localStorage.getItem("userId");

        if (!storedUserId) {
          // If not found in localStorage, set currentUserId to the Admin (ID: 0) or a default user
          const adminUser = data.users_info.find((user) =>
            user.name.toLowerCase().includes("admin")
          );
          storedUserId = adminUser ? adminUser.id : data.users_info[0].id; // Use Admin or fallback to first user

          // Optionally, store this in localStorage for future use
          localStorage.setItem("userId", storedUserId);
        }

        setCurrentUserId(parseInt(storedUserId)); // Set current user ID as integer
      } catch (error) {
        console.error("Error fetching neighbors:", error);
        setError("Failed to load neighbors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNeighbors();
    console.error("Users found 2");
  }, [token]);

  // Function to create chat and navigate to chat page
  const handleNavigate = async (neighborId) => {
    const apiBaseUrl = `${import.meta.env.VITE_BASE_URL_PROD}`; // Use your backend URL here

    // Check if the current user ID is valid
    if (isNaN(currentUserId)) {
      console.error("Error: Current user ID is not a valid integer.");
      setSnackbarMessage("Error: Unable to retrieve your user ID.");
      setOpenSnackbar(true);
      return;
    }

    try {
      // console.log("Token:", token); // Ensure token is correct
      // console.log("Creating chat with neighbor ID:", neighborId); // Log neighbor ID
      // console.log("Current User ID:", currentUserId); // Log the current user ID

      // Create the chat by sending a POST request
      const response = await fetch(`${apiBaseUrl}/chats/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.substring(1, token.length - 1)}`, // Ensure the token is formatted properly
        },
        body: JSON.stringify({
          name: `Chat with neighbor ${neighborId}`, // Dynamic chat name
          description: `Chat between you and neighbor ${neighborId}`, // Dynamic chat description
          tags: [], // Optional tags
          users: [currentUserId, neighborId], // Current user and selected neighbor
        }),
      });

      // Handle the response from the server
      // console.log("Response status:", response.status);

      if (!response.ok) {
        const data = await response.json(); // Parse error details from server
        // console.log("Response data:", data);
        throw new Error(
          `Failed to create chat: ${data.message || response.status}`
        );
      }

      const data = await response.json();
      // console.log("Chat created successfully with ID:", data.chat_id);

      // Redirect to the newly created chat
      navigate(`/chat/${data.chat_id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h4" sx={{ color: "#000", marginBottom: "30px" }}>
        Your Neighbors
      </Typography>
      <List>
        {neighbors.map((neighbor) => (
          <ListItem
            key={neighbor.id}
            className="hover:bg-gray-100 cursor-pointer transition-colors duration-200"
            onClick={() => handleNavigate(neighbor.id)} // Create chat when neighbor is clicked
          >
            <ListItemAvatar>
              <Avatar className="bg-blue-500">{neighbor.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={neighbor.name} />
          </ListItem>
        ))}
      </List>

      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Neighbors;
