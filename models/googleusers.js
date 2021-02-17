const mongoose = require("mongoose");

const googleuserschema = mongoose.Schema({
  googleid: {
    type: String,
    required: true,
  },
  displayname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },

  createdat: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Googleuser", googleuserschema);
