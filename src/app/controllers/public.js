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
                let {page, limit} = req.query
        page = page || 1
        limit = limit || 10 //10
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
                return res.render("recipes", { recipes, chefs, pagination })
            }
        }
        Publico.paginate(params)

            })
        })
        
        /*Publico.allRecipes(function (recipes) {
            Publico.selectChefOptions(function(chefs) {
                return res.render("recipes", { recipes, chefs })
            })
        })*/
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
        Publico.countRecipesOfChef(function(chefs) {
            return res.render("chefs", {chefs})
        })
    },
    search(req, res) {
        const filter = req.query.filter
        Publico.search(req.query.filter, function(recipes) {
            Publico.selectChefOptions(function(chefs) {
                return res.render("search", {recipes, filter, chefs})
            })
        })
    }
}