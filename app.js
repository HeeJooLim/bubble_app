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

app.use(bodyParser.urlencoded({ extended: false }));

const session = require("express-session")({
  secret: "@#@$MYSIGN#@$#$",
  resave: false,
  saveUninitialized: true,
});

var sharedsession = require("express-socket.io-session");
const { $where } = require("./schemas/users");
app.use(session);
io.use(sharedsession(session));

app.use("/css", express.static("./static/css"));
app.use("/js", express.static("./static/js"));
app.use("/web", express.static("./web/"));

app.set("view engine", "ejs"); // 1
app.use(express.static(__dirname + "/public"));

app.use("/public", public);
app.use("/chatting", chatting);

const moment = require("moment");

app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});


app.get("/", (req, res) => {
  console.log("유저가 / 으로 접속했습니다.");

  if (!req.session.userSn) {
    res.redirect("/public/loginPage");
    res.end();
    return;
  }

  if (req.session.type == "01") {

    res.status(200);
    res.render("artistChatRoom", { roomId: req.session.userSn });
    res.end();

  } else {
    User.find({ type: "01" }, (err, data) => {
      res.status(200);
      res.render("mainPage", { data: data });
      res.end();
    });
  }
});

//socket io

var rooms = [];
io.sockets.on("connection", (socket) => {
  // (1) 채팅방 들어가기
  socket.on("enter", (data) => {

    if (socket.handshake.session.type == "01") {
      rooms[data.room] = new Object();
      rooms[data.room].socket_ids = new Object();
      rooms[data.room].socket_ids["artist"] = socket.id;
    }

    socket.name = socket.handshake.session.userNm;
    socket.join(data.room);
  });

  socket.on("message", (data) => {
    data.name = socket.name;
    var createdAt = new Date();

    const newMessage = new message({
      roomId: data.room,
      sender: socket.handshake.session.userSn,
      senderNm: socket.handshake.session.userNm,
      receiver: data.room,
      message: data.message,
      roomImg : socket.handshake.session.userImg,
      createdAt: createdAt,
    });

    if (data.type == "00") {
      newMessage.save(function (err, data2) {
        if (err) {
          console.log("error", err);
        }
        data.senderNm = socket.handshake.session.userNm;
        data.createdAt = createdAt;

        io.sockets.to(socket.id).emit("showMessage", data);
        if(rooms[data.room] && rooms[data.room].socket_ids["artist"]){
          io.sockets.to(rooms[data.room].socket_ids["artist"]).emit("showMessage", data);
        }
      });
    } else if (data.type == "01") {
      newMessage.save(function (err, data2) {
        if (err) {
          console.log("error", err);
        }
        data.roomImg = socket.handshake.session.userImg;
        data.createdAt = createdAt;
        io.sockets.to(data.room).emit("showMessageArt", data);
      });
    }
  });

  socket.on("leave", (data)=>{
    socket.leave(data.room);
  })

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

server.listen(8080, () => {
  console.log("서버 실행 중");
});
