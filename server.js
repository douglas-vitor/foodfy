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
    return res.render("home.html", { recipe: recipes })
})

// About
server.get("/about", (req, res) => {
    return res.render("about.html")
})

// Recipes
server.get("/recipes", (req, res) => {
    return res.render("recipes.html", { recipe: recipes })
})

// View recipe
server.get("/recipe", (req, res) => {
    return res.render("recipe.html", { recipe: recipes })
})


// Ligar servidor
server.listen(3000)