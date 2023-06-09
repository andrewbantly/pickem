// required packages
const express = require("express");
const router = express();
const db = require("../models");
const bcrypt = require("bcrypt");
const cryptoJs = require("crypto-js");

// mount routes on router
// GET users/new -- show route for a form that creates a new user (sign up for the app)
router.get("/new", (req, res) => {
    res.render("users/new.ejs")
})

// POST /users -- CREATE a new user from the form @ GET /users/new
router.post("/", async (req, res) => {
    try {
        // do a find or create with the user's given email
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            }, defaults: {
                username: req.body.username,
                points: req.body.points
            }
        })
        if (!created) {
            // if the user's return as found -- don't let them sign up & redirect them to log in page
            res.redirect("/members/login?message=Please login to your account to continue")
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
            res.redirect("/members/profile")

        }
    } catch (error) {
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
            res.redirect("/members/login?message=" + failedLoginMessage)
        } else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
            // if the user exists but they have the wrong password -- do not let them login
            res.redirect("/members/login?message=" + failedLoginMessage)
        } else {
            // if the user exists, they know the right password -- log them in
            // encrypt the user's PK
            const encryptedPK = cryptoJs.AES.encrypt(foundUser.id.toString(), process.env.ENC_KEY)
            // set encryped ID as a cookie
            res.cookie("userId", encryptedPK.toString())
            // redirect user
            res.redirect("/members/profile")
        }
    } catch (error) {
        res.redirect("/");
    }
})

// GET /users/logout -- log out the current user
router.get("/logout", (req, res) => {
    res.clearCookie("userId");
    res.redirect("/")
})

// GET /users/profile -- show authorized users their profile page
router.get("/profile", async (req, res) => {
    // res.send("show the currently logged in user their personal profile page.")
    // if the user comes here and is not logged in, they lack authorization
    if (!res.locals.user) {
        // redirect them to the log in
        res.redirect("/members/login?message=Authorization invalid. Please log in.")
    } else {
        const myPicks = await db.pick.findAll({
            where: {
                userId: res.locals.user.id
            },
            order: [['id', 'DESC']],
        })
        //if allowed to be here, show them their profile
        res.render("users/profile.ejs", { myPicks })
    }
})

// EDIT /members/edit/:pickId
router.get("/edit/:pickId", async (req, res) => {
    const editPick = await db.pick.findOne({
        where: {
            id: req.params.pickId
        }
    })
    res.render("users/edit.ejs", { editPick })
})

//PUT /members/edit/:pickId -- edit a single pick at the pickId
router.put("/:pickId", async (req, res) => {
    try {
        const updatePick = await db.pick.update({
            selTeam: req.body.selTeam,
            selTeamName: req.body.selTeamName,
            selTeamFavorite: req.body.selTeamFavorite,
            selTeamSpread: req.body.selTeamSpread,
            selTeamOdds: req.body.selTeamOdds,
            selTeamLogo: req.body.selTeamLogo,
            againstTeam: req.body.againstTeam,
            againstTeamName: req.body.againstTeamName,
            againstTeamFavorite: req.body.againstTeamFavorite,
            againstTeamSpread: req.body.againstTeamSpread,
            againstTeamOdds: req.body.againstTeamOdds,
            againstTeamLogo: req.body.againstTeamLogo
        }, {
            where: {
                id: req.body.id
            }
        })
        res.redirect("/members/profile")
    } catch (error) {
        res.redirect("404.ejs")
    }
})

router.get("/:username", async (req, res) => {
    const findUser = await db.user.findOne({
        where: {
            username: req.params.username
        }
    })
    const foundUsername = findUser.username;
    const foundUserPoints = findUser.points;
    const userPicks = await db.pick.findAll({
        where: {
            userId: findUser.id
        },
        order: [['id', 'DESC']],
    })
    res.render("users/visit.ejs", { userPicks, foundUsername, foundUserPoints })
})

// DELETE /members/:pickId -- delete a single pick at the pickId
router.delete("/:pickId", async (req, res) => {
    const deletePick = await db.pick.destroy({
        where: {
            id: req.params.pickId
        }
    })
    res.redirect("/members/profile")
})

// export the router instance
module.exports = router