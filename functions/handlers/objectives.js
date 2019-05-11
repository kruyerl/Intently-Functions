const { db } = require("../utility/admin");
const firebase = require('firebase')
/**
 *  !Get user Objectives
    type: GET
    no body required
 */
exports.getObjectives = (req, res) => {
    db.collection(`/users/${req.user.username}/objectives`)
      .orderBy("createdAt", "desc")
      .get()
      .then(data => {
        const objectives = [];
        data.forEach(doc => {
          objectives.push({
            objectiveId: doc.id,
            body: doc.data().body,
            createdAt: doc.data().createdAt
          });
        });
        return res.json(objectives);
      })
      .catch(error => console.error(error));
}

/**
 *  !Add new Objective
    type: POST
    {
        "content": "zcxvzxvcbn jjghfds qewrtyu",
        "isDone": false
    }
 */
exports.postObjective = (req, res) => {
  const newObjective = {
    createdAt: new Date().toISOString(),
    body: req.body
  }
  db.collection(`/users/${req.user.username}/objectives`)
    .add(newObjective)
    .then(doc => {
      return res.json({
        message: `Objective created successfully`
      });
    })
    .catch(error => {
      res.status(500).json({ error: `something went wrong` });
      console.error(error);
    });
};

/**
 *  !Update Objective
    type: PATCH
    {
        "objectiveId" : "6PReBTiOpl2fKJRtNigO",
        "updates" : {
            "content": "zcxvzxvcbn jjghfds qewrtyu",
	        "isDone": true
        }
    }
 */
exports.patchObjective = (req, res) => {
  const updates = req.body.updates
  db.collection(`/users/${req.user.username}/objectives`)
    .doc(`${req.body.objectiveId}`)
    .update({ body: updates })
    .then(doc => {
      return res.json({
        message: `Objective updated successfully`
      });
    })
    .catch(error => {
      console.error(error)
      return res.status(500).json({ error: `something went wrong` });
    });
};

/**
 *  !Delete Objective
    type: DELETE
    {
        "objectiveId" : "objectiveId"
    }
 */
exports.deleteObjective = (req, res) => {
  db.collection(`/users/${req.user.username}/objectives`)
    .doc(req.body.objectiveId)
    .delete()
    .then(doc => {
      return res.json({
        message: `Objectives deleted successfully`
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ error: `something went wrong` });
    });
};
