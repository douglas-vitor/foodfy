function addIngredients() {
  const ingredient = document.getElementById("ingredient")
  const ingredientChildren = ingredient.children

  //Select item para a copia
  let idArray = ingredientChildren.length -1
  const inputItem = ingredientChildren[idArray]

  //Nao clona input se o index 0 estiver vazio
  if(inputItem.value == "") {
    return false
  }
  
  //Realiza o clone
  const inputCopy = inputItem.cloneNode(true)
  
  //Deixa o filho com valor vazio
  //Add o clone ao elemento pai
  inputCopy.value = ""
  ingredient.appendChild(inputCopy)
}

const buttonAdd = document.querySelector(".add-ingredient")
buttonAdd.addEventListener("click", addIngredients)


function addPreparation() {
  const preparation = document.getElementById("preparation")
  const preparationChildren = preparation.children

  //Select item para a copia
  let idArray = preparationChildren.length -1
  const inputItem = preparationChildren[idArray]

  //Nao clona input se o index 0 estiver vazio
  if(inputItem.value == "") {
    return false
  }
  
  //Realiza o clone
  const inputCopy = inputItem.cloneNode(true)
  
  //Deixa o filho com valor vazio
  //Add o clone ao elemento pai
  inputCopy.value = ""
  preparation.appendChild(inputCopy)
}

const buttonPreparationAdd = document.querySelector(".add-preparation")
buttonPreparationAdd.addEventListener("click", addPreparation)


/*photos upload create*/
const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
      const { files: fileList } = event.target
      PhotosUpload.input = event.target
      
      if(PhotosUpload.hasLimit(event)) return

      Array.from(fileList).forEach((file) => {

          PhotosUpload.files.push(file)

          const reader = new FileReader()
          reader.onload = () => {
              const image = new Image()
              image.src = String(reader.result)
              
              const div = PhotosUpload.getContainer(image)

              PhotosUpload.preview.appendChild(div)
          }

          reader.readAsDataURL(file)
      })

      PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event) {
      const { uploadLimit, input, preview } = PhotosUpload
      const { files: fileList } = input

      if (fileList.length > uploadLimit) {
          alert(`Envie no máximo ${uploadLimit} fotos`)
          event.preventDefault()
          return true
      }

      const photosDiv = []
      preview.childNodes.forEach(item => {
          if(item.classList && item.classList.value == "photo")
          photosDiv.push(item)
      })

      const totalPhotos = fileList.length + photosDiv.length
      if(totalPhotos > uploadLimit) {
          alert("Você atingiu o limite máximo de fotos.")
          event.preventDefault()
          return true
      }

      return false
  },
  getAllFiles() {
      const dataTransfer = new ClipboardEvent("").clipboardData || new dataTransfer()

      PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

      return dataTransfer.files
  },
  getContainer(image) {
      const div = document.createElement('div')
      div.classList.add('photo')
      div.onclick = PhotosUpload.removePhoto
      div.appendChild(image)
      div.appendChild(PhotosUpload.getRemoveButton())

      return div
  },
  getRemoveButton() {
      const button = document.createElement('i')
      button.classList.add('material-icons')
      button.innerHTML = "close"
      return button
  },
  removePhoto(event) {
      const photoDiv = event.target.parentNode // <div class="photo">
      const photosArray = Array.from(PhotosUpload.preview.children)
      const index = photosArray.indexOf(photoDiv)

      PhotosUpload.files.splice(index, 1)
      PhotosUpload.input.files = PhotosUpload.getAllFiles()

      photoDiv.remove()
  },
  removeOldPhoto(event) {
      const photoDiv = event.target.parentNode
      if(photoDiv.id) {
          const removedFiles = document.querySelector('input[name="removed_files"]')
          if(removedFiles) {
              removedFiles.value += `${photoDiv.id},`
          }
      }
      photoDiv.remove()
  }
}