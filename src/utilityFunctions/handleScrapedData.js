import displayResults from './displayResults';

function normaliseIngredient(ingredient) {
    return ingredient
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

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

async function handleScrapedData(data) {
    try {
        const scrapedItemName = data.itemName || 'Unknown Item';
        const scrapedIngredients = data.ingredientsList || [];

        console.log('Scraped Item Name:', scrapedItemName);
        console.log('Scraped Ingredients:', scrapedIngredients);

        const existingIngredients = await getBadIngredients();

        console.log('Existing Bad Ingredients:', existingIngredients);

        if (existingIngredients.length === 0) {
            console.log('No bad ingredients to check against.');
            displayResults(scrapedItemName, new Set());
            return;
        }

        const matchedBadIngredients = new Set();

        const normalisedBadIngredients =
            existingIngredients.map(normaliseIngredient);

        for (const ingredient of scrapedIngredients) {
            const normalisedScrapedIngredient = normaliseIngredient(ingredient);

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
