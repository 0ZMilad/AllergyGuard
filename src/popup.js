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

        setTimeout(() => {
            document.getElementById('status').textContent = '';
        }, 3000);

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
                { badIngredients: uniqueIngredients, currentPage: 1 },
                function () {
                    document.getElementById('status').textContent = 'Saved!';
                    displayIngredients(uniqueIngredients);
                    const toggleCheckbox =
                        document.querySelector('#toggleHide input');
                    if (toggleCheckbox.checked) {
                        pagination(null, 5);
                    } else {
                        pagination(null, 3);
                    }
                    checkForFlaggedIngredients();

                    // Clear the input field
                    document.getElementById('allergy-input').value = '';

                    // Ensure the form and ingredient list are updated based on the toggle state
                    const form = document.getElementById('allergy-form');
                    const ingredientList =
                        document.getElementById('ingredient-list');
                    const clearAllButton =
                        document.getElementById('clearAllButton');

                    if (toggleCheckbox.checked) {
                        form.style.visibility = 'hidden';
                        form.style.opacity = '0';
                        form.style.pointerEvents = 'none';
                        ingredientList.style.transform = 'translateY(-150px)';
                        clearAllButton.style.transform = 'translateY(-48px)';
                    } else {
                        form.style.visibility = 'visible';
                        form.style.opacity = '1';
                        form.style.pointerEvents = 'auto';
                        ingredientList.style.transform = 'translateY(0)';
                        clearAllButton.style.transform = 'translateY(0)';
                        toggleCheckbox.disabled = false;
                    }
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

            const toggleCheckbox = document.querySelector('#toggleHide input');

            // Paginate the filtered ingredients
            if (toggleCheckbox.checked) {
                pagination(filteredIngredients, 5);
            } else {
                pagination(filteredIngredients);
            }
        }
    });
});

// Load saved ingredients from storage and display them
chrome.storage.sync.get('badIngredients', function (data) {
    if (data.badIngredients && data.badIngredients.length > 0) {
        displayIngredients(data.badIngredients);
    }
    checkForFlaggedIngredients();
    pagination(); // Initialise pagination after checking for ingredients
});

function showLess() {
    const toggleContainer = document.querySelector('#toggleHide');
    const toggleCheckbox = document.querySelector('#toggleHide input');
    const form = document.getElementById('allergy-form');
    const ingredientList = document.getElementById('ingredient-list');
    const clearAllButton = document.getElementById('clearAllButton');

    const updateVisibility = () => {
        if (toggleCheckbox.checked) {
            form.style.visibility = 'hidden';
            form.style.opacity = '0';
            form.style.pointerEvents = 'none';
            ingredientList.style.transform = 'translateY(-150px)';
            clearAllButton.style.transform = 'translateY(-48px)';
            pagination(null, 5);
        } else {
            form.style.visibility = 'visible';
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
            ingredientList.style.transform = 'translateY(0)';
            clearAllButton.style.transform = 'translateY(0)';
            pagination(null, 3);
        }
    };

    toggleCheckbox.addEventListener('change', updateVisibility);
    updateVisibility();
}

function checkForFlaggedIngredients() {
    chrome.storage.sync.get('badIngredients', function (data) {
        const clearAllButton = document.getElementById('clearAllButton');
        const toggleContainer = document.querySelector('#toggleHide');
        const toggleCheckbox = document.querySelector('#toggleHide input');
        if (data.badIngredients && data.badIngredients.length > 0) {
            clearAllButton.style.display = 'block';
            clearAllButton.style.transform = 'translateY(0)';
            toggleContainer.style.display = 'block';
            toggleCheckbox.disabled = false;
        } else {
            clearAllButton.style.display = 'none';
            toggleCheckbox.checked = false;
            toggleCheckbox.disabled = true;
            toggleContainer.style.display = 'none';
        }
    });
}

document
    .getElementById('clearAllButton')
    .addEventListener('click', function () {
        const emptyIngredients = [];
        chrome.storage.sync.set(
            { badIngredients: emptyIngredients },
            function () {
                document.getElementById('status').textContent =
                    'All ingredients cleared!';
                setTimeout(() => {
                    document.getElementById('status').textContent = '';
                }, 3000);

                displayIngredients(emptyIngredients);
                pagination(emptyIngredients, 3);
                checkForFlaggedIngredients();
                const toggleCheckbox =
                    document.querySelector('#toggleHide input');
                const form = document.getElementById('allergy-form');
                const ingredientList =
                    document.getElementById('ingredient-list');

                if (toggleCheckbox.checked) {
                    toggleCheckbox.checked = false;
                }

                form.style.visibility = 'visible';
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
                ingredientList.style.transform = 'translateY(0)';

                // Hide the toggle if the list is empty
                toggleCheckbox.style.display = 'none';
            }
        );
    });

showLess();
pagination();
