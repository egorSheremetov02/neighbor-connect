import * as React from "react";
import {
  Box,
  Button,
  CssBaseline,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SitemarkIcon } from "../Components/CustomIcons";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
  borderRadius: theme.shape.borderRadius * 2,
}));

const SingUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  justifyContent: "center",
  padding: theme.spacing(2),
  background: theme.palette.background.default,
}));

const SingUp = () => {
  const [signError, setSignError] = React.useState("");

  if (sessionStorage.getItem("token")) {
    return <Navigate to="/home" />;
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

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
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();

      if (response.ok) {
        // Redirect to login page after successful registration
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        // Handle validation errors
        setSignError(responseData.detail || "Registeration Failed");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SingUpContainer>
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)", fontWeight: "600" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <FormControl>
              <FormLabel htmlFor="fullName" sx={{ fontSize: "0.875rem" }}>
                Full Name
              </FormLabel>
              <TextField
                id="fullName"
                name="fullName"
                required
                fullWidth
                variant="outlined"
                placeholder="Your Name"
                InputProps={{
                  sx: {
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    height: "40px",
                    fontSize: "14px",
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email" sx={{ fontSize: "0.875rem" }}>
                Email
              </FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                required
                fullWidth
                variant="outlined"
                placeholder="your@email.com"
                InputProps={{
                  sx: {
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    height: "40px",
                    fontSize: "14px",
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="login" sx={{ fontSize: "0.875rem" }}>
                Login
              </FormLabel>
              <TextField
                id="login"
                name="login"
                required
                fullWidth
                variant="outlined"
                placeholder="Login"
                InputProps={{
                  sx: {
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    height: "40px",
                    fontSize: "14px",
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password" sx={{ fontSize: "0.875rem" }}>
                Password
              </FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                required
                fullWidth
                variant="outlined"
                placeholder="••••••"
                InputProps={{
                  sx: {
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    height: "40px",
                    fontSize: "14px",
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="address" sx={{ fontSize: "0.875rem" }}>
                Address
              </FormLabel>
              <TextField
                id="address"
                name="address"
                required
                fullWidth
                variant="outlined"
                placeholder="Your Address"
                InputProps={{
                  sx: {
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    height: "40px",
                    fontSize: "14px",
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="birthday" sx={{ fontSize: "0.875rem" }}>
                Birthday
              </FormLabel>
              <TextField
                id="birthday"
                name="birthday"
                type="date"
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  sx: {
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    height: "40px",
                    fontSize: "14px",
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="additionalInfo" sx={{ fontSize: "0.875rem" }}>
                Additional Info
              </FormLabel>
              <TextField
                id="additionalInfo"
                name="additionalInfo"
                // multiline
                rows={3}
                fullWidth
                variant="outlined"
                placeholder="Additional information"
                InputProps={{
                  sx: {
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    height: "40px",
                    fontSize: "14px",
                  },
                }}
              />
            </FormControl>
            {signError && <p>{signError}</p>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ padding: "10px 0", borderRadius: "8px" }}
            >
              Sign up
            </Button>
            <Typography sx={{ textAlign: "center", mt: 2 }}>
              Already have an account?{" "}
              <Link href="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SingUpContainer>
    </>
  );
};

export default SingUp;
