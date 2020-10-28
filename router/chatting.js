/**
 * 채팅방 관련 router
 */

var express = require("express");
const session = require("express-session");

var router = express.Router();

var User = require("../schemas/users");


router.get("/:roomId", (req, res) => {
    var roomId = req.params.roomId;

    if(!req.session.userSn){
        res.redirect("/public/loginPage");
        res.end();
        return;
    }
    
    console.log("유저가 " + roomId + " 채팅방으로 접속했습니다.");
    User.findById(req.params.roomId, (err, data)=>{
        var data_ = { roomId: data._id, room: data.user_nm, userNm : req.session.userNm };
      res.status(200);
      console.log(req.session.type);
      if(req.session.type=='01'){
        res.render("artistChatRoom", data_);
      }else{
        res.render("chattingRoom",data_);
      }
      res.end();
    }).catch((err)=>{
        console.log(err);
    })
  });
  

module.exports = router;
