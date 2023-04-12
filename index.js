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
    // console.log("the middleware has been invoked.");
    // incoming request console logger
    console.log(`[${new Date().toLocaleString()}]: ${req.method} ${req.url}`)
    console.log("request body: ", req.body)
    // send data downstream to the other routes
    // res.locals.myData = "howdy 👋🏼 partner 🤠";
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
            // res.locals.user.addBet({}) !!! how we only allow the loged in user to add a bet to their profile
        } else {
            // if there is no cookie, set the res.locals.user to be null
            res.locals.user = null;
        }
    } catch (error) {
        console.log(error)
        // if something goes wrong, set the user in the res.locals to be null
        res.locals.user = null;
    } finally {
        // runs regardless of whether there was an error or not
        next() // tells express this middleware has finished, go to the next thing
    }
})
app.use(express.static(__dirname + '/public'));


















const gameStatusCheck = async () => {
    console.log("check game status is running")
    try {
        let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
        const response = await axios.get(mlbURL);
        const sports = await response.data;
        await sports.events.forEach(async event => {
            // CHECK IF THE GAME IS OVER (GAME STATUS ID = 3)
            if (event.status.type.id === "3") { 
                console.log("Game over eventId: ", event.id)
                const updateGameStatus = db.pick.update( { gameStatus: 3 }, {
                    where: {
                        game: event.id
                    }
                })
                // IF THE GAME IS OVER, IDENTIFY THE FINAL SCORES OF THE events.competitions array
                const events = event.competitions;
                for (let competition of events) {
                    // console.log(competition)
                    // console.log(competition.competitors)
                    // IDENTIFY THE SCORES BY MATCHING TEAM IDS
                    const games = competition.competitors;
                    for (let teams of games) {
                        // console.log(teams)
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
            //  for (const team of compareTeams) {
                compareTeams.forEach(async team => { 
                    console.log("event ID: ", event.id)
                    // console.log(team);
                // console.log(`You (userId:${team.userId}) selected ${team.selTeamName} which scored ${team.selTeamScore} runs against the ${team.againstTeamName} that scored ${team.againstTeamScore}.`)
                if ((parseInt(team.selTeamScore) + parseFloat(team.selTeamSpread)) > parseInt(team.againstTeamScore)) {
                    console.log(`Favorite ${team.selTeamFavorite} ${team.selTeamName} scored ${parseInt(team.selTeamScore)} and the spread was ${parseFloat(team.selTeamSpread)}, which totals ${parseInt(team.selTeamScore) + parseFloat(team.selTeamSpread)} and is more than ${parseInt(team.againstTeamScore)} by the ${team.againstTeamName}. ${team.selTeamName} covered against the ${team.againstTeamName}`);
                    const pickWinner = await db.pick.update({correctPick: true, pickActive: false}, { 
                        where: {
                            game: event.id
                        }});
                    const userPointValueChange = await db.user.update({ 
                        points: await userWins(team.pickValue, parseInt(team.selTeamOdds), team.userId) }, {
                        where: {
                            id: team.userId
                        }
                    })
                        // userWins (odds, userId) => userWins(parseInt(team.selTeamOdds), team.userId)
                } else if ((parseInt(team.selTeamScore) + parseFloat(team.selTeamSpread)) < parseInt(team.againstTeamScore)) {
                    console.log(`Favorite ${team.selTeamFavorite} ${team.selTeamName} scored ${parseInt(team.selTeamScore)} and the spread was ${parseFloat(team.selTeamSpread)}, which totals ${parseInt(team.selTeamScore) + parseFloat(team.selTeamSpread)} and is less than ${parseInt(team.againstTeamScore)} by the ${team.againstTeamName}. ${team.selTeamName} did not cover against the ${team.againstTeamName}`);
                    const pickLoser = db.pick.update({correctPick: false, pickActive: false}, { 
                        where: {
                            game: event.id
                        }});     
                        // userLoses(team.pickValue, parseInt(team.selTeamOdds), team.userId);
                        const userPointValueChange = await db.user.update({ 
                            points: await userLoses(team.pickValue, team.userId) }, {
                            where: {
                                id: team.userId
                            }
                        })           
                    }
              })
            } if (event.status.type.id === "2") {
                // IF GAME STATUS === 2, the game has started and picks are locked
                const updateGameStatus = db.pick.update( { gameStatus: 2 }, {
                    where: {
                        game: event.id
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}
     
const userWins = async (pickValue, odds, member) => { 
        console.log("winning memberId: ", member);
        let winner = await db.user.findOne({ 
            where: {
                id: member
                    }});
        let initialValue = parseFloat(winner.points);
        if (odds > 0) {
            let updatedPoints = (initialValue + (((odds)/100) * pickValue));
            const newPointValue = (updatedPoints.toFixed(2))
            console.log(`Winner ${winner.username} has ${initialValue} points. After winning a ${pickValue} point pick with positive ${odds} odds, ${winner.username} should now have ${newPointValue}`)
            return parseFloat(newPointValue);
        } else if (odds < 0) {
            let updatedPoints = (initialValue + ((100/(Math.abs(odds))) * pickValue));
            const newPointValue = (updatedPoints.toFixed(2)); 
            console.log(`Winner ${winner.username} has ${initialValue} points. After winning a ${pickValue} point pick with negative ${odds} odds, ${winner.username} should now have ${newPointValue}`);
            return parseFloat(newPointValue);
        } 
    }
const userLoses = async (pickValue, member) => { 
        console.log("losing memberId: ", member);
        let loser = await db.user.findOne({ 
            where: {
                id: member
            }});
        let initialValue = parseFloat(loser.points);
        const newPointValue = (initialValue - pickValue).toFixed(2);
        console.log(`Loser ${loser.username} has ${initialValue} points. After losing a ${pickValue}, ${loser.username} should now have ${newPointValue}`)
        return parseFloat(newPointValue);
}

// const gameStatusCheckLoop = setInterval(gameStatusCheck, 5000)

//routes
app.get("/", (req, res) => {
    console.log(res.locals)
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


// controllers
app.use("/members", require("./controllers/users"));
app.use("/picks", require("./controllers/picks"));
app.use("/leagues", require("./controllers/leagues"));

app.get("*", (req, res) => {
    res.render("404")
})

// listen port
app.listen(PORT, () => {
console.log(`We are live on port ${PORT} ⚾️`);
})