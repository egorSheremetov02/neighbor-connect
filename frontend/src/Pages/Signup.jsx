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
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

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
  const [suggestions, setSuggestions] = React.useState([]);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(validationSchema),
  });
  const password = watch("password", "");
  const passwordStatus = passwordRequirements.map((requirement) =>
    requirement.test(password)
  );

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/suggestions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  };

  const handleFeedback = async (suggestionId, feedback) => {
    try {
      await fetch(`http://localhost:8080/api/suggestions/${suggestionId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
      fetchSuggestions(); // Refresh suggestions after feedback
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  React.useEffect(() => {
    fetchSuggestions();
    const interval = setInterval(fetchSuggestions, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (response.ok) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
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
          <Typography component="h1" variant="h4" sx={{ fontWeight: "600" }}>
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            {/* Form Fields */}
            {/* ... (all form fields here, no change needed) */}

            {signError && <p className="text-center text-red-500">{signError}</p>}

            <Button type="submit" fullWidth variant="contained" sx={{ padding: "10px 0", borderRadius: "8px" }}>
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

        {/* AI Suggestions Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Suggested for You
          </Typography>
          {suggestions.map((suggestion) => (
            <MuiCard key={suggestion.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, mb: 2 }}>
              <Typography variant="body1">{suggestion.content}</Typography>
              <Box>
                <Button onClick={() => handleFeedback(suggestion.id, "like")} sx={{ mr: 1 }}>
                  <ThumbUpIcon />
                </Button>
                <Button onClick={() => handleFeedback(suggestion.id, "dislike")}>
                  <ThumbDownIcon />
                </Button>
              </Box>
            </MuiCard>
          ))}
        </Box>
      </SingUpContainer>
    </>
  );
};

export default SingUp;
