const recipes = require("../../../data.json")

// Index
exports.index = function(req, res) {
    return res.render("home", { recipes: recipes.recipes })
}

// About
exports.about = function(req, res) {
    return res.render("about")
}

// Recipes
exports.recipes = function(req, res) {
    return res.render("recipes", { recipes: recipes.recipes })
}

// Recipe
exports.recipe = function(req, res) {
    // Recebe o indice array vindo da pagina
    const id = req.params.id
    // Funcação para verificar se o id recebido é menor ou igual a quantidade de registros do array
    const verify = function(verify) {
        // Coloquei menos 1 do tamanho do array pois o indicie do array começa em 0
        if (id <= (recipes.recipes.length - 1)) {
            // Se id recebido atender os requisitos da function retorna true, caso ontrario retorna false
            return true
        }
    } 
    // verificar se a function retornou true ou false, se não for true renderiza pagina de erro 404
    if (!verify(id)) {
        return res.status(404).render("not-found")
    }
    // Caso todos os requisitos acima forem aceitos renderiza pagina recipe com os dados do indicie recebido,
    // dentro de um objeto chamado data
    return res.render("recipe", { data: recipes.recipes[id] })
}