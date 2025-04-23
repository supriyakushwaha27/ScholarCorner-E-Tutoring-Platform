import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { NavLink, useLoaderData } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Edit() {
  const params = useParams();
  const navigate = useNavigate();

  // Initialize with default structure
  const [teacherData, setTeacherData] = useState({
    fullName: "",
    country: "",
    phoneNumber: "",
    subjectsTaught: "",
    languagesSpoken: "",
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
    pricing: "",
    experience: "",
    description: "",
    profilePic: { url: "", filename: "" }, 
  });

  const [profilePicFile, setProfilePicFile] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/teachers/${params.id}/edit`
        );
        setTeacherData(response.data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchTeacher();
  }, [params.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTeacherData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEducationChange = (event) => {
    const { name, value } = event.target;
    setTeacherData((prevFormData) => ({
      ...prevFormData,
      education: {
        ...prevFormData.education,
        [name]: value,
      },
    }));
  };

  const handleAvailabilityChange = (event) => {
    const { name, value } = event.target;
    setTeacherData((prevFormData) => ({
      ...prevFormData,
      availability: {
        ...prevFormData.availability,
        [name]: value,
      },
    }));
  };

  // Handle file input change
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    setProfilePicFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("fullName", teacherData.fullName);
      formData.append("country", teacherData.country);
      formData.append("phoneNumber", teacherData.phoneNumber);
      formData.append("subjectsTaught", teacherData.subjectsTaught);
      formData.append("languagesSpoken", teacherData.languagesSpoken);
      formData.append("certification", teacherData.certification);
      formData.append(
        "education[university]",
        teacherData.education.university
      );
      formData.append("education[degree]", teacherData.education.degree);
      formData.append(
        "education[degreeType]",
        teacherData.education.degreeType
      );
      formData.append(
        "education[specialization]",
        teacherData.education.specialization
      );
      formData.append("availability[days]", teacherData.availability.days);
      formData.append("availability[time]", teacherData.availability.time);
      formData.append("pricing", teacherData.pricing);
      formData.append("experience", teacherData.experience);
      formData.append("description", teacherData.description);

      if (profilePicFile) {
        // If a file is selected, send the file
        formData.append("profilePic", profilePicFile);
      } else {
        // If no file is selected, retain the existing profile picture
        formData.append("profilePic", teacherData.profilePic.url);
      }

      await axios.patch(
        `http://localhost:3000/teachers/${params.id}/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate(`/teachers/${params.id}/show`);
      toast.success("Teacher Profile Updated Successfully");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
    }
  };

  
  if (loading) {
    return <Typography>Loading...</Typography>; 
  }

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
      >
        {/* Row 1 */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="fullName"
              value={teacherData.fullName}
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Country</InputLabel>
              <Select
                name="country"
                value={teacherData.country}
                onChange={handleChange}
                required
                label="Country"
              >
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              type="number"
              value={teacherData.phoneNumber}
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
              value={teacherData.subjectsTaught}
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
              value={teacherData.languagesSpoken}
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
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              margin="normal"
              fullWidth
              focused
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Certification"
              name="certification"
              value={teacherData.certification}
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
              value={teacherData.education.university}
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
              value={teacherData.education.degree}
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
              value={teacherData.education.degreeType}
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
              value={teacherData.education.specialization}
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
              value={teacherData.availability.days}
              onChange={handleAvailabilityChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Available Time"
              name="time"
              value={teacherData.availability.time}
              onChange={handleAvailabilityChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Row 8 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pricing"
              name="pricing"
              value={teacherData.pricing}
              onChange={handleChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Experience"
              name="experience"
              value={teacherData.experience}
              onChange={handleChange}
              required
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Row 9 */}
        <Grid container spacing={2} style={{ marginTop: "0.25rem" }}>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={teacherData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              margin="normal"
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
            <NavLink to={`/teachers/${params.id}/show`} variant="body2">
              Back to show
            </NavLink>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
