const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
    async allRecipes() {
        const query = `
            SELECT recipes.*, chefs.name AS chef   
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
            ORDER BY recipes.id DESC 
        `
        const results = await db.query(query)
        return results.rows
    },
    async files(id) {
        const query = `
            SELECT files.* FROM files 
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id) 
            WHERE recipe_files.recipe_id = $1
        `
        return await db.query(query, [id])
    },
    async createRecipe(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return await db.query(query, values)
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
    async updateRecipe(data) {
        const query = `
            UPDATE recipes SET 
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5) 
            WHERE id = $6
        `
        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return await db.query(query, values)
    },
    async deleteRecipe(id) {
        return await db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },
    async findChef(id) {
        const query = `
        SELECT * 
        FROM chefs 
        WHERE id = $1
        `
        const results = await db.query(query, [id])
        return results.rows[0]
    },
    async allChefs() {
        const query = `
        SELECT * FROM chefs ORDER BY id ASC
        `
        const results = await db.query(query)
        return results.rows
    },
    async createChef(data) {
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        const results = await db.query(query, values)
        return results.rows[0]
    },
    async selectChefOptions() {
        const results = await db.query(`SELECT name, id FROM chefs`)
        return results.rows
    },
    async countRecipesOfChef(id) {
        const results = await db.query(`SELECT count(*) FROM recipes WHERE chef_id = $1`, [id])
        return results.rows[0]
    },
    async recipesOfChef(id) {
        const results = await db.query(`SELECT * FROM recipes WHERE chef_id = $1`, [id])
        return results.rows
    },
    async updateChef(data) {
        const query = `
            UPDATE chefs SET 
            name=($1),
            avatar_url=($2)
            WHERE id = $3
        `
        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        return await db.query(query, values)
    },
    async deleteChef(id) {
        const countResult = await db.query(`SELECT count(*) FROM recipes WHERE chef_id = $1`, [id])
        const prove = Number(countResult.rows[0].count)
        if( prove == 0 ) {
            db.query(`DELETE FROM chefs WHERE id = $1`, [id])
        } else {
            return id
        }
    },
    async paginate(params) {
        const { limit, offset, callback } = params

        let query = "",
        totalQuery = `(
            SELECT count(*) FROM recipes
        ) AS total`

        query = `
            SELECT recipes.*, chefs.name AS chef, ${totalQuery}
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
            ORDER BY recipes.id DESC LIMIT $1 OFFSET $2
        `

        const results = await db.query(query, [limit,offset])
        return results.rows
    }
}