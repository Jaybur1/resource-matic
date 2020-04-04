const { getUserWithEmail } = require('../public/scripts/database')
const bcrypt = require('bcrypt');

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  });

  router.put("/", (req,res) => {
    const user_email = req.body.email
    getUserWithEmail(user_email,db).then(data => {
      res.send(data);
    })

  })
  return router;
};
