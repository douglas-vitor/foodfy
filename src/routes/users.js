const express = require("express")
const routes = express.Router()

const UserController = require("../app/controllers/UserController")
const SessionValidator = require("../app/validators/session")

routes.get("/admin/profile", UserController.profile)
routes.put("/admin/profile", UserController.putProfile)
routes.get("/admin/profile/:id/edit", UserController.editUser)
routes.get("/admin/users", UserController.list)
routes.get("/admin/users/create", SessionValidator.checkIsAdmin, UserController.create)
routes.post("/admin/users", SessionValidator.checkIsAdmin, UserController.post)
routes.put("/admin/users", SessionValidator.checkIsAdmin, UserController.put)
routes.delete("/admin/users", SessionValidator.checkIsAdmin, SessionValidator.notDelete, UserController.delete)
routes.get("/admin/users/logout", UserController.logout)

module.exports = routes