const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true // Removed unique property from password because it make and extra index in database
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

// No need to create new index , we can handle the unique email problem from auth.js file
module.exports = mongoose.model("user", UserSchema);