const mailer = require("../../lib/mailer")
const crypto = require("crypto")
const { hash, compare } = require("bcryptjs")
const UsersModel = require("../models/UsersModel")

module.exports = {
    async list(req, res) {
        try {
            const users = await UsersModel.listUsers()
            let is_admin = await UsersModel.checkUserAdmin(req.session.userId)
            const myid = req.session.userId

            const {error} = req.query
            if(error) {
                return res.render("admin/users", { users, administrator: is_admin.is_admin, myid, error })
            }
            return res.render("admin/users", { users, administrator: is_admin.is_admin, myid })
        } catch (err) {
            console.log(err)
        }
    },
    create(req, res) {
        try {
            return res.render("admin/create_user")
        } catch (err) {
            console.log(err)
        }
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
            let maintenant = 'Food' + now.getMinutes() + now.getMilliseconds()
            const tempPassword = maintenant
            const tempPasswordFirst = await hash(tempPassword, 8)
            if (user.is_admin == null) user.is_admin = false
            if (user.is_admin) user.is_admin = true

            //token para o usuario
            const token = crypto.randomBytes(20).toString("hex")

            //criar uma expiração
            now = now.setHours(now.getHours() + 1)

            const idNewUser = await UsersModel.createUser(user, tempPasswordFirst)

            await UsersModel.updateForForgot(idNewUser.rows[0].id, {
                reset_token: token,
                reset_token_expires: now
            })

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
                    password: Defina sua senha de acesso através do link abaixo.
                </p>
                <a href="http://localhost:3000/reset?token=${token}" target="_blank">
                    DEFINIR SENHA.
                </a>
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
    },
    async editUser(req, res) {
        const id = req.params.id
        try {
            let results = await UsersModel.findOne({ where: { id } })

            if (!results) {
                return res.render("admin/users", {
                    error: 'Usuário não encontrado.'
                })
            }
            const myid = req.session.userId
            const {success, error} = req.query
            if(error) { return res.render("admin/edit_user", { admin: results, myid, error }) }
            if(success) { return res.render("admin/edit_user", { admin: results, myid, success }) }
            return res.render("admin/edit_user", { admin: results, myid })
        } catch (err) {
            console.log(err)
        }
    },
    logout(req, res) {
        try {
            req.session.destroy()
            return res.redirect("/login")
        } catch (err) {
            console.log(err)
        }
    },
    async profile(req, res) {
        try {
            const id = req.session.userId
            const admin = await UsersModel.findOne({ where: { id } })
            return res.render("admin/profile", { admin })
        } catch (err) {
            console.log(err)
        }
    },
    async putProfile(req, res) {
        try {
            let { password } = req.body
            let id = req.session.userId
            let checkUser = await UsersModel.findOne({ where: { id } })
            const passed = await compare(password, checkUser.password)

            if (!passed) {
                return res.render("admin/profile", {
                    admin: req.body,
                    error: "Senha incorreta."
                })
            }

            await UsersModel.updateProfile(req.session.userId, req.body)
            return res.render("admin/profile", {
                admin: req.body,
                success: "Dados atualizados com suceso."
            })
        } catch (err) {
            console.log(err)
            return res.render("admin/profile", {
                admin: req.body,
                error: "Erro ao atualizar dados."
            })
        }
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "is_admin") {
                return res.render("admin/create_user", {
                    admin: req.body,
                    error: "Preencha os campos nome e email corretamente."
                })
            }
        }
        const user = req.body
        if (user.is_admin == null) user.is_admin = false
        if (user.is_admin) user.is_admin = true

        try {
            await UsersModel.updateUser(req.body.id, user)
            return res.redirect(`/admin/profile/${req.body.id}/edit?success=Usuário atualizado com sucesso.`)
        } catch (err) {
            console.log(err)
            return res.redirect(`/admin/profile/${req.body.id}/edit?error=Erro ao atualizar usuário.`)
        }
    },
    async delete(req, res) {
        if(!req.body.id) {
            return res.redirect("/admin/users?error=Usuário inválido.")
        }

        try {
            await UsersModel.deleteUser(req.body.id)
            return res.redirect("/admin/users?success=Usuário deletado com sucesso.")        
        } catch (err) {
            console.log(err)
        }
    }
}