/* eslint-disable no-useless-escape */
const functions = require('firebase-functions')

const express = require('express')
const app = express()
const cors = require('cors')({ origin: true })
const FBAuth = require('./utility/fbauth')

const {
    getActions,
    postAction,
    patchAction,
    deleteAction
} = require('./handlers/actions')

const {
    getHabits,
    postHabit,
    patchHabit,
    deleteHabit
} = require("./handlers/habits")

const {
    getObjectives,
    postObjective,
    patchObjective,
    deleteObjective
} = require("./handlers/objectives")

const {
  signUp,
  logIn,
  resetPassword,
  getUser,
  patchUser
} = require("./handlers/users")

const { syncDataDownstream, syncDataUpstream } = require("./handlers/data");

app.use(cors)

//  Users Routes
app.post('/signup', signUp)
app.post('/login', logIn)
app.post('/reset', resetPassword)
app.get("/user", FBAuth, getUser)
app.patch("/user/update", FBAuth, patchUser)

//  Actions Routes
app.get('/actions', FBAuth, getActions)
app.post('/actions', FBAuth, postAction)
app.patch('/actions', FBAuth, patchAction)
app.delete('/actions', FBAuth, deleteAction)

//  Objectives Routes
app.get("/objectives", FBAuth, getObjectives)
app.post("/objectives", FBAuth, postObjective)
app.patch("/objectives", FBAuth, patchObjective)
app.delete("/objectives", FBAuth, deleteObjective)

//  Habits Routes
app.get("/habits", FBAuth, getHabits)
app.post("/habits", FBAuth, postHabit)
app.patch("/habits", FBAuth, patchHabit)
app.delete("/habits", FBAuth, deleteHabit)

//  Data Sync
app.get("/habits", FBAuth, syncDataDownstream);
app.post("/habits", FBAuth, syncDataUpstream);
//  TODO getAllData


exports.api = functions.https.onRequest(app)
