
const db = require("./models")

const loadUsers = async () => {
    try {
        const [andrew] = await db.user.findOrCreate({
            where: {
                username: "andrew"
            }, 
            defaults: {
                email: "andrewbantly@gmail.com",
                password: "password"
            }
        })
        const [hunter] = await db.user.findOrCreate({
            where: {
                username: "hunter"
            }, 
            defaults: {
                email: "hunter@gmail.com",
                password: "password123"
            }
        })
                const [sam] = await db.user.findOrCreate({
            where: {
                username: "sam"
            }, 
            defaults: {
                email: "sam@gmail.com",
                password: "21password12"
            }
        })
    } catch (error) {
        console.log(error)
    }
}
loadUsers()