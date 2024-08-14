// Placeholder for content script functionality
console.log("Content script loaded.");

// Upcoming functionality: Scrape ingredients from webpage and identify harmful ones

// Steps to implement:
// pre-requisite: Define a list of harmful ingredients and extension should send URL to server
// 1. Scrape item ingredients from the webpage using scrape logic code in server. (Completed main logic however need post request to send the website url to the server (Amazon, Amazon Fresh) and express get request to get data from the server)
// 2. Cross-reference each item's ingredients against a predefined list of harmful ingredients.
// 3. If a match is found, flag the ingredient as harmful.
// 4. Display a notification to the user indicating which item contains the harmful ingredient.
// 5. Provide an option for the user to remove the flagged item from their cart (If its added to the cart).

// This outlines the planned approach for identifying and alerting users about harmful ingredients in their shopping cart items.

// Additonally in the future an ingredient API could be used to provide more detailed information about the harmful ingredients and nofitfy users of the items in the cart with harmful ingredients.

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

    // Call display results function
  });
}

// Function to escape special characters in regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
