// required packages for LEAGUES
const express = require("express");
const router = express();
const db = require("../models");
const axios = require("axios");

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

router.post("/", async (req, res) => {
    try {
        const newPick = await db.pick.create({
            userId: req.body.userId,
            league: req.body.league,
            game: req.body.game,
            selTeam: req.body.selTeam,
            selTeamName: req.body.selTeamName,
            againstTeam: req.body.againstTeam,
            againstTeamName: req.body.againstTeamName,
            favorite: req.body.favorite,
            gameSpread: req.body.gameSpread,
            gameOdds: req.body.gameOdds,
            selTeamLogo: req.body.selTeamLogo,
            gameDate: req.body.gameDate,
            shortName: req.body.shortName,
            gameStatus: req.body.gameStatus,
            pickActive: req.body.pickActive,
        })
        res.redirect("/leagues")
    } catch (error) {
        console.log(error);
        res.redirect("404.ejs")
    }
})



// export the router instance
module.exports = router;