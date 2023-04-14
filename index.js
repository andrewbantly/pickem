// required packages
require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const cryptoJs = require("crypto-js");
const db = require("./models")
const axios = require("axios");
const { compare } = require("bcrypt");

// app config
const app = express();
const PORT = process.env.PORT || 3030;
app.set("view engine", "ejs")

//middleware
app.use(express.urlencoded( { extended: false }));
app.use(methodOverride("_method"))
app.use(cookieParser())
app.use((req, res, next) => {
    // incoming request console logger
    // send data downstream to the other routes
    next() // tells express that this middleware has finished
})
app.use(async (req, res, next) => {
    try {
        // check if there is a cookie
        if (req.cookies.userId) {
            // if so we will decrypt the cookie and lookup the user using their PK
            const decryptedPK = cryptoJs.AES.decrypt(req.cookies.userId, process.env.ENC_KEY);
            const decryptedPKString = decryptedPK.toString(cryptoJs.enc.Utf8);
            const user = await db.user.findByPk(decryptedPKString) // eager loading can be done here
            // mount the found user on the res.locals
            // in all other routes you can assume that the res.locals.user is the currently logged in user
            res.locals.user = user;
            // res.locals.user.addBet({}) !!! how we only allow the logged in user to add a bet to their profile
        } else {
            // if there is no cookie, set the res.locals.user to be null
            res.locals.user = null;
        }
    } catch (error) {
        // if something goes wrong, set the user in the res.locals to be null
        res.locals.user = null;
    } finally {
        // runs regardless of whether there was an error or not
        next() // tells express this middleware has finished, go to the next thing
    }
})
app.use(express.static(__dirname + '/public'));

// GAME STATUS FUNCTION TO CHECK IF USER PICKS A WINNER, LOSER AND ADJUSTS POINT BALANCE IN USER'S ACCOUNT
const gameStatusCheck = async () => {
    try {
        let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
        const response = await axios.get(mlbURL);
        const sports = await response.data;
        for (let event of sports.events) {
            // CHECK IF THE GAME IS OVER (GAME STATUS ID = 3)
            if (event.status.type.id === "3") { 
                const updateGameStatus = db.pick.update( { gameStatus: 3 }, {
                    where: {
                        game: event.id
                    }
                })
                // IF THE GAME IS OVER, IDENTIFY THE FINAL SCORES OF THE events.competitions array
                const events = event.competitions;
                for (let competition of events) {
                    // IDENTIFY THE SCORES BY MATCHING TEAM IDS
                    const games = competition.competitors;
                    for (let teams of games) {
                        const updateSelectTeamScore = await db.pick.update ( {selTeamScore: teams.score}, {
                            where: {
                                selTeam: teams.id
                            }
                        } )
                        const updateAgainstTeamScore = await db.pick.update ( {againstTeamScore: teams.score}, {
                            where: {
                                againstTeam: teams.id
                            }
                        })
                    }}
                // AFTER SCORES ARE INPUTED, DETERMINE correctPick AND ADJUST pickActive
             const compareTeams = await db.pick.findAll({
                where: {
                    game: event.id
                }
             })
             for (const team of compareTeams) {
                if ((parseInt(team.selTeamScore) + parseFloat(team.selTeamSpread)) > parseInt(team.againstTeamScore)) {
                    const pickWinner = await db.pick.update({correctPick: true, pickActive: false}, { 
                        where: {
                            game: event.id
                        }});
                    let newPointValue = await userWins(team.pickValue, parseInt(team.selTeamOdds), team.userId);
                    const userPointValueChange = await db.user.update({ 
                    points: newPointValue }, {
                    where: { 
                        id: team.userId
                    }
                })
                } else if ((parseInt(team.selTeamScore) + parseFloat(team.selTeamSpread)) < parseInt(team.againstTeamScore)) {
                    const pickLoser = await db.pick.update({correctPick: false, pickActive: false}, { 
                        where: {
                            game: event.id
                        }});
                    let newPointValue = await userLoses(team.pickValue, team.userId);
                    const userPointValueChange = await db.user.update({ 
                        points: newPointValue }, {
                        where: {
                            id: team.userId
                        }
                    })           
                    } 
              }
            } if (event.status.type.id === "2") {
                // IF GAME STATUS === 2, the game has started and picks are locked
                const updateGameStatus = db.pick.update( { gameStatus: 2 }, {
                    where: {
                        game: event.id
                    }
                })
            }
        }
    } catch (error) {
    }
}
     

const userWins = (pickValue, odds, member) => { 
    return new Promise((resolve, reject) => {
       db.user.findOne({ where: {
                id: member
                    }})
                    .then(winner => {
                        let initialValue = parseFloat(winner.points);
                        let updatedPoints;
                        if (odds > 0) {
                            updatedPoints = ((((odds)/100) * pickValue));
                        } else if (odds < 0) {
                            updatedPoints = (((100/(Math.abs(odds))) * pickValue));
                        } 
                        let newPointValue = (updatedPoints.toFixed(2));
                        resolve(parseFloat(newPointValue));
                    })
                })
    }

const userLoses = (pickValue, member) => {
    return new Promise((resolve, reject) => {
        db.user.findOne({ where: {
            id:member
        }})
        .then(loser => {
            let initialValue = parseFloat(loser.points);
            let newPointValue = (initialValue - pickValue).toFixed(2);
            resolve(parseFloat(newPointValue));
        })
    })
}


// const gameStatusCheckLoop = setInterval(gameStatusCheck, 5000)

//routes
app.get("/", (req, res) => {
    res.render("index.ejs", {
        message: req.query.message ? req.query.message : null
    })
})

app.post("/", async (req, res) => {
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
                res.redirect("/users/login?message=" + failedLoginMessage)
            } else if(!bcrypt.compareSync(req.body.password, foundUser.password)) {
                // if the user exists but they have the wrong password -- do not let them login
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
        res.redirect("/");
    }
})


// controllers
app.use("/members", require("./controllers/users"));
app.use("/picks", require("./controllers/picks"));
app.use("/leagues", require("./controllers/leagues"));
app.use("/leaders", require("./controllers/leaderboard"));

app.get("*", (req, res) => {
    res.render("404")
})

// listen port
app.listen(PORT, () => {
console.log(`We are live on port ${PORT} ⚾️`);
})