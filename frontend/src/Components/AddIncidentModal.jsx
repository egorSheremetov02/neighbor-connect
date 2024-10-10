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

const AddIncidentModal = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = sessionStorage.getItem("TOKEN");

  const handleAddIncident = () => {
    const incidentData = {
      title,
      description,
      location,
      date,
      created_at: new Date().toISOString(),
    };

    fetch("http://localhost:8080/incidents/", {
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
        return response.json();
      })
      .then((data) => {
        onClose(); // Close modal on success
        window.location.reload();
      })
      .catch((error) => {
        setErrorMessage("Error: " + error.message);
      });
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
              color: "black",
              background: "#e2e2e2",
              fontSize: "10px",
              "&:hover": {
                background: "#e2e2e2",
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
