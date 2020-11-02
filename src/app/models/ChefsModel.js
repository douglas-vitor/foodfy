const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
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
    }
}