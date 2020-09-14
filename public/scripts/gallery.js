/*Show gallery photos*/
const ImageGallery = {
    highlight: document.querySelector('.admin-container > span'),
    previews: document.querySelectorAll('.show-recipe-preview .photo img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.setAttribute("style", `background-image: url(${target.src});`)
    }
}