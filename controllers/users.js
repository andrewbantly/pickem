// required packages
const express = require("express");
const router = express()
const db = require("../models")
const bcrypt = require("bcrypt");
const cryptoJs = require("crypto-js");


// mount routes on router
// GET users/new -- show route for a form that creates a new user (sign up for the app)
router.get("/new", (req, res) => {
    // res.send("show a form to sign up for the app")
    res.render("users/new.ejs")
})

// POST /users -- CREATE a new user from the form @ GET /users/new
router.post("/", async (req, res) => {
    // res.send("create a new user if they do not exist already in the db, log a user in")
    try {
        console.log(req.body)
        // do a find or create with the user's given email
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            }
        })
        if (!created) {
            // if the user's return as found -- don't let them sign up & redirect them to log in page
            console.log("user account exists")
            res.redirect("/users/login?message=Please login to your account to continue")
        } else {
            // hash the user's password before it is added to db
            const hashedPassed = bcrypt.hashSync(req.body.password, 12);
            // save the user in the db
            newUser.password = hashedPassed;
            await newUser.save();
            // encrypt the logged in user's id
            const encryptedPK = cryptoJs.AES.encrypt(newUser.id.toString(), process.env.ENC_KEY)
            // set encryped ID as a cookie
            res.cookie("userId", encryptedPK.toString())
            // redirect user
            res.redirect("/users/profile")

        }
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }

})

// GET /users/login -- show route for a form that lets a user login
router.get("/login", (req, res) => {
    // res.send("show a form that lets the user log in")
    res.render("users/login.ejs", {
        message: req.query.message ? req.query.message : null
    })
})

// POST /users/login -- authenticate a user's credentials 
router.post("/login", async (req, res) => {
    // res.send("verify credentials that are given by the user to log in")
    try {
        // search for the user's email in the db
        const foundUser = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        const failedLoginMessage = "Incorrect email or password"
            if (!foundUser) {
                // if the user's email is not found -- do not let them login
                console.log("user not found")
                res.redirect("/users/login?message=" + failedLoginMessage)
            } else if(!bcrypt.compareSync(req.body.password, foundUser.password)) {
                // if the user exists but they have the wrong password -- do not let them login
                console.log("incorrect password")
                res.redirect("/users/login?message=" + failedLoginMessage)
            } else {
                // if the user exists, they know the right password -- log them in
                    // encrypt the user's PK
                const encryptedPK = cryptoJs.AES.encrypt(foundUser.id.toString(), process.env.ENC_KEY)
                // set encryped ID as a cookie
                res.cookie("userId", encryptedPK.toString())
                // redirect user
                res.redirect("/users/profile")
            }
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

// GET /users/logout -- log out the current user
router.get("/logout", (req, res) => {
    // res.send("log a user out")
    console.log("logging user out");
    res.clearCookie("userId");
    res.redirect("/")
})

// GET /users/profile -- show authorized users their profile page
router.get("/profile", (req, res) => {
    // res.send("show the currently logged in user their personal profile page.")
    // if the user comes here and is not logged in, they lack authorization
    if (!res.locals.user) {
        // redirect them to the log in
        res.redirect("/users/login?message=Authorization invalid. Please log in.")
    } else {
        //if allowed to be here, show them their profile
        res.render("users/profile.ejs")
    }
})

// export the router instance
module.exports = router