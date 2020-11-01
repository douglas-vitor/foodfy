const db = require("../../config/db")
const Admin = require("../models/Admin")
const File = require("../models/File")
const { date } = require("../../lib/utils")

module.exports = {
    async index(req, res) {
        try {
            let { page, limit } = req.query
            page = page || 1
            limit = limit || 10
            let offset = limit * (page - 1)

            let params = {
                page,
                limit,
                offset
            }
            let recipes = await Admin.paginate(params)

            async function getImage(recipeId) {
                let results = await Admin.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }

            const recipePromise = recipes.map(async recipeI => {
                recipeI.image = await getImage(recipeI.id)
                return recipeI
            })
            const lastadded = await Promise.all(recipePromise)

            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page
            }
            return res.render("admin/home", { recipes: recipes, chefs: recipes.name, pagination, lastimg: lastadded })
        } catch (err) {
            console.log(err)
        }
    },
    async create(req, res) {
        try {
            const options = await Admin.selectChefOptions()
            return res.render("admin/create", { options })
        } catch (err) {
            console.log(err)
        }
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor preencha todos os campos.")
            }
        }

        try {
            if (req.files.length == 0) {
                return res.send("Please, send at least one image.")
            }

            let results = await Admin.createRecipe(req.body)
            const recipeId = results.rows[0].id

            const filesPromise = req.files.map(file => File.createFullDataRecipe({ ...file, recipeId }))
            await Promise.all(filesPromise)

            return res.redirect(`/admin/recipes/${recipeId}`)
        } catch (err) {
            console.log(err)
        }

    },
    async show(req, res) {
        try {
            let recipes = await Admin.findRecipe(req.params.id)
            if (!recipes) {
                return res.send("Receita não encontrada.")
            }

            const chefs = await Admin.selectChefOptions()

            let results = await Admin.files(recipes.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "/").replace("\\", "/")}`
            }))

            return res.render("admin/show", { recipes, chefs, files })
        } catch (err) {
            console.log(err)
        }
    },
    async edit(req, res) {
        try {
            const recipes = await Admin.findRecipe(req.params.id)
            if (!recipes) {
                return res.send("Receita não encontrada.")
            }
            const options = await Admin.selectChefOptions()

            let results = await Admin.files(recipes.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "/").replace("\\", "/")}`
            }))

            return res.render("admin/edit", { recipes, options, files })
        } catch (err) {
            console.log(err)
        }
    },
    async update(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send("Todos os campos devem ser preenchidos.")
            }
        }

        try {
            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file =>
                    File.createFullDataRecipe({ ...file, recipeId: req.body.id }))
                await Promise.all(newFilesPromise)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
            }

            let data = {
                ...req.body
            }

            await Admin.updateRecipe(data)
            return res.redirect(`/admin/recipes/${req.body.id}`)
        } catch (err) {
            console.log(err)
        }
    },
    async delete(req, res) {
        try {
            await Admin.deleteRecipe(req.body.id)
            return res.redirect("/admin/recipes")
        } catch (err) {
            console.log(err)
        }
    },
    async chefs(req, res) {
        try {
            const chefs = await Admin.allChefs()

            async function getImage(chefId) {
                let results = await Admin.filesChefs(chefId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }

            const chefPromisse = chefs.map(async chefI => {
                chefI.image = await getImage(chefI.id)
                return chefI
            })
            const lastadded = await Promise.all(chefPromisse)

            return res.render("admin/chefs", { chefs })
        } catch (err) {
            console.log(err)
        }
    },
    async showChef(req, res) {
        try {
            let chefs = await Admin.findChef(req.params.id)
            if (!chefs) {
                return res.send("Chef não encontrado.")
            }
            try {
                chefs = {
                    ...chefs,
                    avatar_url: `${req.protocol}://${req.headers.host}${chefs.path.replace("public", "").replace("\\", "/").replace("\\", "/")}`
                }
            } catch (err) {
                console.log(err)
            }

            const count = await Admin.countRecipesOfChef(req.params.id)

            const recipes = await Admin.recipesOfChef(req.params.id)
            async function getImage(recipeId) {
                let results = await Admin.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }

            const recipePromise = recipes.map(async recipeI => {
                recipeI.image = await getImage(recipeI.id)
                return recipeI
            })
            await Promise.all(recipePromise)

            const options = await Admin.selectChefOptions()

            return res.render("admin/show_chef", { chefs, count, recipes, options })
        } catch (err) {
            console.log(err)
        }
    },
    createChef(req, res) {
        try {
            return res.render("admin/create_chef")
        } catch (err) {
            console.log(err)
        }
    },
    async postChef(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor preencha todos os campos.")
            }
        }

        try {
            if (req.files.length == 0) {
                return res.send("Please, send at least one image.")
            }
            const data = req.body

            const filesPromise = req.files.map(file => File.createFullDataChef({ ...file, data }))
            await Promise.all(filesPromise)

            const chefId = await filesPromise[0]
            return res.redirect(`/admin/chefs/${chefId}`)
        } catch (err) {
            console.log(err)
        }
    },
    async editChef(req, res) {
        try {
            let chefs = await Admin.findChef(req.params.id)
            try {
                chefs = {
                    ...chefs,
                    avatar_url: `${req.protocol}://${req.headers.host}${chefs.path.replace("public", "").replace("\\", "/").replace("\\", "/")}`
                }
            } catch (err) {
                console.log(err)
            }
            return res.render("admin/edit_chef", { chefs })
        } catch (err) {
            console.log(err)
        }
    },
    async updateChef(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != 'avatar_url') {
                return res.send("Todos os capos devem ser preenchidos.")
            }
        }

        try {
            let data = {
                ...req.body
            }
            if (req.files != "") {
                const filesPromise = req.files.map(file => File.updateFullDataChef({ ...file, data }))
                await Promise.all(filesPromise)
            } else {
                Admin.updateChef(data)
            }


            return res.redirect(`/admin/chefs/${req.body.id}`)
        } catch (err) {
            console.log(err)
        }
    },
    async deleteChef(req, res) {
        try {
            const chefId = await Admin.deleteChef(req.body.id)

            if (chefId) {
                return res.send("O chef não pode ser excluído, pois o mesmo tem receitas em seu nome.")
            } else {
                return res.redirect("/admin/chefs")
            }
        } catch (err) {
            console.log(err)
        }
    }
}