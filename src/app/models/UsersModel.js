const db = require("../../config/db")

module.exports = {
    async createUser(data, password) {
        try {
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4) 
            RETURNING id
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
        try {
            let query = `SELECT * FROM users`

            Object.keys(filters).map(key => {
                query = `${query} 
                ${key}`

                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}'`
                })
            })

            const results = await db.query(query)
            return results.rows[0]
        } catch (err) {
            console.log(err)
        }
    },
    async updateForForgot(id, fields) {
        try {
            let query = "UPDATE users SET"

            Object.keys(fields).map((key, index, array) => {
                if ((index + 1) < array.length) {
                    query = `${query} 
                ${key} = '${fields[key]}',
                `
                } else {
                    query = `${query} 
                ${key} = '${fields[key]}'
                WHERE id = ${id}
                `
                }
            })
            await db.query(query)
            return
        } catch (err) {
            console.log(err)
        }
    },
    async listUsers() {
        try {
            let results = await db.query("SELECT * FROM users ORDER BY updated_at ASC")
            return results.rows
        } catch (err) {
            console.log(err)
        }
    },
    async checkUserAdmin(id) {
        try {
            let results = await db.query("SELECT is_admin FROM users WHERE id = $1", [id])
            return results.rows[0]
        } catch (err) {
            console.log(err)
        }
    },
    async updateProfile(id, data) {
        try {
            const query = `UPDATE users SET 
            name=($1),
            email=($2) 
            WHERE id = $3`
            const values = [
                data.name,
                data.email,
                id
            ]

            return await db.query(query, values)
        } catch (err) {
            console.log(err)
        }
    },
    async updateUser(id, data) {
        try {
            const query = `UPDATE users SET 
            name=($1),
            email=($2),
            is_admin=($3) 
            WHERE id = $4`
            const values = [
                data.name,
                data.email,
                data.is_admin,
                id
            ]

            return await db.query(query, values)
        } catch (err) {
            console.log(err)
        }
    },
    async deleteUser(id) {
        try {
            return await db.query("DELETE FROM users WHERE id = $1", [id])
        } catch (err) {
            console.log(err)
        }
    }
}