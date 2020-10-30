var socket = io();

// 채팅방 접속
socket.on("connect", () => {
  socket.emit("enter", { room: room });
});

// 메세지 받기(아티스트용)
socket.on("showMessageArt", (data) => {
  $("#content").append(`<p>${data.name}(아티스트) : ${data.message}</p`);
});

// 메세지 받기(사용자용)
socket.on("showMessage", (data) => {
  $("#content").append(`<p>${data.name} : ${data.message}</p`);
});

// 메세지 보내기
function send() {
  var message = $("#message").val();
  console.log(message);
  $("#message").val("");
  socket.emit("message", { type: "00", message: message });
}


