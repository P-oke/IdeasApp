const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expresslayout = require("express-ejs-layouts");
const passport = require("passport");
const mongostore = require("connect-mongo")(session);
const connectDB = require("./config/db");

dotenv.config({ path: "./config/.env" });

//passport oauth config
require("./config/oauthpassport")(passport);


//database connection
connectDB();

const app = express();
//body parser
app.use(express.json());
//form data
app.use(express.urlencoded({ extended: false }));

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//express session middleware
app.use(
  session({
    secret: "session",
    resave: true,
    saveUninitialized: true,
    store: new mongostore({ mongooseConnection: mongoose.connection }),
  })
);

//set public folder
app.use(express.static(path.join(__dirname, "public")));

//middleware
app.use(expresslayout);
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");

//set up flash
app.use(flash());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//routers
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/ideas", require("./routes/idea"));

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on port${port}`);
});
