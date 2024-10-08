import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const EditOfferModal = ({ open, onClose, offer, onEditSuccess }) => {
  const [formData, setFormData] = useState({
    offer_id: offer?.id || "",
    title: offer?.title || "",
    description: offer?.description || "",
    tags: offer?.tags?.[0] || "",
    date: new Date(),
    image_id: 0,
  });

  const token = sessionStorage.getItem("TOKEN");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const dataToSubmit = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()), // split and trim tags
    };

    console.log(dataToSubmit);

    try {
      const response = await fetch("http://localhost:8080/offers/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token.substring(1, token.length - 1),
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to update offer");
      }

      onEditSuccess();
      onClose();
    } catch (error) {
      console.error("Error editing offer:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <DialogTitle>Edit Offer</DialogTitle>
      <DialogContent>
        <DialogContentText>Update the offer details below.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          fullWidth
          value={formData.title}
          onChange={handleChange}
          required
          InputProps={{
            sx: {
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              height: "40px",
              fontSize: "14px",
            },
          }}
          InputLabelProps={{
            sx: {
              fontSize: "14px",
            },
          }}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          multiline
          value={formData.description}
          onChange={handleChange}
          required
          InputProps={{
            sx: {
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              height: "40px",
              fontSize: "14px",
            },
          }}
          InputLabelProps={{
            sx: {
              fontSize: "14px",
            },
          }}
        />
        <TextField
          margin="dense"
          name="tags"
          label="Tags"
          fullWidth
          value={formData.tags}
          onChange={handleChange}
          required
          InputProps={{
            sx: {
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              height: "40px",
              fontSize: "14px",
            },
          }}
          InputLabelProps={{
            sx: {
              fontSize: "14px",
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "black",
            background: "#e2e2e2",
            fontSize: "10px",
            "&:hover": {
              background: "#e2e2e2",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            color: "black",
            background: "#e2e2e2",
            fontSize: "10px",
            "&:hover": {
              background: "#e2e2e2",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOfferModal;
