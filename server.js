const express = require("express")
const server = express()

// Importando dados dinamicos
const recipes = require("./data")

// Pasta publica
server.use(express.static("public"))

// Habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }))

// Utilizando template engine nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//Configurando rotas
// home
server.get("/", (req, res) => {
    return res.render("home.html", { recipes: recipes })
})

// About
server.get("/about", (req, res) => {
    return res.render("about.html")
})

// Recipes
server.get("/recipes", (req, res) => {
    return res.render("recipes.html", { recipes: recipes })
})

// View recipe
server.get("/recipe", (req, res) => {
    const id = req.query.id
    const recipe = recipes.find(function (recipe) {
        if (recipe.id == id) {
            return true
        }
    })
    if (!recipe) {
        return res.status(404).render("not-found.html")
    }
    return res.render("recipe.html", { data: recipe })
})

// Not-found
server.use(function (req, res) {
    return res.status(404).render("not-found.html")
})


// Ligar servidor
server.listen(3000)