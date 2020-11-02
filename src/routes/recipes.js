const express = require("express")
const routes = express.Router()

const multer = require("../app/middlewares/multer")
const recipeController = require("../app/controllers/recipesController")


// Admin recipes
routes.get("/admin", function(req, res) {
    return res.redirect("/admin/recipes")
})
routes.get("/admin/recipes", recipeController.index)
routes.get("/admin/recipes/create", recipeController.create)
routes.post("/admin/recipes", multer.array("photos", 5), recipeController.post)
routes.get("/admin/recipes/:id", recipeController.show)
routes.get("/admin/recipes/:id/edit", recipeController.edit)
routes.put("/admin/recipes", multer.array("photos", 5), recipeController.update)
routes.delete("/admin/recipes", recipeController.delete)

module.exports = routes