const express = require("express")
const routes = express.Router()

const {onlyUsers} = require("../app/middlewares/session")
const UserController = require("../app/controllers/UserController")
const SessionValidator = require("../app/validators/session")

routes.get("/admin/profile", onlyUsers, UserController.profile)
routes.put("/admin/profile", onlyUsers, UserController.putProfile)
routes.get("/admin/profile/:id/edit", onlyUsers, UserController.editUser)
routes.get("/admin/users", onlyUsers, UserController.list)
routes.get("/admin/users/create", onlyUsers, SessionValidator.checkIsAdmin, UserController.create)
routes.post("/admin/users", onlyUsers, SessionValidator.checkIsAdmin, UserController.post)
routes.put("/admin/users", onlyUsers, SessionValidator.checkIsAdmin, UserController.put)
routes.delete("/admin/users", onlyUsers, SessionValidator.checkIsAdmin, SessionValidator.notDelete, UserController.delete)
routes.get("/admin/users/logout", onlyUsers, UserController.logout)

module.exports = routes