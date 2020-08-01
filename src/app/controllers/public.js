const db = require("../../config/db")
const Publico = require("../models/Public")

module.exports = {
    index(req, res) {
        Publico.allRecipes(function(recipes) {
            return res.render("home", {recipes})
        })
    },
    about(req, res) {
        return res.render("about")
    },
    recipes(req, res) {
        Publico.allRecipes(function(recipes) {
            return res.render("recipes", {recipes})
        })
    },
    recipe(req, res) {
        Publico.findRecipe(req.params.id, function(data) {
            if(!data) {
                return res.send("Receita não encontrada.")
            }
            return res.render("recipe", {data})
        })
    },
    chefs(req, res) {
        return res.render("chefs")
    },
    search(req, res) {
        return res.render("search")
    }
}