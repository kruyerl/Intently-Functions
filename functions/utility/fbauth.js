const {admin, db} = require('./admin')

module.exports = (req, res, next) => {
    let idToken
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1]
    } else {
        console.error('No token found')
        return res.status(403).json({ error: 'Unauthorised' })
    }
    admin.auth()
        .verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken
            return db.collection("users")
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get()

        })
        .then(data => {
            req.user.username = data.docs[0].data().username
            return next()
        })
        .catch(error => {
            console.error('error while verifying token', error)
            return res.status(403).json(error)
        })
    return res
}
