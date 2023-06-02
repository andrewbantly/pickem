const axios = require("axios");

let mlbURL = "http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
axios.get(mlbURL).then(response => {
    let sports = response.data;
    console.log(sports)
    sports.events.forEach(competition => {
        const gameTime = new Date(competition.date)
        console.log(competition.shortName + " at " + gameTime)
    });
})