const axios = require("axios");
function apiTest () {
    let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
    axios.get(mlbURL).then(apiResponse => {
        let sports = apiResponse.data;    
        sports.events.forEach(event => {
            if (event.status.type.id === "1") {
                event.competitions.forEach(competition => {
                    console.log("away team: ", competition.competitors[1].team.name)
                    console.log("pitcher: ", competition.competitors[1].probables[0].athlete.displayName);
                    console.log("wins: ", competition.competitors[1].probables[0]?.statistics[2]?.displayValue)
                })
            } else (
                console.log("a different game?")
                )
            })
})
}

apiTest();