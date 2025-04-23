import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function BeATeacher() {
  const navigate = useNavigate();
  const [teacherFormData, setFormData] = useState({
    fullName: "",
    country: "",
    subjectsTaught: "",
    languagesSpoken: "",
    phoneNumber: "",
    profilePic: "",
    experience: "",
    certification: "",
    education: {
      university: "",
      degree: "",
      degreeType: "",
      specialization: "",
    },
    availability: {
      days: "",
      time: "",
    },
    description: "",
    pricing: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEducationChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      education: {
        ...prevFormData.education,
        [name]: value,
      },
    }));
  };

  const handleAvailabilityChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      availability: {
        ...prevFormData.availability,
        [name]: value,
      },
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    // Append form data to FormData object
    formData.append("fullName", teacherFormData.fullName);
    formData.append("country", teacherFormData.country);
    formData.append("subjectsTaught", teacherFormData.subjectsTaught);
    formData.append("languagesSpoken", teacherFormData.languagesSpoken);
    formData.append("phoneNumber", teacherFormData.phoneNumber);
    formData.append("profilePic", event.target.profilePic.files[0]);
    formData.append("experience", teacherFormData.experience);
    formData.append("certification", teacherFormData.certification);

    // Append nested objects like education and availability manually
    formData.append(
      "education[university]",
      teacherFormData.education.university
    );
    formData.append("education[degree]", teacherFormData.education.degree);
    formData.append(
      "education[degreeType]",
      teacherFormData.education.degreeType
    );
    formData.append(
      "education[specialization]",
      teacherFormData.education.specialization
    );

    formData.append("availability[days]", teacherFormData.availability.days);
    formData.append("availability[time]", teacherFormData.availability.time);

    formData.append("description", teacherFormData.description);
    formData.append("pricing", teacherFormData.pricing);

    console.log("Form Data to be sent:", formData);

    try {
      await axios.post("http://localhost:3000/beteacher", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      window.scrollTo(0, 0);
      navigate("/teachers");
      toast.success("Teacher Profile Created Successfully");

      // Reset form after submission
      setFormData({
        fullName: "",
        country: "",
        subjectsTaught: "",
        languagesSpoken: "",
        phoneNumber: "",
        profilePic: "",
        experience: "",
        certification: "",
        education: {
          university: "",
          degree: "",
          degreeType: "",
          specialization: "",
        },
        availability: {
          days: "",
          time: "",
        },
        description: "",
        pricing: "",
      });
    } catch (err) {
      console.log("Error in frontend while sending data:", err);
      if (err.response) {
        console.log("Response error:", err.response);
      } else if (err.request) {
        console.log("Request error:", err.request);
      } else {
        console.log("Error message:", err.message);
      }
    }
  };

  return (
    <Container
      maxWidth="md"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        marginTop: "2rem",
      }}
    >
      <Typography
        sx={{
          fontSize: {
            xs: "2rem",
            lg: "2.6rem",
          },
          fontWeight: "600",
          textAlign: "center",
          color: "#023063",
        }}
      >
        Become a Teacher
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "800px",
          marginTop: "1rem",
        }}
        encType="multipart/form-data"
      >
        {/* Row 1 */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="fullName"
              value={teacherFormData.fullName}
              onChange={handleChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Row 2 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="country"
              value={teacherFormData.country}
              onChange={handleChange}
              required
              label="Country"
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              type="number"
              value={teacherFormData.phoneNumber}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Row 3 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Subjects Taught"
              name="subjectsTaught"
              value={teacherFormData.subjectsTaught}
              onChange={handleChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Languages Spoken"
              name="languagesSpoken"
              value={teacherFormData.languagesSpoken}
              onChange={handleChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Row 4 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Profile Pic"
              name="profilePic"
              value={teacherFormData.profilePic}
              onChange={handleChange}
              margin="normal"
              fullWidth
              required
              type="file"
              focused
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Certification"
              name="certification"
              value={teacherFormData.certification}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Row 5 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="University"
              name="university"
              value={teacherFormData.education.university}
              onChange={handleEducationChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Degree"
              name="degree"
              value={teacherFormData.education.degree}
              onChange={handleEducationChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Row 6 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Degree Type"
              name="degreeType"
              value={teacherFormData.education.degreeType}
              onChange={handleEducationChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Specialization"
              name="specialization"
              value={teacherFormData.education.specialization}
              onChange={handleEducationChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Row 7 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Available Days"
              name="days"
              value={teacherFormData.availability.days}
              onChange={handleAvailabilityChange}
              margin="normal"
              fullWidth
              required
              placeholder="Monday to Saturday"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Available Time"
              name="time"
              value={teacherFormData.availability.time}
              onChange={handleAvailabilityChange}
              margin="normal"
              fullWidth
              required
              placeholder="12 PM - 6 PM"
            />
          </Grid>
        </Grid>

        {/* Row 8 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pricing"
              name="pricing"
              type="number"
              value={teacherFormData.pricing}
              onChange={handleChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Experience"
              name="experience"
              value={teacherFormData.experience}
              onChange={handleChange}
              margin="normal"
              fullWidth
              required
            />
          </Grid>
        </Grid>
        {/* Row 9 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12}>
            <TextField
              label="About Yourself"
              name="description"
              value={teacherFormData.description}
              onChange={handleChange}
              required
              margin="normal"
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#346df0",
            color: "#ffffff",
            padding: "10px 20px",
            fontSize: "1rem",
            marginTop: "1rem",
            width: "50%",
            alignSelf: "center",
            "&:hover": {
              backgroundColor: "#023063",
            },
          }}
        >
          Submit
        </Button>
        <Grid container justifyContent="flex-end" style={{ marginTop: "1rem" }}>
          <Grid item>
            <NavLink
              to="/"
              variant="body2"
              onClick={() => window.scrollTo(0, 0)}
            >
              Back to Home
            </NavLink>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
