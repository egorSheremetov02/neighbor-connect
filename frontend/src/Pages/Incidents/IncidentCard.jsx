import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Avatar,
  Grid,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import MapIcon from "@mui/icons-material/Map";

const IncidentCard = ({ incident }) => {
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user's full name from API
  useEffect(() => {
    const fetchUserFullName = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token not found.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/auth/users/${incident.author_id}`,
          {
            headers: {
              Authorization: token.substring(1, token.length - 1),
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFullName(data.fullName);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserFullName();
  }, []);

  const dateTime = new Date(incident?.created_at);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formattedDateTime = dateTime.toLocaleDateString("en-US", options);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 345,
        m: 2,
        backgroundColor: "#f5f5f5",
        overflow: "visible",
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ ml: 2, mr: 2, mt: 1 }}
      >
        <Grid item>
          <Avatar
            src="/public/images/profile.jfif"
            alt="Reporter"
            sx={{ width: 56, height: 56 }}
          />
        </Grid>
        <Grid item xs>
          <Typography gutterBottom variant="subtitle1" component="div">
            {fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formattedDateTime}
          </Typography>
        </Grid>
      </Grid>
      <CardMedia
        component="img"
        height="140"
        image="/public/images/incidentimage1.png"
        alt="Incident Scene"
        sx={{ mt: 1, mb: 1 }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {incident?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {incident?.location}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <IconButton aria-label="like" color="primary">
            <ThumbUpIcon />
            <span>10</span>
          </IconButton>
          <IconButton aria-label="dislike" color="error">
            <ThumbDownIcon />
            <span>5</span>
          </IconButton>
          <IconButton color="default">
            <MapIcon />
            <Typography variant="caption" display="block">
              Go to map
            </Typography>
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;
