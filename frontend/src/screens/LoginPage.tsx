import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Alert, Divider } from "@mui/material";
import { styled } from "@mui/system";
import { supabase } from "../util/supabaseClient";
import { useNavigate } from "react-router-dom";
import loginImageLight from "../assets/mcav_large_white_on_blue.svg";
import loginImageDark from "../assets/mcav_large_white_on_black.svg";
import { useTheme as useCustomTheme } from "../util/ThemeContext";
import { useAuthStore } from "../util/stores/authStore";

const FlexContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "calc(100vh - 200px)",
  minHeight: "500px",
  [theme.breakpoints.down("md")]: {
    height: "calc(100vh - 100px)",
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(30),
  [theme.breakpoints.up("md")]: {
    maxWidth: "50%",
    padding: theme.spacing(10),
  },
}));

const ImageSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const CoverImage = styled("img")({
  width: "100%",
  height: "80%",
  objectFit: "fill",
});

const LoginPage: React.FC = () => {
  const [error, setError] = useState("");
  const authStore = useAuthStore();
  const { darkMode } = useCustomTheme();

  const navigate = useNavigate();

  const handleMonashLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google", // You can replace this with your Monash SSO logic if available
        options: {
          redirectTo: "http://127.0.0.1:80/login",
        },
      });

      if (error) console.error("Error logging in with Monash SSO:", error);
    } catch (error) {
      console.error("OAuth error");
    }
  };

  useEffect(() => {
    // Check for OAuth errors on page load
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    if (error) {
      console.error(`OAuth Error: ${error}, Description: ${errorDescription}`);

      // clearing the url params
      window.history.replaceState({}, document.title, window.location.pathname);

      if (errorDescription === "Database error saving new user") {
        setError(
          "Oops! It looks like you're not using a Monash email. Please sign in with your official Monash University email address.",
        );
      }
    }

    // Check if user is signed in on initial component render
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // authStore
        authStore.initializeAuth();
        // Redirecting user to dashboard if user is signed in
        navigate("/dashboard");
      }
    };

    checkUser();
  }, [navigate]);
  const handleOpenings = () => {
    navigate("/onboarder-openings");
  };

  return (
    <FlexContainer>
      <FormSection>
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to the MCAV Recruitment Platform!
        </Typography>
        <Divider
          orientation="horizontal"
          flexItem
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
          }}
        />
        <Typography component="h1" variant="h5" gutterBottom>
          Log In
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Part of MCAV? Log in with your Monash email to get started.
        </Typography>
        <Button variant="contained" onClick={handleMonashLogin} sx={{ mb: 5 }}>
          LOG IN VIA MONASH SSO
        </Button>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          Want to start your application process? Click below.
        </Typography>
        <Button variant="contained" onClick={handleOpenings}>
          Apply for a position
        </Button>

        {error && (
          <Alert
            severity="error"
            sx={{ mt: 2, width: "100%", justifyContent: "center" }}
          >
            {error}
          </Alert>
        )}
      </FormSection>
      <ImageSection>
        <CoverImage
          src={darkMode ? loginImageDark : loginImageLight}
          alt="Login illustration"
        />
      </ImageSection>
    </FlexContainer>
  );
};

export default LoginPage;
