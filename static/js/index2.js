var socket = io();

socket.on("connect", () => {
  var name = prompt("반갑습니다.", "");

  if (!name) {
    name = "익명";
  }

  socket.emit("newUser", name);
});

socket.on("update", (data) => {
  console.log(`${data.name}: ${data.message}`);
});

function send() {
  var message = document.getElementById("test").value;
  document.getElementById("test").value = "";
  socket.emit("message", { type: "message", message: message });
}
