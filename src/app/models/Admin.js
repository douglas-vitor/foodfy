const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
    async allRecipes() {
        try {
            const query = `
            SELECT recipes.*, chefs.name AS chef   
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
            ORDER BY recipes.id DESC
        `
            const results = await db.query(query)
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
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
    async findChef(id) {
        try {
            const query = `
        SELECT chefs.*, files.path AS path 
        FROM chefs 
        LEFT JOIN files ON (chefs.file_id = files.id) 
        WHERE chefs.id = $1
        `
            const results = await db.query(query, [id])
            return results.rows[0]
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
    async createChef(data) {
        try {
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
        } catch (err) {
            console.log(err)
        }
    },
    async selectChefOptions() {
        try {
            const results = await db.query(`SELECT name, id FROM chefs`)
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
    async countRecipesOfChef(id) {
        try {
            const results = await db.query(`SELECT count(*) FROM recipes WHERE chef_id = $1`, [id])
            return results.rows[0]
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
    },
    async updateChef(data) {
        try {
            const query = `
            UPDATE chefs SET 
            name=($1) 
            WHERE id = $2
        `
            const values = [
                data.name,
                data.id
            ]

            return await db.query(query, values)
        } catch (err) {
            console.log(err)
        }
    },
    async deleteChef(id) {
        try {
            const countResult = await db.query(`SELECT count(*) FROM recipes WHERE chef_id = $1`, [id])
            const prove = Number(countResult.rows[0].count)
            if (prove == 0) {
                db.query(`DELETE FROM chefs WHERE id = $1`, [id])
            } else {
                return id
            }
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
    async createUser(data, password) {
        try {
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            `
            const values = [
                data.name,
                data.email,
                password,
                data.is_admin
            ]

            return await db.query(query, values)
        } catch (err) {
            console.log(err)
        }
    },
    async findOne(filters) {
        let query = `SELECT * FROM users`

        Object.keys(filters).map(key => {
            // WHERE | OR | AND
            query = `${query} 
            ${key}`

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    }
}