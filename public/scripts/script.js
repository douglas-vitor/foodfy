const cards = document.querySelectorAll(".card")

for (let card of cards) {
    card.addEventListener("click", function () {
    const infoId = card.getAttribute("id")
    window.location.href = `/recipe/${infoId}`
    })
}

document.querySelector(".detalhes").addEventListener("click", function () {
    let verify = document.querySelector(".oculto").classList.contains("view-div")
    if (verify == false) {
        document.querySelector(".oculto").classList.add("view-div")
        document.getElementById("ingredientes").innerHTML = "ESCONDER"
    } else {
        document.querySelector(".oculto").classList.remove("view-div")
        document.getElementById("ingredientes").innerHTML = "MOSTRAR"
    }
})

document.querySelector(".detalhes1").addEventListener("click", function () {
    let verify = document.querySelector(".oculto1").classList.contains("view-div")
    if (verify == false) {
        document.querySelector(".oculto1").classList.add("view-div")
        document.getElementById("preparo").innerHTML = "ESCONDER"
    } else {
        document.querySelector(".oculto1").classList.remove("view-div")
        document.getElementById("preparo").innerHTML = "MOSTRAR"
    }
})

document.querySelector(".detalhes2").addEventListener("click", function () {
    let verify = document.querySelector(".oculto2").classList.contains("view-div")
    if (verify == false) {
        document.querySelector(".oculto2").classList.add("view-div")
        document.getElementById("informacoes").innerHTML = "ESCONDER"
    } else {
        document.querySelector(".oculto2").classList.remove("view-div")
        document.getElementById("informacoes").innerHTML = "MOSTRAR"
    }
})