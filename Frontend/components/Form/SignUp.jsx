import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Header/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { refreshAuthStatus } = useAuth();
  const [userFormData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/signup",
        userFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success("Signup Successful");

      await refreshAuthStatus();

      navigate("/");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }

    setFormData({
      username: "",
      email: "",
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
        backgroundColor: "#f5f7fb",
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
            fontSize: {
              xs: "1.8rem",
              lg: "2.4rem",
            },
            fontWeight: "700",
            textAlign: "center",
            color: "#023063",
            marginBottom: "1.5rem",
          }}
        >
          Sign Up 
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
            value={userFormData.username}
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
            label="Email"
            name="email"
            type="email"
            value={userFormData.email}
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
            value={userFormData.password}
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
            Sign Up
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#023063",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
