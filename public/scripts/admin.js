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

//Example function bootcamp course
function addPreparation() {
  const ingredients = document.querySelector("#preparations");
  const fieldContainer = document.querySelectorAll(".preparation");

  // Realiza um clone do último preparation adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  preparations.appendChild(newField);
}

document
  .querySelector(".add-preparation")
  .addEventListener("click", addPreparation);