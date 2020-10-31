
var socket = io();

// 채팅방 접속
socket.on("connect", () => {
  //socket.emit("enter", { room: room });
});

// 메세지 받기(아티스트용)
socket.on("showMessageArt", (data) => {
  artistHtml(data);
  $('.msg_history').scrollTop($(".msg_history")[0].scrollHeight);
});

// 메세지 받기(사용자용)
socket.on("showMessage", (data) => {
  userHtml(data);
  $('.msg_history').scrollTop($(".msg_history")[0].scrollHeight);
});

// 메세지 보내기
function send() {
  var message = $("#message").val();
  $("#message").val("");
  socket.emit("message", { type: "00", message: message, room : room });
}


