const { all } = require("axios")
const db = require("./models")

const leaderboardTest = async () => {
    const allUsersAndPicks = await db.user.findAll({
        include: [db.pick]
    })
    // console.log(allUsersAndPicks)

    let winners = [] 
    allUsersAndPicks.forEach(user => { 
        let wins = [] 
        user.picks.forEach(pick => { 
            if (pick.correctPick === true) { 
                wins.push(pick)
                }})  
        const userWins = {
            name: user.username,
            wins: wins.length
        }
        winners.push(userWins)
        }) 
        winners.sort(function(b, a) {
            if (a.wins < b.wins ) {
                return -1
            } 
            if (a.wins > b.wins ) {
                return 1
            } 
            return 0;
        })
        
       console.log(winners)
       
    }
    
    leaderboardTest()
