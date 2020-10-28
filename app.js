const fs = require("fs");

const express = require("express");
const socket = require("socket.io");
const connect = require("./schemas");
const bodyParser = require("body-parser");
var session = require("express-session");
const http = require("http");
// const { nextTick } = require("process");
// const { EDESTADDRREQ } = require("constants");
const app = express();
connect();

var User = require("./schemas/users");

app.use(bodyParser.urlencoded({extended:false}));

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


// 세션관리
app.use(session({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true
 }));

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
  console.log(req.session);
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

app.use("/public/loginPage", (req, res) => {
  res.status(200);
  res.render("loginPage");
  res.end();
});

app.post("/public/login", (req,res)=>{
  var userId = req.body.userId;
  var userPassword = req.body.userPassword;
  //var _session = req.session;


  User.find({user_id : userId, user_password : userPassword}).then((users)=>{

    if(users.length > 0){
 
      req.session.userNm = users[0].user_nm;
      req.session.userId = users[0].user_id;
      req.session.type = users[0].type;
      req.session.userSn = users[0]._id;

      res.send(`userId : ${userId}, password : ${userPassword}`);
      res.end();
    }

  }).catch((err) => {
    console.log(err);
  });

})


server.listen(8080, () => {
  console.log("서버 실행 중");
});
