const { db } = require("../utility/admin");
const firebase = require('firebase')
/**
 *  !Get user actions
    type: GET
    no body required
 */
exports.getActions = (req, res) => {
    db.collection(`/users/${req.user.username}/actions`)
      .orderBy("createdAt", "desc")
      .get()
      .then(data => {
        const actions = [];
        data.forEach(doc => {
          actions.push({
            actionId: doc.id,
            body: doc.data().body,
            createdAt: doc.data().createdAt
          });
        });
        return res.json(actions);
      })
      .catch(error => console.error(error));
}

/**
 *  !Add new action
    type: POST
    {
        "content": "action content",
        "due" : "duedate",
        "scheduled" : "scheduleddate",
        "category" : "category",
        "objectiveId" : "objectiveId"


    }
 */
exports.postAction = (req, res) => {

    const newAction = {
      createdAt: new Date().toISOString(),
      body: req.body
    };
    db.collection(`/users/${req.user.username}/actions`)
    .add(newAction)
    .then(doc => {
      return res.json({
        message: `action created successfully`
      });
    })
    .catch(error => {
      res.status(500).json({ error: `something went wrong` });
      console.error(error);
    });
}

/**
 *  !Update action
    type: PATCH
    {
        "actionId" : "actionId",
        "updates" :{

            body:{
                "content": "action content",
                "due" : "duedate",
                "scheduled" : "scheduleddate",
                "category" : "category",
                "objectiveId" : "objectiveId"
            }
        }
    }
 */
exports.patchAction = (req, res) => {
    const updates = req.body.updates;

    db.collection(`/users/${req.user.username}/actions`)
      .doc(`${req.body.actionId}`)
      .update({body: updates})
      .then(doc => {
        return res.json({
          message: `action updated successfully`
        });
      })
      .catch(error => {
        console.error(error);
        return res.status(500).json({ error: `something went wrong` });
      });

}

/**
 *  !Delete action
    type: DELETE
    {
        "actionId" : "actionId"
    }
 */
exports.deleteAction = (req, res) => {
    db.collection(`/users/${req.user.username}/actions`)
      .doc(req.body.actionId)
      .delete()
      .then(doc => {
        return res.json({
          message: `action deleted successfully`
        });
      })
      .catch(error => {
        console.error(error);
        return res.status(500).json({ error: `something went wrong` });
      });
}
