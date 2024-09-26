import displayResults from './displayResults';

// Function to handle the scraped data - alert user of bad ingredients
function handleScrapedData(data) {
    const scrapedItemName = data.itemName || 'Unknown Item';
    const scrapedIngredients = data.ingredientsList || [];

    console.log('Scraped Item Name:', scrapedItemName);
    console.log('Scraped Ingredients:', scrapedIngredients);

    // Retrieve the bad ingredients from Chrome storage
    chrome.storage.sync.get('badIngredients', function (result) {
        let existingIngredients = result.badIngredients || [];
        let matchedBadIngredients = new Set();

        console.log('Existing Bad Ingredients:', existingIngredients);

        // Create a single regex pattern for all bad ingredients
        const badIngredientsPattern = existingIngredients
            .map(escapeRegExp)
            .join('|');
        const regex = new RegExp(`\\b(${badIngredientsPattern})\\b`, 'gi');

        // Check all ingredients at once
        scrapedIngredients.forEach((ingredient) => {
            const matches = ingredient.match(regex);
            if (matches) {
                matches.forEach((match) =>
                    matchedBadIngredients.add(match.toLowerCase())
                );
            }
        });

        console.log('Matched Bad Ingredients:', [...matchedBadIngredients]);

        displayResults(scrapedItemName, matchedBadIngredients);
    });
}

export default handleScrapedData;
