import * as React from "react";
import { Grid, Typography, Box } from "@mui/material";

export default function About() {
  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 } }} mt={5} mb={6}>
      <Grid container spacing={4}>
        <Grid
          item
          xs={12}
          lg={5}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: { xs: 2 },
          }}
        >
          <img
            src="about.png"
            alt="About Scholar Corner"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: 570,
              objectFit: "cover",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={7}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", lg: "flex-start" },
            px: { xs: 2 },
          }}
        >
          <Box
            sx={{ textAlign: { xs: "center", lg: "left" }, pl: { lg: "3rem" } }}
          >
            <Typography
              sx={{
                lineHeight: "1.2",
                fontSize: {
                  xs: "2rem",
                  lg: "2.8rem",
                },
                fontWeight: "600",
                marginBottom: "2rem",
              }}
            >
              About
              <span style={{ color: "#023063" }}> ScholarCorner </span>
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "1.2rem",
                  lg: "1.3rem",
                },
                mt: 2,
                textAlign: { xs: "justify", lg: "left" },
              }}
            >
              At Scholar Corner, we are dedicated to bridging the gap between
              students and top-tier tutors, offering a personalized and seamless
              e-tutoring experience. Whether you need help mastering a specific
              subject or aim to excel academically, our expert team is here to
              guide you on your learning journey. Dive into the world of online
              education with Scholar Corner and discover a tailored approach to
              learning that fits your needs.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
