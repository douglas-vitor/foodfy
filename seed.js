const User = require("./src/app/models/UsersModel")
const Recipes = require("./src/app/models/RecipesModel")
const File = require("./src/app/models/File")
const { hash } = require("bcryptjs")
const faker = require("faker")

let usersIds = []
let chefsIds = []

async function createAdmin() {
    const password = await hash('1234', 8)

    const data = {
        name: faker.name.firstName(),
        email: 'admin@foodfy.com',
        is_admin: 'true'
    }
    await User.createUser(data, password)
    return
}

async function createUsers() {
    const users = []
    const password = await hash('1234', 8)

    while (users.length <= 3) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            is_admin: 'false'
        })
    }

    const usersPromise = users.map(user => User.createUser(user, password))
    usersIds = await Promise.all(usersPromise)
    return
}

async function createChefs() {
    const chefs = []

    while(chefs.length <= 1) {
        chefs.push({
            name: faker.name.firstName(),
        })
    }
    const data = {
        filename: 'chef.png',
        path: 'public\\assets\\chef.png',
        data: {
            name: 'Chef teste'
        }
    }

    const chefsPromise = chefs.map(chef => File.createFullDataChef({ ...data }))
    chefsIds = await Promise.all(chefsPromise)
    return
}

async function createRecipes() {
    const recipes = [
        {
        id: 1,
        chef_id: 1,
        title: 'Omelete Crazy',
        ingredients: ['1 Ovo', 'Pitada de sal', '20Ml Leite'],
        preparation: ['Quebre o ovo', 'Coloque a pitada de sal', 'Coloque o leite', 'Misture tudo na tigela', 'Leve ao fogo em uma frigideira'],
        information: 'Vá a loucura com este omelete feito em casa invetado nos anos 1000.',
        user_id: 1
    },
    {
        id: 2,
        chef_id: 2,
        title: 'Vinho para crianças',
        ingredients: ['10 Uvas', '200Ml de água', '1 saquinho de suco pronto de uva'],
        preparation: ['Bata as uvas no liquidiicador', 'Adicione a água', 'Acrescente o suco pronto', 'Bata novamente no liquidificador todos os ingredientes'],
        information: 'Se divirta com seus filhos com este vinho para crianças.',
        user_id: 1
    }
]

const data = [
    {
        filename: 'ovo.jpg',
        path: 'public\\assets\\ovo.jpg',
    },
    {
        filename: 'vinho.jpg',
        path: 'public\\assets\\vinho.jpg',
    }
]

    const recipesPromise = recipes.map(recipe => Recipes.createRecipe(recipe))
    await Promise.all(recipesPromise)

    for(i in data) {
        await File.createFullDataRecipe({ ...data[i], recipeId:recipes[i].id })
    }
    return
}

createAdmin()
createUsers()
createChefs()
createRecipes()