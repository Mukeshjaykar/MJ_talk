const socket = io();

var username;
var chats = document.querySelector(".chats");
var users_count = document.querySelector(".count");
var user_list = document.querySelector(".user-list");
var mssg_send = document.querySelector("#user-send");
var user_msg = document.querySelector("#user-mssg");

do {
  username = prompt("Enter your name: ");
} while (!username);
socket.emit("new-user-joined", username);

socket.on("user-connected", (socket_name) => {
  userJoinLeft(socket_name, "joined");
});

function userJoinLeft(name, status) {
  let div = document.createElement("div");
  div.classList.add("user-join");
  let content = `<p><b>${name}</b> ${status} the chat</p>`;
  div.innerHTML = content;
  chats.appendChild(div);
  chats.scrollTop = chats.scrollHeight;
}

socket.on("user-disconnected", (user) => {
  userJoinLeft(user, "left");
});

socket.on("users-list", (users) => {
  user_list.innerHTML = "";
  user_arr = Object.values(users);
  for (i = 0; i < user_arr.length; i++) {
    let p = document.createElement("p");
    p.innerText = user_arr[i];
    user_list.appendChild(p);
  }
  users_count.innerHTML = user_arr.length;
  console.log(users_count);
});

/* for sending message*/

mssg_send.addEventListener("click", () => {
  let data = {
    user: username,
    msg: user_msg.value,
  };
  console.log(data);
  if (user_msg.value != "") {
    appendMessage(data, "outgoing");
    socket.emit("message", data);
    user_msg.value = "";
  }
});

function appendMessage(data, status) {
  let div = document.createElement("div");
  div.classList.add("message", status);
  let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
  `;
  div.innerHTML = content;
  chats.appendChild(div);
  chats.scrollTop = chats.scrollHeight;
}

socket.on("message", (data) => {
  appendMessage(data, "incoming");
});
