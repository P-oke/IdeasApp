const express = require("express");

const passport = require("passport");
const router = express.Router();

//get auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//logout user
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "youre logged out");
  res.redirect("/");
});

module.exports = router;
