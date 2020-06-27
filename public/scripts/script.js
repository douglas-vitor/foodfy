const cards = document.querySelectorAll(".card")

for (let card of cards) {
    card.addEventListener("click", function () {
    const infoId = card.getAttribute("id")
    window.location.href = `/recipe?id=${infoId}`
    })
}