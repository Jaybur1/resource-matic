const { getUserWithEmail, addUser } = require("../public/scripts/database");
const bcrypt = require("bcrypt");

const express = require("express");
const router = express.Router();

const login = (email, password, db) => {
  return getUserWithEmail(email, db).then((user) => {
    if (!user) return null;
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
};

//validates thats the input email is in the right format => example@example.com
const emailFormatValidation = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
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
    if (emailFormatValidation(email)) {
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
    } else {
      res.render("signup", {
        user: null,
        err: "Email should be in the right format example@example.com",
      });
    }
  });

  return router;
};
