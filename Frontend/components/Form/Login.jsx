import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Header/AuthContext";

export default function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const { refreshAuthStatus } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form data submitted:", loginData);

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        loginData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      toast.success("Login Successful");

      // Refresh the authentication status after a successful login
      await refreshAuthStatus();

      // Navigate to the home page or any other page
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login Failed");
    }

    setLoginData({
      username: "",
      password: "",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "79vh",
        padding: "1rem",
        backgroundColor: "#f4f6f8", 
      }}
    >
      <Paper
        elevation={3} 
        sx={{
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
          borderRadius: "8px",
        }}
      >
        <Typography
          sx={{
            fontSize: "2rem", 
            fontWeight: "700",
            textAlign: "center",
            color: "#023063",
            marginBottom: "1.5rem",
            whiteSpace: "nowrap", 
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Login 
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <TextField
            label="Username"
            name="username"
            type="text"
            value={loginData.username}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              sx: {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={loginData.password}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              sx: {
                borderRadius: "8px",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#023063",
              color: "#ffffff",
              padding: "0.8rem",
              fontSize: "1rem",
              fontWeight: "600",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#012a4a",
              },
            }}
          >
            Login
          </Button>
        </form>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "#777",
            marginTop: "1.5rem",
          }}
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            style={{
              color: "#023063",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Sign up
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
