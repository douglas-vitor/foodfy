const express = require("express")
const routes = express.Router()

const { isLoggedRedirectToUsers } = require("../app/middlewares/session")
const publico = require("../app/controllers/public")
const SessionValidator = require("../app/validators/session")

routes.get("/", publico.index)
routes.get("/about", publico.about)
routes.get("/recipes", publico.recipes)
routes.get("/recipe/:id", publico.recipe)
routes.get("/chefs", publico.chefs)
routes.get("/search", publico.search)
routes.get("/login", isLoggedRedirectToUsers, publico.loginForm)
routes.post("/login", SessionValidator.login, publico.login)
routes.get("/forgot-password", publico.forgotForm)
routes.post("/forgot-password", SessionValidator.forgot, publico.forgot)
routes.get("/reset", publico.resetForm)
routes.post("/reset",SessionValidator.reset, publico.reset)

module.exports = routes