console.log("hello andrewb")
const axios = require("axios");
const db = require("../../models");

const checkWinners = async () => {
    try {
        let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
        const response = await axios.get(mlbURL);
        const sports = await response.data;
        await sports.events.forEach(event => {
            // CHECK IF THE GAME IS OVER (GAME STATUS ID = 3)
            if (event.status.type.id === "3") {
                // console.log(event.name)
                // IF THE GAME IS OVER, IDENTIFY THE WINNER BY GOING THROUGH events.competitions array
                event.competitions.forEach(competition => {
                    // console.log(competition.competitors)
                    // IDENTIFY THE WINNING TEAM
                    competition.competitors.forEach(team => {
                        if (team.winner === true) {
                            console.log(team.team.name);
                            const updatePicks =  db.pick.update({ correctPick: true, gameStatus: 3, pickActive: false }, {
                                where: {
                                    selTeam: team.team.id
                                }
                            })
                        } else if (team.winner === false) {
                            const updatePicks =  db.pick.update({ correctPick: false, gameStatus: 3, pickActive: false }, {
                                where: {
                                    selTeam: team.team.id
                                }
                            })
                        }
                    })
                })
            }
        })
    } catch (error) {
        console.log("error: ", error)
    }
}

const scoreChecks = setInterval(checkWinners, 5000)


// let sports = apiResponse.data;
// sports.events.forEach(event => {
//     if (event.status.type.id === "3") {
//         event.competitions.forEach(competition => {
//             const allPicks = picks.findAll({
//                 where: {
//                     game: competition.id
//                 }
//             })
//             allPicks.correctPick = false;
//         })
//     }})
// })