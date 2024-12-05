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
    const authToken = token.replace(/^"|"$/g, "");

    const dataToSubmit = {
      offer_id: formData.offer_id,
      title: formData.title,
      description: formData.description,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      date: new Date().toISOString(),
      image_id: formData.image_id || null,
    };

    // console.log(dataToSubmit, `Bearer ${authToken}`);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL_PROD}/offers/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update offer: ${errorMessage}`);
      }

      onEditSuccess();
      onClose();
    } catch (error) {
      console.error("Error editing offer:", error.message);
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
            color: "white",
            background: "#6363ab",
            fontSize: "10px",
            "&:hover": {
              color: "white",
              background: "#6363ab",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            color: "white",
            background: "#6363ab",
            fontSize: "10px",
            "&:hover": {
              color: "white",
              background: "#6363ab",
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
