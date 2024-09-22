// Function to remove ingredient from list which takes in the remove button, ingredient, and list item
import pagination from "./pagination";

const removeIngredient = (removeButton, ingredient, li) => {
  // Add a click event listener to the button to handle removal
  removeButton.addEventListener("click", function () {
    // Remove ingredient from DOM
    li.remove();

    // Retrieve the current list of bad ingredients from Chrome storage
    chrome.storage.sync.get("badIngredients", function (data) {
      // Filter out the ingredient that was removed
      const updatedIngredients = data.badIngredients.filter(
        (item) => item !== ingredient
      );
      // Save the updated list of ingredients back to Chrome storage
      chrome.storage.sync.set(
        { badIngredients: updatedIngredients },
        function () {
          // Reinitialise pagination with the updated list of ingredients
          pagination();
        }
      );
    });
  });
};

export default removeIngredient;
