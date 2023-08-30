const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const formatMessage = require("./utils/message");
const {
  userJoin,
  getUserById,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "Admin";

io.on("connection", (socket) => {
  //On joining room
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessage(botName, `Welcome to Messenger!`));

    //Broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
      );

    //Send user and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //When user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat!`)
      );

      //Send user and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getUserById(socket.io);
    io.emit("message", formatMessage(user.username, msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Chat server runnning on port ${PORT}`);
});
