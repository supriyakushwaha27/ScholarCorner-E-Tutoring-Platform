import * as React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#023063",
        color: "#ffffff",
        padding: { xs: "1rem", md: "1.5rem 2rem" },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          textAlign: { xs: "center", md: "left" },
          marginBottom: { xs: "1rem", md: "0" },
          fontSize: { xs: "0.9rem", md: "1rem" },
        }}
      >
        © {new Date().getFullYear()} ScholarCorner. All rights reserved.
      </Typography>
      <Typography
        variant="body2"
        sx={{
          textAlign: { xs: "center", md: "right" },
          fontSize: { xs: "0.9rem", md: "1rem" },
        }}
      >
        Made with ❤️ by ScholarCorner Team
      </Typography>
    </Box>
  );
}
