// comments.js
//
// Routes related to resource comments.

const router = require("express").Router();

const util = require("../util");



module.exports = (db) => {

  // GET /comment/list
  //    Gets a list of all comment IDs for a resource.
  // Arguments:
  //    resourceId      Integer: Resource to retrieve comments for.
  // Returns: {
  //   commentIdList: [1, 2, 3, ...]
  // }

  router.get("/list", (req, res) => {
    const userId     = req.session.userId;
    const resourceId = req.query.resourceId;
    if (!userId) {
      util.httpError("GET /comment/list failed:", "No session", res, 403);
    } else if (!resourceId) {
      util.httpError("GET /comment/list failed:", "Resource ID not specified", res, 400);
    } else {
      db.query("SELECT id FROM comments WHERE resource_id = $1", [ resourceId ])
        .then((queryRes) => {
          res.status(200).json({ commentIdList: queryRes.rows.map(x => x.id) });
        }).catch((err) => {
          util.httpError("GET /comment/list SELECT failed:", err, res, 500);
        });
    }
  });

  // GET /comment
  //    Gets comments for a resource from a list of IDs.
  // Arguments:
  //    resourceId        Integer: Resource to retrieve comments for.
  //    [commentIdList]   Array:   Optional: Array of comment IDs to retrieve comments for.
  //                               If not specified, all comments are retrieved.
  // Returns:
  //  {
  //    comments: [
  //      {
  //        id:
  //        userId:
  //        body:
  //        created:
  //        updated:
  //      },
  //      ...
  //    ]
  //  }

  router.get("/", (req, res) => {
    const userId        = req.session.userId;
    const resourceId    = req.query.resourceId;
    const commentIdList = req.query.commentIdList;
    console.log(req.query);
    if (!userId) {
      util.httpError("GET /comment failed:", "No session", res, 403);
    } else if (!resourceId) {
      util.httpError("GET /comment failed:", "Resource ID not specified", res, 400);
    } else {
      // db.query("SELECT id, user_id, body, created, updated FROM comments WHERE resource_id = $1 AND id IN ($2::int[])", [ resourceId, commentIdList ])
      db.query(`SELECT id, user_id, body, created, updated FROM comments WHERE resource_id = $1${commentIdList ? ` AND id IN (${commentIdList.join(",")})` : ""}`, [ resourceId ])
        .then((queryRes) => {
          res.status(200).json({ comments: queryRes.rows });
        }).catch((err) => {
          util.httpError("GET /comment SELECT failed:", err, res, 500);
        });
    }
  });

  // POST /comment
  //    Add a comment to a resource.
  // Arguments:
  //    resourceId   Integer: Resource to add a comment for.
  //    content      String:  The comment body.

  router.post("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceId = req.body.resourceId;
    const content    = req.body.content.trim();
    if (!userId) {
      util.httpError("POST /comment failed:", "No session", res, 403);
    } else if (!resourceId) {
      util.httpError("POST /comment failed:", "Resource ID not specified", res, 400);
    } else if (!content) {
      util.httpError("POST /comment failed:", "Content not specified", res, 400);
    } else {
      db.query("INSERT INTO comments (user_id, resource_id, body) VALUES ($1, $2, $3)", [ userId, resourceId, content ])
        .then((_queryRes) => {
          res.status(200).end();
        }).catch((err) => {
          util.httpError("POST /comment INSERT failed:", err, res, 500);
        });
    }
  });

  // PUT /comment
  //    Update a comment on a resource.
  // Arguments:
  //    commentId   Integer: Resource to update the comment for.
  //    content     String:  The comment body.

  router.put("/", (req, res) => {
    const userId    = req.session.userId;
    const commentId = req.body.commentId;
    const content   = req.body.content.trim();
    if (!userId) {
      util.httpError("PUT /comment failed:", "No session", res, 403);
    } else if (!commentId) {
      util.httpError("PUT /comment failed:", "Comment ID not specified", res, 400);
    } else if (!content) {
      util.httpError("PUT /comment failed:", "Content not specified", res, 400);
    } else {
      db.query("UPDATE comments SET body = $1 WHERE id = $2", [ content, commentId ])
        .then((_queryRes) => {
          res.status(200).end();
        }).catch((err) => {
          util.httpError("PUT /comment UPDATE failed:", err, res, 500);
        });
    }
  });

  // DELETE /comment
  //    Remove a comment from a resource.
  // Arguments:
  //    commentId   Integer: Comment to delete.

  router.delete("/", (req, res) => {
    const userId    = req.session.userId;
    const commentId = req.body.commentId;
    if (!userId) {
      util.httpError("DELETE /comment failed:", "No session", res, 403);
    } else if (!commentId) {
      util.httpError("DELETE /comment failed:", "Comment ID not specified", res, 400);
    } else {
      db.query("DELETE FROM comments WHERE id = $1", [ commentId ])
        .then((_queryRes) => {
          res.status(200).end();
        }).catch((err) => {
          util.httpError("DELETE /comment DELETE failed:", err, res, 500);
        });
    }
  });

  return router;

};



