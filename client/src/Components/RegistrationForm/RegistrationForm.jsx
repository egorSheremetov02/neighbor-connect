import React, { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function RegistrationForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      fullName: event.target.elements.fullName.value,
      email: event.target.elements.email.value,
      login: event.target.elements.login.value,
      password: event.target.elements.password.value,
      address: event.target.elements.address.value,
      birthday: event.target.elements.birthday.value,
      additionalInfo: event.target.elements.additionalInfo.value,
    };

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError('');
        // Redirect to login page after successful registration
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setSuccess(false);
        // Handle validation errors
        if (responseData.detail) {
          setError(responseData.detail);
        } else {
          setError('Registration failed');
        }
      }
    } catch (error) {
      setError('Network error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create New Account
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Login"
              name="login"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="address"
              label="Address"
              id="address"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="birthday"
              label="Date of Birth"
              type="date"
              id="birthday"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="additionalInfo"
              label="Additional Info"
              type="text"
              id="additionalInfo"
              multiline
              rows={4}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Account
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography variant="body2" color="success" align="center" sx={{ mt: 1 }}>
              Registration successful. Redirecting to login page...
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default RegistrationForm;
