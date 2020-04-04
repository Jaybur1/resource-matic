const { getUserWithId } = require('../public/scripts/database')

const express = require("express");
const router = express.Router();



module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId;
    if(!userId){
      res.redirect('/');
    }else {
      getUserWithId(userId,db).then(data => {
        // res.send(data)
        res.render("home",{user:data, err:null});
      })
    }
  });

  return router;
}
