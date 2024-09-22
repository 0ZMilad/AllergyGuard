import pagination from "./utilityFunctions/pagination";
import displayIngredients from "./utilityFunctions/displayIngredients";

// Event listener for the form submission to save bad ingredients
document
  .getElementById("allergy-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const badIngredients = document
      .getElementById("allergy-input")
      .value.split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    // alert if user tries to add empty ingredient
    if (badIngredients.length === 0) {
      document.getElementById("status").textContent =
        "Please enter an ingredient!";
      return;
    }

    // Retrieve exisiting bad ingredients from storage
    chrome.storage.sync.get("badIngredients", function (data) {
      let existingIngredients = data.badIngredients || [];

      existingIngredients.push(...badIngredients);

      // remove duplicates
      const uniqueIngredients = [...new Set(existingIngredients)];

      chrome.storage.sync.set(
        { badIngredients: uniqueIngredients },
        function () {
          document.getElementById("status").textContent = "Saved!";
          displayIngredients(uniqueIngredients);
          pagination();
        }
      );
    });
  });

// Event listener for the search bar to filter ingredients
document.getElementById("search-bar").addEventListener("input", function () {
  const query = this.value.toLowerCase();

  // Retrieve all ingredients from storage
  chrome.storage.sync.get("badIngredients", function (data) {
    const allIngredients = data.badIngredients || [];

    if (query === "") {
      // If the search query is empty, reinitialise pagination
      pagination();
    } else {
      // Filter ingredients based on the search query
      const filteredIngredients = allIngredients.filter((ingredient) =>
        ingredient.toLowerCase().includes(query)
      );

      // Display the filtered ingredients
      displayIngredients(filteredIngredients);
    }
  });
});

// Load saved ingredients from storage and display them
chrome.storage.sync.get("badIngredients", function (data) {
  if (data.badIngredients && data.badIngredients.length > 0) {
    displayIngredients(data.badIngredients);
  }
});

pagination();
