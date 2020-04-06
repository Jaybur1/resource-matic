// users.js
//
// Routes related to users.

const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcrypt");

const util     = require("../util");
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

  router.get("/login", (_req, res) => {
    util.renderView(res, "login");
  });

  // GET /user/signup
  //    Renders the new user registration page.

  router.get("/signup", (_req, res) => {
    util.renderView(res, "signup");
  });

  // PUT /user/login
  //    Logs a user in (creates a session).

  router.put("/login", (req, res) => {
    const { email, password } = req.body;
    login(email, password, db)
      .then((user) => {
        if (!user) {
          res.send({ err: "Wrong email/password enterd" });
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

  // POST /user/register
  //    Registers a new user.

  router.post("/", (req, res) => {
    const { name, email, password } = req.body;
    util.hashPassword(password).then((hashedPassword) => {
      if (util.validateEmailFormat(email)) {
        database.getUserWithEmail(db, email).then((existingUser) => {
          if (!existingUser) {
            const newUser = { name, email, password: hashedPassword };
            database.addUser(newUser, db).then((addedUser) => {
              req.session.userId = addedUser.id;
              res.send({ redirect: "/home" });
            });
          } else {
            res.send({ err: "Email already exists" });
          }
        });
      } else {
        res.send({
          err: "Email should be in the right format example@example.com",
        });
      }
    });
  });

  return router;
};
