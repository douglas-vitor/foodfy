const RecipesModel = require("../models/RecipesModel")
const ChefsModel = require("../models/ChefsModel")
const UsersModel = require("../models/UsersModel")
const File = require("../models/File")

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
            let recipes = await RecipesModel.paginate(params)

            async function getImage(recipeId) {
                let results = await RecipesModel.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }

            const recipePromise = recipes.map(async recipeI => {
                recipeI.image = await getImage(recipeI.id)
                return recipeI
            })
            const lastadded = await Promise.all(recipePromise)

            let pagination
            try {
                pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
            } catch (err) {
                pagination = {
                    total: 0,
                    page
                }
            }

            const { error, success } = req.query
            if (error) { return res.render("admin/home", { recipes: recipes, chefs: recipes.name, pagination, lastimg: lastadded, error }) }
            if (success) { return res.render("admin/home", { recipes: recipes, chefs: recipes.name, pagination, lastimg: lastadded, success }) }

            return res.render("admin/home", { recipes: recipes, chefs: recipes.name, pagination, lastimg: lastadded })
        } catch (err) {
            console.log(err)
        }
    },
    async create(req, res) {
        try {
            const options = await ChefsModel.selectChefOptions()
            const { error, success } = req.query
            if (error) { return res.render("admin/create", { options, error }) }
            if (success) { return res.render("admin/create", { options, success }) }

            return res.render("admin/create", { options })
        } catch (err) {
            console.log(err)
        }
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.render("admin/create", {
                    error: 'Preencha todos os campos.'
                })
            }
        }

        try {
            if (req.files.length == 0) {
                return res.redirect("/admin/recipes/create?error=Selecione pelo menos uma imagem.")
            }

            let results = await RecipesModel.createRecipe(req.body)
            const recipeId = results.rows[0].id

            const filesPromise = req.files.map(file => File.createFullDataRecipe({ ...file, recipeId }))
            await Promise.all(filesPromise)

            return res.redirect(`/admin/recipes/${recipeId}?success=Receita criada com sucesso.`)
        } catch (err) {
            console.log(err)
        }

    },
    async show(req, res) {
        try {
            let recipes = await RecipesModel.findRecipe(req.params.id)
            if (!recipes) {
                return res.redirect("/admin/recipes?error=Receita não encontrada.")
            }

            const chefs = await ChefsModel.selectChefOptions()

            let results = await RecipesModel.files(recipes.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "/").replace("\\", "/")}`
            }))

            let is_admin = await UsersModel.checkUserAdmin(req.session.userId)

            const { error, success } = req.query
            if (error) { return res.render("admin/show", { recipes, chefs, files, administrator: is_admin.is_admin, error }) }
            if (success) { return res.render("admin/show", { recipes, chefs, files, administrator: is_admin.is_admin, success }) }

            return res.render("admin/show", { recipes, chefs, files, administrator: is_admin.is_admin })
        } catch (err) {
            console.log(err)
            return res.redirect("/admin/recipes?error=Algo deu errado.")
        }
    },
    async edit(req, res) {
        try {
            const recipes = await RecipesModel.findRecipe(req.params.id)
            if (!recipes) {
                return res.redirect("/admin/recipes?error=Receita não encontrada.")
            }
            const options = await ChefsModel.selectChefOptions()

            let results = await RecipesModel.files(recipes.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "/").replace("\\", "/")}`
            }))

            let is_admin = await UsersModel.checkUserAdmin(req.session.userId)

            const { error, success } = req.query
            if (error) { return res.render("admin/edit", { recipes, options, files, administrator: is_admin.is_admin, error }) }
            if (success) { return res.render("admin/edit", { recipes, options, files, administrator: is_admin.is_admin, success }) }

            return res.render("admin/edit", { recipes, options, files, administrator: is_admin.is_admin })
        } catch (err) {
            console.log(err)
            return res.redirect("/admin/recipes?error=Algo deu errado.")
        }
    },
    async update(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.redirect(`/admin/recipes/${req.body.id}?error=Todos os campos devem ser preenchidos.`)
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

            await RecipesModel.updateRecipe(data)
            return res.redirect(`/admin/recipes/${req.body.id}?success=Receita atualizada com sucesso.`)
        } catch (err) {
            console.log(err)
            return res.redirect(`/admin/recipes?error=Algo deu errado.`)
        }
    },
    async delete(req, res) {
        try {
            await RecipesModel.deleteRecipe(req.body.id)
            return res.redirect("/admin/recipes?success=Receita deletada com sucesso.")
        } catch (err) {
            console.log(err)
            return res.redirect("/admin/recipes?error=Algo deu errado.")
        }
    }
}