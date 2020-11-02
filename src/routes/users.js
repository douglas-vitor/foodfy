const express = require("express")
const routes = express.Router()

const UserController = require("../app/controllers/UserController")

//Admin users
routes.get('/admin/profile', UserController.profile) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile', UserController.putProfile)// Editar o usuário logado
routes.get("/admin/profile/:id/edit", UserController.editUser)
routes.get('/admin/users', UserController.list) //Mostrar a lista de usuários cadastrados
routes.get("/admin/users/create", UserController.create)
routes.post('/admin/users', UserController.post) //Cadastrar um usuário
//routes.put('/admin/users', UserController.put) // Editar um usuário
//routes.delete('/admin/users', UserController.delete) // Deletar um usuário
routes.get("/admin/users/logout", UserController.logout)

module.exports = routes