import { Badge, TextField, Button, IconButton } from "@mui/material";
import io from "socket.io-client";
import React, { useState, useRef, useEffect } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "../../styles/video.module.css";

const server_url = "http://localhost:3000";

var connections = {};

// Configuration for WebRTC PeerConnection, including a STUN server for NAT traversal.

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeet() {
  var socketRef = useRef();

  let socketIdRef = useRef();

  let localVideoref = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState([]);

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState(true);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      /*When permissions are granted, the browser gives you a MediaStream object.
      Think of it as a data pipeline that carries the audio and/or video streams from the user’s devices to your app. */

      //video Permission
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("Video permission granted");
      } else {
        setVideoAvailable(false);
        console.log("Video permission denied");
      }

      //audio Permission
      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("Audio permission granted");
      } else {
        setAudioAvailable(false);
        console.log("Audio permission denied");
      }

      //screen share
      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      //streaming video
      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;

          /*localVideoref.current refers to a React ref that points to a <video> element in the DOM.
          The srcObject property of the <video> element is set to the MediaStream, allowing the user to see their own video feed in real-time. */
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }

      /* MediaStream Tracks
        The MediaStream object contains tracks, which are individual streams of either audio or video.
        Attach them to an HTML <audio> or <video> element for playback.
        Send them over a WebRTC connection for real-time communication. */
    } catch (error) {
      console.log(error);
    }
  };

  //Triggered when media stream is obtained, updates peers with the new stream.
  let getUserMediaSuccess = (stream) => {
    try {
      // Stop any existing media tracks
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream; //update stream to new stream
    localVideoref.current.srcObject = stream;

    // Send updated stream to connected peers
    for (let id in connections) {
      if (id === socketIdRef.current) continue; // Skip own connection

      connections[id].addStream(window.localStream);

      //An offer is created to send the updated stream to peers when there is a change in the media
      connections[id].createOffer().then((description) => {
        console.log(description);
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    //Triggered when the user stops their media (e.g.video/audio off).
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  //whenever video & audio changes getUserMedia will get triggered like someone closed video ,mute/unmute audio etc.
  let getUserMedia = () => {
    // If video or audio is enabled
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess) // Handle the media stream
        .then((stream) => {})
        .catch((e) => console.log(e));
    } // If video and audio are both off
    else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks(); //retrieves all the media tracks from the srcObject of the video reference(<video> element).
        tracks.forEach((track) => track.stop()); //stops each active media track (video or audio) when video/audio is turned off.
      } catch (e) {
        console.log(e);
      }
    }
    //A track in the MediaStream API refers to an individual stream of media content, such as video or audio.
  };

  //Runs whenever there is a change in audio /video
  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      console.log("Video and Audio state:", video, audio);
    }
  }, [video, audio]);

  // Receives a message from the signaling server
  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message); // Parse the message into a signal object

    // Check if the message is not from current person
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        // Stores the remote peer's SDP in the current user's remote description to facilitate communication setup.
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            //Checks if the message contains an SDP offer
            if (signal.sdp.type === "offer") {
              // Generate an answer SDP describing local peer's capabilities
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  // Set the local description and send it back to the peer
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }
      if (signal.ice) {
        // Adds the received ICE candidate to the connection to establish a direct peer-to-peer communication path.
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  //connect to socket server
  let connectToSocketServer = () => {
    //socketRef.current holds the WebSocket connection, persisting it across re-renders using React's useRef.
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer); //calls gotMessageFromServer when signal event occur.

    //The connect event comes from the Socket.IO client once the connection to the server is established.
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href); //send user's current path
      socketIdRef.current = socketRef.current.id; //generate socked id for user

      socketRef.current.on("chat-message", addMessage);

      // Listens for 'user-left' event and removes the video of the user who left based on their socket ID.
      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      /* id: The ID of the user who just joined.
      clients: An array of client IDs (socket IDs) that are already connected to the room. */
      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          //socketListId: This represents each client in the clients array. For each client, a new WebRTC peer connection (RTCPeerConnection) is created.
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );

          //ICE candidates are network routes used to establish a WebRTC connection between peers.

          // Listen for and send ICE candidates to establish a peer-to-peer connection.
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          //listens for the onaddstream event in WebRTC, which is triggered when a new media stream (such as a video or audio stream) is added to an existing RTCPeerConnection.
          connections[socketListId].onaddstream = (event) => {
            console.log("BEFORE:", videoRef.current);
            console.log("FINDING ID: ", socketListId);

            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              console.log("FOUND EXISTING");

              // Update the stream of the existing video
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              // Create a new video
              console.log("CREATING NEW");
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          /*Local Stream-The localStream is the media (audio and/or video) captured from the user's device, such as a webcam or microphone.
          It represents the actual content that is shared with other peers in a WebRTC connection.  */

          // Adds the local stream to the current peer's connection (socketListId).
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        /*
        Offer-An offer in WebRTC is a session description created by one peer to start a connection.
        It contains details about the peer's media capabilities (e.g., supported audio/video formats), network information (IP and ports),
        and media tracks, allowing the receiving peer to understand how to establish the connection.
        */

        //socketIdRef.current :-current user's socket ID.

        // id2 is the socket ID of each peer in the connections object, except the current peer (socketIdRef.current).

        // Check if the triggering peer (id) is the current user (socketIdRef.current)
        // If true, the current user is adding a new stream, so we add that stream to all other peers
        // except the current user itself (local stream won't be added to the local peer)

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue; // Skip the local peer

            try {
              // Add the local stream to all other peer connections
              connections[id2].addStream(window.localStream);
            } catch (e) {
              console.log(e);
            }

            // Create an SDP offer for each peer and send it to them
            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description) // Save offer locally
                .then(() => {
                  //Send the SDP offer to the other peer to initiate the connection and establish it.
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  // Creates a silent audio stream and disables the audio track.
  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  // Creates a black video stream and disables the video track.
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  let handleScreen = () => {
    setScreen(!screen);
  };

  let getDislayMediaSuccess = (stream) => {
    console.log("HERE");
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };
  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  let sendMessage = () => {
    console.log(socketRef.current);
    socketRef.current.emit("chat-message", message, username);
    setMessage("");

    //this.setState({ message: "", sender: username })
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = "/";
  };

  return (
    <div>
      {askForUsername === true ? (
        <div>
          <h2>Enter into Lobby</h2>

          <TextField
            id="outlined-size-small"
            label="Username"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button
            variant="contained"
            sx={{
              marginLeft: "1rem",
              marginTop: { xs: "0.5rem", sm: "0rem" },
            }}
            onClick={connect}
          >
            Connect
          </Button>

          <div>
            <video ref={localVideoref} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <div className={styles.meetVideoContainer}>
          {showModal ? (
            <div className={styles.chatRoom}>
              <div className={styles.chatContainer}>
                <h1>Chat</h1>

                <div className={styles.chattingDisplay}>
                  {messages.length > 0 ? (
                    messages.map((item, index) => {
                      console.log(messages);
                      return (
                        <div style={{ marginBottom: "20px" }} key={index}>
                          <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                          <p>{item.data}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No Messages Yet</p>
                  )}
                </div>

                <div className={styles.chattingArea}>
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    size="small"
                    id="outlined-size-small"
                    label="Enter Your chat"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    sx={{ marginLeft: "1rem" }}
                    onClick={sendMessage}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className={styles.buttonContainers}>
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleEndCall} style={{ color: "red" }}>
              <CallEndIcon />
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio === true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable === true ? (
              <IconButton onClick={handleScreen} style={{ color: "white" }}>
                {screen === true ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            ) : (
              <></>
            )}

            <Badge badgeContent={newMessages} max={999} color="secondary">
              <IconButton
                onClick={() => {
                  setModal(!showModal);
                  setNewMessages(0);
                }}
                style={{ color: "white" }}
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>

          <video
            className={styles.meetUserVideo}
            ref={localVideoref}
            autoPlay
            muted
          ></video>
          <div className={styles.conferenceView}>
            {videos.map((video) => (
              <div key={video.socketId}>
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                ></video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
