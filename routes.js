const express = require("express")
const routes = express.Router()
const admin = require("./controllers/admin")
const publico = require("./controllers/public")


// Public
routes.get("/", publico.index)
routes.get("/about", publico.about)
routes.get("/recipes", publico.recipes)
routes.get("/recipe/:id", publico.recipe)


// Admin
routes.get("/admin/recipes", admin.index)
routes.get("/admin/recipes/create", admin.create)
routes.post("/admin/recipes", admin.post)
routes.get("/admin/recipes/:id", admin.show)
routes.get("/admin/recipes/:id/edit", admin.edit)
routes.put("/admin/recipes", admin.update)
routes.delete("/admin/recipes", admin.delete)


module.exports = routes