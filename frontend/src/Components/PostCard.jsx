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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import incident_img from "../../public/images/incident.webp";
import offer_img from "../../public/images/offer.jpg";
import EditOfferModal from "./EditOfferModal";
import EditIncidentModal from "./EditIncidentModal";
import DeleteModal from "./DeleteModal";

import { formatDate } from "../assets/functions";

const PostCard = ({ props }) => {
  const {
    title,
    description,
    author_id,
    date,
    created_at,
    location,
    tags,
    id,
    image,
  } = props;

  const dateFormatted = formatDate(date || created_at);
  const type = tags ? "offer" : "incident";
  const ismypost = sessionStorage.getItem("myid") === author_id;
  const token = sessionStorage.getItem("TOKEN");

  const [expanded, setExpanded] = useState(false);
  const [editOfferModalOpen, setEditOfferModalOpen] = useState(false);
  const [editIncidentModalOpen, setEditIncidentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [authorData, setAuthorData] = useState();
  const [liked, setLiked] = useState(false);
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || ""
  );

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
          setAuthorData(data);
        } else {
          console.error("Error fetching profile");
        }
      } catch (error) {
        console.error("Error fetching profile", error);
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
              Authorization: `bearer ${token.substring(1, token.length - 1)}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
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
  }, [author_id, id, token, type]);

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
            Authorization: `bearer ${token.substring(1, token.length - 1)}`,
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
      const response = await fetch(
        `${
          type === "offer"
            ? "http://localhost:8080/offers"
            : `http://localhost:8080/incidents/${id}`
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token.substring(1, token.length - 1)}`,
          },
          body: JSON.stringify(type === "offer" ? { offer_id: id } : {}),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      setDeleteModalOpen(false);
      handleEditSuccess();
    } catch (error) {
      console.error("Error deleting item:", error);
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
                window.location.href = `/neighbors/${author_id}`;
              }}
              src={profilePic || undefined}
            >
              {!authorData?.profilePicture && (
                <Typography sx={{ color: "#fff" }}>
                  {authorData?.fullName[0]}
                </Typography>
              )}
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
        {/* <CardMedia
          component="img"
          height="194"
          image={tags ? offer_img : incident_img}
          alt="post image"
        /> */}

        <CardMedia
          component="img"
          height="140"
          image={props.image || (type === "offer" ? offer_img : incident_img)} // Use the uploaded image if available
          alt={title}
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
                <Typography variant="body2" color="text.secondary">
                  {tags[0]}
                </Typography>
              </Stack>
            )}
          </Stack>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites" onClick={handleLikeToggle}>
            <FavoriteIcon sx={{ color: liked ? "red" : "inherit" }} />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{ marginLeft: "auto" }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Details...</Typography>
          </CardContent>
        </Collapse>
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
