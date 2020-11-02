const express = require("express")
const routes = express.Router()

const multer = require("../app/middlewares/multer")
const chefsController = require("../app/controllers/chefsController")


// Admin chefs
routes.get("/admin/chefs", chefsController.chefs)
routes.get("/admin/chefs/create_chef", chefsController.createChef)
routes.post("/admin/chefs", multer.array("photos", 1), chefsController.postChef)
routes.get("/admin/chefs/:id", chefsController.showChef)
routes.get("/admin/chefs/:id/edit", chefsController.editChef)
routes.put("/admin/chefs", multer.array("photos", 1), chefsController.updateChef)
routes.delete("/admin/chefs", chefsController.deleteChef)

module.exports = routes