// required packages for PICKS
const express = require("express");
const router = express();
const db = require("../models");
const axios = require("axios");


router.get("/", (req, res) => {
    let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
    axios.get(mlbURL).then(apiResponse => {
        let sports = apiResponse.data;
        console.log(sports);
        res.render("picks/index.ejs", {
            sports
        })
    })
})

// Add picks to database, redirect to /picks
router.post("/:league/add/:pickId", (req, res) => {
    res.send("Adds pick to database, change color of logo & switch")
})
// Updates a pick, redirects to /picks
router.put("/:league/update/:pickId", (req, res) => {
    res.send("Changes teamSelect of existing pickId")
})
// Delete a pick from database, redirect to /picks
router.delete("/:league/delete/:pickId", (req, res) => {
    res.send("Removes pick from database, resets color of both picks")
})
// Shows picks of user
router.get("/:username", (req, res) => {
    res.send("display feed of real-time picks")
})
// Changes pick selection of exisiting pickId
router.put("/:username/update/:pickId", (req, res) => {
    res.send("Change teamSelect of existing pickId")
})
// Delete picks from user's database
router.delete("/:username/delete/:pickId", (req, res) => {
    res.send("removes pick from database")
})



// export the router instance
module.exports = router;