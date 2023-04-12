const userWins = async (pickValue, odds, member) => { 
        const username = "MurphyBoy";
        let initialValue = 10;
        if (odds > 0) {
            console.log(`${username} has ${initialValue} points. After winning a ${pickValue} point pick with positive ${odds} odds, ${username} should now have ${(initialValue + (((odds)/100) * pickValue)).toFixed(2)}`);
            const updatedPoints = await (initialValue + (((odds)/100) * pickValue)).toFixed(2);
            console.log("updated points: ", updatedPoints)
        } else if (odds < 0) {
            console.log(`${username} has ${initialValue} points. After winning a ${pickValue} point pick with negative ${odds} odds, ${username} should now have ${(initialValue + ((100/(Math.abs(odds))) * pickValue)).toFixed(2)}`)
            const updatedPoints = await (initialValue + ((100/(Math.abs(odds))) * pickValue)).toFixed(2); 
            console.log("updated points: ", updatedPoints)
    } 
}
userWins(10, 200, 1)