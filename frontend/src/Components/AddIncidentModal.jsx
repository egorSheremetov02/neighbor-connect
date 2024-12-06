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

const AddIncidentModal = ({ open, onClose, onImageUpload }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [photo, setPhoto] = useState(null);
  const [image, setImage] = useState(null);
  const token = sessionStorage.getItem("TOKEN");
  const [tag, setTag] = useState("");
  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setPhoto(reader.result);
  //       onImageUpload(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleAddIncident = () => {
    const incidentData = {
      title,
      description,
      location,
      tags: [tag],
      date,
      created_at: new Date().toISOString(),
      image,
    };

    fetch(`${import.meta.env.VITE_BASE_URL_PROD}/incidents/`, {
      method: "POST",
      headers: {
        Authorization: "bearer " + token.substring(1, token.length - 1),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incidentData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add incident");
        }
        window.location.reload();
        return response.json();
      })
      .then((data) => {
        onClose(); // Close modal on success
        // window.location.reload();
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
        <Typography variant="h6">Add Incident</Typography>
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
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
        />
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
            onClick={handleAddIncident}
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
            Add Incident
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddIncidentModal;
