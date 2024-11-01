import React, { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  FormLabel,
  FormControl,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  maxWidth: "450px",
  margin: "auto",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
  borderRadius: theme.shape.borderRadius * 2,
}));

const ResetPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      login: location.state?.login,
      code: event.target.elements.code?.value,
      new_password: event.target.elements.new_password?.value,
    };

    // Check for missing fields
    if (!formData.login || !formData.code || !formData.new_password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      // Ensure the correct URL endpoint and JSON content type
      const response = await fetch("http://localhost:8080/auth/change_password_with_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccessMessage("Password changed successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setErrorMessage(
          typeof responseData.detail === "string"
            ? responseData.detail
            : "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack minHeight="100vh" alignItems="center" justifyContent="center" padding={2}>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" fontWeight="600">
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
            <FormControl fullWidth margin="normal">
              <FormLabel htmlFor="code">Verification Code</FormLabel>
              <TextField
                id="code"
                name="code"
                required
                fullWidth
                variant="outlined"
                placeholder="Enter the code sent to your email"
                inputProps={{ 'aria-labelledby': 'code-label' }}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel htmlFor="new_password">New Password</FormLabel>
              <TextField
                id="new_password"
                name="new_password"
                type="password"
                required
                fullWidth
                variant="outlined"
                placeholder="Enter your new password"
                inputProps={{ 'aria-labelledby': 'new-password-label' }}
              />
            </FormControl>

            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            {successMessage && <Typography color="success.main">{successMessage}</Typography>}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Verify Code
            </Button>
          </Box>
        </Card>
      </Stack>
    </>
  );
};

export default ResetPassword;
