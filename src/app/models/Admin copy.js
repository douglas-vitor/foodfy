const db = require("../../config/db")
const { date } = require("../../lib/utils")

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
    async getImageRecipeHome(id) {
        let query = `
            SELECT files.* FROM files 
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id) 
            WHERE recipe_files.recipe_id = $1 
        `
        const results = await db.query(query, [id])
        
        return results.rows
    },
    createRecipe(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
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

        return db.query(query, values)
    }
/*    createRecipe(data, callback) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows[0])
        })
    }*/,
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
    updateRecipe(data, callback) {
        const query = `
            UPDATE recipes SET 
            chef_id=($1),
            image=($2),
            title=($3),
            ingredients=($4),
            preparation=($5),
            information=($6) 
            WHERE id = $7
        `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback()
        })
    },
    deleteRecipe(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback()
        })
    },
    findChef(id, callback) {
        db.query(`
            SELECT * 
            FROM chefs 
            WHERE id = $1 
        `, [id], function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows[0])
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
    createChef(data, callback) {
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

        db.query(query, values, function (err, results) {
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
    countRecipesOfChef(id, callback) {
        db.query(`SELECT count(*) FROM recipes WHERE chef_id = $1`, [id], function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows[0])
        })
    },
    recipesOfChef(id, callback) {
        db.query(`SELECT * FROM recipes WHERE chef_id = $1`, [id], function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows)
        })
    },
    updateChef(data, callback) {
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

        db.query(query, values, function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback()
        })
    },
    deleteChef(id, callback) {
        const verifyRecipesOfChef = db.query(`SELECT count(*) FROM recipes WHERE chef_id = $1`, [id], function (err, countResult) {
            if(err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            const prove = Number(countResult.rows[0].count)
            if( prove == 0 ) {
                db.query(`DELETE FROM chefs WHERE id = $1`, [id], function (err, results) {
                    if (err) {
                        throw `[DATABASE] : ${err}`
                    }
                    callback()
                })
            } else {
                function SendErrorDeleteChef(chefId) {
                    callback(chefId)
                }
                SendErrorDeleteChef(id)

            }
        })
    },
    paginate(params) {
        const { limit, offset, callback } = params

        let query = "",
        totalQuery = `(
            SELECT count(*) FROM recipes
        ) AS total`

        query = `
            SELECT recipes.*, ${totalQuery} 
            FROM recipes 
            ORDER BY id LIMIT $1 OFFSET $2
        `
        db.query(query, [limit, offset], function (err, results) {
            if (err) {
                throw `[DATABASE ERROR] : ${err}`
            }
            callback(results.rows)
        })
    }
}