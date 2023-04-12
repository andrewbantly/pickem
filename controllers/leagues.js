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
        // console.log(sports.events[14].competitions[0].competitors[0].team.name);
        // console.log("short name: ", sports.events[14]);
        // console.log("res locals ID: ", res.locals.user.id);
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
        const newPick = await db.pick.create({
            userId: req.body.userId,
            league: req.body.league,
            game: req.body.game,
            shortName: req.body.shortName,
            gameDate: req.body.gameDate,
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
        console.log("error: ", error);
        res.redirect("404.ejs")
    }
})

// GET - /leagues/:game - shows details of a specific game
router.get("/:league/:game", async (req, res) => {
    console.log("params: ", req.params);
    console.log("league: ", req.params.league);
    console.log("game: ", req.params.game);
    let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
    axios.get(mlbURL).then(apiResponse => {
        let sports = apiResponse.data;    
        const game = req.params.game;
        res.render("leagues/details.ejs", {game});
    })
})

// export the router instance
module.exports = router;