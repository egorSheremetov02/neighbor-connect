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
      login: location.state?.login, // Use login from state passed in navigation
      code: event.target.elements.code.value,
      new_password: event.target.elements.new_password.value,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/login_with_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();

      if (response.ok) {
        setSuccessMessage("Your password has been reset successfully!");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setErrorMessage(responseData.detail || "Failed to reset password.");
      }
    } catch (error) {
      setErrorMessage("Network error.");
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
              <FormLabel>Reset Code</FormLabel>
              <TextField
                id="code"
                name="code"
                required
                fullWidth
                variant="outlined"
                placeholder="Enter the code sent to your email"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>New Password</FormLabel>
              <TextField
                id="new_password"
                name="new_password"
                type="password"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>

            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            {successMessage && <Typography color="success.main">{successMessage}</Typography>}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Reset Password
            </Button>
          </Box>
        </Card>
      </Stack>
    </>
  );
};

export default ResetPassword;
