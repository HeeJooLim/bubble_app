const fs = require("fs");

const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { nextTick } = require("process");
const app = express();

const server = http.createServer(app);
const io = socket(server);

//socket io
io.sockets.on("connection", (socket) => {
  var artist = null;
  socket.on("newUser", (name) => {
    console.log(name + "님이 접속하였습니다.");

    // 소켓에 이름 저장해두기. 각 접속한 사용자가 각 소켓에 저장하는 의미로 생각하면 될 듯..
    socket.name = name;
    io.sockets.emit("update", {
      type: "connect",
      name: "server",
      message: name + "님이 접속하였습니다.",
    });
  });

  // 전송한 메세지 받기
  socket.on("message", (data) => {
    data.name = socket.name; // 받은 데이터에 누가 보냈는지 이름을 추가

    console.log(data);
    socket.broadcast.emit("update", data);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("update", {
      type: "disconnect",
      name: "server",
      message: socket.name + "님이 나가셨습니다.",
    });
  });
});

app.use("/css", express.static("./static/css"));
app.use("/js", express.static("./static/js"));

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

app.get("/", (req, res) => {
  console.log("유저가 / 으로 접속했습니다.");

  fs.readFile("./static/html/index.html", (err, data) => {
    if (err) {
      res.send("에러가 발생했습니다");
    } else {
      res.writeHead(200, { "context-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

server.listen(8080, () => {
  console.log("서버 실행 중");
});
