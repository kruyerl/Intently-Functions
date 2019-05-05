const {db} = require('../utility/admin')
const firebase = require('firebase')
const config = require('../utility/config')
firebase.initializeApp(config)

const {
  validateSignupData,
  validateLoginData,
  validateReset
} = require("../utility/validators");



exports.reset = (req, res) => {
    const emailAddress = req.body.email;
    const { valid, errors } = validateReset(emailAddress);
    if (!valid) return res.status(400).json(errors);

    firebase.auth().sendPasswordResetEmail(`${emailAddress}`);
    return res.json({ message: `Password reset email for ${emailAddress} sent` });
}
exports.logOut = (req, res) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        return res.json({
          message: `Logged Out`
        });
      })
      .catch(error => {
          return res.status(500).json({ error: error });

      });
}

exports.signUp = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    const {valid, errors} = validateSignupData(newUser)
    if(!valid) return res.status(400).json(errors)

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'this handle is already taken' })
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
            const userCredentials = {
                userId,
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials)
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email already in use' })
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
            return res.json({ token })
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
