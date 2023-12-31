const users = [];

//Join user to chat
const userJoin = (id, username, room) => {
  const user = {
    id,
    username,
    room,
  };

  users.push(user);
  return user;
};

const getUserById = (id) => {
  return users.find((user) => user.id == id);
};

const userLeave = (id) => {
  const index = users.findIndex((user) => user.id == id);
  if (index !== -1) {
    const user = users[index];
    users.splice(index, 1);
    return user;
  }
  return null;
};

const getRoomUsers = (room) => {
  const roomUsers = users.filter((user) => user.room == room);
  return roomUsers;
};

module.exports = {
  userJoin,
  getUserById,
  userLeave,
  getRoomUsers,
};
