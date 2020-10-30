
/**
 * 로그인, 회원가입 관련 router
 */


var express = require('express');
var router = express.Router();

var User = require("../schemas/users");


router.get("/registerPage", (req,res)=>{
    res.status(200);
    res.render("registerPage");
    res.end();
})

router.post("/register", (req,res)=>{
    console.log(req.body);
    User.find({user_id : req.body.userId}).then((users)=>{
        if(users.length == 0){
            var user_ = new User({user_id : req.body.userId, user_pwd : req.body.userPwd, user_nm : req.body.userNm, type : '00'});
            user_.save( (err)=>{
                if(err) {
                    res.send({result :false, msg : '회원가입 중 에러가 발생했습니다.'});
                    res.end();
                } else {
                    res.send({result :true});
                    res.end();
                }
            });
        }else {
            res.send({result :false, msg : '이미 등록된 아이디입니다.'});
            res.end();
        }
    }).catch((error)=>{
        console.log(error);
    })
   
    
})


router.get("/loginPage", (req, res) => {

    if(req.session.userSn){
        res.status(200);
        res.redirect("/");
        res.end();
        return;
    }
    res.status(200);
    res.render("loginPage");
    res.end();
});
  

router.post("/login", (req,res)=>{
    var userId = req.body.userId;
    var userPassword = req.body.userPassword;
    var _session = req.session;
  
    User.find({user_id : userId, user_pwd : userPassword}).then((users)=>{
  
      if(users.length > 0){
   
        _session.userNm = users[0].user_nm;
        _session.userId = users[0].user_id;
        _session.type = users[0].type;
        _session.userSn = users[0]._id;
  
        res.redirect("/test");
        res.end();
      } else {
          res.render("loginPage");
      }
  
    }).catch((err) => {
      console.log(err);
    });
  
  });


  router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect('/public/loginPage');
    res.end();
  });

module.exports = router;