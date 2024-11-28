import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const passwordRequirements = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "At least one uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "At least one lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "At least one number", test: (pw) => /\d/.test(pw) },
  {
    label: "At least one special character",
    test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
];

const ChangePasswordModal = ({ open, handleClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const passwordStatus = useMemo(
    () =>
      passwordRequirements.map((requirement) => requirement.test(newPassword)),
    [newPassword]
  );

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match.",
        severity: "error",
      });
      return;
    }

    if (!passwordStatus.every((status) => status)) {
      setSnackbar({
        open: true,
        message: "New password does not meet all requirements.",
        severity: "error",
      });
      return;
    }

    setLoading(true);

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

      setLoading(false);

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Password changed successfully.",
          severity: "success",
        });
        handleClose();
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || "Error changing password.",
          severity: "error",
        });
      }
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
      console.error("Password change error:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="change-password-title"
    >
      <DialogTitle id="change-password-title">Change Password</DialogTitle>
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
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(newPassword !== "")}
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
        {isPasswordFocused && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Password must meet the following criteria:
            </Typography>
            {passwordRequirements.map((req, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                {passwordStatus[index] ? (
                  <CheckIcon color="success" fontSize="small" />
                ) : (
                  <CloseIcon color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  sx={{ ml: 1 }}
                  color={passwordStatus[index] ? "success.main" : "error.main"}
                >
                  {req.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
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
          disabled={loading}
          sx={{
            color: "black",
            background: "#e2e2e2",
            fontSize: "10px",
            "&:hover": {
              background: "#d0d0d0",
            },
          }}
        >
          {loading ? "Processing..." : "Change Password"}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ChangePasswordModal;
