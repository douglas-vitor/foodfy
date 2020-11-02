const express = require("express")
const routes = express.Router()

const multer = require("../app/middlewares/multer")
const recipeController = require("../app/controllers/recipesController")
const SessionValidator = require("../app/validators/session")

routes.get("/admin", function(req, res) {
    return res.redirect("/admin/recipes")
})
routes.get("/admin/recipes", recipeController.index)
routes.get("/admin/recipes/create", SessionValidator.checkIsAdmin, recipeController.create)
routes.post("/admin/recipes", SessionValidator.checkIsAdmin, multer.array("photos", 5), recipeController.post)
routes.get("/admin/recipes/:id", recipeController.show)
routes.get("/admin/recipes/:id/edit", SessionValidator.checkIsAdmin, recipeController.edit)
routes.put("/admin/recipes", SessionValidator.checkIsAdmin, multer.array("photos", 5), recipeController.update)
routes.delete("/admin/recipes", SessionValidator.checkIsAdmin, recipeController.delete)

module.exports = routes