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
        }
      );
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

// Event listener for the search bar to filter ingredients
document.getElementById("search-bar").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const items = document.querySelectorAll("#ingredient-items li");

  items.forEach((item) => {
    if (item.textContent.toLowerCase().includes(query)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});

// Load saved ingredients from storage and display them
chrome.storage.sync.get("badIngredients", function (data) {
  if (data.badIngredients && data.badIngredients.length > 0) {
    displayIngredients(data.badIngredients);
  }
});

// Function to remove ingredient from list which takes in the remove button, ingredient, and list item
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
          // Redisplay the updated list of ingredients
          displayIngredients(updatedIngredients);
        }
      );
    });
  });
};

async function pagination() {
  const itemsPerPage = 3;

  let currentPage = 1;

  const data = await chrome.storage.sync.get("badIngredients");

  const badIngredients = data.badIngredients || [];

  let totalPages = Math.ceil(badIngredients.length / itemsPerPage);

  const nextPage = document.createElement("button");
  nextPage.textContent = "→";
  nextPage.id = "next-button";

  const previousPage = document.createElement("button");
  previousPage.textContent = "←";
  previousPage.id = "prev-button";

  const pageInfo = document.createElement("span");
  pageInfo.id = "page-info";

  document.body.appendChild(previousPage);
  document.body.appendChild(nextPage);
  document.body.appendChild(pageInfo);

  function updatePage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentPageItems = badIngredients.slice(startIndex, endIndex);

    displayIngredients(currentPageItems);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    previousPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
  }

  nextPage.addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      updatePage();
    }
  });

  previousPage.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  });

  updatePage();
}

pagination();
