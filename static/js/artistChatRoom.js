
var socket = io();


// 채팅방 접속
socket.on("connect", () => {
    var name = name;
    socket.emit('enter', {room:room, name : name});
  });


// 메세지 받기
socket.on("showMessage", (data)=>{
    $("#userMessage").append(`<p>${data.name} : ${data.message}</p`);
})

function send() {
    var message = $("#message").val();
    socket.emit("artistMessage", { type: "message", message: message });
}
  