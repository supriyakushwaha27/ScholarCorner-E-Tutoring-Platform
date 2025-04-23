import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../Header/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const parseAvailability = (daysString, timeString) => {
  const daysMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  try {
    const [startDayStr, endDayStr] = daysString.toLowerCase().split(" to ");
    const startDay = daysMap[startDayStr.trim()];
    const endDay = daysMap[endDayStr.trim()];

    const [startTimeStr, endTimeStr] = timeString.replace(/\s+/g, "").split("-");
    const parseTime = (str) => {
      const match = str.match(/^(\d{1,2})(am|pm)$/i);
      if (!match) return null;
      let [_, hour, period] = match;
      hour = parseInt(hour, 10);
      if (period.toLowerCase() === "pm" && hour !== 12) hour += 12;
      if (period.toLowerCase() === "am" && hour === 12) hour = 0;
      return hour;
    };

    const startHour = parseTime(startTimeStr);
    const endHour = parseTime(endTimeStr);

    return { startDay, endDay, startHour, endHour };
  } catch {
    return null;
  }
};

const validateDateTime = (dateTime, availability) => {
  if (!availability) return false;

  const day = dayjs(dateTime).day();
  const hour = dayjs(dateTime).hour();

  const isDayValid =
    availability.startDay <= availability.endDay
      ? day >= availability.startDay && day <= availability.endDay
      : day >= availability.startDay || day <= availability.endDay;

  const isHourValid = hour >= availability.startHour && hour < availability.endHour;

  return isDayValid && isHourValid;
};

const BookSession = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/teachers/${id}/show`);
        setTeacher(res.data);
      } catch {
        toast.error("Failed to fetch teacher data");
      }
    };

    fetchTeacher();
  }, [id]);

  const handleBookSession = async () => {
    if (!dateTime || !dayjs(dateTime).isValid()) {
      setMessage("Please select a valid date and time.");
      return;
    }

    const availability = parseAvailability(teacher.availability?.days, teacher.availability?.time);
    if (!validateDateTime(dateTime, availability)) {
      setMessage("Selected date/time is outside the teacher's availability.");
      return;
    }

    const payload = {
      teacherId: teacher.teacherId._id,
      studentId: user._id,
      date: dayjs(dateTime).format("YYYY-MM-DD"),
      time: dayjs(dateTime).format("HH:mm"),
      userName: user.username,
      teacherName: teacher.fullName,
      price: teacher.pricing,
    };

    try {
      const res = await axios.post("http://localhost:3000/book-session", payload);
      const bookingId = res.data?.booking?._id;
      if (!bookingId) throw new Error("Missing booking ID");

      toast.success("Session booked! Redirecting to payment...");
      navigate(`/payment/${bookingId}`);
    } catch (err) {
      setMessage("Failed to book session. Please try again.");
    }
  };

  return (
    
    <Box sx={{ display: "flex", justifyContent: "center", mt: 15,mb:10, px: 2 }}>
      <Card sx={{ maxWidth: 600, width: "100%", p: 3, boxShadow: 5, borderRadius: 4 }}>
        <CardContent>
          {teacher ? (
            <>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Book a <span style={{ color: "#0B60B0" }}>Session</span> with{" "}
                <span style={{ color: "#0B60B0" }}>{teacher.fullName}</span>
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                <strong>Availability:</strong>{" "}
                {teacher.availability?.days || "N/A"} | {teacher.availability?.time || "N/A"}
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Select Date & Time"
                  value={dateTime}
                  onChange={setDateTime}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth sx={{ mt: 2 }} />
                  )}
                />
              </LocalizationProvider>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.2, fontWeight: "bold", backgroundColor: "#0B60B0" }}
                onClick={handleBookSession}
              >
                Confirm Booking
              </Button>

              {message && (
                <Alert severity={message.includes("success") ? "success" : "error"} sx={{ mt: 2 }}>
                  {message}
                </Alert>
              )}
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookSession;
