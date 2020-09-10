const db = require("../../config/db")
const Admin = require("../models/Admin")
const File = require("../models/File")
const { date } = require("../../lib/utils")

module.exports = {
    index(req, res) {
        Admin.allRecipes(function (recipes) {
            Admin.selectChefOptions(function(chefs) {
                let { page, limit } = req.query
                page = page || 1
                limit = limit || 10
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
                        let amor = Admin.getImageRecipeHome(2)
                        console.log(amor)
                        console.log(recipes[0].id)
                        return res.render("admin/home", { recipes, chefs, pagination })
                    }
                }
                Admin.paginate(params)
            })
        })
    },
    create(req, res) {
        Admin.selectChefOptions(function(options) {
            return res.render("admin/create", {options})
        })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor preencha todos os campos.")
            }
        }

        if(req.files.length == 0) {
            return res.send("Please, send at least one image.")
        }

        let results = await Admin.createRecipe(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.createFullDataRecipe({...file, recipeId }))
        await Promise.all(filesPromise)

        console.log(filesPromise.values)


        return res.redirect(`/admin/recipes/${recipeId}`)

    }
    /*
    create(req, res) {
        Admin.selectChefOptions(function(options) {
            return res.render("admin/create", {options})
        })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor preencha todos os campos.")
            }
        }


        let createRecipe = await
        Admin.createRecipe(req.body, function (recipes) {
            return res.redirect(`/admin/recipes/${recipes.id}`)
        })
    }
    */,
    show(req, res) {
        Admin.findRecipe(req.params.id, function(recipes) {
            if (!recipes) {
                return res.send("Receita não encontrada.")
            }
            Admin.selectChefOptions(function(chefs) {
                return res.render("admin/show", { recipes, chefs })
            })
        })
    },
    edit(req, res) {
        Admin.findRecipe(req.params.id, function (recipes) {
            if (!recipes) {
                return res.send("Receita não encontrada.")
            }
            Admin.selectChefOptions(function(options) {
                return res.render("admin/edit", { recipes, options })
            })
        })
    },
    update(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Todos os capos devem ser preenchidos.")
            }
        }

        let data = {
            ...req.body
        }

        Admin.updateRecipe(data, function () {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req, res) {
        Admin.deleteRecipe(req.body.id, function() {
            return res.redirect("/admin/recipes")
        })
    },
    chefs(req, res) {
        Admin.allChefs(function(chefs) {
            return res.render("admin/chefs", {chefs})
        })
    },
    showChef(req, res) {
        Admin.findChef(req.params.id, function(chefs) {
            if(!chefs) {
                return res.send("Chef não encontrado.")
            }
            Admin.countRecipesOfChef(req.params.id, function(count) {
                Admin.recipesOfChef(req.params.id, function(recipes) {
                    Admin.selectChefOptions(function(options) {
                        return res.render("admin/show_chef", {chefs, count, recipes, options})
                    })
                })
            })
        })
    },
    createChef(req, res) {
        return res.render("admin/create_chef")
    },
    postChef(req, res) {
        const keys = Object.keys(req.body)
        for(key of keys) {
            if(req.body[key] == "") {
                return res.send("Por favor preencha todos os campos.")
            }
        }
        Admin.createChef(req.body, function(chefs) {
            return res.redirect(`/admin/chefs/${chefs.id}`)
        })
    },
    editChef(req, res) {
        Admin.findChef(req.params.id, function(chefs) {
            return res.render("admin/edit_chef", {chefs})
        })
    },
    updateChef(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Todos os capos devem ser preenchidos.")
            }
        }

        let data = {
            ...req.body
        }

        Admin.updateChef(data, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    deleteChef(req, res) {
        Admin.deleteChef(req.body.id, function(chefId) {
            if(chefId) {
                return res.send("O chef não pode ser excluído, pois o mesmo tem receitas em seu nome.")
            } else {
                return res.redirect("/admin/chefs")
            }
        })
    }
}