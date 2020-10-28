const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema({
  type: {
    type: String,
    required: true,
    unique: false,
  },
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_password: {
    type: String,
    required: true,
    unique: false,
  },
  user_nm: {
    type: String,
    required: true,
    unique: false,
  },
  user_img: {
    type: String,
    required: false,
    unique: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", usersSchema);
