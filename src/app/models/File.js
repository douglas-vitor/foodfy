const db = require("../../config/db")
const fs = require("fs")

module.exports = {
    create(data) {
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
    },
    async createFullDataRecipe({ filename, path, recipeId}) {
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
        } catch(err) {
            console.log(err)
        }
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

            return db.query(`
                DELETE FROM files WHERE id = $1
                `, [id])
        } catch(err) {
            console.log(err)
        }
    }
}