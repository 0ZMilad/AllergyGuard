// Placeholder for content script functionality
console.log("Content script loaded.");

// Get the current page URL
const url = window.location.href;
console.log("Current URL:", url);

// Send a message to the background script to log the current URL
chrome.runtime.sendMessage(
  { message: "log_url", url: url },
  function (response) {
    // Log the response from the background script
    console.log("Received response from background script:", response);
  }
);

// Send a message to the background script to forward the URL to the server for scraping
chrome.runtime.sendMessage(
  { message: "url_scrape", url: url },
  function (response) {
    if (response.data) {
      // If scraped data is received, log it to the console
      handleScrapedData(response.data);
    } else if (response.error) {
      // If an error occurs, log the error message
      console.error("Error:", response.error);
    }
  }
);

// Function to handle the scraped data - alert user of bad ingredients
function handleScrapedData(data) {
  const scrapedItemName = data.itemName || "Unknown Item";
  const scrapedIngredients = data.ingredientsList || [];

  console.log("Scraped Item Name:", scrapedItemName);
  console.log("Scraped Ingredients:", scrapedIngredients);

  // Retrieve the bad ingredients from Chrome storage
  chrome.storage.sync.get("badIngredients", function (result) {
    let existingIngredients = result.badIngredients || [];
    let matchedBadIngredients = new Set();

    console.log("Existing Bad Ingredients:", existingIngredients);

    // Create a single regex pattern for all bad ingredients
    const badIngredientsPattern = existingIngredients
      .map(escapeRegExp)
      .join("|");
    const regex = new RegExp(`\\b(${badIngredientsPattern})\\b`, "gi");

    // Check all ingredients at once
    scrapedIngredients.forEach((ingredient) => {
      const matches = ingredient.match(regex);
      if (matches) {
        matches.forEach((match) =>
          matchedBadIngredients.add(match.toLowerCase())
        );
      }
    });

    console.log("Matched Bad Ingredients:", [...matchedBadIngredients]);

    displayResults(scrapedItemName, matchedBadIngredients);
  });
}

// Function to escape special characters in regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Function to display results to the user
function displayResults(itemName, matchedIngredients) {
  const badIngredientsArray = [...matchedIngredients];

  if (badIngredientsArray.length > 0) {
    const alertMessage = `Warning: The product "${itemName}" contains the following concerning ingredients:\n\n${badIngredientsArray.join(
      ", "
    )}`;
    console.log("Displaying dialog with message:", alertMessage);
    createDialog(alertMessage);
  } else {
    console.log(`No concerning ingredients found in "${itemName}".`);
  }
}
