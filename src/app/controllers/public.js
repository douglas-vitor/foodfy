const db = require("../../config/db")
const Publico = require("../models/Public")
const crypto = require("crypto")
const {hash} = require("bcryptjs")
const mailer = require("../../lib/mailer")
const Admin = require("../models/Admin")

module.exports = {
    async index(req, res) {
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
    },
    about(req, res) {
        return res.render("about")
    },
    async recipes(req, res) {
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
    },
    async recipe(req, res) {
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
    },
    async chefs(req, res) {
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
    },
    async search(req, res) {
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
    },
    login(req, res) {
        req.session.userId = req.user.id
        return res.redirect("/admin/profile")
    },
    loginForm(req, res) {
        return res.render("session/login")
    },
    async forgot(req, res) {
        const user = req.user

        try {
            //token para o usuario
            const token = crypto.randomBytes(20).toString("hex")

            //criar uma expiração
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await Admin.updateForForgot(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            //enviar um email com um link de recuperação de senha
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
            //avisar o usuario que eviamos o email
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
        return res.render("session/forgot-password")
    },
    async reset(req, res) {
        const user = req.user

        const { password, token } = req.body

        try {
            //cria um novo hash de senha
            const newPassword = await hash(password, 8)

            //atualiza o usuario
            await Admin.updateForForgot(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            //avisa o usuario que ele tem uma nova senha
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
        return res.render("session/reset", {token: req.query.token})
    }
}