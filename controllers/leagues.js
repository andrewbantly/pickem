// required packages for LEAGUES
const express = require("express");
const router = express();
const db = require("../models");
const axios = require("axios");

// GET ALL AVAILABLE PICKS
router.get("/", (req, res) => {
    let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
    axios.get(mlbURL).then(apiResponse => {
        let sports = apiResponse.data;
        sports.events.forEach(event => {
            event.competitions.forEach(competition => {
                competition.competitors.forEach(competitor => {
                })
            })
        })
        if (!res.locals.user) {
            res.render("leagues/show.ejs", {
                sports
            })
        } else {
            const userId = res.locals.user.id;
            res.render("leagues/index.ejs", {
                sports, userId
            })
        }
    })
})

// CREATE PICK IN DATABASE 
router.post("/", async (req, res) => {
    try {
        const gameTime = new Date(req.body.gameDate)
        const newPick = await db.pick.create({
            userId: req.body.userId,
            league: req.body.league,
            game: req.body.game,
            shortName: req.body.shortName,
            gameDate: gameTime,
            gameStatus: req.body.gameStatus,
            pickActive: req.body.pickActive,
            pickValue: req.body.pickValue,
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
            againstTeamLogo: req.body.againstTeamLogo,
        })
        res.redirect("/leagues")
    } catch (error) {
        res.redirect("404.ejs")
    }
})

// export the router instance
module.exports = router;