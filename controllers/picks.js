// required packages for PICKS
const express = require("express");
const router = express();
const db = require("../models");
const axios = require("axios");


router.get("/", async (req, res) => {
//  res.send("see picks that people have made");
    const allUsersAndPicks = await db.pick.findAll({
        include: [db.user, db.like],
        order: [["id", "DESC"]]
    })
    // console.log(allUsersAndPicks[0].likes)
    res.render("picks/index.ejs", { allUsersAndPicks })
})

router.post("/like/:pickId", async (req, res) => {
    // console.log("req params: ", req.params.pickId);
    // console.log("res locals userId: ", res.locals.user.id);
    // console.log("res locals username: ", res.locals.user.username);
    const likerName = res.locals.user.username;
    const [newLike, likeCreated]= await db.like.findOrCreate({
        where: {
            userId: res.locals.user.id,
            pickId: req.params.pickId,
            likerName: likerName 
        }, defaults: {
            liked: true    
    }
    })
    // console.log("likeCreated: ", likeCreated);
    if (likeCreated === false && newLike.liked === true) {
        // console.log(`because pickId ${req.params.pickId} was liked again, it is now unliked by userId ${res.locals.user.id}`)
        const updateLike = await db.like.update({ liked: false, likerName: null }, {
            where: {
                userId: res.locals.user.id,
                pickId: req.params.pickId
            }
        })
    } else if (likeCreated === false && newLike.liked === false) {
        const updateLike = await db.like.update({ liked: true, likerName: likerName }, {
            where: {
                userId: res.locals.user.id,
                pickId: req.params.pickId
            }
        })
    }
    const usersThatLiked = await db.like.findAll({
        where: {
            pickId: req.params.pickId,
            liked: true
        }
    })
    const pickLikeCount = usersThatLiked.length;
    console.log("like counts: ", pickLikeCount)
    const updatePickLikeCount = await db.pick.update({ likeCount: pickLikeCount},{ 
        where: {
            id: req.params.pickId,
        }
     })
    // console.log("liked users(picks): ", usersThatLiked.length)
    // console.log("req body: ", req.body[0]);
    res.redirect("/picks")
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