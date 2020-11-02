const ChefsModel = require("../models/ChefsModel")
const RecipesModel = require("../models/RecipesModel")
const UsersModel = require("../models/UsersModel")
const File = require("../models/File")

module.exports = {
    async chefs(req, res) {
        try {
            const chefs = await ChefsModel.allChefs()

            async function getImage(chefId) {
                let results = await ChefsModel.filesChefs(chefId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }

            const chefPromisse = chefs.map(async chefI => {
                chefI.image = await getImage(chefI.id)
                return chefI
            })
            const lastadded = await Promise.all(chefPromisse)

            const { error, success } = req.query
            if (error) { return res.render("admin/chefs", { chefs, error }) }
            if (success) { return res.render("admin/chefs", { chefs, success }) }

            return res.render("admin/chefs", { chefs })
        } catch (err) {
            console.log(err)
        }
    },
    async showChef(req, res) {
        try {
            let chefs = await ChefsModel.findChef(req.params.id)
            if (!chefs) {
                return res.redirect("/admin/chefs?error=Chef não encontrado.")
            }
            try {
                chefs = {
                    ...chefs,
                    avatar_url: `${req.protocol}://${req.headers.host}${chefs.path.replace("public", "").replace("\\", "/").replace("\\", "/")}`
                }
            } catch (err) {
                console.log(err)
            }

            const count = await ChefsModel.countRecipesOfChef(req.params.id)

            const recipes = await RecipesModel.recipesOfChef(req.params.id)
            async function getImage(recipeId) {
                let results = await RecipesModel.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }

            const recipePromise = recipes.map(async recipeI => {
                recipeI.image = await getImage(recipeI.id)
                return recipeI
            })
            await Promise.all(recipePromise)

            const options = await ChefsModel.selectChefOptions()

            let is_admin = await UsersModel.checkUserAdmin(req.session.userId)

            const { error, success } = req.query
            if (error) { return res.render("admin/show_chef", { chefs, count, recipes, options, administrator: is_admin.is_admin, error }) }
            if (success) { return res.render("admin/show_chef", { chefs, count, recipes, options, administrator: is_admin.is_admin, success }) }

            return res.render("admin/show_chef", { chefs, count, recipes, options, administrator: is_admin.is_admin })
        } catch (err) {
            console.log(err)
            return res.redirect("/admin/chefs?error=Algo deu errado.")
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
                return res.render("admin/create_chef", {
                    error: "Preencha todos os campos."
                })
            }
        }

        try {
            if (req.files.length == 0) {
                return res.redirect("/admin/chefs/create?error=Selecione um avatar para o chef.")
            }
            const data = req.body

            const filesPromise = req.files.map(file => File.createFullDataChef({ ...file, data }))
            await Promise.all(filesPromise)

            const chefId = await filesPromise[0]
            return res.redirect(`/admin/chefs/${chefId}?success=Chef criado com sucesso.`)
        } catch (err) {
            console.log(err)
            return res.redirect("/admin/chefs?error=Algo deu errado.")
        }
    },
    async editChef(req, res) {
        try {
            let chefs = await ChefsModel.findChef(req.params.id)
            try {
                chefs = {
                    ...chefs,
                    avatar_url: `${req.protocol}://${req.headers.host}${chefs.path.replace("public", "").replace("\\", "/").replace("\\", "/")}`
                }
            } catch (err) {
                console.log(err)
            }

            const { error, success } = req.query
            if (error) { return res.render("admin/edit_chef", { chefs, error }) }
            if (success) { return res.render("admin/edit_chef", { chefs, success }) }

            return res.render("admin/edit_chef", { chefs })
        } catch (err) {
            console.log(err)
            return res.redirect("/admin/chefs?error=Algo deu errado.")
        }
    },
    async updateChef(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != 'avatar_url') {
                return res.redirect(`/admin/chefs/${req.body.id}?error=Todos os campos devem ser preenchidos.`)
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
                ChefsModel.updateChef(data)
            }

            return res.redirect(`/admin/chefs/${req.body.id}?success=Chef atualizado com sucesso.`)
        } catch (err) {
            console.log(err)
            return res.redirect(`/admin/chefs?error=Algo deu errado.`)
        }
    },
    async deleteChef(req, res) {
        try {
            const chefId = await ChefsModel.deleteChef(req.body.id)

            if (chefId) {
                return res.redirect(`/admin/chefs/${req.body.id}?error=O chef não pode ser excluído, pois o mesmo tem receitas em seu nome.`)
            } else {
                return res.redirect("/admin/chefs?success=Chef deletado com sucesso.")
            }
        } catch (err) {
            console.log(err)
            return res.redirect(`/admin/chefs?error=Algo deu errado.`)
        }
    }
}