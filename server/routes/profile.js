// profile.js
//
// Profile page routes.

const bcrypt = require("bcrypt");

const { getUserWithId, updateUser, updateUserWithCreds, validatePassword } = require("../database");

const SALT_ROUNDS = 10;



module.exports = function(app, db) {

  // TODO: Better error handling

  // GET profile
  //    Render the user profile page.

  app.get("/profile", (req, res) => {
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
    }).catch((err) => {
      console.log(err);
      res.status(500).end();
    });
  });

  // PUT profile
  //    Update user info.

  app.put("/profile", (req, res) => {
    console.log(req.body);
    const user = req.body;
    // Save stuff that doesn't require a password:
    if (!user.password) {
      //console.log("Saving name, avatar...", user);
      updateUser(db, [ user.name, user.avatar, req.session.userId ]
      ).then(function(_updateRes) {
        //console.log(_updateRes.rows);
        //res.status(200).end();
        res.redirect(303, "/home");
      }).catch(function(err) {
        console.log(err);
        res.status(500).end();
      });
    // Check the password if changing login info:
    } else {
      //console.log("Saving name, avatar, email, password...");
      validatePassword(db, req.session.userId, user.password
      ).then(function() {
        bcrypt.hash(user.newPassword, SALT_ROUNDS
        ).then(function(pwHash) {
          updateUserWithCreds(db, [ user.email, pwHash, user.name, user.avatar, req.session.userId ]
          ).then(function(_updateRes) {
            //console.log(_updateRes.rows);
            //res.status(200).end();
            res.status(200).end();
          }).catch(function(err) {
            console.log(err);
            res.status(500).end();
          });
        }).catch(function(err) {
          console.log("bcrypt hash failed\n", err);
          res.status(500).end();
        });
      }).catch(function(err) {
        console.log("validatePassword failed\n", err);
        res.status(403).end();
      });
    }
  });

};



