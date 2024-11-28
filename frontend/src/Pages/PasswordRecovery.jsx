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
import { useNavigate } from "react-router-dom";

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

const RequestResetCode = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const login = event.target.elements.login.value;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL_PROD}/auth/forget_password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login }),
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        navigate("/passwordreset", { state: { login } });
      } else {
        setErrorMessage(responseData.detail || "Failed to send reset code.");
      }
    } catch (error) {
      setErrorMessage("Network error.");
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        <Card variant="outlined">
          <Typography component="h2" variant="h4" fontWeight="600">
            Request Code
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
          >
            <FormControl fullWidth margin="normal">
              <FormLabel htmlFor="login">Login (Username or Email)</FormLabel>
              <TextField
                id="login"
                name="login"
                required
                fullWidth
                variant="outlined"
                placeholder="Enter your login or email"
                inputProps={{ "aria-labelledby": "login-label" }}
              />
            </FormControl>

            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Send Reset Code
            </Button>
          </Box>
        </Card>
      </Stack>
    </>
  );
};

export default RequestResetCode;
