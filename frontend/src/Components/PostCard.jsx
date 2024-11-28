import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Stack,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
// import ShareIcon from "@mui/icons-material/Share";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import incident_img from "../../public/images/incident.webp";
import offer_img from "../../public/images/offer.jpg";
import EditOfferModal from "./EditOfferModal";
import Box from "@mui/material/Box";
import EditIncidentModal from "./EditIncidentModal";
import DeleteModal from "./DeleteModal";
import TagsListComponent from "./TagsListComponent.jsx";
import { formatDate } from "../assets/functions";

const PostCard = ({ props, onTagToggle, is_admin }) => {
  const {
    title,
    description,
    author_id,
    date,
    created_at,
    location,
    tags,
    id,
    status,
  } = props;

  const dateFormatted = formatDate(date || created_at);
  const type = tags ? "offer" : "incident";
  const ismypost = sessionStorage.getItem("myid") == author_id;
  const token = sessionStorage.getItem("TOKEN");

  const [expanded, setExpanded] = useState(false);
  const [editOfferModalOpen, setEditOfferModalOpen] = useState(false);
  const [editIncidentModalOpen, setEditIncidentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [authorData, setAuthorData] = useState();
  const [liked, setLiked] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    if (type === "offer") {
      setEditOfferModalOpen(true);
    } else {
      setEditIncidentModalOpen(true);
    }
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteModalOpen(true);
  };

  const handleEditSuccess = () => {
    window.location.reload();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/users/users/${author_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${token.substring(1, token.length - 1)}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setAuthorData(data);
        } else {
          setError("Error fetching profile");
        }
      } catch (error) {
        setError("Error fetching profile", error);
      }
    };

    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/${
            type === "offer" ? "offers" : "incidents"
          }/${id}/vote`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "bearer " + token.substring(1, token.length - 1),
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setLiked(data.is_liked);
        } else {
          console.error("Error fetching like status");
        }
      } catch (error) {
        console.error("Error fetching like status", error);
      }
    };

    fetchProfile();
    fetchLikeStatus();
  }, []);

  const handleLikeToggle = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/${
          type === "offer" ? "offers" : "incidents"
        }/${id}/vote`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "bearer " + token.substring(1, token.length - 1),
          },
          body: JSON.stringify({ vote: liked ? "dislike" : "like" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (type === "offer") {
        const response = await fetch(`http://localhost:8080/offers`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "bearer " + token.substring(1, token.length - 1),
          },
          body: JSON.stringify({ offer_id: id }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete offer");
        }
      } else {
        const response = await fetch(`http://localhost:8080/incidents/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: "bearer " + token.substring(1, token.length - 1),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete incident");
        }
      }

      setDeleteModalOpen(false);
      handleEditSuccess();
      // Logic to refresh or update the state after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleVerifyIncident = async (incident_id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/incidents/${incident_id}/authorize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "bearer " + token.substring(1, token.length - 1),
          },
          body: JSON.stringify({
            status: "confirmed",
          }),
        }
      );
      if (!response.ok) {
        setError(`HTTP error! Status: ${response.status}`);
        return [];
      }
      window.location.reload();
    } catch (error) {
      setError("Error marking incident as spam.");
      console.error(error);
      return [];
    }
  };

  const handleSpamIncident = async (incident_id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/incidents/${incident_id}/authorize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "bearer " + token.substring(1, token.length - 1),
          },
          body: JSON.stringify({
            status: "hidden",
          }),
        }
      );
      if (!response.ok) {
        setError(`HTTP error! Status: ${response.status}`);
        return [];
      }
      window.location.reload();
    } catch (error) {
      setError("Error marking incident as spam.");
      console.error(error);
      return [];
    }
  };

  const postcardActions = () => {
    if (is_admin && status != "confirmed") {
      return (
        <Stack
          spacing={2}
          direction="row"
          justifyContent="center"
          sx={{ mb: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => handleVerifyIncident(id)}
            sx={{
              color: "black",
              background: "#e2e2e2",
              fontSize: "14px",
              "&:hover": {
                background: "#e2e2e2",
              },
            }}
          >
            Verify
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSpamIncident(id)}
            sx={{
              color: "black",
              background: "#e2e2e2",
              fontSize: "14px",
              "&:hover": {
                background: "#e2e2e2",
              },
            }}
          >
            Spam
          </Button>
        </Stack>
      );
    } else {
      return (
        <CardActions>
          <IconButton aria-label="add to favorites" onClick={handleLikeToggle}>
            <FavoriteIcon sx={{ color: liked ? "red" : "inherit" }} />
          </IconButton>
          {/* <IconButton aria-label="share">
            <ShareIcon />
          </IconButton> */}
          {/* <IconButton
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{ marginLeft: "auto" }}
          >
            <ExpandMoreIcon />
          </IconButton> */}
        </CardActions>
      );
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 360, backgroundColor: "#e2e2e2", height: "100%" }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: "#000", cursor: "pointer" }}
              onClick={() => {
                window.location.href = `neighbors/${author_id}`;
              }}
            >
              {authorData?.fullName?.[0]}
            </Avatar>
          }
          action={
            <IconButton onClick={handleMenuOpen}>
              {ismypost && <MoreVertIcon />}
            </IconButton>
          }
          title={
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          }
          subheader={
            <Typography variant="body1" fontSize={"12px"}>
              {dateFormatted}
            </Typography>
          }
        />
        <CardMedia
          component="img"
          height="194"
          image={tags ? offer_img : incident_img}
          alt="post image"
        />
        <CardContent>
          <Stack
            direction={"row"}
            sx={{
              alignItems: "center",
              marginBottom: "10px",
              fontStyle: "italic",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
            {tags && (
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TagsListComponent tags={tags} />
              </Stack>
            )}
          </Stack>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
        {postcardActions()}
        {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Details...</Typography>
          </CardContent>
        </Collapse> */}
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      <EditOfferModal
        open={editOfferModalOpen}
        onClose={() => setEditOfferModalOpen(false)}
        offer={props}
        onEditSuccess={handleEditSuccess}
      />

      <EditIncidentModal
        open={editIncidentModalOpen}
        onClose={() => setEditIncidentModalOpen(false)}
        incident={props}
        onEditSuccess={handleEditSuccess}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default PostCard;
