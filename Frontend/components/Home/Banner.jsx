import * as React from "react";
import { Grid, Button, Typography, Box } from "@mui/material";

function Banner() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: { lg: "90vh", xs: "auto" },
        backgroundColor: "#032b63",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      <Grid
        container
        sx={{
          width: "100%",
          height: "100%",
          padding: 0,
          margin: 0,
        }}
      >
        <Grid
          item
          xs={12}
          lg={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign={{ xs: "center", lg: "left" }}
          padding={{ xs: 2, lg: 2 }}
        >
          <Box sx={{ color: "white", pl: { lg: "3rem" } }}>
            <Typography
              sx={{
                lineHeight: "1.2",
                fontSize: {
                  xs: "3rem",
                  lg: "3.6rem",
                },
              }}
            >
              Experience
              <span style={{ color: "#089ce2" }}> Engaging, </span>
              Real-Time
              <span style={{ color: "#089ce2" }}> Tutoring </span>
              Sessions
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "1.2rem",
                  lg: "1.4rem",
                },
                mt: 2,
              }}
            >
              Our interactive sessions, led by expert tutors, ensure that each
              student receives the guidance they need to excel.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#089ce2",
                paddingX: "1rem",
                paddingY: "0.5rem",
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "capitalize",
                mt: 3,
              }}
              component="a"
              href="#services-section"  
            >
              Learn More
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={{ xs: 2, lg: 2 }}
          paddingRight={{ xs: 2, lg: 7 }}
        >
          <video
            autoPlay
            loop
            muted
            controls
            style={{
              borderRadius: "15px",
              boxShadow:
                "rgba(0, 0, 0, 0.4) 0px 30px 90px, rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
              border: "none",
              background: "none",
              maxWidth: "100%",
              maxHeight: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          >
            <source src="banner.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Banner;
