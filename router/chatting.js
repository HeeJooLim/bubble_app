/**
 * 채팅방 관련 router
 */

var express = require("express");
const session = require("express-session");

var router = express.Router();

var User = require("../schemas/users");
var Message = require("../schemas/messages");

router.get("/:roomId", (req, res) => {
  var roomId = req.params.roomId;

  if (!req.session.userSn) {
    res.redirect("/public/loginPage");
    res.end();
    return;
  }

  console.log("유저가 " + roomId + " 채팅방으로 접속했습니다.");
  User.findById(req.params.roomId, (err, data) => {
    var data_ = {
      roomId: data._id,
      room: data.user_nm,
      userNm: req.session.userNm,
    };
    res.status(200);
    console.log(req.session.type);
    if (req.session.type == "01") {
      res.render("artistChatRoom", data_);
    } else {
      res.render("chattingRoom", data_);
    }
    res.end();
  }).catch((err) => {
    console.log(err);
  });
});

router.get("/:roomId/chat", (req, res) => {
  Message.find({ roomId: req.params.roomId }, (err, data) => {
    res.send(data);
    res.end();
  }).catch((err) => {
    console.log(err);
  });
});

router.get("/:roomId/chat2", (req, res) => {
  var roomId = req.params.roomId;

  if (!req.session.userSn) {
    res.redirect("/public/loginPage");
    res.end();
    return;
  }

  User.findById(req.params.roomId, (err, data) => {
    var result = {};

    var data_ = {
      roomId: data._id,
      room: data.user_nm,
      userNm: req.session.userNm,
    };
    result.data = data_;
    var query='';
    if(req.session.userSn == roomId){
      query = {roomId: req.params.roomId};
    } else {
      query = {'roomId': req.params.roomId, $or: [{'sender': req.params.roomId}, {'sender' : req.session.userSn}]};
    }

    Message.find(query).sort({ _id: 'asc' }).exec( (err,data2)=>{
    //Message.find(query, (err, data2) => {

      console.log(data2);
      result.data_msg = data2;
      res.send(result);
      res.end();
    });
  }).catch((err) => {
    console.log(err);
  });
});

module.exports = router;
