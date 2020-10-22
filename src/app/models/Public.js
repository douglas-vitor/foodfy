const db = require("../../config/db")

module.exports = {
    async allRecipes() {
        try {
            const query = `
        SELECT * FROM recipes ORDER BY id ASC LIMIT 6
        `

            const results = await db.query(query)
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
    async getImages(id) {
        try {
            const query = `
            SELECT files.* FROM files 
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id) 
            WHERE recipe_files.recipe_id = $1
        `
            return db.query(query, [id])
        } catch (err) {
            console.log(err)
        }
    },
    async findRecipe(id) {
        try {
            const query = `
        SELECT * 
        FROM recipes 
        WHERE id = $1
        `

            const results = await db.query(query, [id])
            return results.rows[0]
        } catch (err) {
            console.log(err)
        }
    },
    async selectChefOptions() {
        try {
            const query = `
        SELECT name, id FROM chefs
        `

            const results = await db.query(query)
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
    async allChefs() {
        try {
            const query = `
        SELECT * FROM chefs ORDER BY id ASC
        `

            const results = await db.query(query)
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
    async countRecipesOfChef() {
        try {
            const query = `
            SELECT chefs.*, count(recipes) AS count_recipes 
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id) 
            GROUP BY chefs.id 
            ORDER BY chefs.id ASC
        `
            const results = await db.query(query)
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
    filesChefs(id) {
        try {
            const query = `
            SELECT files.* FROM files 
            LEFT JOIN chefs ON (files.id = chefs.file_id) 
            WHERE chefs.id = $1
        `
            return db.query(query, [id])
        } catch (err) {
            console.log(err)
        }
    },
    async search(data) {
        try {
            const query = `
            SELECT * FROM recipes 
            WHERE title ILIKE '%${data}%' 
            ORDER BY id ASC
        `

            const results = await db.query(query)
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
    async paginate(params) {
        try {
            const { limit, offset } = params

            let query = "",
                totalQuery = `(
            SELECT count(*) FROM recipes
        ) AS total`

            query = `
            SELECT recipes.*, ${totalQuery} 
            FROM recipes 
            ORDER BY id LIMIT $1 OFFSET $2
        `

            const results = await db.query(query, [limit, offset])
            return results.rows
        } catch (err) {
            console.log(err)
        }
    }
}