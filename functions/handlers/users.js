const {db} = require('../utility/admin')
const firebase = require('firebase')
const config = require('../utility/config')
firebase.initializeApp(config)

const {
  validateSignupData,
  validateLoginData,
  validateReset
} = require("../utility/validators");


exports.patchUser = (req, res) => {
    const updates = req.body.updates
    console.warn('updates',updates)
    db.collection("users")
      .doc(`${req.user.username}`)
      .update(updates)
      .then(doc => {
        return res.json({
          message: `document updated successfully`
        });
      })
      .catch(error => {
        console.error(error);
        return res.status(500).json({ error: `something went wrong` });
      });
}

exports.getUser = (req, res) => {
  db.doc(`users/${req.user.username}`)
    .get()
    .then(doc => {
      console.log(req.user.username);
      console.log("doc", doc);
      if (doc.exists) {
        console.log("Document data:", doc.data());
        return res.status(200).json(doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      return null;
    })
    .catch(error => {
      console.log("Error getting document:", error);
    });
};

exports.resetPassword = (req, res) => {
    const emailAddress = req.body.email;
    const { valid, errors } = validateReset(emailAddress);
    if (!valid) return res.status(400).json(errors);

    firebase.auth().sendPasswordResetEmail(`${emailAddress}`);
    return res.json({ message: `Password reset email for ${emailAddress} sent` });
}

exports.signUp = (req, res) => {

    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username
    }

    const {valid, errors} = validateSignupData(newUser)
    if(!valid) return res.status(400).json(errors)

    let token, userId;
    db.doc(`/users/${newUser.username}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ username: 'this username is already taken' })
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid
            return data.user.getIdToken()
        })
        .then(idToken => {
            token = idToken
            const userTemplate = {
                userId,
                username: newUser.username,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                totalActionsCompleted: 0,
                objectivesCompleted: 0,

            };
            return db.doc(`/users/${newUser.username}`).set(userTemplate)
        })
        .then(() => {
            return res.status(200).json({ token })
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email already in use' })
            } else if (error.code === 'auth/weak-password') {
                return res.status(400).json({ password: 'Stronger password required' })
            } else {
                return res.status(500).json({ error: error.code })
            }
        })
    return res
}

exports.logIn = (req, res) => {

    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateLoginData(user)
    if (!valid) return res.status(400).json(errors)


    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken()
        })
        .then(token => {
            return res.status(200).json({ token })
        })
        .catch((error) => {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    return res.status(400).json({ general: 'Email already in use' })
                case 'auth/wrong-password':
                    return res.status(400).json({ general: 'Incorrect password ' })
                case 'auth/user-not-found':
                    return res.status(400).json({ general: 'User not found' })
                default:
                    return res.status(500).json({ error: error.code })
            }
        })
    return res
}
