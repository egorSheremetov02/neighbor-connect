import React, { useState } from "react";
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
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import img_source from "../../public/images/fast_food.png";
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
  } = props;

  const dateFormatted = formatDate(date || created_at);
  const type = tags ? "offer" : "incident";
  const token = sessionStorage.getItem("TOKEN");

  const [expanded, setExpanded] = useState(false);
  const [editOfferModalOpen, setEditOfferModalOpen] = useState(false);
  const [editIncidentModalOpen, setEditIncidentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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

  return (
    <>
      <Card sx={{ maxWidth: 360, backgroundColor: "#e2e2e2", height: "100%" }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
          action={
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
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
          image={img_source}
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
                <Typography variant="body2" color="text.secondary">
                  {tags[0]}
                </Typography>
              </Stack>
            )}
          </Stack>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
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
