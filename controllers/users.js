// required packages
const express = require("express");
const router = express()

// mount routes on router
// GET users/new -- show route for a form that creates a new user (sign up for the app)

// POST /users -- CREATE a new user from the form @ GET /users/new

// GET /users/login -- show route for a form that lets a user login

// POST /users/login -- authenticate a user's credentials 

// GET /users/logout -- log out the current user

// GET /users/profile -- show authorized users their profile page

// export the router instance
module.exports = router