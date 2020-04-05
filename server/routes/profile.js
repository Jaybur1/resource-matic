// profile.js
//
// Routes related to the profile page.

const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcrypt");

const { getUserWithId, updateUser, updateUserWithCreds, validatePassword } = require("../database");

const SALT_ROUNDS = 10;



const httpError = function(logMessage, err, res, httpStatus) {
  console.log(logMessage, err);
  res.status(httpStatus).end();
};



module.exports = (db) => {

  // TODO: Better error handling

  // GET profile
  //    Render the user profile page.

  router.get("/", (req, res) => {
    if (req.session.userId) {
      getUserWithId(req.session.userId, db
      ).then((user) => {
        console.log(user);
        res.render("profile", {
          APP_NAME: "tSyn",
          user: {
            email:  user.email,
            name:   user.name,
            avatar: user.avatar
          }
        });
      }).catch((_err) => {
        //console.log("getUserWithId failed:", err);
        res.redirect("/");
      });
    } else {
      res.redirect("/");
    }
  });

  // PUT profile
  //    Update user info.

  router.put("/", (req, res) => {
    if (req.session.userId) {
      const user = req.body;
      // Save stuff that doesn't require a password:
      if (!user.password) {
        updateUser(db, [ user.name, user.avatar, req.session.userId ]
        ).then(function(_updateRes) {
          res.redirect(303, "/home");
        }).catch(function(err) {
          httpError("updateUser failed:", err, res, 500);
        });
      // Check the password if changing login info:
      } else {
        validatePassword(db, req.session.userId, user.password
        ).then(function() {
          bcrypt.hash(user.newPassword, SALT_ROUNDS
          ).then(function(pwHash) {
            updateUserWithCreds(db, [ user.email, pwHash, user.name, user.avatar, req.session.userId ]
            ).then(function(_updateRes) {
              res.status(200).end();
            }).catch(function(err) {
              httpError("updateUserWithCreds failed:", err, res, 500);
            });
          }).catch(function(err) {
            httpError("bcrypt.hash failed:", err, res, 500);
          });
        }).catch(function(err) {
          httpError("validatePassword failed:", err, res, 403);
        });
      }
    } else {
      httpError("PUT /profile failed:", "No session", res, 303);
    }
  });

  return router;

};



