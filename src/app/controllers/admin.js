const db = require("../../config/db")
const Admin = require("../models/Admin")
const {date} = require("../../lib/utils")

module.exports = {
    index(req, res) {
        Admin.allRecipes(function(recipes) {
            return res.render("admin/home", {recipes})
        })
    },
    create(req, res) {
        return res.render("admin/create")
    },
    post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor preencha todos os campos.")
            }
        }

        Admin.createRecipe(req.body, function(recipes) {
            return res.redirect(`/admin/recipes/${recipes.id}`)
        })
    },
    show(req, res) {
        Admin.find(req.params.id, function(recipes) {
            if(!recipes) {
                return res.send("Receita não encontrada.")
            }
            return res.render("admin/show", {recipes})
        })
    },
    edit(req, res) {
        const { id } = req.params
        const foundRecipes = data.recipes.find(function (recipe) {
            return recipe.id == id
        })
        if (!foundRecipes) {
            return res.send("Receita não encontrada.")
        }
        return res.render("admin/edit")
    },
    update(req, res) {
        const { id } = req.body
        let index = 0

        const foundRecipes = data.recipes.find(function (recipe, foundIndex) {
            if (id == recipe.id) {
                index = foundIndex
                return true
            }
        })
        if (!foundRecipes) {
            return res.send("Receita não encontrada.")
        }

        const recipe = {
            ...foundRecipes,
            ...req.body,
            id: Number(req.body.id)
        }

        data.recipes[index] = recipe
    },
    delete(req, res) {
        const { id } = req.body
        const filteredRecipes = data.recipes.filter(function (recipe) {
            return recipe.id != id
        })

        data.recipes = filteredRecipes
    }
}