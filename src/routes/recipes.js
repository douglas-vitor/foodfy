const express = require("express")
const routes = express.Router()

const multer = require("../app/middlewares/multer")
const {onlyUsers} = require("../app/middlewares/session")
const recipeController = require("../app/controllers/recipesController")
const SessionValidator = require("../app/validators/session")

routes.get("/admin", onlyUsers, function(req, res) {
    return res.redirect("/admin/recipes")
})
routes.get("/admin/recipes", onlyUsers, recipeController.index)
routes.get("/admin/recipes/create", onlyUsers, SessionValidator.checkIsAdmin, recipeController.create)
routes.post("/admin/recipes", onlyUsers, SessionValidator.checkIsAdmin, multer.array("photos", 5), recipeController.post)
routes.get("/admin/recipes/:id", onlyUsers, recipeController.show)
routes.get("/admin/recipes/:id/edit", onlyUsers, SessionValidator.checkIsAdmin, recipeController.edit)
routes.put("/admin/recipes", onlyUsers, SessionValidator.checkIsAdmin, multer.array("photos", 5), recipeController.update)
routes.delete("/admin/recipes", onlyUsers, SessionValidator.checkIsAdmin, recipeController.delete)

module.exports = routes