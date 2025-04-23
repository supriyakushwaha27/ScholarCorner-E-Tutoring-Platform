import * as React from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
export default function BeTutor() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        pt: 2,
        backgroundColor: "#ecedef",
        paddingBottom: { lg: 0, xs: "2rem" },
      }}
    >
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="Tutor.png"
            alt="Become a Tutor at Scholar Corner"
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
          lg={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            pr: { lg: "6rem" },
            textAlign: { xs: "center", lg: "left" },
          }}
        >
          <Box>
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
              Become a<span style={{ color: "#023063" }}> Tutor </span>
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "1rem",
                  lg: "1.2rem",
                },
                mb: 3,
                color: "#555",
                mt: "1rem",
              }}
            >
              Share your knowledge, inspire students, and grow your career. Join
              ScholarCorner to start making a difference today.
            </Typography>
            <Button
          variant="contained"
          component={NavLink}
          onClick={() => window.scrollTo(0, 0)}
            to="/beteacher"
              sx={{
                backgroundColor: "#346df0",
                color: "#ffffff",
                padding: "10px 20px",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#023063",
                },
              }}
            >
              Become a Tutor
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
