const express = require("express")
const routes = express.Router()

const multer = require("../app/middlewares/multer")
const {onlyUsers} = require("../app/middlewares/session")
const chefsController = require("../app/controllers/chefsController")
const SessionValidator = require("../app/validators/session")

routes.get("/admin/chefs", onlyUsers, chefsController.chefs)
routes.get("/admin/chefs/create", onlyUsers, SessionValidator.checkIsAdmin, chefsController.createChef)
routes.post("/admin/chefs", onlyUsers, SessionValidator.checkIsAdmin, multer.array("photos", 1), chefsController.postChef)
routes.get("/admin/chefs/:id", onlyUsers, chefsController.showChef)
routes.get("/admin/chefs/:id/edit", onlyUsers, SessionValidator.checkIsAdmin, chefsController.editChef)
routes.put("/admin/chefs", onlyUsers, SessionValidator.checkIsAdmin, multer.array("photos", 1), chefsController.updateChef)
routes.delete("/admin/chefs", onlyUsers, SessionValidator.checkIsAdmin, chefsController.deleteChef)

module.exports = routes