import React, { useEffect, useRef } from "react";
import Teacher from "./Teacher";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AuthCheck = () => {
  const isAuthenticated = useLoaderData();
  const navigate = useNavigate();
  const toastShown = useRef(false);

  useEffect(() => {
    if (isAuthenticated === false && !toastShown.current) {
      toast.error("You need to login to access this page");
      toastShown.current = true;
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null || isAuthenticated === undefined) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Teacher /> : <div>You are not authenticated</div>;
};

export default AuthCheck;

export const authLoader = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/auth/status", {
      withCredentials: true,
    });
    console.log("Authentication response:", response.data);
    return response.data.authenticated;
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};
