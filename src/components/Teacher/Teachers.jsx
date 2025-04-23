import { Grid } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "../../index.css";
import { Link, useLoaderData } from "react-router-dom";

export default function MediaControlCard() {
  const theme = useTheme();
  const data = useLoaderData();
  return (
    <>
      <Typography
        sx={{
          lineHeight: "1.2",
          fontSize: {
            xs: "2rem",
            lg: "2.8rem",
          },
          fontWeight: "600",
          textAlign: "center",
          mt: "2rem",
        }}
      >
        <span style={{ color: "#023063" }}>Meet </span>Our{" "}
        <span style={{ color: "#023063" }}>Teachers </span>
      </Typography>
      <Grid
        container
        spacing={4}
        sx={{
          width: "100%",
          margin: "1rem auto",
          marginBottom: "4rem",
          maxWidth: "1200px",
        }}
      >
        {data.map((teacher, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              component={Link}
              to={`/teachers/${teacher._id}/show`}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                p: 2,
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": { boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)" },
                textDecorationLine: "none",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  mr: 2,
                }}
                image={teacher.profilePic.url}
                alt={teacher.fullName}
              />
              <CardContent sx={{ flex: "1" }}>
                <Typography component="div" variant="h5" gutterBottom>
                  {teacher.fullName}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  color="text.secondary"
                  gutterBottom
                >
                  {teacher.subjectsTaught.join(", ")}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  color="text.secondary"
                >
                  Speaks {teacher.languagesSpoken.join(", ")}
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
                    "&:hover": {
                      backgroundColor: "#023063",
                    },
                  }}
                >
                  Book Session
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export const teacherData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/teachers");
    const teachers = response.data;
    return teachers;
  } catch (err) {
    console.log(err);
  }
};
