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
import { Navigate } from "react-router-dom";

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

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  justifyContent: "center",
  padding: theme.spacing(2),
  background: theme.palette.background.default,
}));

const SignIn = () => {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [signError, setSignError] = React.useState("");

  console.log(sessionStorage.getItem("TOKEN"));

  if (sessionStorage.getItem("TOKEN")) {
    return <Navigate to="/home" />;
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (emailError || passwordError) {
      return;
    }

    const formData = new URLSearchParams();
    formData.append("username", event.target.elements.email.value);
    formData.append("password", event.target.elements.password.value);
    formData.append("grant_type", ""); // Required field, can be empty
    formData.append("client_id", ""); // Required field, can be empty
    formData.append("client_secret", ""); // Required field, can be empty

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.access_token);
        sessionStorage.setItem(
          "TOKEN",
          JSON.stringify(responseData.access_token)
        );
        sessionStorage.setItem("myid", JSON.stringify(responseData.user_id));
        window.location.href = "/home";
      } else {
        const responseData = await response.json();
        setSignError(responseData.detail || "Login failed");
      }
    } catch (error) {
      setSignError("Network error");
    }
  };

  // Input validation function
  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286]">
      <CssBaseline enableColorScheme />
      <SignInContainer>
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)", fontWeight: "600" }}
          >
            Sign in
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
              <FormLabel htmlFor="email" sx={{ fontSize: "0.875rem" }}>
                Email
              </FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <FormLabel htmlFor="password" sx={{ fontSize: "0.875rem" }}>
                  Password
                </FormLabel>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
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
              onClick={validateInputs}
              sx={{ padding: "10px 0", borderRadius: "8px" }}
            >
              Sign in
            </Button>
            <Typography sx={{ textAlign: "center", mt: 2 }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" variant="body2">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </div>
  );
};

export default SignIn;
