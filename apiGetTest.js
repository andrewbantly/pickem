const axios = require("axios");

let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
axios.get(mlbURL).then(apiResponse => {
    let sports = apiResponse.data;
            sports.events.forEach(event => {
                // console.log(event.competitions)
            event.competitions.forEach(competition => {
                // console.log(competition?.odds)
                if (competition.odds) {
                    if (competition.odds[1].awayTeamOdds.spreadOdds) {
                        console.log(`${competition.odds[1].awayTeamOdds.team.abbreviation} is away at ${competition.odds[1].awayTeamOdds.spreadOdds} odds.`)
                    }
                    if (competition.odds[1].homeTeamOdds.spreadOdds) {
                        console.log(`${competition.odds[1].homeTeamOdds.team.abbreviation} is home at ${competition.odds[1].homeTeamOdds.spreadOdds} odds.`)
                    }
                    if (!competition.odds[1].homeTeamOdds.spreadOdds) {
                        console.log(`${competition.odds[1].homeTeamOdds.team.abbreviation} has no odds.`)
                    }
                    if (!competition.odds[1].awayTeamOdds.spreadOdds) {
                        console.log(`${competition.odds[1].awayTeamOdds.team.abbreviation} has no odds.`)
                    }
                }
                else {
                    console.log("no odds")
                }
            })
        })
})