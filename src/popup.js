import pagination from './utilityFunctions/pagination';
import displayIngredients from './utilityFunctions/displayIngredients';

// Event listener for the form submission to save bad ingredients
document
    .getElementById('allergy-form')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        const badIngredients = document
            .getElementById('allergy-input')
            .value.split(',')
            .map((item) => item.trim())
            .filter((item) => item !== '');

        // alert if user tries to add empty ingredient
        if (badIngredients.length === 0) {
            document.getElementById('status').textContent =
                'Please enter at least one ingredient!';
            return;
        }

        // Filter out ingredients that are too long and show a warning for each
        const validIngredients = [];
        const invalidIngredients = [];

        badIngredients.forEach((ingredient) => {
            if (ingredient.length > 40) {
                // If the ingredient is too long, mark it as invalid
                invalidIngredients.push(ingredient);
            } else {
                // Otherwise, it's valid
                validIngredients.push(ingredient);
            }
        });

        // If there are any invalid ingredients, alert the user and don't save anything
        if (invalidIngredients.length > 0) {
            document.getElementById('status').textContent =
                'The following ingredients were not saved: ' +
                invalidIngredients.join(', ') +
                '. Maximum length is 40 characters.';
            return;
        }

        // If all ingredients are valid, proceed to save
        chrome.storage.sync.get('badIngredients', function (data) {
            let existingIngredients = data.badIngredients || [];

            existingIngredients.push(...validIngredients);

            // remove duplicates
            const uniqueIngredients = [...new Set(existingIngredients)];

            chrome.storage.sync.set(
                { badIngredients: uniqueIngredients },
                function () {
                    document.getElementById('status').textContent = 'Saved!';
                    displayIngredients(uniqueIngredients);
                    pagination();
                }
            );
        });
    });

// Event listener for the search bar to filter ingredients
document.getElementById('search-bar').addEventListener('input', function () {
    const query = this.value.toLowerCase();

    // Retrieve all ingredients from storage
    chrome.storage.sync.get('badIngredients', function (data) {
        const allIngredients = data.badIngredients || [];

        if (query === '') {
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
chrome.storage.sync.get('badIngredients', function (data) {
    if (data.badIngredients && data.badIngredients.length > 0) {
        displayIngredients(data.badIngredients);
    }
});

pagination();
