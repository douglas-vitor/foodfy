const Publico = require("../models/Public")
const crypto = require("crypto")
const { hash } = require("bcryptjs")
const mailer = require("../../lib/mailer")
const UsersModel = require("../models/UsersModel")

module.exports = {
    async index(req, res) {
        try {
            let recipes = await Publico.allRecipes()
            const chefs = await Publico.selectChefOptions()

            async function getImage(recipeId) {
                let results = await Publico.getImages(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }

            const recipePromise = recipes.map(async recipeI => {
                recipeI.image = await getImage(recipeI.id)
                return recipeI
            })
            const lastadded = await Promise.all(recipePromise)
            return res.render("home", { recipes: lastadded, chefs })
        } catch (err) {
            console.log(err)
        }
    },
    about(req, res) {
        try {
            return res.render("about")
        } catch (err) {
            console.log(err)
        }
    },
    async recipes(req, res) {
        try {
            const chefs = await Publico.selectChefOptions()

            let { page, limit } = req.query
            page = page || 1
            limit = limit || 10
            let offset = limit * (page - 1)

            const params = {
                page,
                limit,
                offset
            }

            const recipes = await Publico.paginate(params)

            async function getImage(recipeId) {
                let results = await Publico.getImages(recipeId)
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

            return res.render("recipes", { recipes, chefs, pagination })
        } catch (err) {
            console.log(err)
        }
    },
    async recipe(req, res) {
        try {
            const data = await Publico.findRecipe(req.params.id)
            if (!data) {
                return res.send("Receita não encontrada.")
            }

            async function getImage(recipeId) {
                let results = await Publico.getImages(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }
            data.image = await getImage(data.id)

            const chefs = await Publico.selectChefOptions()

            return res.render("recipe", { data, chefs })
        } catch (err) {
            console.log(err)
        }
    },
    async chefs(req, res) {
        try {
            const chefs = await Publico.countRecipesOfChef()

            async function getImage(chefId) {
                let results = await Publico.filesChefs(chefId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }

            const chefPromisse = chefs.map(async chefI => {
                chefI.image = await getImage(chefI.id)
                return chefI
            })
            await Promise.all(chefPromisse)

            return res.render("chefs", { chefs })
        } catch (err) {
            console.log(err)
        }
    },
    async search(req, res) {
        try {
            const filter = req.query.filter
            const recipes = await Publico.search(filter)
            const chefs = await Publico.selectChefOptions()

            async function getImage(recipeId) {
                let results = await Publico.getImages(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
                return files[0]
            }

            const recipePromise = recipes.map(async recipeI => {
                recipeI.image = await getImage(recipeI.id)
                return recipeI
            })
            await Promise.all(recipePromise)

            return res.render("search", { recipes, filter, chefs })
        } catch (err) {
            console.log(err)
        }
    },
    login(req, res) {
        try {
            req.session.userId = req.user.id
            return res.redirect("/admin/profile")
        } catch (err) {
            console.log(err)
        }
    },
    loginForm(req, res) {
        try {
            return res.render("session/login")
        } catch (err) {
            console.log(err)
        }
    },
    async forgot(req, res) {
        const user = req.user

        try {
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await UsersModel.updateForForgot(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a chave?</h2>
            <p>Não se preocupe, clique no link abaixo para recuperar sua senha.</p>
            <p>
                <a href="http://localhost:3000/reset?token=${token}" target="_blank">
                    RECUPERAR SENHA.
                </a>
            </p>
            `
            })
            return res.render("session/forgot-password", {
                success: "Verifique seu email para resetar sua senha."
            })
        } catch (err) {
            console.log(err)
            return res.render("session/forgot-password", {
                error: "Erro inesperado, tente novamente."
            })
        }
    },
    forgotForm(req, res) {
        try {
            return res.render("session/forgot-password")
        } catch (err) {
            console.log(err)
        }
    },
    async reset(req, res) {
        const user = req.user

        const { password, token } = req.body

        try {
            const newPassword = await hash(password, 8)

            await UsersModel.updateForForgot(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            return res.render("session/login", {
                public: req.body,
                success: "Senha atualizada."
            })

        } catch (err) {
            console.log(err)
            return res.render("session/reset", {
                public: req.body,
                token,
                error: "Erro inesperado, tente novamente."
            })
        }
    },
    resetForm(req, res) {
        try {
            return res.render("session/reset", { token: req.query.token })
        } catch (err) {
            console.log(err)
        }
    }
}