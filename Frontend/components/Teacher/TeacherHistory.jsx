import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Box } from "@mui/material";
import { useParams } from "react-router-dom";

const TeacherHistory = () => {
  const { teacherId } = useParams();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/history/${teacherId}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setHistoryData(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setHistoryData([]);
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
        setHistoryData([]);
      }
    };

    fetchHistory();
  }, [teacherId]);

  // Function to format date and time
  const formatDateTime = (date, time) => {
    const parsedDate = new Date(date);

    if (!isNaN(parsedDate.getTime())) {
      // Format date
      const formattedDate = parsedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let formattedTime = "";
      if (time) {
        const timeParts = time.split(":");
        const hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        formattedTime = `${formattedHours}:${minutes} ${ampm}`;
      }

      return time ? `${formattedDate}, ${formattedTime}` : formattedDate;
    }

    return "Not Available";
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          textAlign: "center",
          color: "#032b63", 
        }}
      >
        Meeting History
      </Typography>

      {historyData.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
          No history found for this teacher.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {historyData.map((entry) => (
            <Grid item xs={12} key={entry._id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", color: "#032b63" }}
                >
                  Booking ID: {entry._id}
                </Typography>
                <Typography variant="body2">
                  <strong>Username:</strong> {entry.username}
                </Typography>
                <Typography variant="body2">
                  <strong>Date & Time:</strong>{" "}
                  {formatDateTime(entry.date, entry.time)}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {entry.status}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TeacherHistory;
