# AllergyGuard

AllergyGuard is a powerful browser extension designed to help users identify and avoid ingredients that are harmful or undesirable based on their personal dietary restrictions or allergies. By scraping ingredient lists from product pages and cross-referencing them with a user-defined list of bad ingredients, AllergyGuard provides real-time alerts and insights, making grocery shopping online safer and more convenient.

## Features

- **Ingredient Scraper**: Automatically extracts ingredients from product pages on supported websites.
- **Customizable Allergen List**: Allows users to define and manage a list of ingredients they wish to avoid.
- **Real-Time Alerts**: Provides immediate feedback when a product contains one or more flagged ingredients.
- **Ingredient Filtering**: Offers a search feature to filter through the list of ingredients quickly.
- **Data Storage**: Saves user preferences and the list of bad ingredients using Chrome's storage API for persistence across sessions.

<!--
// functionality: Scrape ingredients from webpage and identify harmful ones

// Steps:
// pre-requisite: Define a list of harmful ingredients and extension should send URL to server
// 1. Scrape item ingredients from the webpage using scrape logic code in server. (Completed main logic however need post request to send the website url to the server (Amazon, Amazon Fresh) and express get request to get data from the server)
// 2. Cross-reference each item's ingredients against a predefined list of harmful ingredients.
// 3. If a match is found, flag the ingredient as harmful.
// 4. Display a notification to the user indicating which item contains the harmful ingredient.
// 5. Provide an option for the user to remove the flagged item from their cart (If its added to the cart).

// This outlines the planned approach for identifying and alerting users about harmful ingredients in their shopping cart items.

// Additonally in the future an ingredient API could be used to provide more detailed information about the harmful ingredients and nofitfy users of the items in the cart with harmful ingredients.
-->
