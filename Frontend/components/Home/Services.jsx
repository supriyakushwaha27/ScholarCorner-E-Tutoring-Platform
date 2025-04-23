import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import VideocamIcon from "@mui/icons-material/Videocam";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AdsClickIcon from "@mui/icons-material/AdsClick";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  elevation: 8,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export default function Services() {
  return (
    <Box
      id="services-section"
      sx={{
        flexGrow: 1,
        background: "#f5f5f5",
        pt: "3rem",
        pb: "3rem",
        px: { xs: 2, sm: 3, md: 4, lg: 10 },
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <Grid container direction="column" spacing={3}>
        <Grid item xs={12}>
          <Typography
            sx={{
              lineHeight: "1.2",
              fontSize: {
                xs: "2rem",
                lg: "2.8rem",
              },
              fontWeight: "600",
              textAlign: "center",
              mb: "3rem",
            }}
          >
            Our
            <span style={{ color: "#023063" }}> Services </span>
          </Typography>
        </Grid>

        <Grid container spacing={4} justifyContent="center">
          {[
            {
              icon: <VideocamIcon sx={{ fontSize: 60, color: "#023063" }} />,
              title: "Interactive Live Sessions",
              description:
                "Engage in real-time, interactive sessions with tutors, allowing for immediate feedback and personalized instruction.",
            },
            {
              icon: <AssignmentIcon sx={{ fontSize: 60, color: "#023063" }} />,
              title: "Homework Assistance Service",
              description:
                "Our tutors provide step-by-step guidance and support, helping students complete their homework accurately and understand the underlying concepts.",
            },
            {
              icon: <AdsClickIcon sx={{ fontSize: 60, color: "#023063" }} />,
              title: "Academic Counseling",
              description:
                "Receive tailored advice and support for educational and career planning. Our counselors assist students in making informed decisions about their paths.",
            },
            {
              icon: <LightbulbIcon sx={{ fontSize: 60, color: "#023063" }} />,
              title: "Personalized Learning Strategies",
              description:
                "Boost your learning efficiency with customized strategies. Our experts offer targeted techniques to enhance study habits and achieve academic goals.",
            },
            {
              icon: <SchoolIcon sx={{ fontSize: 60, color: "#023063" }} />,
              title: "Test Preparation Programs",
              description:
                "We offer targeted coaching for a wide range of exams, equipping students with strategies and knowledge to excel on test day.",
            },
            {
              icon: <MenuBookIcon sx={{ fontSize: 60, color: "#023063" }} />,
              title: "Expert Subject Tutoring",
              description:
                "Our experienced tutors specialize in various subjects, offering in-depth explanations and support to help students master even the most challenging topics.",
            },
          ].map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 6,
                alignItems: "center",
              }}
            >
              <Item>
                {item.icon}
                <StyledCardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </StyledCardContent>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
