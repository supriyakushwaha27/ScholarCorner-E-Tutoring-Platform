const { Server } = require("socket.io");

let connections = {};
let messages = {};
let timeOnline = {};

const connectToSocket = (server) => {

  const io = new Server(server, {       //we have combined app server(server) and socket server(Server) together
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    }
  });


  io.on("connection", (socket) => {

    console.log("something connected");

    //join-call

    socket.on("join-call", (path) => {   //listens to sended/emitted message
      

    /* (connection object)
    let connections = {
      room1(path): ["socketId1", "socketId2"],  // room1 has two users connected with socketId1 and socketId2
      room2: ["socketId3", "socketId4"]   // room2 has two users connected with socketId3 and socketId4
    };
    */

    /* checks if the path given by user exist or not.if it exists then it adds the user in the room(zoom call) of 
    that path , and if it does not exist it create a new room (zoom call ) of the provided path */

      if (connections[path] == undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();    //storing entry time of user(when they entered the call)

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path]                 //it send msg to existing users that new user joined.
        );
      }

      //`messages object stores arrays of messages for each room(path),where each message contains text,sender info,and sender's socketID.

      /*
      let messages = {
        "room1"(path): [  
            { data: "Hello, everyone!", sender: "User1", "socket-id-sender": "socketId1" },
            { data: "Hi, User1!", sender: "User2", "socket-id-sender": "socketId2" }
        ],
        "room2": [  
            { data: "Good morning!", sender: "User3", "socket-id-sender": "socketId3" }
        ]
      };
    */

      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          //this loop send each msg in path (room) 1 by 1.
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"]
          );
        }
      }
    });


    //signal 
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message); //connects clients together by sharing their socket id to one another
    });


    //chat-message


    socket.on("chat-message", (data, sender) => {

      const [matchingRoom, found] = Object.entries(connections)
          .reduce(([room, isFound], [roomKey, roomValue]) => {


              if (!isFound && roomValue.includes(socket.id)) {
                  return [roomKey, true];
              }

              return [room, isFound];

          }, ['', false]);

      if (found === true) {
          if (messages[matchingRoom] === undefined) {
              messages[matchingRoom] = []
          }

          messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
          console.log("message", matchingRoom, ":", sender, data)

          connections[matchingRoom].forEach((elem) => {
              io.to(elem).emit("chat-message", data, sender, socket.id)
          })
      }

  })

    // socket.on("chat-messge", (data, sender) => {
      
    //   // Finds the room (path) the user belongs to by checking if their socket ID exists in any room's array.

    //   const [matchingRoom, found] = Object.entries(connections).reduce(
       
    //     ([room, isFound], [roomKey, roomValue]) => {
         
    //       // If you've already found the room, just keep accumulater as it is.
    //       if (!isFound && roomValue.includes(socket.id)) {
    //         // Found the person in this room!
    //         return [roomKey, true]; 
    //       }

    //       // Keep looking if they're not in this room.
    //       return [room, isFound]; 

    //     },

    //     ["", false]            // Start with no room name and not found.
    //   );
      

    //   /* below code explanation
    //     1.If the user is found in a room, the system checks if there are any existing messages for that room.
    //     2.If no messages exist, it initializes an empty array to store the messages.
    //     3.The new message is added to the room's message history.
    //     4.Then, the system broadcasts the message to all other users in the room using their socket IDs.
    //   */

    //   if (found === true) {

    //     if (messages[matchingRoom] === undefined) {
    //       messages[matchingRoom] = [];
    //     }

    //     messages[matchingRoom].push({
    //       sender: sender,
    //       data: data,
    //       "socket-id-sender": socket.id,
    //     });
    //     console.log("message", matchingRoom, ":", sender, data);


    //     //user represents each socket ID in the room.( connections[path] )
    //     connections[matchingRoom].forEach((user) => {
    //       io.to(user).emit("chat-message", data, sender, socket.id);  //socket.id- The socket ID of the sender
    //     });

    //     //The forEach loop goes through each user in the room (using their socket ID),
    //     //and the message is sent to each user with the message content and sender's info.

    //   }

    // });

   //disconnect

   socket.on("disconnect", () => {

    // Calculate the time difference the user was online
    var timeSpentOnline = Math.abs(timeOnline[socket.id] - new Date());

    var roomKey;
    
    // Loop through all rooms (paths) to find the one where the user was
    for (const [room, connectedUsers] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
        
        // Check if the user is in this room
        for (let i = 0; i < connectedUsers.length; ++i) {
            if (connectedUsers[i] === socket.id) {
                roomKey = room;  // Store the room the user was in

                // Notify all other users in the room that this user has left
                for (let i = 0; i < connections[roomKey].length; ++i) {
                    io.to(connections[roomKey][i]).emit('user-left', socket.id);
                }

                // Remove the user from the room's user list
                var userIndex = connections[roomKey].indexOf(socket.id);
                connections[roomKey].splice(userIndex, 1);

                // If the room is empty, delete the room
                if (connections[roomKey].length === 0) {
                    delete connections[roomKey];
                }
            }
        }
    }
});

});

  return io;
};

module.exports = { connectToSocket };
