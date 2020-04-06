// resources.js
//
// Resource-related routes.

const router = require("express").Router();

const database = require("../database");



const resourcesRoutes = (db) => {
  // Handle request resources
  router.get("/", (req, res) =>
    database.getResources(db, req.query)
      .then((queryRes) => res.json(queryRes))
  );

  //Handle create new resource
  router.post("/", (req,res) => {
    const user_id = req.session.userId
    const data = {...req.body,user_id}
    database.addResource(data,db).then(resource => {
      res.send(resource)
    })
  })

  return router;
};




module.exports = resourcesRoutes;
