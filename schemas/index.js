const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    mongoose.connect(
      "mongodb://heejoo:heejoo@localhost:27017/admin",
      {
        dbName: "chatting",
      },
      (error) => {
        if (error) {
          console.log("몽고디비에러", error);
        } else {
          console.log("몽고디비 연결");
        }
      }
    );
  };

  connect();

  mongoose.connection.on("error", (error) => {
    console.log("몽고디비 에러");
  });
  mongoose.connection.on("disconnection", () => {
    console.log("연결 끊김. 재시도");
    connect();
  });

  require("./users");
};
