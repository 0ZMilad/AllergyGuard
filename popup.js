// Event listener for the form submission to save bad ingredients
document
  .getElementById("allergy-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const badIngredients = document
      .getElementById("allergy-input")
      .value.split(",")
      .map((item) => item.trim());
    chrome.storage.sync.set({ badIngredients: badIngredients }, function () {
      document.getElementById("status").textContent = "Saved!";
      displayIngredients(badIngredients);
    });
  });

// Function to display the list of flagged ingredients
function displayIngredients(ingredients) {
  const ingredientList = document.getElementById("ingredient-list");
  const ingredientItems = document.getElementById("ingredient-items");
  ingredientItems.innerHTML = "";

  ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.textContent = ingredient;
    ingredientItems.appendChild(li);
  });

  ingredientList.classList.remove("hidden");
}
