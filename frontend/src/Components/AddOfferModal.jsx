import React, { useState } from "react";
import { Modal, Box, Button, Typography, TextField } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const AddOfferModal = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);
  const token = sessionStorage.getItem("TOKEN");

  const handleAddOffer = () => {
    const offerData = {
      title,
      description,
      tags: [tag],
      date,
      image,
    };

    // console.log(offerData);

    fetch(`${import.meta.env.VITE_BASE_URL_PROD}/offers/`, {
      method: "POST",
      headers: {
        Authorization: "bearer " + token.substring(1, token.length - 1),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offerData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add offer");
        }
        window.location.reload();
        return response.json();
      })
      .then((data) => {
        onClose(); // Close modal on success
      })
      .catch((error) => {
        setErrorMessage("Error: " + error.message);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <Box sx={modalStyle}>
        <Typography variant="h6">Add Offer</Typography>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
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
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
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
          label="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          fullWidth
          margin="normal"
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
        {/* <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
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
        /> */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: "16px", display: "block" }}
        />
        {image && (
          <Box sx={{ marginTop: "8px" }}>
            <img
              src={image}
              alt="Offer preview"
              style={{ width: "100%", borderRadius: "8px", maxHeight: "200px", objectFit: "cover" }}
            />
          </Box>
        )}
        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={handleAddOffer}
            variant="contained"
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
            Add Offer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddOfferModal;
