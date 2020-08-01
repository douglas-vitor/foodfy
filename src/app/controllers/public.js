const db = require("../../config/db")

module.exports = {
    index(req, res) {
        return res.render("home")
    },
    about(req, res) {
        return res.render("about")
    },
    recipes(req, res) {
        return res.render("recipes")
    },
    recipe(req, res) {
        const id = req.params.id
        const verify = function (verify) {
            if (id <= (recipes.recipes.length - 1)) {
                return true
            }
        }
        if (!verify(id)) {
            return res.status(404).render("not-found")
        }
        return res.render("recipe")
    },
    chefs(req, res) {
        return res.render("chefs")
    },
    search(req, res) {
        return res.render("search")
    }
}