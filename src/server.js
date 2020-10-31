const express = require("express")
const nunjucks = require("nunjucks")
const routes = require("./routes")
const methodOverride = require("method-override")
const session = require("./config/session")

const server = express()
server.use(session)
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})


// Habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }))

// Pasta publica
server.use(express.static("public"))

// habilitar sobrescrição de metodo
server.use(methodOverride("_method"))

//Importar rotas
server.use(routes)

// Setar template engine
server.set("view engine", "njk")

// Utilizando template engine nunjucks
nunjucks.configure("src/app/views", {
    express: server,
    noCache: true,
    autoescape: false
})


// Ligar servidor
server.listen(5000)