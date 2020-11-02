const express = require("express")
const routes = express.Router()

const multer = require("../app/middlewares/multer")
const chefsController = require("../app/controllers/chefsController")
const SessionValidator = require("../app/validators/session")

routes.get("/admin/chefs", chefsController.chefs)
routes.get("/admin/chefs/create", SessionValidator.checkIsAdmin, chefsController.createChef)
routes.post("/admin/chefs", SessionValidator.checkIsAdmin, multer.array("photos", 1), chefsController.postChef)
routes.get("/admin/chefs/:id", chefsController.showChef)
routes.get("/admin/chefs/:id/edit", SessionValidator.checkIsAdmin, chefsController.editChef)
routes.put("/admin/chefs", SessionValidator.checkIsAdmin, multer.array("photos", 1), chefsController.updateChef)
routes.delete("/admin/chefs", SessionValidator.checkIsAdmin, chefsController.deleteChef)

module.exports = routes