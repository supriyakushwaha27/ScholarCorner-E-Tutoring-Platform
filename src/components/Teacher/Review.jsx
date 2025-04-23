import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Rating,
  Grid,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";

const Review = ({ teacherId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/reviews`, {
          params: { teacherId: teacherId },
        });
        console.log("data fetched ", response.data);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      }
    };

    if (teacherId) {
      fetchReviews();
    }
  }, [teacherId]);

  return (
    <Box sx={{ padding: "1rem", borderRadius: "12px", marginBottom: "2rem" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#032b63",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Teacher Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "#777",
            fontSize: "1.2rem",
            marginTop: "2rem",
          }}
        >
          No reviews yet. Be the first to share your experience!
        </Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {reviews.map((review) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              key={review._id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e0e0e0",
                  overflow: "hidden",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <Avatar
                      src=""
                      alt={review.userId.username}
                      sx={{
                        width: 50,
                        height: 50,
                        marginRight: "1rem",
                        backgroundColor: "#032b63",
                        color: "#fff",
                      }}
                    >
                      {review.userId.username.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#333",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {review.userId.username}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Rating
                          value={review.rating}
                          readOnly
                          precision={0.5}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            marginLeft: "0.5rem",
                            fontWeight: "bold",
                            color: "#032b63",
                          }}
                        >
                          {review.rating}/5
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: 1.4,
                      marginBottom: "1rem",
                    }}
                  >
                    {review.review}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#777",
                      fontSize: "0.875rem",
                    }}
                  >
                    {format(new Date(review.createdAt), "do MMMM yyyy, h:mm a")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Review;
