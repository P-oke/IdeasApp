const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  ensureGuest,
} = require("../middleware/authenticate");
const {truncate}=require("../middleware/truncate")
const Idea = require("../models/idea");
const moment = require("moment");
router.get("/", ensureGuest, (req, res) => {
  res.render("../views/welcome");
});
// {{user:req.user._id}}
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const ideas = await Idea.find({user:req.user.id}).lean();
   
    res.render("../views/dashboard", {
      name: req.user.firstname,
      ideas,
      moment,
      truncate
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
