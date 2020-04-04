const { getUserWithEmail, addUser } = require("../public/scripts/database");
const bcrypt = require("bcrypt");

const express = require("express");
const router = express.Router();

const login = (email, password, db) => {
  return getUserWithEmail(email, db).then((user) => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
};

const isUserExists = (email, db) => {
  return getUserWithEmail(email, db).then((user) => {
    if (!user.email) {
      return true;
    }
    return false;
  });
};

module.exports = (db) => {
  router.get("/login", (req, res) => {
    res.render("login", { user: null, err: null });
  });
  router.get("/signup", (req, res) => {
    res.render("signup", { user: null, err: null });
  });

  //Handle login
  router.put("/login", (req, res) => {
    const { email, password } = req.body;
    login(email, password, db)
      .then((user) => {
        if (!user) {
          res.render("login", {
            user: null,
            err: "Login or Password not match",
          });
          return;
        }
        req.session.userId = user.id;
        res.redirect("/home");
      })
      .catch((error) => console.error(error));
  });

  //handle logout
  router.delete("/", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
  });

  //handle register
  router.post("/", (req, res) => {
    const { name, avatar, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    getUserWithEmail(email, db).then((data) => {
      const user = { name, email, password: hash, avatar };
      if (!data) {
        addUser(user, db).then((data) => {
          req.session.userId = data.id;
          res.redirect("/home");
        });
      } else {
        res.render("signup", { user: null, err: "Email already exists" });
      }
    });
  });

  return router;
};
