const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({
  // Making a foreign key named user so that it linked notes to user and no other user can see notes of another user
  user: {
    type: mongoose.Schema.Types.ObjectId, // setting type to objectId of database schema
    ref: 'user' // refence is same as scema name
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    default: "General"
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("note", NoteSchema);
