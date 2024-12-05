import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const DeleteModal = ({ open, onClose, onDeleteConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>Are you sure you want to delete this item?</DialogContent>
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
          onClick={onDeleteConfirm}
          color="error"
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
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
