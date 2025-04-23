import React, { useState, useEffect } from "react";
import { useLoaderData, useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { Divider } from "@mui/material";
import Rating from "@mui/material/Rating";

import { useAuth } from "../Header/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { TeacherBookings } from "./TeacherBookings";
import TextField from "@mui/material/TextField";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Review from "./Review";
import { useLocation } from "react-router-dom";
export default function Show() {
  const params = useParams();
  const teacher = useLoaderData();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [bookings, setBookings] = useState([]);

  //booking status
  const [status, setStatus] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const session_id = queryParams.get("session_id");
    const status = queryParams.get("status");
    const bookingId = queryParams.get("bookingId");

    if (session_id) setSessionId(session_id);
    if (status) setStatus(status);
    if (bookingId) setBookingId(bookingId);
  }, [location]);

  // Handle success or failure of the booking
  useEffect(() => {
    if (status === "success") {
      handleApproveBooking(bookingId);
    } else if (status === "failure") {
      handleCancelBooking(bookingId);
    }
  }, [status, bookingId]);

  const handleApproveBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/approve/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedBooking = await response.json();
        toast.success("Booking approved!");
      } else {
        const errorText = await response.text();
        toast.error(`Failed to approve booking: ${errorText}`);
      }
    } catch (error) {
      toast.error("An error occurred while approving the booking.");
    }
  };


  //history
  const [userBooking, setUserBooking] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isMessageVisible, setMessageVisible] = useState(true);

  const fetchHistory = async (teacherId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/history/${teacherId}`
      );
      const data = response.data || [];
      setHistoryData(data);
      console.log("History fetched:", data);

      const cancelled = checkBookingCancelled(data, user?._id);
      setIsCancelled(cancelled);
      console.log("Cancellation status after fetching history:", cancelled);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const checkBookingCancelled = (data = [], currentUserId) => {
    console.log("CheckBookingCancelled triggered");
    if (!data || data.length === 0) return false;

    console.log("Current user ID:", currentUserId);
    const canceledBooking = data.find(
      (entry) => entry.userId === currentUserId && entry.status === "canceled"
    );

    console.log("Canceled booking found:", canceledBooking);
    return !!canceledBooking;
  };

  useEffect(() => {
    if (teacher?.teacherId?._id && user?._id) {
      console.log("Fetching history for teacher:", teacher.teacherId._id);
      fetchHistory(teacher.teacherId._id);
    }
  }, [teacher?.teacherId?._id, user?._id]);

  const handleMessageClose = () => {
    setMessageVisible(false);
    localStorage.setItem("isMessageClosed", "true");
  };

  useEffect(() => {
    const isClosed = localStorage.getItem("isMessageClosed") === "true";
    setMessageVisible(!isClosed);
  }, []);

  //review
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(2);

  const handleSubmit = async () => {
    if (!user?._id) {
      toast.error("You must be logged in to submit a review.");
      navigate("/login");
      return;
    }

    if (!review) {
      toast.error("Please fill in the review field.");
      return;
    }

    const reviewData = {
      userId: user?._id,
      username: user?.username,
      teacherId: teacher?._id,
      review,
      rating,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/reviews",
        reviewData
      );
      toast.success("Review submitted successfully!");
      setReview("");
      setRating(0);
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.message || "An error occurred. Please try again."
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const bookingResponse = await axios.get(
          `http://localhost:3000/api/bookings/${user?._id}`
        );

        const newBookings = bookingResponse.data.reduce((acc, booking) => {
          acc[booking.teacherId] = booking;
          return acc;
        }, {});

        setUserBooking(newBookings);
      } catch (error) {
        console.error(
          "Error fetching booking data:",
          error.response?.data || error.message
        );
      }
    };

    if (user?._id) fetchBookingData();
  }, [user?._id]);

  useEffect(() => {
    if (teacher?.teacherId?._id === user?._id) {
      const fetchBookings = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/bookings?teacherId=${teacher?.teacherId?._id}`
          );
          if (response.ok) {
            const data = await response.json();
            console.log("Fetched Bookings:", data);
            setBookings(Array.isArray(data) ? data : []);
          } else {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error(`Error fetching bookings: ${errorText}`);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          toast.error("Failed to fetch bookings. Please try again later.");
        }
      };
      fetchBookings();
    }
  }, [teacher, user]);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate(`/teachers/${params.id}/booksession`);
    } else {
      toast.info("You need to login to book session");
      navigate("/login");
    }
  };

  const deleteData = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/teachers/${params.id}/delete`
      );
      console.log(response);
      navigate("/teachers");
      window.scrollTo(0, 0);
    } catch (err) {
      console.log(err);
    }
  };

  async function CreateMeeting() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/teachers/${user._id}`
      );
      const teacher = response?.data;

      if (user?._id === teacher?.teacherId) {
        navigate("/CreateMeeting");
      } else {
        console.log("Current user is not a teacher");
        navigate("/profile");
      }
    } catch (err) {
      console.error("Error fetching teacher data:", err.message);
      navigate("/profile");
    }
  }

  return (
    <Box sx={{ width: "100%", margin: "2rem auto", maxWidth: "1400px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Left Section - Teacher Profile Details */}
        <Card
          sx={{
            p: 3,
            borderRadius: "16px",
            // boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Avatar
              sx={{
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: "50%",
                marginRight: 3,
              }}
              src={teacher?.profilePic.url}
              alt={teacher?.fullName}
            />
            <Box>
              <Typography
                component="h1"
                variant="h4"
                sx={{ fontWeight: "bold" }}
                gutterBottom
              >
                {teacher?.fullName}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {teacher?.subjectsTaught?.join(", ") || "No subjects listed"}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Speaks{" "}
                {teacher?.languagesSpoken?.join(", ") || "No languages listed"}
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ paddingTop: 0 }}>
            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>Certification:</strong>{" "}
              {teacher?.certification || "Not provided"}
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>Degree:</strong>{" "}
              {teacher?.education?.degree || "Not provided"}
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>University:</strong>{" "}
              {teacher?.education?.university || "Not provided"}
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>Specialization:</strong>{" "}
              {teacher?.education?.specialization || "Not provided"}
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>Availability:</strong>{" "}
              {teacher?.availability
                ? `${teacher.availability.days} (${teacher.availability.time})`
                : "Not provided"}
            </Typography>

            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>Pricing:</strong> ${teacher?.pricing || "Not provided"}{" "}
              per hour
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>Contact:</strong>{" "}
              {teacher?.teacherId?.email || "Email not available"}
            </Typography>

            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>About Me:</strong>{" "}
              {teacher?.description || "No description provided"}
            </Typography>

            {isCancelled && isMessageVisible && (
              <Typography
                variant="body1"
                sx={{
                  color: "red",
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Your booking has been canceled by the teacher.
                <IconButton
                  sx={{ marginLeft: "auto" }}
                  onClick={handleMessageClose}
                >
                  <Close />
                </IconButton>
              </Typography>
            )}

            {user?._id !== teacher?.teacherId?._id &&
              (userBooking && userBooking[teacher?.teacherId?._id] ? (
                <>
                  {userBooking[teacher?.teacherId?._id].status ===
                    "confirmed" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center", 
                        gap: "1rem", 
                        marginTop: "0.6rem", 
                      }}
                    >
                      {/* Booking Approved Button */}
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "green",
                          color: "white",
                          padding: "10px 20px",
                          borderRadius: "5px",
                          textTransform: "none",
                          boxShadow: "none",
                          fontWeight: "bold",
                          ":hover": {
                            backgroundColor: "#45a04e",
                          },
                        }}
                      >
                        Booking Approved
                      </Button>

                      {/* Informational Text */}
                      {!userBooking[teacher?.teacherId?._id]?.meetingCode && (
                        <p
                          style={{
                            color: "#6c757d", 
                            fontSize: "14px", 
                          }}
                        >
                          You will soon receive a 'Join Meeting' button to join
                          the session.
                        </p>
                      )}

                      {/* Join Meeting Button */}
                      {userBooking[teacher?.teacherId?._id]?.meetingCode && (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#0a74da",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            textTransform: "none",
                            boxShadow: "none",
                            fontWeight: "bold",
                            ":hover": {
                              backgroundColor: "#065fa3",
                            },
                          }}
                          onClick={() =>
                            navigate(
                              `/${
                                userBooking[teacher?.teacherId?._id]
                                  ?.meetingCode
                              }`
                            )
                          }
                        >
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Book Session Button */}
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#089ce2",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      textTransform: "none",
                      marginTop: "0.6rem",
                      boxShadow: "none",
                      fontWeight: "bold",
                      ":hover": {
                        backgroundColor: "#0676a5",
                      },
                    }}
                    onClick={handleButtonClick}
                  >
                    Book Session
                  </Button>
                </>
              ))}

            {user?._id !== teacher?.teacherId?._id &&
              userBooking &&
              userBooking[teacher?.teacherId?._id] &&
              userBooking[teacher?.teacherId?._id].status === null && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#089ce2",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    textTransform: "none",
                    marginTop: "0.6rem",
                    boxShadow: "none",
                    fontWeight: "bold",
                    ":hover": {
                      backgroundColor: "#0676a5",
                    },
                  }}
                  onClick={handleButtonClick}
                >
                  Book Session
                </Button>
              )}

            {user?._id !== teacher?.teacherId?._id && (
              <>
                <Box sx={{ mt: 4 }}>
                  <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.1)", my: 3 }} />
                  <Typography
                    variant="h6"
                    color="text.primary"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Share Your Review
                  </Typography>
                  <Rating
                    name="rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <TextField
                      placeholder="Write your review here..."
                      multiline
                      rows={4}
                      fullWidth
                      sx={{
                        backgroundColor: "#fafafa",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.1)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.1)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.1)",
                          },
                        },
                      }}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                    <Box sx={{ textAlign: "left" }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#089ce2",
                          color: "white",
                          padding: "10px 20px",
                          borderRadius: "5px",
                          textTransform: "none",
                          marginTop: "0.6rem",
                          boxShadow: "none",
                          fontWeight: "bold",
                          ":hover": {
                            backgroundColor: "#0676a5",
                          },
                        }}
                        onClick={handleSubmit}
                      >
                        Submit Review
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
            {teacher?.teacherId?._id === user?._id && (
              <>
                <Button
                  component={Link}
                  to={`/teachers/${params.id}/edit`}
                  variant="contained"
                  sx={{
                    backgroundColor: "#089ce2",
                    paddingX: "1rem",
                    paddingY: "0.5rem",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "capitalize",
                    mt: 3,
                    mr: 2,
                    "&:hover": { backgroundColor: "#023063" },
                  }}
                >
                  Edit
                </Button>

                <Button
                  onClick={deleteData}
                  variant="contained"
                  sx={{
                    backgroundColor: "#089ce2",
                    paddingX: "1rem",
                    paddingY: "0.5rem",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "capitalize",
                    mt: 3,
                    mr: 2,
                    "&:hover": { backgroundColor: "#023063" },
                  }}
                >
                  Delete
                </Button>

                <Button
                  onClick={CreateMeeting}
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "#089ce2",
                    paddingX: "1rem",
                    paddingY: "0.5rem",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "capitalize",
                    mt: 3,
                    "&:hover": { backgroundColor: "#023063" },
                  }}
                >
                  Create Meeting
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Section - Bookings */}
        <Card
          sx={{
            flex: 1,
            p: 3,
            borderRadius: "16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",

            backgroundColor: "#fff",
          }}
        >
          {teacher?.teacherId?._id === user?._id ? (
            <>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  textAlign: "center",
                  color: "#032b63",
                  fontWeight: "bold",
                }}
              >
                Bookings
              </Typography>

              <div
                style={{
                  overflowY: "auto",
                  maxHeight: "600px",

                  scrollbarWidth: "none",
                }}
              >
                <TeacherBookings
                  key={teacher.teacherId?._id}
                  teacherId={teacher?.teacherId?._id}
                  bookingData={bookings}
                  setBookings={setBookings}
                />
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  overflowY: "auto",
                  maxHeight: "750px",
                  scrollbarWidth: "none",
                }}
              >
                <Review teacherId={teacher?._id} />
              </div>
            </>
          )}

          <style>
            {`
            div::-webkit-scrollbar {
            display: none; 
            }`}
          </style>
        </Card>
      </Box>
    </Box>
  );
}

export const teacherLoader = async ({ params }) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/teachers/${params.id}/show`
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
