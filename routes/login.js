const { getUserWithEmail } = require('../public/scripts/database')
const bcrypt = require('bcrypt');

const express = require("express");
const router = express.Router();

const login =  function(email, password,db) {
  return getUserWithEmail(email,db)
  .then(user => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
}


module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login",{user:null, err:null});
  });



  router.put("/", (req,res) => {
    const {email, password} = req.body
    login(email,password,db).then(user => {
      if(!user){
        res.render('login',{user:null, err:"Login or Password not match"})
        return;
      }
      req.session.userId = user.id;
      res.redirect('/home');
    }).catch(error => console.error(error))
  })
  
  router.delete('/', (req,res) => {
    req.session.userId = null;
    res.redirect('/');
  })
  return router;
};
