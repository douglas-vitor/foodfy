const express = require("express")
const routes = express.Router()
const admin = require("./app/controllers/admin")
const publico = require("./app/controllers/public")
const multer = require("./app/middlewares/multer")


// Public
routes.get("/", publico.index)
routes.get("/about", publico.about)
routes.get("/recipes", publico.recipes)
routes.get("/recipe/:id", publico.recipe)
routes.get("/chefs", publico.chefs)
routes.get("/search", publico.search)


// Admin
routes.get("/admin", function(req, res) {
    return res.redirect("/admin/recipes")
})
routes.get("/admin/recipes", admin.index)
routes.get("/admin/recipes/create", admin.create)
routes.post("/admin/recipes", multer.array("photos", 5), admin.post)
routes.get("/admin/recipes/:id", admin.show)
routes.get("/admin/recipes/:id/edit", admin.edit)
routes.put("/admin/recipes", multer.array("photos", 5), admin.update)
routes.delete("/admin/recipes", admin.delete)
routes.get("/admin/chefs", admin.chefs)
routes.get("/admin/chefs/create_chef", admin.createChef)
routes.post("/admin/chefs", multer.array("photos", 1), admin.postChef)
routes.get("/admin/chefs/:id", admin.showChef)
routes.get("/admin/chefs/:id/edit", admin.editChef)
routes.put("/admin/chefs", multer.array("photos", 1), admin.updateChef)
routes.delete("/admin/chefs", admin.deleteChef)

// Not-found
routes.use(function (req, res) {
    return res.status(404).render("not-found")
})

module.exports = routes