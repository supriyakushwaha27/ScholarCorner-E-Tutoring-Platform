import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HistoryIcon from "@mui/icons-material/History";

export const TeacherBookings = ({ bookingData, setBookings, teacherId }) => {
  const [meetingCodes, setMeetingCodes] = useState({});
  const navigate = useNavigate();

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return format(date, "hh:mm a");
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const handleHistoryClick = () => {
    navigate(`/teacher-history/${teacherId}`);
  };

  const handleSendMeetingCode = async (bookingId) => {
    const meetingCode = meetingCodes[bookingId];

    if (!meetingCode) {
      toast.error("Please enter a meeting code.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/sendMeetingCode/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ meetingCode }),
        }
      );

      if (response.ok) {
        setMeetingCodes((prevState) => ({
          ...prevState,
          [bookingId]: "",
        }));
        toast.success("Meeting code sent successfully!");
      } else {
        const errorText = await response.text();
        toast.error(`Failed to send meeting code: ${errorText}`);
      }
    } catch (error) {
      toast.error("An error occurred while sending the meeting code.");
    }
  };

  const handleMeetingDone = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/meetingDone/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedBookings = bookingData.filter(
          (booking) => booking._id !== bookingId
        );
        setBookings(updatedBookings);
        toast.success("Meeting marked as done and moved to history!");
      } else {
        const errorText = await response.text();
        toast.error(`Failed to mark meeting as done: ${errorText}`);
      }
    } catch (error) {
      toast.error("An error occurred while marking the meeting as done.");
    }
  };

  const groupByTeacherId = (bookings) => {
    const grouped = {};
    bookings.forEach((booking) => {
      if (!grouped[booking.teacherId]) {
        grouped[booking.teacherId] = [];
      }
      grouped[booking.teacherId].push(booking);
    });
    return grouped;
  };

  const groupedBookings = groupByTeacherId(bookingData);

  return (
    <div>
      <IconButton onClick={handleHistoryClick}>
        <HistoryIcon />
      </IconButton>

      {!bookingData || bookingData.length === 0 ? (
        <Typography>No bookings found.</Typography>
      ) : (
        Object.entries(groupedBookings).map(([teacherId, bookings]) => (
          <div key={teacherId}>
            {bookings.map((booking) => (
              <Card
                sx={{
                  mb: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  border: "1px solid lightgrey",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
                key={booking._id}
              >
                {/* Top Section: Avatar and Name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      bgcolor: "#1976d2",
                      width: 50,
                      height: 50,
                      fontSize: "1.5rem",
                    }}
                    alt={booking.userName}
                  >
                    {booking.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333", flex: 1 }}
                  >
                    {booking.userName}
                  </Typography>
                </div>

                {/* Details Section */}
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    padding: "0",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    <strong>Booking ID:</strong> {booking._id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Date:</strong> {formatDate(booking.date)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Time:</strong> {formatTime(booking.time)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          booking.status === "confirmed"
                            ? "green"
                            : booking.status === "cancelled"
                            ? "red"
                            : "#333",
                      }}
                    >
                      {booking.status}
                    </span>
                  </Typography>
                </CardContent>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem", // Space between buttons
                  }}
                >
                  {booking.status === "confirmed" && (
                    <>
                      <TextField
                        label="Meeting Code"
                        variant="outlined"
                        size="small"
                        value={meetingCodes[booking._id] || ""}
                        onChange={(e) =>
                          setMeetingCodes((prevState) => ({
                            ...prevState,
                            [booking._id]: e.target.value,
                          }))
                        }
                        sx={{ flex: 1 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSendMeetingCode(booking._id)}
                      >
                        Send Code
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleMeetingDone(booking._id)}
                      >
                        Mark as Done
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ))
      )}
    </div>
  );
};
