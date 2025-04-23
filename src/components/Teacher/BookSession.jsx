// // import React, { useState, useEffect } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { Box, Typography, TextField, Button } from "@mui/material";
// // import axios from "axios";
// // import { useAuth } from "../Header/AuthContext";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// // import { toast } from "react-toastify";
// // import dayjs from "dayjs";

// // // Helper function to get day index (Sunday = 0, Monday = 1, ..., Saturday = 6)
// // const getDayIndex = (day) => {
// //   const daysOfWeek = [
// //     "Sunday",
// //     "Monday",
// //     "Tuesday",
// //     "Wednesday",
// //     "Thursday",
// //     "Friday",
// //     "Saturday",
// //   ];
// //   return daysOfWeek.indexOf(day);
// // };

// // // Helper function to convert time string to Date object with 24-hour format
// // const parseTime = (hour, period) => {
// //   let parsedHour = parseInt(hour, 10);

// //   // Normalize the period to uppercase
// //   period = period.toUpperCase();

// //   // If period is "PM", convert the hour to 24-hour format, except for 12 PM
// //   if (period === "PM" && parsedHour !== 12) {
// //     parsedHour += 12;
// //   } else if (period === "AM" && parsedHour === 12) {
// //     parsedHour = 0; // Convert 12 AM to 00:00
// //   }

// //   // Create a Date object representing the time on a dummy date (January 1st, 2000)
// //   const date = new Date(2000, 0, 1, parsedHour, 0, 0);

// //   return date; // Return the Date object
// // };

// // // Function to parse the availability string (days and time range)

// // const parseAvailability = (daysString, timeString) => {
// //   if (!daysString || !timeString) {
// //     console.error("Invalid availability data:", { daysString, timeString });
// //     return null;
// //   }

// //   const daysMap = {
// //     sunday: 0,
// //     monday: 1,
// //     tuesday: 2,
// //     wednesday: 3,
// //     thursday: 4,
// //     friday: 5,
// //     saturday: 6,
// //   };

// //   try {
// //     // Normalize the input to lowercase and handle ranges like "monday to friday"
// //     const daysArray = daysString
// //       .toLowerCase()
// //       .split(" to ")
// //       .map((day) => daysMap[day.trim()]);
// //     if (daysArray.length !== 2 || daysArray.includes(undefined)) {
// //       throw new Error("Invalid days in availability data");
// //     }

// //     const [startDay, endDay] = daysArray;

// //     // Parse the time range from the string (e.g., "12pm-2pm")
// //     const [startTimeStr, endTimeStr] = timeString
// //       .split("-")
// //       .map((time) => time.trim());

// //     // Split the start and end times by the period (AM/PM)
// //     const [startHour, startPeriod] = startTimeStr
// //       .split(/(\d+)/)
// //       .filter(Boolean);
// //     const [endHour, endPeriod] = endTimeStr.split(/(\d+)/).filter(Boolean);

// //     // Convert the times to Date objects
// //     const startTime = parseTime(startHour, startPeriod);
// //     const endTime = parseTime(endHour, endPeriod);

// //     return { startDay, endDay, startTime, endTime };
// //   } catch (error) {
// //     console.error("Error parsing availability:", error);
// //     return null;
// //   }
// // };

// // // Function to validate if the selected date and time fall within the teacher's availability
// // const validateDateTime = (dateTime, availability) => {
// //   if (!availability) return false;

// //   const { startDay, endDay, startTime, endTime } = availability;
// //   const selectedTime = new Date(dateTime);

// //   if (isNaN(selectedTime)) {
// //     console.error("Invalid dateTime:", dateTime);
// //     return false;
// //   }

// //   const selectedDay = selectedTime.getDay(); // Get the day (0-6)
// //   const isDayValid =
// //     startDay <= endDay
// //       ? selectedDay >= startDay && selectedDay <= endDay
// //       : selectedDay >= startDay || selectedDay <= endDay;

// //   const selectedTimeInMinutes =
// //     selectedTime.getHours() * 60 + selectedTime.getMinutes();
// //   const startTimeInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
// //   const endTimeInMinutes = endTime.getHours() * 60 + endTime.getMinutes();

// //   const isTimeValid =
// //     selectedTimeInMinutes >= startTimeInMinutes &&
// //     selectedTimeInMinutes <= endTimeInMinutes;

// //   console.log("Day Validation:", isDayValid);
// //   console.log("Time Validation:", isTimeValid);

// //   return isDayValid && isTimeValid;
// // };

