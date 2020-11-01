const db = require("../../config/db")
const fs = require("fs")
const { date } = require("../../lib/utils")


module.exports = {
    create(data) {
        try {
            const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `
            const values = [
                data.filename,
                data.path
            ]

            return db.query(query, values)
        } catch (err) {
            console.log(err)
        }
    },
    async createFullDataRecipe({ filename, path, recipeId }) {
        try {
            let query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `
            let values = [
                filename,
                path
            ]

            const results = await db.query(query, values)
            const fileId = results.rows[0].id

            query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `
            return db.query(query, [recipeId, fileId])
        } catch (err) {
            console.log(err)
        }
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]
            fs.unlinkSync(file.path)

            let query = `
            DELETE FROM recipe_files WHERE file_id = $1
            `
            await db.query(query, [id])

            query = `
            DELETE FROM files WHERE id = $1
            `
            return await db.query(query, [id])

        } catch (err) {
            console.log(err)
        }
    },
    async createFullDataChef({ filename, path, data }) {
        try {
            let query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `
            let values = [
                filename,
                path
            ]
            const resultsFile = await db.query(query, values)
            const fileId = resultsFile.rows[0].id

            query = `
            INSERT INTO chefs (
                name,
                created_at,
                file_id
            ) VALUES ($1, $2, $3)
            RETURNING id
        `
            const results = await db.query(query, [data.name, date(Date.now()).iso, fileId])
            return results.rows[0].id
        } catch (err) {
            console.log(err)
        }
    },
    async updateFullDataChef({ filename, path, data }) {
        try {
            let query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `
            let values = [
                filename,
                path
            ]
            const resultsFile = await db.query(query, values)
            const fileId = resultsFile.rows[0].id

            query = `
            UPDATE chefs SET 
                name=($1),
                file_id=($2)
            WHERE id = $3
        `
            return await db.query(query, [data.name, fileId, data.id])
        } catch (err) {
            console.log(err)
        }
    }
}