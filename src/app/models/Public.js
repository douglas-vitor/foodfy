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
    },
    selectChefOptions(callback) {
        db.query(`SELECT name, id FROM chefs`, function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows)
        })
    },
    allChefs(callback) {
        db.query(`
            SELECT * FROM chefs ORDER BY id ASC
        `, function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows)
        })
    },
    countRecipesOfChef(callback) {
        db.query(`
            SELECT chefs.*, count(recipes) AS count_recipes 
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id) 
            GROUP BY chefs.id 
            ORDER BY chefs.id ASC
        `, function(err, results) {
            if(err) {
                throw `[DATABASE ERROR] : ${err}`
            }
        callback(results.rows)
        })
    },
    search(data, callback) {
            db.query(`
            SELECT * FROM recipes 
            WHERE title ILIKE '%${data}%' 
            ORDER BY id ASC
        `, function(err, results) {
            if(err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows)
        })
    }
}