import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const EditProfileModal = ({
  open,
  handleClose,
  editData,
  handleInputChange,
  handleSave,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update your profile details below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="fullName"
          label="Full Name"
          fullWidth
          value={editData.fullName}
          onChange={handleInputChange}
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
          name="permanent_address"
          label="Permanent Address"
          fullWidth
          value={editData.permanent_address}
          onChange={handleInputChange}
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
          name="current_address"
          label="Current Address"
          fullWidth
          value={editData.current_address}
          onChange={handleInputChange}
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
          name="phone_number"
          label="Phone Number"
          fullWidth
          value={editData.phone_number}
          onChange={handleInputChange}
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
          name="bio_header"
          label="Status header"
          fullWidth
          value={editData.bio_header}
          onChange={handleInputChange}
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
          name="bio_description"
          label="Bio Description"
          fullWidth
          value={editData.bio_description}
          onChange={handleInputChange}
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
          name="interests"
          label="Interests"
          fullWidth
          value={editData.interests}
          onChange={handleInputChange}
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
          name="birthday"
          type="date"
          fullWidth
          value={editData.birthday}
          onChange={handleInputChange}
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
          name="gender"
          label="Gender"
          fullWidth
          value={editData.gender}
          onChange={handleInputChange}
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
          onClick={handleClose}
          sx={{
            color: "black",
            background: "#e2e2e2",
            fontSize: "10px",
            "&:hover": {
              background: "#d0d0d0",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            color: "black",
            background: "#e2e2e2",
            fontSize: "10px",
            "&:hover": {
              background: "#d0d0d0",
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
