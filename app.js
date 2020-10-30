const fs = require("fs");
const express = require("express");
const socket = require("socket.io");
const bodyParser = require("body-parser");

var User = require("./schemas/users");
var public = require("./router/public");
var message = require("./schemas/messages");
var chatting = require("./router/chatting");

const http = require("http");
const app = express();
const server = http.createServer(app);
var io = socket(server);

const connect = require("./schemas");
connect();

app.use(bodyParser.urlencoded({extended:false}));

const session = require('express-session')({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true
 });

var sharedsession = require("express-socket.io-session"); 
const { $where } = require("./schemas/users");
app.use(session);
io.use(sharedsession(session));

app.use("/css", express.static("./static/css"));
app.use("/js", express.static("./static/js"));
app.use("/web", express.static("./web/"));

app.set('view engine','ejs'); // 1
app.use(express.static(__dirname + '/public'));

app.use("/public", public);
app.use("/chatting", chatting);

app.get("/", (req, res) => {

  console.log("유저가 / 으로 접속했습니다.");
  
  if(!req.session.userSn){
    res.redirect("/public/loginPage");
    res.end();
    return;
  }

  User.find({type:'01'}, (err,data)=>{
    res.status(200);
    res.render('mainPage', {data : data});
    res.end();
  });
});



app.get("/test", (req, res) => {

  console.log("유저가 / 으로 접속했습니다.");
  
  if(!req.session.userSn){
    res.redirect("/public/loginPage");
    res.end();
    return;
  }

  User.find({type:'01'}, (err,data)=>{
    res.status(200);
    res.render('mainPageNew', {data : data});
    res.end();
  });
});



//socket io

var chatRoom; // 채팅방
var artistSocketId;
io.sockets.on("connection", (socket) => {

  // (1) 채팅방 들어가기
  socket.on('enter', (data)=>{
    socket.leave(chatRoom);

    chatRoom = data.room;
    
    if(socket.handshake.session.type == '01'){
      artistSocketId = socket.id;
    }

    socket.name = socket.handshake.session.userNm;
    socket.join(chatRoom);
  });

  socket.on("message", (data)=>{
    data.name = socket.name;
    if(data.type=="00"){

      const newMessage = new message({
        roomId : chatRoom,
        sender : socket.handshake.session.userSn,
        receiver : chatRoom,
        message : data.message
      })

      newMessage.save(function (err, data2) {
        if (err) {// TODO handle the error
            console.log("error");
        }
        console.log("haah");

        io.sockets.to(artistSocketId).to(socket.id).emit("showMessage", data);
      });

    } else if(data.type=="01"){
      io.sockets.to(chatRoom).emit("showMessageArt", data);
    }
  });


  socket.on("disconnect", () => {
    socket.leave(chatRoom);
  });
  
});



server.listen(8089, () => {
  console.log("서버 실행 중");
});
