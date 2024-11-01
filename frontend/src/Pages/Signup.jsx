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
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SitemarkIcon } from "../Components/CustomIcons";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Eye icons for show/hide

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
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [password, setPassword] = React.useState(""); // State to hold the password

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const isPasswordStrong = (pw) => {
    return (
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /\d/.test(pw) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(pw)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted with password:", password);
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
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  height: "40px",
                  fontSize: "14px",
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
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  height: "40px",
                  fontSize: "14px",
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
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  height: "40px",
                  fontSize: "14px",
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
                type={isPasswordVisible ? "text" : "password"}
                required
                fullWidth
                variant="outlined"
                placeholder="••••••"
                onChange={handlePasswordChange}
                error={password && !isPasswordStrong(password)} // Show error if password is not strong
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                  sx: {
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    height: "40px",
                    fontSize: "14px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: password
                          ? isPasswordStrong(password)
                            ? "green" // Change border to green when strong
                            : "red"   // Change border to red when weak
                          : "default", // Default border color when empty
                      },
                      "&:hover fieldset": {
                        borderColor: password
                          ? isPasswordStrong(password)
                            ? "green" // Keep green on hover when strong
                            : "red"   // Keep red on hover when weak
                          : "default",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: password
                          ? isPasswordStrong(password)
                            ? "green" // Keep green when focused and strong
                            : "red"   // Keep red when focused and weak
                          : "default",
                      },
                    },
                  },
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel
                htmlFor="permanent_address"
                sx={{ fontSize: "0.875rem" }}
              >
                Permanent Address
              </FormLabel>
              <TextField
                id="permanent_address"
                name="permanent_address"
                required
                fullWidth
                variant="outlined"
                placeholder="Your Address"
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  height: "40px",
                  fontSize: "14px",
                }}
              />
            </FormControl>

            {signError && (
              <p className="text-center text-red-500">{signError}</p>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ padding: "10px 0", borderRadius: "8px" }}
              disabled={!isPasswordStrong(password)} // Disable button if password is not strong
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
