import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create a Context for authentication
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Function to fetch and update authentication status
  const refreshAuthStatus = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/status",
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(response.data.authenticated);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error refreshing authentication status:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run the function on initial load
  useEffect(() => {
    refreshAuthStatus();
  }, []);

  // Meeting history functions
  const getHistoryOfUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/get_all_activity",
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/add_to_activity",
        { meeting_code: meetingCode },
        { withCredentials: true }
      );
      return response;
    } catch (e) {
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        setIsLoggedIn,
        loading,
        refreshAuthStatus, 
        getHistoryOfUser,
        addToUserHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };
