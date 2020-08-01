const db = require("../../config/db")

module.exports = {
    allRecipes(callback) {
        db.query(`
            SELECT * FROM recipes ORDER BY id ASC
        `, function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows)
        })
    },
    findRecipe(id, callback) {
        db.query(`
            SELECT * 
            FROM recipes 
            WHERE id = $1 
        `, [id], function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows[0])
        })
    }
}