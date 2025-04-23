// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import { useAuth } from "./AuthContext";
// import { NavLink, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { IconButton } from "@mui/material";
// import HistoryIcon from "@mui/icons-material/History";

// export default function Profile() {
//   const { user, loading } = useAuth();
//   const [teacher, setTeacher] = useState(null);
//   const [teacherLoading, setTeacherLoading] = useState(true);
//   const navigate = useNavigate();

//   const handleHistoryClick = () => {
//     navigate(`/user-history/${user?._id}`);
//   };

//   useEffect(() => {
//     const fetchTeacher = async () => {
//       if (user?._id) {
//         try {
//           console.log("Fetching teacher with ID:", user?._id);
//           const response = await fetch(
//             `http://localhost:3000/api/teachers/${user?._id}`
//           );

//           console.log("Response status:", response.status);

//           if (!response.ok) {
//             const text = await response.text();
//             console.error("Error response:", text);
//             throw new Error("Network response was not ok");
//           }

//           const data = await response.json();
//           console.log("Teacher data received:", data);
//           setTeacher(data);
//         } catch (err) {
//           console.error("Error fetching teacher:", err.message);
//         } finally {
//           setTeacherLoading(false);
//         }
//       }
//     };

//     fetchTeacher();
//   }, [user?._id]);

//   if (loading || teacherLoading) {
//     return <div></div>;
//   }

//   async function deleteUser() {
//     try {
//       await axios.delete(`http://localhost:3000/user/${user._id}/delete`);
//       toast.success("User deleted successfully.");
//       navigate("/");
//     } catch (err) {
//       toast.error("User could not be deleted. Please try again.");
//       navigate("/profile");
//     }
//   }

//   function deleteAlert() {
//     if (user._id === teacher?.teacherId) {
//       toast.warn("Your Teacher Profile will also be deleted!");
//     }
//   }

//   return (
//     <Box
//       sx={{
//         background: "#f5f5f5",
//         width: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "79vh",
//         paddingY: "2rem",
//         boxSizing: "border-box",
//       }}
//     >
//       <Card
//         sx={{
//           maxWidth: "100%",
//           width: "35%",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           textAlign: "center",
//           overflow: "hidden",
//           paddingY: "1rem",
//           height: "100%",
//         }}
//       >
//         <CardContent>
//           <Typography
//             gutterBottom
//             variant="h4"
//             component="div"
//             sx={{ fontWeight: "bold" }}
//           >
//             <span style={{ color: "#023063" }}>User </span>Profile
//           </Typography>

//           {/* history icon */}
//           {user?._id !== teacher?.teacherId && user?._id && (
//             <IconButton
//               onClick={handleHistoryClick}
//               sx={{ position: "relative", top: "-3.9rem", left: "13rem" }}
//             >
//               <HistoryIcon sx={{ fontSize: "2rem" }} />
//             </IconButton>
//           )}
//         </CardContent>

//         <Grid container justifyContent="center">
//           <Grid item xs={12} md={6}>
//             <img
//               alt={
//                 user?.username
//                   ? `${user.username}'s profile picture`
//                   : "Profile"
//               }
//               height="200"
//               width="200"
//               style={{
//                 objectFit: "cover",
//                 borderRadius: "50%",
//                 maxWidth: "100%",
//                 boxSizing: "border-box",
//               }}
//               src={ "profile img.jpg"}
//             />
//           </Grid>
//         </Grid>

//         <CardContent>
//           <Typography gutterBottom variant="h5" component="div">
//             {user?.username || "Demo User"}
//           </Typography>
//           <Typography variant="body2" sx={{ color: "text.secondary" }}>
//             {user?.email || "demo@example.com"}
//           </Typography>
//         </CardContent>

//         <CardActions
//           sx={{
//             justifyContent: "center",
//             gap: "3",
//           }}
//         >
//           <Button
//             size="small"
//             variant="contained"
//             onClick={deleteUser}
//             onMouseOver={deleteAlert}
//             sx={{
//               backgroundColor: "#089ce2",
//               paddingX: "1rem",
//               paddingY: "0.5rem",
//               fontWeight: "bold",
//               fontSize: "1rem",
//               textTransform: "capitalize",
//             }}
//           >
//             Delete
//           </Button>

