console.log("hello andrewb")
const axios = require("axios");
const db = require("../../models");
const { compare } = require("bcrypt");

const checkWinners = async () => {
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
             console.log("event ID: ", event.id)
                compareTeams.forEach(team => {
                    // console.log(team);
                console.log(`You (userId:${team.userId}) selected ${team.selTeamName} which scored ${team.selTeamScore} runs against the ${team.againstTeamName} that scored ${team.againstTeamScore}.`)
              })
            }
        })

            

    } catch (error) {
        console.log(error)
    }
}


const scoreChecks = setInterval(checkWinners, 5000)