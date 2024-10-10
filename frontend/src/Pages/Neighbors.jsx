import React, { useEffect, useState } from "react";
import {
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Neighbors = () => {
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("TOKEN");

  // Fetch neighbors from the API
  useEffect(() => {
    const fetchNeighbors = async () => {
      try {
        const response = await fetch("http://localhost:8080/users/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token.substring(1, token.length - 1)}`,
          },
        });

        if (!response.ok) {
          setError("Failed to fetch neighbors");
        }

        const data = await response.json();
        setNeighbors(data.users_info); // Assuming users_info contains the user data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching neighbors:", error);
        setError("Failed to load neighbors. Please try again later.");
        setLoading(false);
      }
    };

    fetchNeighbors();
  }, []);

  const handleNavigate = (id) => {
    navigate(`/neighbors/${id}`);
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
            onClick={() => handleNavigate(neighbor.id)}
          >
            <ListItemAvatar>
              <Avatar className="bg-blue-500">{neighbor.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={neighbor.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Neighbors;
