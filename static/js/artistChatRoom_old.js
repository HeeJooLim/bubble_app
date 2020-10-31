
var socket = io();


// 채팅방 접속
socket.on("connect", () => {

    socket.emit("enter", { room: room });
  });

  
// 메세지 받기(아티스트용)
socket.on("showMessageArt", (data) => {
    $("#content").append(`<p>${data.name}(아티스트) : ${data.message}</p`);
  });

// 메세지 받기
socket.on("showMessage", (data)=>{
    $("#userMessage").append(`<p>${data.name} : ${data.message}</p`);
})

function send() {
    var message = $("#message").val();
     $("#message").val("");
  socket.emit("message", { type: "01",  message: message });
}
  