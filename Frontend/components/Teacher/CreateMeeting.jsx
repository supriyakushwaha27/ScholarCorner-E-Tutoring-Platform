import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TextField, Button } from "@mui/material";
import { AuthContext } from "../Header/AuthContext";
import "../../App.css";

export default function CreateMeeting() {
  let navigate = useNavigate();

  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <div className="Meeting">
      <div style={{ margin: "2rem", width: "50%" }}>
        <h1>
          <span style={{ color: "#023063" }}>Create Meeting </span> Code For
          Student
        </h1>
        <p style={{ marginTop: "1rem", marginLeft: "0.1rem" }}>
          Create meeting code and send to students and click on join to join
          meeting directly.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <TextField
            id="outlined-basic"
            label="Meeting Code"
            variant="outlined"
            onChange={(e) => setMeetingCode(e.target.value)}
            value={meetingCode}
          />
          <Button
            variant="contained"
            size="large"
            style={{
              marginLeft: "1.5rem",
              height: "3.3rem",
              padding: "0 2rem",
            }}
            onClick={handleJoinVideoCall}
          >
            Join
          </Button>
        </div>
      </div>

      <div></div>
      <img
        src="meeting.jpeg"
        alt="meeting"
        width="50%"
        height="100%"
        style={{ objectFit: "contain", marginTop: "0.7rem" }}
      />
    </div>
  );
}

