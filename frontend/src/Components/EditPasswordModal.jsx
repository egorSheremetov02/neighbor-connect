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

const ChangePasswordModal = ({ open, handleClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const token = sessionStorage.getItem("TOKEN");
      const data = {
        old_password: currentPassword,
        new_password: newPassword,
      };
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL_PROD}/users/change_password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token.substring(1, token.length - 1)}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Password changed successfully");
        handleClose();
      } else {
        alert("Error changing password");
      }
    } catch (error) {
      console.error("Password change error:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter your current and new password to change it.
        </DialogContentText>
        <TextField
          margin="dense"
          label="Current Password"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
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
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          label="Confirm New Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          onClick={handlePasswordChange}
          color="primary"
          sx={{
            color: "black",
            background: "#e2e2e2",
            fontSize: "10px",
            "&:hover": {
              background: "#d0d0d0",
            },
          }}
        >
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal;
