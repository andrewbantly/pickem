// required packages
const express = require("express");
const router = express();
const db = require("../models");

router.get("/", async (req, res) => {
    const allUsersAndPicks = await db.user.findAll({
        include: [db.pick]
    })
    console.log(allUsersAndPicks)
    res.render("leaderboard/index.ejs", { allUsersAndPicks })
})

module.exports = router