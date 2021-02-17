const mongoose = require("mongoose");

const properties={
  type: String,
  trim:true,
  required: true,
  minlength: 2,
  maxlength: 50
}
const Ideaschema = mongoose.Schema({
  title:
   properties,
  

  details: {
    ...properties,
    maxlength: 1024,
    
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Googleuser"
  },

  createdat: {
    type: Date,
    default: Date.now,
  }
 
});


  
module.exports = mongoose.model("Idea", Ideaschema);
