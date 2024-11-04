import displayResults from './displayResults';

// Function to normalise ingredient strings
function normaliseIngredient(ingredient) {
    return ingredient
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
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

        // Normalise bad ingredients
        const normalisedBadIngredients =
            existingIngredients.map(normaliseIngredient);

        // Iterate over scraped ingredients
        for (const ingredient of scrapedIngredients) {
            const normalisedScrapedIngredient = normaliseIngredient(ingredient);

            // Check if any bad ingredient is included in the scraped ingredient
            for (let i = 0; i < normalisedBadIngredients.length; i++) {
                const badIngredient = normalisedBadIngredients[i];
                if (normalisedScrapedIngredient.includes(badIngredient)) {
                    matchedBadIngredients.add(existingIngredients[i]);
                }
            }
        }

        console.log('Matched Bad Ingredients:', [...matchedBadIngredients]);

        displayResults(scrapedItemName, matchedBadIngredients);
    } catch (error) {
        console.error('Error handling scraped data:', error);
    }
}

export default handleScrapedData;
