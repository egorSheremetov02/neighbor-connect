import React, { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  CssBaseline,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../auth/index'; // Import useAuth hook

const defaultTheme = createTheme();

export default function SignIn() {
  const [error, setError] = useState('');
  const { setToken } = useAuth(); // Access setToken function from useAuth

  if (sessionStorage.getItem('token')) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', event.target.elements.email.value);
    formData.append('password', event.target.elements.password.value);
    formData.append('grant_type', ''); // Required field, can be empty
    formData.append('client_id', ''); // Required field, can be empty
    formData.append('client_secret', ''); // Required field, can be empty

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.access_token)
        setToken(responseData.access_token); // Set the authentication token
        setError('');
        // Redirect to home page after successful login
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        const responseData = await response.json();
        setError(responseData.detail || 'Login failed');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" className="mt-0">
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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {error && (
              <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
              <Link href="/register" variant="body2" sx={{ ml: 2 }}>
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
