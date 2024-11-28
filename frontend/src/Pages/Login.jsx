import React, { useState } from "react";
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
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [signError, setSignError] = useState("");
  const [twoFARequired, setTwoFARequired] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");

  if (sessionStorage.getItem("TOKEN")) {
    return <Navigate to="/home" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      return;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      return;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const loginUrl = twoFARequired
        ? `${
            import.meta.env.VITE_BASE_URL_PROD
          }/auth/login?auth_2fa_code=${twoFACode}`
        : `${import.meta.env.VITE_BASE_URL_PROD}/auth/login`;

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();
      if (response.ok && data.state !== "2fa") {
        if (data.access_token) {
          sessionStorage.setItem("TOKEN", JSON.stringify(data.access_token));
          sessionStorage.setItem("myid", JSON.stringify(data.user_id));
          sessionStorage.setItem("is_admin", JSON.stringify(data.is_admin));
          window.location.href = "/home";
        }
      } else {
        if (data.state === "2fa") {
          setTwoFARequired(true);
          setSignError(
            "Two-factor authentication required. Please enter the 2FA code."
          );
        } else {
          setSignError(data.detail || "Login failed");
        }
      }
    } catch (error) {
      setSignError("Network error");
    }
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

            <FormControl>
              {twoFARequired && (
                <TextField
                  label="Enter 2FA code"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  required
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    height: "40px",
                    fontSize: "14px",
                  }}
                />
              )}
            </FormControl>

            {signError && <Typography color="error">{signError}</Typography>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ padding: "10px 0", borderRadius: "8px" }}
            >
              Sign in
            </Button>
            <Typography sx={{ textAlign: "center", mt: 2 }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" variant="body2">
                Sign up
              </Link>
              <br></br>
              <Link href="/passwordrecovery" variant="body2">
                Recover password
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </div>
  );
};

export default SignIn;
