const db = require("../../config/db")
const Publico = require("../models/Public")

module.exports = {
    async index(req, res) {
        let recipes = await Publico.allRecipes()
        const chefs = await Publico.selectChefOptions()

        async function getImage(recipeId) {
            let results = await Publico.getImages(recipeId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("\\", "\/").replace("\\", "\/")}`)
            return files[0]
        }

        const recipePromise = recipes.map(async recipeI => {
            recipeI.image = await getImage(recipeI.id)
            return recipeI
        })
        const lastadded = await Promise.all(recipePromise)
        return res.render("home", { recipes: lastadded, chefs })
    },
    about(req, res) {
        return res.render("about")
    },
    async recipes(req, res) {
        const chefs = await Publico.selectChefOptions()

        let { page, limit } = req.query
        page = page || 1
        limit = limit || 10
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset
        }

        const recipes = await Publico.paginate(params)

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        return res.render("recipes", { recipes, chefs, pagination })
    },
    async recipe(req, res) {
        const data = await Publico.findRecipe(req.params.id)
        if (!data) {
            return res.send("Receita não encontrada.")
        }

        const chefs = await Publico.selectChefOptions()

        return res.render("recipe", { data, chefs })
    },
    async chefs(req, res) {
        const chefs = await Publico.countRecipesOfChef()
        return res.render("chefs", { chefs })
    },
    async search(req, res) {
        const filter = req.query.filter
        const recipes = await Publico.search(filter)
        const chefs = await Publico.selectChefOptions()

        return res.render("search", { recipes, filter, chefs })
    }
}