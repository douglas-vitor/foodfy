const mailer = require("../../lib/mailer")
const crypto = require("crypto")
const { hash } = require("bcryptjs")
const Admin = require("../models/Admin")

module.exports = {
    list(req, res) {

    },
    create(req, res) {
        return res.render("admin/create_user")
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != "is_admin") {
                return res.render("admin/create_user", {
                    admin: req.body,
                    error: "Preencha os campos nome e email corretamente."
                })
            }
        }

        try {
            user = req.body
            let now = new Date()
            now = 'Food' + now.getMinutes() + now.getMilliseconds()
            const tempPassword = now
            const tempPasswordFirst = await hash(tempPassword, 8)
            if (user.is_admin == null) user.is_admin = false
            if (user.is_admin) user.is_admin = true

            await Admin.createUser(user, tempPasswordFirst)

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Conta Foodfy criada com sucesso!',
                html: `
                <h2>
                Olá ${user.name}, <br>
                Sua conta Foodfy foi criada com sucesso!<br/>
                Segue abaixo seus dados de login</h2>
                <p>
                    login: ${user.email}
                    <br>
                    password: ${tempPassword}
                </p>
                <b>Atenção:</b> Para sua segurança atualize sua senha após fazer seu primeiro login.
                `
            })

            return res.render("admin/create_user", {
                success: `Usuário criado com sucesso;<br/> Dados de login enviados para ${user.email}.`
            })
        } catch (err) {
            console.log(err)
            return res.render("admin/create_user", {
                admin: req.body,
                error: "Algo deu errado, tente novamente mais tarde."
            })
        }
    }
}