// required packages for PICKS
const express = require("express");
const router = express();
const db = require("../models");
const axios = require("axios");


router.get("/", async (req, res) => {
//  res.send("see picks that people have made");
const allUsersAndPicks = await db.pick.findAll({
    include: [db.user, db.like, db.comment],
    order: [["id", "DESC"]]
})
if (!res.locals.user) {
    res.render("picks/show.ejs", {
        allUsersAndPicks
    })
} else {
    res.render("picks/index.ejs", { allUsersAndPicks })
} 
    // console.log(allUsersAndPicks[0].likes)
})

// POST - CREATE LIKE OF A PICK
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


router.post("/comment/:pickId", async (req, res) => {
    // console.log("req params: ", req.params.content);
    console.log("req body: ", req.body.content);
    // console.log("res locals userId: ", res.locals.user.id);
    // console.log("res locals username: ", res.locals.user.username);
    const commenterName = res.locals.user.username;
    const [newComment, commentCreated]= await db.comment.findOrCreate({
        where: {
            userId: res.locals.user.id,
            pickId: req.params.pickId,
            commenterName: commenterName 
        }, defaults: {
            content: req.body.content    
    }
    })
    res.redirect("/picks")
})











// Shows picks of user
router.get("/:username", (req, res) => {
    res.send("display public version of :username profile")
})


// export the router instance
module.exports = router;