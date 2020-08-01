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
        Admin.findRecipe(req.params.id, function(recipes) {
            if(!recipes) {
                return res.send("Receita não encontrada.")
            }
            return res.render("admin/show", {recipes})
        })
    },
    edit(req, res) {
        Admin.findRecipe(req.params.id, function(recipes) {
            if(!recipes) {
                return res.send("Receita não encontrada.")
            }
        return res.render("admin/edit", {recipes})
        })
    },
    update(req, res) {
        const keys = Object.keys(req.body)
        for(key of keys) {
            if(req.body[key] == "") {
                return res.send("Todos os capos devem ser preenchidos.")
            }
        }

        let data = {
            ...req.body
        }

        Admin.updateRecipe(data, function() {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req, res) {
        Admin.deleteRecipe(req.body.id, function() {
            return res.redirect("/admin/recipes")
        })
    }
}