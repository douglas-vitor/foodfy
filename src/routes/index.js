const express = require("express")
const routes = express.Router()

const publico = require("./publico")
const recipes = require("./recipes")
const chefs = require("./chefs")
const users = require("./users")

routes.use(publico)
routes.use(recipes)
routes.use(chefs)
routes.use(users)

routes.use(function (req, res) {
    return res.status(404).render("not-found")
})

module.exports = routes