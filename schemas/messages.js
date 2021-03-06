const mongoose = require("mongoose");

const { Schema } = mongoose;

const messagesSchema = new Schema({
  roomId: {
    type: String,
    required: true,
    unique: false,
  },
  roomImg: {
    type: String,
    required: false,
    unique: false,
  },
  sender: {
    type: String,
    required: true,
    unique: false,
  },
  senderNm : {
    type : String,
    required: false,
    unique: false,
  },
  receiver: {
    type: String,
    required: true,
    unique: false,
  },
  message: {
    type: String,
    required: true,
    unique: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messagesSchema);
