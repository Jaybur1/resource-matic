// server.js
//
// Main entry point of the app.

// Load .env data into process.env
require("dotenv").config();
const c = require("./constants");

const COOKIE_SECRET  = process.env.COOKIE_SECRET || (process.env.development ? "totally-impossible-to-crack-cookie-secret" : "");
if (!COOKIE_SECRET) {
  console.log("Refusing to run without cookie secret outside development environment.");
  process.exit(1);
}

// Database setup:
const db = require("./pg.js")();
db.connect().catch((err) => {
  console.log("db.connect failed:\n", err);
  process.exit(1);
});

// Web server setup:
const PORT           = process.env.PORT || c.DEFAULT_PORT;
const ENV            = process.env.ENV || "development";
const express        = require("express");
const bodyParser     = require("body-parser");
const sass           = require("node-sass-middleware");
const app            = express();
const morgan         = require("morgan");
const cookieSession  = require("cookie-session");

app.use(morgan("dev"));
app.use(cookieSession({
  name:   "session",
  secret: COOKIE_SECRET
}));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src:         `${__dirname}/../styles`,
  dest:        `${__dirname}/../public/styles`,
  debug:       true,
  outputStyle: "expanded"
}));
// Set the static assets route:
app.use(express.static("public"));
// Mount all app endpoint routes:
app.use("/home",    require("./routes/home")(db));
//app.use("/login",   require("./routes/login")(db));
app.use("/users",   require("./routes/users")(db));
app.use("/profile", require("./routes/profile")(db));
app.use("/resources", require("./routes/resources")(db));

// Start listening for client connections:
app.listen(PORT, () => {
  console.log(`${c.APP_NAME} listening on port ${PORT}`);
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