// // const BookSession = () => {
// //   const { id } = useParams();
// //   const { user } = useAuth();
// //   const navigate = useNavigate();

// //   const [teacher, setTeacher] = useState(null);
// //   const [dateTime, setDateTime] = useState(null);
// //   const [message, setMessage] = useState("");

// //   useEffect(() => {
// //     const fetchTeacherData = async () => {
// //       try {
// //         const response = await axios.get(
// //           `http://localhost:3000/teachers/${id}/show`
// //         );
// //         setTeacher(response.data);
// //       } catch (error) {
// //         console.error("Error fetching teacher data:", error);
// //         toast.error("Failed to fetch teacher data.");
// //       }
// //     };

// //     fetchTeacherData();
// //   }, [id]);

// //   const handleBookSession = async () => {
// //     if (!dateTime || !dayjs(dateTime).isValid()) {
// //       setMessage("Please select a valid date and time.");
// //       return;
// //     }

// //     if (!teacher) {
// //       setMessage("Teacher data is missing.");
// //       return;
// //     }

// //     console.log("Teacher Data:", teacher);

// //     if (!teacher.teacherId || !teacher.teacherId._id) {
// //       console.log("Teacher ID is missing:", teacher.teacherId);
// //       setMessage("Teacher ID is missing.");
// //       return;
// //     }

// //     if (
// //       !teacher.availability ||
// //       !teacher.availability.days ||
// //       !teacher.availability.time
// //     ) {
// //       setMessage("Teacher availability is incomplete.");
// //       return;
// //     }

// //     const availability = parseAvailability(
// //       teacher.availability.days,
// //       teacher.availability.time
// //     );
// //     if (!availability) {
// //       setMessage("Error parsing teacher's availability.");
// //       return;
// //     }

// //     const isValid = validateDateTime(dateTime, availability);

// //     if (!isValid) {
// //       setMessage(
// //         "Selected date or time is outside the teacher's availability."
// //       );
// //       return;
// //     }

// //     const payload = {
// //       teacherId: teacher.teacherId._id,
// //       studentId: user._id,
// //       date: dayjs(dateTime).format("YYYY-MM-DD"),
// //       time: dayjs(dateTime).format("HH:mm"),
// //       userName: user.username,
// //       teacherName: teacher.fullName,
// //     };

// //     try {
// //       const response = await axios.post(
// //         "http://localhost:3000/book-session",
// //         payload
// //       );
// //       if (response.status === 200) {
// //         toast.success("Session booked successfully!");
// //         navigate(`/`);
// //       }
// //     } catch (error) {
// //       console.error("Error booking session:", error.response || error.message);
// //       setMessage("Failed to book session. Please try again.");
// //     }
// //   };

// //   return (
// //     <Box sx={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
// //       {teacher ? (
// //         <div>
// //           <Typography variant="h4" component="h1">
// //             Book a <span style={{ color: "#023063" }}>Session</span> with{" "}
// //             <span style={{ color: "#023063" }}>{teacher.fullName}</span>
// //           </Typography>

// //           <Typography variant="body1" sx={{ marginTop: "1rem" }}>
// //             Availability: {teacher.availability.days || "Not Available"} (
// //             {teacher.availability.time || "No Time Available"})
// //           </Typography>

// //           <Box sx={{ marginTop: "1rem" }}>
// //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// //               <DateTimePicker
// //                 label="Select Date and Time"
// //                 value={dateTime}
// //                 onChange={(newValue) => setDateTime(newValue)}
// //                 renderInput={(params) => (
// //                   <TextField
// //                     {...params}
// //                     fullWidth
// //                     required
// //                     sx={{ marginBottom: "1rem" }}
// //                   />
// //                 )}
// //               />
// //             </LocalizationProvider>
// //           </Box>

// //           <Button
// //             variant="contained"
// //             color="primary"
// //             onClick={handleBookSession}
// //             sx={{ marginTop: "1rem", backgroundColor: "#023063" }}
// //           >
// //             Book Session
// //           </Button>

// //           {message && (
// //             <Typography
// //               variant="body1"
// //               color={message.includes("successfully") ? "green" : "red"}
// //               sx={{ marginTop: "1rem" }}
// //             >
// //               {message}
// //             </Typography>
// //           )}
// //         </div>
// //       ) : (
// //         <Typography variant="h6" color="red">
// //           Teacher data is loading...
// //         </Typography>
// //       )}
// //     </Box>
// //   );
// // };

// // export default BookSession;


// // import React, { useState, useEffect } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { Box, Typography, TextField, Button } from "@mui/material";
// // import axios from "axios";
// // import { useAuth } from "../Header/AuthContext";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// // import { toast } from "react-toastify";
// // import dayjs from "dayjs";

