// users.js
//
// Routes related to users.

const router = require("express").Router();
const bcrypt = require("bcrypt");

const util = require("../util");
const database = require("../database");

const login = (email, password, db) => {
  return database.getUserWithEmail(db, email).then((user) => {
    if (!user) return null;
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
};

module.exports = (db) => {
  // GET /user/login
  //    Renders the login page.

  router.get("/login", (req, res) => {
    if (req.session.userId) {
      res.redirect("/home");
    } else {
      util.renderView(res, "login");
    }
  });

  // GET /user/signup
  //    Renders the new user registration page.

  router.get("/signup", (req, res) => {
    if (req.session.userId) {
      res.redirect("/home");
    } else {
      util.renderView(res, "signup");
    }
  });

  // PUT /user/login
  //    Logs a user in (creates a session).

  router.put("/login", (req, res) => {
    const { email, password } = req.body;
    login(email, password, db)
      .then((user) => {
        if (!user) {
          res.send({ err: "Incorrect email or password" });
          return;
        }
        req.session.userId = user.id;
        res.send({ redirect: "/home" });
      })
      .catch((err) => console.error(err));
  });

  // PUT /user/logout
  //    Logs a user out (destroy the current session).

  router.put("/logout", (req, res) => {
    req.session = null;
    res.send({ redirect: "/" });
  });

  // POST /user
  //    Registers a new user.

  router.post("/", (req, res) => {
    const { name, email, password } = req.body;
    util.hashPassword(password).then((hashedPassword) => {
      if (util.validateEmailFormat(email)) {
        database.getUserWithEmail(db, email).then((existingUser) => {
          if (!existingUser) {
            const newUser = { name, email, password: hashedPassword };
            database.addUser(db, newUser).then((addedUser) => {
              req.session.userId = addedUser.id;
              res.send({ redirect: "/home" });
            });
          } else {
            res.send({
              err: "An account with this email address already exists",
            });
          }
        });
      } else {
        res.send({
          err: "Please enter an email address",
        });
      }
    });
  });

  router.get("/curr", (req, res) => {
    if (req.session.userId) {
      const current = req.session.userId;
      res.json({current});
    } else {
      res.send("Forbidden Action Error code 403");
    }
  });

  return router;
};
