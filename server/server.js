// server.js
//
// Main entry point of the app.

// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT           = process.env.PORT || 3000;
const ENV            = process.env.ENV || "development";
const express        = require("express");
const bodyParser     = require("body-parser");
const sass           = require("node-sass-middleware");
const app            = express();
const morgan         = require("morgan");

const cookieSession  = require("cookie-session");

// PG database client/connection setup
const { Pool } = require("pg");
const db = new Pool(require("../lib/db.js"));
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// "dev" = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.use(cookieSession({
  name: "session",
  keys: ["key1"]
}));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src:         `${__dirname}/../styles`,
  dest:        `${__dirname}/../public/styles`,
  debug:       true,
  outputStyle: "expanded"
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/home",    require("./routes/home")(db));
// app.use("/login",   require("./routes/login")(db));
app.use("/users",   require("./routes/users")(db));
app.use("/profile", require("./routes/profile")(db));
app.use("/resources", require("./routes/resources")(db));



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});



// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/home");
  } else {
    res.render("index", {
      user: null
    });
  }
});