// // const BookSession = () => {
// //   const { id } = useParams();
// //   const { user } = useAuth();
// //   const navigate = useNavigate();

// //   const [teacher, setTeacher] = useState(null);
// //   const [dateTime, setDateTime] = useState(null);
// //   const [message, setMessage] = useState("");

// //   useEffect(() => {
// //     const fetchTeacherData = async () => {
// //       try {
// //         const response = await axios.get(
// //           `http://localhost:3000/teachers/${id}/show`
// //         );
// //         setTeacher(response.data);
// //       } catch (error) {
// //         console.error("Error fetching teacher data:", error);
// //         toast.error("Failed to fetch teacher data.");
// //       }
// //     };

// //     fetchTeacherData();
// //   }, [id]);

// //   const handleBookSession = async () => {
// //     if (!dateTime || !dayjs(dateTime).isValid()) {
// //       setMessage("Please select a valid date and time.");
// //       return;
// //     }

// //     if (!teacher || !teacher.teacherId || !teacher.teacherId._id) {
// //       setMessage("Teacher data is missing.");
// //       return;
// //     }

// //     const payload = {
// //       teacherId: teacher.teacherId._id,
// //       studentId: user?._id,
// //       date: dayjs(dateTime).format("YYYY-MM-DD"),
// //       time: dayjs(dateTime).format("HH:mm"),
// //       userName: user.username,
// //       teacherName: teacher.fullName,
// //       price: teacher.pricing,  
// //     };
    
    

// //     try {
// //       // Step 1: Create the booking with "pending" status
// //       const response = await axios.post(
// //         "http://localhost:3000/book-session",
// //         payload
// //       );
    
// //       if (response.status === 200) {
// //         console.log("booking data:", response.data);
// //         const bookingId = response.data.booking?._id ;
// //         console.log("booking id:", bookingId);
// //         if (!bookingId) {
// //           console.error("Booking ID is missing in the response!");
// //           return;
// //         }
    
// //         toast.info("Redirecting to payment...");
// //         navigate(`/payment/${bookingId}`); // Pass booking ID to payment page
// //       }
// //     } catch (error) {
// //       console.error("Error booking session:", error.response || error.message);
// //       setMessage("Failed to book session. Please try again.");
// //     }
    
// //   };

// //   return (
// //     <Box sx={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
// //       {teacher ? (
// //         <div>
// //           <Typography variant="h4" component="h1">
// //             Book a <span style={{ color: "#023063" }}>Session</span> with{" "}
// //             <span style={{ color: "#023063" }}>{teacher.fullName}</span>
// //           </Typography>

// //           <Typography variant="body1" sx={{ marginTop: "1rem" }}>
// //             Availability: {teacher.availability.days || "Not Available"} (
// //             {teacher.availability.time || "No Time Available"})
// //           </Typography>

// //           <Box sx={{ marginTop: "1rem" }}>
// //             <LocalizationProvider dateAdapter={AdapterDayjs}>
// //               <DateTimePicker
// //                 label="Select Date and Time"
// //                 value={dateTime}
// //                 onChange={(newValue) => setDateTime(newValue)}
// //                 renderInput={(params) => (
// //                   <TextField
// //                     {...params}
// //                     fullWidth
// //                     required
// //                     sx={{ marginBottom: "1rem" }}
// //                   />
// //                 )}
// //               />
// //             </LocalizationProvider>
// //           </Box>

// //           <Button
// //             variant="contained"
// //             color="primary"
// //             onClick={handleBookSession}
// //             sx={{ marginTop: "1rem", backgroundColor: "#023063" }}
// //           >
// //             Book Session
// //           </Button>

// //           {message && (
// //             <Typography
// //               variant="body1"
// //               color={message.includes("successfully") ? "green" : "red"}
// //               sx={{ marginTop: "1rem" }}
// //             >
// //               {message}
// //             </Typography>
// //           )}
// //         </div>
// //       ) : (
// //         <Typography variant="h6" color="red">
// //           Teacher data is loading...
// //         </Typography>
// //       )}
// //     </Box>
// //   );
// // };

// // export default BookSession;


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Box, Typography, TextField, Button } from "@mui/material";
// import axios from "axios";
// import { useAuth } from "../Header/AuthContext";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { toast } from "react-toastify";
// import dayjs from "dayjs";

