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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// Define validation schema with zod
const validationSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  login: z.string().min(1, "Login is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/\d/, "Password must include at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character"
    ),
  permanent_address: z.string().min(1, "Address is required"),
});

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
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const password = watch("password", "");

  const passwordStatus = passwordRequirements.map((requirement) =>
    requirement.test(password)
  );

  const onSubmit = async (formData) => {
    console.log(formData);
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
        setSignError(responseData.detail || "Registration Failed");
      }
    } catch (error) {
      setSignError("Network error");
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
            onSubmit={handleSubmit(onSubmit)}
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
                {...register("fullName")}
                id="fullName"
                name="fullName"
                required
                fullWidth
                variant="outlined"
                placeholder="Your Name"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
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
                {...register("email")}
                id="email"
                name="email"
                type="email"
                required
                fullWidth
                variant="outlined"
                placeholder="your@email.com"
                error={!!errors.email}
                helperText={errors.email?.message}
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
                {...register("login")}
                id="login"
                name="login"
                required
                fullWidth
                variant="outlined"
                placeholder="Login"
                error={!!errors.login}
                helperText={errors.login?.message}
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
                {...register("password")}
                id="password"
                name="password"
                type="password"
                required
                fullWidth
                variant="outlined"
                placeholder="••••••"
                error={!!errors.password}
                helperText={errors.password?.message}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(password !== "")}
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

            {(isPasswordFocused || password) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Password must meet the following criteria:
                </Typography>
                {passwordRequirements.map((req, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {passwordStatus[index] ? (
                      <CheckIcon color="success" fontSize="small" />
                    ) : (
                      <CloseIcon color="error" fontSize="small" />
                    )}
                    <Typography
                      variant="body2"
                      sx={{ ml: 1 }}
                      color={
                        passwordStatus[index] ? "success.main" : "error.main"
                      }
                    >
                      {req.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <FormControl>
              <FormLabel
                htmlFor="permanent_address"
                sx={{ fontSize: "0.875rem" }}
              >
                Permanent Address
              </FormLabel>
              <TextField
                {...register("permanent_address")}
                id="permanent_address"
                name="permanent_address"
                required
                fullWidth
                variant="outlined"
                placeholder="Your Address"
                error={!!errors.address}
                helperText={errors.address?.message}
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

            {signError && (
              <p className="text-center text-red-500">{signError}</p>
            )}

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
