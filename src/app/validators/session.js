const { compare } = require("bcryptjs")
const UsersModel = require("../models/UsersModel")

module.exports = {
    async login(req, res, next) {
        const { email, password } = req.body
        try {
            const user = await UsersModel.findOne({ where: { email } })

            if (!user) return res.render("session/login", {
                public: req.body,
                error: "Usuário não cadastrado."
            })

            const passed = await compare(password, user.password)

            if (!passed) return res.render("session/login", {
                public: req.body,
                error: "Senha incorreta."
            })

            req.user = user

            next()
        } catch (err) {
            console.log(err)
        }
    },
    async forgot(req, res, next) {
        const { email } = req.body
        try {
            let user = await UsersModel.findOne({ where: { email } })

            if (!user) return res.render("session/forgot-password", {
                public: req.body,
                error: "Email não cadastrado."
            })

            req.user = user

            next()
        } catch (err) {
            console.log(err)
        }
    },
    async reset(req, res, next) {
        const { email, password, passwordRepeat, token } = req.body

        try {
            //procurar o usuario
            const user = await UsersModel.findOne({ where: { email } })

            if (!user) return res.render("session/reset", {
                public: req.body,
                token,
                error: "Usuário não cadastrado."
            })

            //ver se as senhas batem
            if (password != passwordRepeat) return res.render('session/reset', {
                public: req.body,
                token,
                error: 'Senhas não conferem.'
            })

            //verificar se token bate
            if (token != user.reset_token) return res.render('session/reset', {
                public: req.body,
                token,
                error: 'Token inválido, solicite uma nova recuperação de senha.'
            })

            //verificar se token nao expirou
            let now = new Date()
            now = now.setHours(now.getHours())

            if (now > user.reset_token_expires) return res.render('session/reset', {
                public: req.body,
                token,
                error: 'Token expirado, solicite uma nova recuperação de senha.'
            })

            req.user = user

            next()
        } catch (err) {
            console.log(err)
        }
    }
}