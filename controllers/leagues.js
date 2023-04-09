// required packages for LEAGUES
const express = require("express");
const router = express();
const db = require("../models");
const axios = require("axios");

router.get("/", (req, res) => {
    let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
    axios.get(mlbURL).then(apiResponse => {
        let sports = apiResponse.data;
        // console.log(sports.events[14].competitions[0].competitors[0].team.logo);
        console.log(sports.events[3]);
        res.render("leagues/index.ejs", {
            sports
        })
    })
})



// export the router instance
module.exports = router;