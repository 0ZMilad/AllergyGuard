import displayResults from './displayResults';

// Function to escape special characters in regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Function to retrieve bad ingredients from storage
function getBadIngredients() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('badIngredients', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.badIngredients || []);
            }
        });
    });
}

// Function to handle the scraped data - alert user of bad ingredients
async function handleScrapedData(data) {
    try {
        const scrapedItemName = data.itemName || 'Unknown Item';
        const scrapedIngredients = data.ingredientsList || [];

        console.log('Scraped Item Name:', scrapedItemName);
        console.log('Scraped Ingredients:', scrapedIngredients);

        // Retrieve the bad ingredients from Chrome storage
        const existingIngredients = await getBadIngredients();

        console.log('Existing Bad Ingredients:', existingIngredients);

        if (existingIngredients.length === 0) {
            console.log('No bad ingredients to check against.');
            displayResults(scrapedItemName, new Set());
            return;
        }

        const matchedBadIngredients = new Set();

        // Create a single regex pattern for all bad ingredients
        const badIngredientsPattern = existingIngredients
            .map(escapeRegExp)
            .join('|');

        if (!badIngredientsPattern) {
            console.log('Bad ingredients pattern is empty.');
            displayResults(scrapedItemName, matchedBadIngredients);
            return;
        }

        const regex = new RegExp(`\\b(${badIngredientsPattern})\\b`, 'gi');

        // Check all ingredients at once
        for (const ingredient of scrapedIngredients) {
            const matches = ingredient.match(regex);
            if (matches) {
                matches.forEach((match) =>
                    matchedBadIngredients.add(match.toLowerCase())
                );
            }
        }

        console.log('Matched Bad Ingredients:', [...matchedBadIngredients]);

        displayResults(scrapedItemName, matchedBadIngredients);
    } catch (error) {
        console.error('Error handling scraped data:', error);
    }
}

export default handleScrapedData;
