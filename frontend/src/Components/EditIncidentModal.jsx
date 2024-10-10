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

const EditIncidentModal = ({ open, onClose, incident, onEditSuccess }) => {
  const [formData, setFormData] = useState(incident);
  const token = sessionStorage.getItem("TOKEN");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/incidents/${incident.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "bearer " + token.substring(1, token.length - 1),
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update incident");
      }

      onEditSuccess();
      onClose();
    } catch (error) {
      console.error("Error editing incident:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <DialogTitle>Edit Incident</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the incident details below.
        </DialogContentText>
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
          name="location"
          label="Location"
          fullWidth
          value={formData.location}
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

export default EditIncidentModal;
