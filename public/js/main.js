const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get username and room from the URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//Join chatroom
socket.emit("joinRoom", { username, room });

//Get roomusers
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsersList(users);
});

socket.on("message", (message) => {
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submitted
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //getting message text
  const msg = e.target.elements.msg.value;

  //emiting message to server
  socket.emit("chatMessage", msg);

  //Clearing the input box
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Outputting message to DOM
function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">${msg.text} </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

//Outputting roomname to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//Outputting users to DOM
function outputUsersList(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}
