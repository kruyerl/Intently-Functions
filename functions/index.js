/* eslint-disable no-useless-escape */
const functions = require('firebase-functions')

const express = require('express')
const app = express()

const FBAuth = require('./utility/fbauth')

const { getUserActions, postUserAction } = require('./handlers/actions')
const { getUserObjectives, postUserObjective } = require("./handlers/objectives");
const { getUserNonNegotiables, postUserNonNegotiable } = require("./handlers/nonNegotiables");
const {
  signUp,
  logIn,
  logOut,
  reset
} = require("./handlers/users");

// Users Routes
app.post('/signup', signUp)
app.post('/login', logIn)
app.post('/logout', logOut)
app.post('/reset', reset)
//TODO      update userdetails

// Actions Routes
app.get('/actions', FBAuth, getUserActions)
app.post('/actions', FBAuth, postUserAction)
//TODO      update action
//TODO      delete action

// objectives Routes
app.get("/objectives", FBAuth, getUserObjectives);
app.post("/objectives", FBAuth, postUserObjective);
//TODO      update objective
//TODO      delete objective

// nonNegotiables Routes
app.get("/nonnegotiables", FBAuth, getUserNonNegotiables);
app.post("/nonnegotiables", FBAuth, postUserNonNegotiable);
//TODO      update non negotiables
//TODO      delete non negotiable

exports.api = functions.https.onRequest(app)
