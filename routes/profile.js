


const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;



module.exports = function(app, db) {

  // TODO: Promisefy further
  // TODO: Get user info from session
  // TODO: Better error handling

  // GET profile
  //    Render the user profile page.

  app.get("/profile", (_req, res) => {
    db.query("SELECT email, name, avatar FROM users WHERE id = 6",
      [  ]
    ).then(function(queryRes) {
      const user = queryRes.rows[0];
      res.render("profile", {
        APP_NAME: "tSyn",
        user:     user,
      });
    }).catch(function(err) {
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
      db.query("UPDATE users SET name = $1, avatar = $2 WHERE id = 6",
        [ user.name, user.avatar ]
      ).then(function(_queryRes) {
        //console.log(_queryRes.rows);
        //res.status(200).end();
        res.redirect(301, "/home");
      }).catch(function(err) {
        console.log(err);
        res.status(500).end();
      });
    // Check the password if changing login info:
    } else {
      console.log("Saving name, avatar, email, password...");
      db.query("SELECT password FROM users WHERE id = 6",
        [  ]
      ).then(function(queryRes) {
        bcrypt.compare(user.password, queryRes.rows[0].password
        ).then(function(pwMatch) {
          if (pwMatch) {
            //console.log("Password OK");
            bcrypt.hash(user.newPassword, SALT_ROUNDS
            ).then(function(pwHash) {
              db.query("UPDATE users SET email = $1, password = $2, name = $3, avatar = $4 WHERE id = 6",
                [ user.email, pwHash, user.name, user.avatar ]
              ).then(function(_queryRes) {
                //console.log(_queryRes.rows);
                //res.status(200).end();
                res.redirect(301, "/home");
              }).catch(function(err) {
                console.log(err);
                res.status(500).end();
              });
            }).catch(function(err) {
              console.log("bcrypt hash failed\n", err);
              res.status(500).end();
            });
          } else {
            console.log("Password mismatch");
            res.status(403).send("Password not OK");
          }
        }).catch(function(err) {
          console.log("bcrypt compare failed\n", err);
          res.status(500).end();
        });
      }).catch(function(err) {
        console.log("select password failed\n", err);
        res.status(500).end();
      });
    }
  });

};



