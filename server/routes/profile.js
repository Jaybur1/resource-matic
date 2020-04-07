// profile.js
//
// Routes related to the profile page.

const router = require("express").Router();

const util     = require("../util");
const database = require("../database");



module.exports = (db) => {

  // TODO: Input validation
  // TODO: Better error handling

  // GET profile
  //    Render the user profile page.

  router.get("/", (req, res) => {
    if (req.session.userId) {
      database.getUserWithId(db, req.session.userId
      ).then((user) => {
        if (user) {
          util.renderView(res, "profile", { user });
        } else {
          res.redirect("/");
        }
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
        database.updateUser(db, [ user.name, user.avatar, req.session.userId ]
        ).then(function(_updateRes) {
          res.redirect(303, "/home");
        }).catch(function(err) {
          util.httpError("updateUser failed:", err, res, 500);
        });
      // Check the password if changing login info:
      } else {
        database.validatePassword(db, req.session.userId, user.password
        ).then(function() {
          util.hashPassword(user.newPassword
          ).then(function(pwHash) {
            user.userId = req.session.userId;
            user.pwHash = pwHash;
            database.updateUserWithCreds(db, user
            ).then(function(_updateRes) {
              res.status(200).end();
            }).catch(function(err) {
              util.httpError("updateUserWithCreds failed:", err, res, 500);
            });
          }).catch(function(err) {
            util.httpError("bcrypt.hash failed:", err, res, 500);
          });
        }).catch(function(err) {
          util.httpError("validatePassword failed:", err, res, 403);
        });
      }
    } else {
      util.httpError("PUT /profile failed:", "No session", res, 303);
    }
  });

  router.delete("/", (req, res) => {
    if (req.session.userId) {
      const user = req.body;
      console.log("DELETE /profile", user);
      database.validatePassword(db, req.session.userId, user.password)
        .then(database.deleteUser(db, req.session.userId))
        .then(function() {
          req.session = null;
          res.status(200).end();
        }).catch(function(err) {
          util.httpError("DELETE /profile failed:", err, res, 500);
        });
    } else {
      util.httpError("DELETE /profile failed:", "No session", res, 303);
    }
  });

  return router;

};



