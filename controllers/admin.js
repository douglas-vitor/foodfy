const data = require("../data.json")
const fs = require('fs')


// Index
exports.index = function(req, res) {
    return res.render("admin/home", { recipes: recipes })
}

// Create
exports.create = function(req, res) {
    return res.render("admin/create")
}

// Post
exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    for(key of keys) {
        if(req.body[key] == "") {
            return res.send("Por favor preencha todos os campos.")
        }
    }
    let { title, author, image, ingredients, preparation, information } = req.body

    let id = 1
    const lastRecipe = data.recipes[data.recipes.length -1]
    if(lastRecipe) {
        id = lastRecipe.id + 1
    }

    data.recipes.push({
        id,
        title,
        author,
        image,
        ingredients,
        preparation,
        information
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function (err) {
        if(err) {
            return res.send("Erro ao gravar arquivo.")
        }
        return res.redirect("/admin/recipes")
    })
}

// Show
exports.show = function(req, res) {
    const {id} = req.params
    const verify = function(verify) {
        if(id <= (recipes.length -1)){
            return true
        }
    }
    if(!verify){
        return res.send("not found recipe")
    }
    let recipesSend = {
        ...recipes[id],
        id: id
    }
    return res.render("admin/show", { recipes: recipesSend })
}

// Edit
exports.edit = function(req, res) {
    const {id} = req.params
    const verify = function(verify) {
        if(id <= (recipes.length -1)){
            return true
        }
    }
    if(!verify){
        return res.send("not found recipe")
    }
    return res.render("admin/edit", { recipes: recipes[id] })
}

// Update
exports.update = function(req, res) {
    
}

// Delete
exports.delete = function(req, res) {
    
}