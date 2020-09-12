const db = require("../../config/db")

module.exports = {
    async allRecipes() {
        const query = `
        SELECT * FROM recipes ORDER BY id ASC LIMIT 6
        `

        const results = await db.query(query)
        return results.rows
    },
    async findRecipe(id) {
        const query = `
        SELECT * 
        FROM recipes 
        WHERE id = $1
        `

        const results = await db.query(query, [id])
        return results.rows[0]
    },
    async selectChefOptions() {
        const query = `
        SELECT name, id FROM chefs
        `

        const results = await db.query(query)
        return results.rows
    },
    async allChefs() {
        const query = `
        SELECT * FROM chefs ORDER BY id ASC
        `

        const results = await db.query(query)
        return results.rows
    },
    async countRecipesOfChef(callback) {
        const query = `
            SELECT chefs.*, count(recipes) AS count_recipes 
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id) 
            GROUP BY chefs.id 
            ORDER BY chefs.id ASC
        `
        const results = await db.query(query)
        return results.rows
    },
    async search(data) {
        const query = `
            SELECT * FROM recipes 
            WHERE title ILIKE '%${data}%' 
            ORDER BY id ASC
        `

        const results = await db.query(query)
        return results.rows
    },
    async paginate(params) {
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
    }
}