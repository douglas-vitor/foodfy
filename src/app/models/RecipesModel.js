const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
    files(id) {
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
    async createRecipe(data) {
        try {
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
    async updateRecipe(data) {
        try {
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
        } catch (err) {
            console.log(err)
        }
    },
    async deleteRecipe(id) {
        try {
            return await db.query(`DELETE FROM recipes WHERE id = $1`, [id])
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
            SELECT recipes.*, chefs.name AS chef, ${totalQuery}
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
            ORDER BY recipes.created_at DESC LIMIT $1 OFFSET $2
        `

            const results = await db.query(query, [limit, offset])
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
    async recipesOfChef(id) {
        try {
            const results = await db.query(`SELECT * FROM recipes WHERE chef_id = $1 ORDER BY created_at DESC`, [id])
            return results.rows
        } catch (err) {
            console.log(err)
        }
    }
}