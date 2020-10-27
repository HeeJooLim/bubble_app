
var socket = io();


// 채팅방 접속
socket.on("connect", () => {
    var name = "사용자1";

    socket.emit('enter', {room:room, name : name});
    //socket.emit("newUser", name);
  });


// 메세지 받기
socket.on("showMessage", (data)=>{
    $("#content").append(`<p>${data.name} : ${data.message}</p`);
})

function send() {
    var message = $("#message").val();
    socket.emit("message", { type: "message", message: message });
  }
  