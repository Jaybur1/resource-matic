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
    if (!req.session.userId) {
      res.redirect("/");
    } else {
      database.getUserWithId(db, req.session.userId
      ).then((user) => {
        if (!user) {
          req.session = null;
          res.redirect("/");
        } else {
          util.renderView(res, "profile", { user });
        }
      }).catch((_err) => {
        res.redirect("/");
      });
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
            database.updateUserWithCreds(db, [ user.email, pwHash, user.name, user.avatar, req.session.userId ]
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

  // DELETE profile
  //    Delete the current user's account.

  router.delete("/", (req, res) => {
    if (req.session.userId) {
      const user = req.body;
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



