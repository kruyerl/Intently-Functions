const {db} = require('../utility/admin')

exports.getUserActions = (req, res) => {
    db.collection("actions")
      .where("userHandle", "==", req.user.handle)
      .orderBy("createdAt", "desc")
      .get()
      .then(data => {
        const actions = [];
        data.forEach(doc => {
          actions.push({
            actionId: doc.id,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            createdAt: doc.data().createdAt
          });
        });
        return res.json(actions);
      })
      .catch(error => console.error(error));
}

exports.postOneAction = (req, res) => {
    const newAction = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };
    db
        .collection('actions')
        .add(newAction)
        .then((doc) => {
            return res.json({ message: `document ${doc.id} created successfully` })
        })
        .catch((error) => {
            res.status(500).json({ error: `something went wrong` })
            console.error(error)
        })
}
