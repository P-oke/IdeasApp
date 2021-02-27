const express = require("express");
const router = express.Router();
const Idea = require("../models/idea");
const moment = require("moment");
const { ensureAuthenticated } = require("../middleware/authenticate");
const validateIdea=require("../middleware/validate")



//get todo add
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("../views/Ideas/add",);
});

//handle todo post request
router.post("/", ensureAuthenticated, async (req, res) => {
  
  const {error}=validateIdea(req.body)
     console.log(error);
     if (error) {
     res.render("../views/Ideas/add", {
       error:{
        message: error.details[0].message
       }

    })}
   try {
   
    req.body.user = req.user.id;
    const {title, details}=req.body
    let idea={
      title:title.trim(),
      details:details.trim()
    }
    await Idea.create(idea);

    req.flash("success_msg", "you've created an Idea");
    res.redirect("/dashboard");
  } catch (error) {
    return res.render("../views/errors/500")
    console.error(error);
  }
  
});

//show a specific todo
router.get("/:id", ensureAuthenticated, async (req, res) => {
 
  try {
    
    let idea = await Idea.findOne({_id:req.params.id}).populate("user").lean();
    if (idea) {
      res.render("../views/Ideas/show", { idea, moment });
    } 
      
     
  } catch (error) {
    return res.render("../views/errors/404")
    // console.log(error.message);
  }
});

//get a specific story
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  try {
    let idea = await Idea.findById(req.params.id).lean();
    if (idea) {
      res.render("../views/Ideas/edit", { idea });
    }
  } catch (error) {

    console.log(error.message);
    return res.render("../views/errors/500")
  }
});

//update a specific post
router.put("/:id", ensureAuthenticated, async (req, res) => {
  
  try {
    let idea = await Idea.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (idea) {
      req.flash("success_msg", "You've updated your idea")
      res.redirect("/dashboard");
    }
  } catch (error) {
    return res.render("../views/errors/500")
  
  }
});

//delete a specific post
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    let idea = await Idea.findById(req.params.id);
    if (idea) {
      idea.remove();
      req.flash("error_msg", "you've deleted an Idea");
      res.redirect("/dashboard");
    } 
  } catch (error) {
    return res.render("../views/errors/500")
  }
});

module.exports = router;
