const modalOverlay = document.querySelector('.modal-overlay')
const cards = document.querySelectorAll('.card')

for(let card of cards) {
    card.addEventListener("click", function() {
        const receitaId = card.getAttribute("id")
        if(receitaId == "burger") {
            let img = "assets/burger.png"
            modalOverlay.querySelector("img").src = img
            document.getElementById("modal-content").innerHTML = "<h1>Triplo bacon burger</h1><h4>por Jorge Relato</h4>"
        } else if(receitaId == "pizza") {
            let img = "assets/pizza.png"
            modalOverlay.querySelector("img").src = img
            document.getElementById("modal-content").innerHTML = "<h1>Pizza 4 estações</h1><h4>por Fabiana Melo</h4>"
        } else if(receitaId == "espaguete") {
            let img = "assets/espaguete.png"
            modalOverlay.querySelector("img").src = img
            document.getElementById("modal-content").innerHTML = "<h1>Espaguete ao alho</h1><h4>por Júlia Kinoto</h4>"
        } else if(receitaId == "lasanha") {
            let img = "assets/lasanha.png"
            modalOverlay.querySelector("img").src = img
            document.getElementById("modal-content").innerHTML = "<h1>Lasanha mac n’ cheese</h1><h4>por Juliano Vieira</h4>"
        } else if(receitaId == "doce") {
            let img = "assets/doce.png"
            modalOverlay.querySelector("img").src = img
            document.getElementById("modal-content").innerHTML = "<h1>Docinhos pão-do-céu</h1><h4>por Ricardo Golvea</h4>"
        } else if(receitaId == "asinhas") {
            let img = "assets/asinhas.png"
            modalOverlay.querySelector("img").src = img
            document.getElementById("modal-content").innerHTML = "<h1>Asinhas de frango ao barbecue</h1><h4>por Vania Steroski</h4>"
        }
        modalOverlay.classList.add('active')
    })
}

document.querySelector('.close-modal').addEventListener("click", function() {
    modalOverlay.classList.remove('active')
    modalOverlay.querySelector("img").src = ""
    document.getElementById("modal-content").innerHTML = ""
})