//           {user?._id === teacher?.teacherId && (
//             <Button
//               component={NavLink}
//               to={`/teachers/${teacher._id}/show`}
//               size="small"
//               variant="contained"
//               sx={{
//                 backgroundColor: "#089ce2",
//                 paddingX: "1rem",
//                 paddingY: "0.5rem",
//                 fontWeight: "bold",
//                 fontSize: "1rem",
//                 textTransform: "capitalize",
//               }}
//             >
//               View Teacher Profile
//             </Button>
//           )}
//         </CardActions>
//       </Card>
//     </Box>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useAuth } from "./AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

export default function Profile() {
  const { user, loading } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [teacherLoading, setTeacherLoading] = useState(true);
  const navigate = useNavigate();

  const handleHistoryClick = () => {
    navigate(`/user-history/${user?._id}`);
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      if (user?._id) {
        try {
          console.log("Fetching teacher with ID:", user?._id);
          const response = await fetch(
            `http://localhost:3000/api/teachers/${user?._id}`
          );

          console.log("Response status:", response.status);

          if (!response.ok) {
            const text = await response.text();
            console.error("Error response:", text);
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("Teacher data received:", data);
          setTeacher(data);
        } catch (err) {
          console.error("Error fetching teacher:", err.message);
        } finally {
          setTeacherLoading(false);
        }
      }
    };

    fetchTeacher();
  }, [user?._id]);

  if (loading || teacherLoading) {
    return <div></div>;
  }

  async function deleteUser() {
    try {
      await axios.delete(`http://localhost:3000/user/${user._id}/delete`);
      toast.success("User deleted successfully.");
      navigate("/");
    } catch (err) {
      toast.error("User could not be deleted. Please try again.");
      navigate("/profile");
    }
  }

  function deleteAlert() {
    if (user._id === teacher?.teacherId) {
      toast.warn("Your Teacher Profile will also be deleted!");
    }
  }

  return (
    <Box
      sx={{
        background: "#f5f5f5",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "79vh",
        paddingY: "2rem",
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{
          maxWidth: "100%",
          width: { xs: "90%", sm: "60%", md: "35%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
          paddingY: "1rem",
          height: "100%",
        }}
      >
        <CardContent sx={{ position: "relative" }}>
          <Typography
            gutterBottom
            variant="h4"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            <span style={{ color: "#023063" }}>User </span>Profile
          </Typography>

          {/* history icon */}
          {user?._id !== teacher?.teacherId && user?._id && (
            <Box
              sx={{
                position: "absolute",
                top: { xs: "0.5rem", sm: "0.5rem" },
                right: { xs: "0.5rem", sm: "2rem" },
                zIndex: 1,
              }}
            >
              <IconButton
                sx={{
                  color: "#023063",
                }}
                onClick={handleHistoryClick}
              >
                <HistoryIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Box>
          )}
        </CardContent>

        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <img
              alt={
                user?.username
                  ? `${user.username}'s profile picture`
                  : "Profile"
              }
              height="200"
              width="200"
              style={{
                objectFit: "cover",
                borderRadius: "50%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
              src={"profile img.jpg"}
            />
          </Grid>
        </Grid>

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {user?.username || "Demo User"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {user?.email || "demo@example.com"}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "center",
            gap: "3",
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={deleteUser}
            onMouseOver={deleteAlert}
            sx={{
              backgroundColor: "#089ce2",
              paddingX: "1rem",
              paddingY: "0.5rem",
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "capitalize",
            }}
          >
            Delete
          </Button>

          {user?._id === teacher?.teacherId && (
            <Button
              component={NavLink}
              to={`/teachers/${teacher._id}/show`}
              size="small"
              variant="contained"
              sx={{
                backgroundColor: "#089ce2",
                paddingX: "1rem",
                paddingY: "0.5rem",
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "capitalize",
              }}
            >
              View Teacher Profile
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
