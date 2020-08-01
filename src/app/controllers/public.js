const db = require("../../config/db")
const Publico = require("../models/Public")

module.exports = {
    index(req, res) {
        Publico.allRecipes(function (recipes) {
            Publico.selectChefOptions(function(chefs) {
                return res.render("home", { recipes, chefs })
            })
        })
    },
    about(req, res) {
        return res.render("about")
    },
    recipes(req, res) {
        Publico.allRecipes(function (recipes) {
            Publico.selectChefOptions(function(chefs) {
                return res.render("recipes", { recipes, chefs })
            })
        })
    },
    recipe(req, res) {
        Publico.findRecipe(req.params.id, function (data) {
            if (!data) {
                return res.send("Receita não encontrada.")
            }
            Publico.selectChefOptions(function(chefs) {
                return res.render("recipe", { data, chefs })
            })
        })
    },
    chefs(req, res) {
        Publico.allChefs(function(chefs) {
            return res.render("chefs", {chefs})
        })
    },
    search(req, res) {
        return res.render("search")
    }
}