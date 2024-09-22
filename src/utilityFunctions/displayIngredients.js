// Function to display the list of flagged ingredients
import removeIngredient from "./removeIngredient";

function displayIngredients(ingredients) {
  const ingredientList = document.getElementById("ingredient-list");
  const ingredientItems = document.getElementById("ingredient-items");
  ingredientItems.innerHTML = "";

  ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.textContent = ingredient;

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.classList.add("remove-button"); // Add a class to style the button

    removeIngredient(removeButton, ingredient, li);

    // Append the remove button to the list item
    li.appendChild(removeButton);
    // Append the list item to the ingredient items container
    ingredientItems.appendChild(li);
  });

  ingredientList.classList.remove("hidden");
}

export default displayIngredients;
