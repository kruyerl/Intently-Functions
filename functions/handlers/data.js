const { db } = require("../utility/admin");
const firebase = require('firebase')
/**
 *  !Sync Data Downstream
    type: GET
    no body required
 */


const getActions = function(req) {
  return new Promise(((resolve, reject) => {
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
        return actions;
      })
      .catch(error => console.error(error));
  }));
}
const getHabits = function(req) {
  return new Promise((resolve, reject) => {
    db.collection(`/users/${req.user.username}/habits`)
      .orderBy("createdAt", "desc")
      .get()
      .then(data => {
        const habits = [];
        data.forEach(doc => {
          habits.push({
            habitId: doc.id,
            body: doc.data().body,
            createdAt: doc.data().createdAt
          });
        });
        return habits ;
      })
      .catch(error => console.error(error));
  });
};



exports.syncDataDownstream = (req, res) => {
    const allData = {}
    Promise.all([getActions(req), getHabits(req)])
      .then(res => {
        console.log(res);
        return res.json({res});
      })
      .catch(err => {
        console.error(err);
      });
}