// // Helper to parse "12pm-2pm" format
// const parseAvailability = (daysString, timeString) => {
//   const daysMap = {
//     sunday: 0,
//     monday: 1,
//     tuesday: 2,
//     wednesday: 3,
//     thursday: 4,
//     friday: 5,
//     saturday: 6,
//   };

//   try {
//     const [startDayStr, endDayStr] = daysString.toLowerCase().split(" to ");
//     const startDay = daysMap[startDayStr.trim()];
//     const endDay = daysMap[endDayStr.trim()];

//     const [startTimeStr, endTimeStr] = timeString.replace(/\s+/g, "").split("-");

//     const parseTime = (str) => {
//       const match = str.match(/^(\d{1,2})(am|pm)$/i);
//       if (!match) return null;
//       let [_, hour, period] = match;
//       hour = parseInt(hour, 10);
//       if (period.toLowerCase() === "pm" && hour !== 12) hour += 12;
//       if (period.toLowerCase() === "am" && hour === 12) hour = 0;
//       return hour;
//     };

//     const startHour = parseTime(startTimeStr);
//     const endHour = parseTime(endTimeStr);

//     return { startDay, endDay, startHour, endHour };
//   } catch (err) {
//     console.error("Availability parsing error:", err);
//     return null;
//   }
// };

// const validateDateTime = (dateTime, availability) => {
//   if (!availability) return false;

//   const day = dayjs(dateTime).day(); // 0 = Sunday
//   const hour = dayjs(dateTime).hour();

//   const isDayValid =
//     availability.startDay <= availability.endDay
//       ? day >= availability.startDay && day <= availability.endDay
//       : day >= availability.startDay || day <= availability.endDay;

//   const isHourValid = hour >= availability.startHour && hour < availability.endHour;

//   return isDayValid && isHourValid;
// };

// const BookSession = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [teacher, setTeacher] = useState(null);
//   const [dateTime, setDateTime] = useState(null);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchTeacher = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/teachers/${id}/show`);
//         setTeacher(res.data);
//       } catch (err) {
//         console.error("Error fetching teacher:", err);
//         toast.error("Failed to fetch teacher data");
//       }
//     };

//     fetchTeacher();
//   }, [id]);

//   const handleBookSession = async () => {
//     if (!dateTime || !dayjs(dateTime).isValid()) {
//       setMessage("Please select a valid date and time.");
//       return;
//     }

//     if (!teacher || !teacher.teacherId || !teacher.teacherId._id) {
//       setMessage("Teacher data is missing.");
//       return;
//     }

//     const availability = parseAvailability(teacher.availability?.days, teacher.availability?.time);
//     if (!validateDateTime(dateTime, availability)) {
//       setMessage("Selected date/time is outside the teacher's availability.");
//       return;
//     }

//     const payload = {
//       teacherId: teacher.teacherId._id,
//       studentId: user._id,
//       date: dayjs(dateTime).format("YYYY-MM-DD"),
//       time: dayjs(dateTime).format("HH:mm"),
//       userName: user.username,
//       teacherName: teacher.fullName,
//       price: teacher.pricing,
//     };

//     try {
//       const res = await axios.post("http://localhost:3000/book-session", payload);
//       const bookingId = res.data?.booking?._id;
//       if (!bookingId) throw new Error("Missing booking ID");

//       toast.success("Session booked! Redirecting to payment...");
//       navigate(`/payment/${bookingId}`);
//     } catch (err) {
//       console.error("Booking error:", err);
//       setMessage("Failed to book session. Please try again.");
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
//       {teacher ? (
//         <>
//           <Typography variant="h4">
//             Book a <span style={{ color: "#023063" }}>Session</span> with{" "}
//             <span style={{ color: "#023063" }}>{teacher.fullName}</span>
//           </Typography>

//           <Typography sx={{ mt: 2 }}>
//             Availability: {teacher.availability?.days || "Not set"} (
//             {teacher.availability?.time || "Not set"})
//           </Typography>

//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DateTimePicker
//               label="Select Date and Time"
//               value={dateTime}
//               onChange={setDateTime}
//               renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
//             />
//           </LocalizationProvider>

//           <Button
//             variant="contained"
//             sx={{ mt: 3, backgroundColor: "#023063" }}
//             onClick={handleBookSession}
//           >
//             Book Session
//           </Button>

//           {message && (
//             <Typography sx={{ mt: 2 }} color={message.includes("successfully") ? "green" : "red"}>
//               {message}
//             </Typography>
//           )}
//         </>
//       ) : (
//         <Typography color="error">Loading teacher data...</Typography>
//       )}
//     </Box>
//   );
// };

// export default BookSession;


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
