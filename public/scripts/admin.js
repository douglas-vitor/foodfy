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