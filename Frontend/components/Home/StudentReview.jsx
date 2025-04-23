import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import Slider from "react-slick";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./Arrow.css";

const ReviewBox = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: "1rem",
  backgroundColor: "#e1e9fd",
  height: "auto",
  width: "100%",
  boxSizing: "border-box",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6),
  },
}));

const reviews = [
  {
    name: "Jane Doe",
    review:
      "Scholar Corner has been a game changer for me. The personalized tutoring sessions have greatly improved my understanding of challenging subjects.",
    avatar: "avatar1.jpg",
  },
  {
    name: "Emily Johnson",
    review:
      "A fantastic platform for learning. The interactive sessions and resources provided are top-notch. Highly recommended!",
    avatar: "avatar2.jpg",
  },
  {
    name: "John Smith",
    review:
      "The tutors are incredibly knowledgeable and supportive. I’ve seen a significant improvement in my grades since I started using Scholar Corner.",
    avatar: "avatar3.jpg",
  },
];

export default function StudentReviews() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: (
      <div style={{ color: "#e1e9fd", fontSize: "24px" }}>&#9664;</div>
    ),
    nextArrow: (
      <div style={{ color: "#e1e9fd", fontSize: "24px" }}>&#9654;</div>
    ),
  };

  return (
    <Box
      sx={{
        p: { xs: 6, md: 8 },
      }}
    >
      <Typography
        sx={{
          lineHeight: "1.2",
          fontSize: { xs: "2rem", lg: "2.8rem" },
          fontWeight: "600",
          textAlign: "center",
          mb: "3rem",
        }}
      >
        What Our
        <span style={{ color: "#023063" }}> Students </span> Say
      </Typography>
      <Box
        sx={{
          maxWidth: { xs: "100%", md: 900 },
          margin: "0 auto",
        }}
      >
        <Slider {...settings}>
          {reviews.map((review, index) => (
            <ReviewBox key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Avatar
                  src={review.avatar}
                  alt={review.name}
                  sx={{
                    width: { xs: 80, md: 140 },
                    height: { xs: 80, md: 140 },
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: { xs: "1.2rem", md: "1.6rem" },
                }}
              >
                {review.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontStyle: "italic", textAlign: "center" }}
              >
                "{review.review}"
              </Typography>
            </ReviewBox>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
