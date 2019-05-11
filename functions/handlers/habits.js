const { db } = require("../utility/admin");
const firebase = require('firebase')
/**
 *  !Get user habits
    type: GET
    no body required
 */
exports.getHabits = (req, res) => {
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
        return res.json(habits);
      })
      .catch(error => console.error(error));
}

/**
 *  !Add new habit
    type: POST
    {
        "content": "zcxvzxvcbn jjghfds qewrtyu",
        "1": false,
        "2": false,
        "3": false,
        "4": false,
        "5": false,
        "6": false,
        "7": false
    }
 */
exports.postHabit = (req, res) => {

    const newHabit = {
      createdAt: new Date().toISOString(),
      body: req.body
    };
    db.collection(`/users/${req.user.username}/habits`)
      .add(newHabit)
      .then(doc => {
        return res.json({
          message: `habit created successfully`
        });
      })
      .catch(error => {
        res.status(500).json({ error: `something went wrong` });
        console.error(error);
      });
}

/**
 *  !Update habit
    type: PATCH
     {
        "habitId" : "6PReBTiOpl2fKJRtNigO",
        "updates" : {
            "content": "zcxvzxvcbn jjghfds qewrtyu",
	        "1": true,
	        "2": true,
	        "3": false,
	        "4": false,
	        "5": false,
	        "6": false,
	        "7": false
        }
    }
 */
exports.patchHabit = (req, res) => {
    const updates = req.body.updates;

    db.collection(`/users/${req.user.username}/habits`)
      .doc(`${req.body.habitId}`)
      .update({body: updates})
      .then(doc => {
        return res.json({
          message: `habit updated successfully`
        });
      })
      .catch(error => {
        console.error(error);
        return res.status(500).json({ error: `something went wrong` });
      });

}

/**
 *  !Delete habit
    type: DELETE
    {
        "habitId" : "habitId"
    }
 */
exports.deleteHabit = (req, res) => {
    db.collection(`/users/${req.user.username}/habits`)
      .doc(req.body.habitId)
      .delete()
      .then(doc => {
        return res.json({
          message: `habit deleted successfully`
        });
      })
      .catch(error => {
        console.error(error);
        return res.status(500).json({ error: `something went wrong` });
      });
}
