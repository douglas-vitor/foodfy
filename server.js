const express = require("express")
const nunjucks = require("nunjucks")
const routes = require("./routes")
const methodOverride = require("method-override")
const server = express()


// Pasta publica
server.use(express.static("public"))

// habilitar sobrescrição de metodo
server.use(methodOverride("_method"))

//Importar rotas
server.use(routes)

// Setar template engine
server.set("view engine", "njk")

// Habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }))

// Utilizando template engine nunjucks
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
    autoescape: false
})

//Configurando rotas

// Not-found
server.use(function (req, res) {
    return res.status(404).render("not-found")
})


// Ligar servidor
server.listen(5000)