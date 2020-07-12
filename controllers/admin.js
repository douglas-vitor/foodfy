const recipes = require("../data")


// Index
exports.index = function(req, res) {
    return res.render("admin/home", { recipes: recipes })
}

// Create
exports.create = function(req, res) {
    
}

// Post
exports.post = function(req, res) {
    
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
    return res.render("admin/show", { recipes: recipes[id] })
}

// Edit
exports.edit = function(req, res) {
    
}

// Update
exports.update = function(req, res) {
    
}

// Delete
exports.delete = function(req, res) {
    
}