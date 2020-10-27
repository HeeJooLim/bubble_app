const fs = require("fs");

const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { nextTick } = require("process");
const app = express();

const server = http.createServer(app);

const io = socket(server);


var chatRoom; // 채팅방

//socket io
io.sockets.on("connection", (socket) => {

  // (1) 채팅방 들어가기
  socket.on('enter', (data)=>{
    socket.leave(chatRoom);

    chatRoom = data.room;
    socket.name = data.name;
    socket.join(chatRoom);
  });

  socket.on("message", (data)=>{
    data.name = socket.name;
    io.sockets.to(chatRoom).emit("showMessage", data);
  });

  socket.on("artistMessage", (data)=>{
    data.name = socket.name;
    io.sockets.to(chatRoom).emit("showMessage", data);
  });

  socket.on("disconnect", () => {
    socket.leave(chatRoom);
  });
  
});

app.use("/css", express.static("./static/css"));
app.use("/js", express.static("./static/js"));


app.set('view engine','ejs'); // 1
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  console.log("유저가 / 으로 접속했습니다.");

  res.status(200);
  res.render('mainPage');
  res.end();
});


app.get("/chatting/:artist", (req, res) => {
  var artist = req.params.artist;
  console.log("유저가 " + artist + " 채팅방으로 접속했습니다.");
  
  res.status(200);
  res.render('chattingRoom', {room:artist});
  res.end();

});

app.get("/admin/chatting/:artist", (req, res) => {
  var artist = req.params.artist;
  console.log("유저가 " + artist + " 채팅방으로 접속했습니다.");
  
  res.status(200);
  res.render('artistChatRoom', {room:artist});
  res.end();

});

app.use("/public/:path", (req, res) => {
  var path = req.params.path;
  var method = req.method;

  if (path == "loginPage") {
    if (method == "GET") {
      fs.readFile("./static/html/loginPage.html", (err, data) => {
        if (err) {
          res.send("에러가 발생했습니다");
        } else {
          res.writeHead(200, { "context-Type": "text/html" });
  
          res.write(data);
        
          res.end();
        }
      });
    }
  }
});

server.listen(8080, () => {
  console.log("서버 실행 중");
});
