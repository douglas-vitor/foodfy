const express = require("express")
const server = express()

// Importando dados dinamicos
const recipes = require("./data")

// Pasta publica
server.use(express.static("public"))

// Setar template engine
server.set("view engine", "njk")

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
    return res.render("home", { recipes: recipes })
})

// About
server.get("/about", (req, res) => {
    return res.render("about")
})

// Recipes
server.get("/recipes", (req, res) => {
    return res.render("recipes", { recipes: recipes })
})

// View recipe
server.get("/recipe/:id", function(req, res) {
    // Recebe o indice array vindo da pagina
    const id = req.params.id
    // Funcação para verificar se o id recebido é menor ou igual a quantidade de registros do array
    const verify = function(verify) {
        // Coloquei menos 1 do tamanho do array pois o indicie do array começa em 0
        if (id <= (recipes.length - 1)) {
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
    return res.render("recipe", { data: recipes[id] })
})

// Not-found
server.use(function (req, res) {
    return res.status(404).render("not-found")
})


// Ligar servidor
server.listen(3000)