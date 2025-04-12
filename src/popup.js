import pagination from './utilityFunctions/pagination';
import displayIngredients from './utilityFunctions/displayIngredients';

document
    .getElementById('allergy-form')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        const badIngredients = document
            .getElementById('allergy-input')
            .value.split(',')
            .map((item) => item.trim())
            .filter((item) => item !== '');

        if (badIngredients.length === 0) {
            document.getElementById('status').textContent =
                'Please enter at least one ingredient!';
            return;
        }

        setTimeout(() => {
            document.getElementById('status').textContent = '';
        }, 3000);

        const validIngredients = [];
        const invalidIngredients = [];

        badIngredients.forEach((ingredient) => {
            if (ingredient.length > 40) {
                invalidIngredients.push(ingredient);
            } else {
                validIngredients.push(ingredient);
            }
        });

        if (invalidIngredients.length > 0) {
            document.getElementById('status').textContent =
                'The following ingredients were not saved: ' +
                invalidIngredients.join(', ') +
                '. Maximum length is 40 characters.';
            return;
        }

        chrome.storage.sync.get('badIngredients', function (data) {
            let existingIngredients = data.badIngredients || [];

            const newIngredients = validIngredients.filter(
                (ingredient) => !existingIngredients.includes(ingredient)
            );

            const alreadyExistingIngredients = validIngredients.filter(
                (ingredient) => existingIngredients.includes(ingredient)
            );

            existingIngredients.push(...validIngredients);

            const uniqueIngredients = [...new Set(existingIngredients)];

            chrome.storage.sync.set(
                { badIngredients: uniqueIngredients, currentPage: 1, isHidden: false },
                function () {
                    if (
                        newIngredients.length > 0 &&
                        alreadyExistingIngredients.length > 0
                    ) {
                        document.getElementById('status').textContent =
                            `Added ${newIngredients.length} new ingredient(s). ${alreadyExistingIngredients.length} already existed.`;
                    } else if (newIngredients.length > 0) {
                        document.getElementById('status').textContent =
                            'Saved!';
                    } else if (validIngredients.length > 0) {
                        document.getElementById('status').textContent =
                            'Ingredients already in your list!';
                    }

                    displayIngredients(uniqueIngredients);
                    chrome.storage.sync.get('isHidden', function (data) {
                        const isHidden = data.isHidden || false;
                        if (isHidden) {
                            pagination(null, 5);
                        } else {
                            pagination(null, 3);
                        }
                        updateUIBasedOnHiddenState(isHidden);
                    });
                    checkForFlaggedIngredients();

                    document.getElementById('allergy-input').value = '';
                }
            );
        });
    });

document.getElementById('search-bar').addEventListener('input', function () {
    const query = this.value.toLowerCase();

    chrome.storage.sync.get(['badIngredients', 'isHidden'], function (data) {
        const allIngredients = data.badIngredients || [];
        const isHidden = data.isHidden || false;

        if (query === '') {
            pagination();
        } else {
            const filteredIngredients = allIngredients.filter((ingredient) =>
                ingredient.toLowerCase().includes(query)
            );

            if (isHidden) {
                pagination(filteredIngredients, 5);
            } else {
                pagination(filteredIngredients);
            }
        }
    });
});

chrome.storage.sync.get(['badIngredients', 'isHidden'], function (data) {
    const isHidden = data.isHidden || false;
    if (data.badIngredients && data.badIngredients.length > 0) {
        displayIngredients(data.badIngredients);
    }
    checkForFlaggedIngredients();
    updateUIBasedOnHiddenState(isHidden);
    pagination();
});

function updateUIBasedOnHiddenState(isHidden) {
    const form = document.getElementById('allergy-form');
    const ingredientList = document.getElementById('ingredient-list');
    const hideButton = document.getElementById('hideButton');

    if (isHidden) {
        form.style.visibility = 'hidden';
        form.style.opacity = '0';
        form.style.pointerEvents = 'none';
        ingredientList.style.transform = 'translateY(-150px)';
        hideButton.textContent = 'Show';
    } else {
        form.style.visibility = 'visible';
        form.style.opacity = '1';
        form.style.pointerEvents = 'auto';
        ingredientList.style.transform = 'translateY(0)';
        hideButton.textContent = 'Hide';
    }
}

document.getElementById('hideButton').addEventListener('click', function() {
    chrome.storage.sync.get('isHidden', function(data) {
        const currentState = data.isHidden || false;
        const newState = !currentState;
        
        chrome.storage.sync.set({ isHidden: newState }, function() {
            updateUIBasedOnHiddenState(newState);
            if (newState) {
                pagination(null, 5);
            } else {
                pagination(null, 3);
            }
        });
    });
});

function checkForFlaggedIngredients() {
    chrome.storage.sync.get('badIngredients', function (data) {
        const clearAllButton = document.getElementById('clearAllButton');
        const hideButton = document.getElementById('hideButton');
        if (data.badIngredients && data.badIngredients.length > 0) {
            chrome.storage.sync.get('isHidden', function(hiddenData) {
                const isHidden = hiddenData.isHidden || false;
                const itemsPerPage = isHidden ? 5 : 3;
                const totalPages = Math.ceil(data.badIngredients.length / itemsPerPage);
                const currentPage = data.currentPage || 1;

                if (currentPage === totalPages) {
                    clearAllButton.style.display = 'block';
                    clearAllButton.style.transform = '';
                } else {
                    clearAllButton.style.display = 'none';
                }
                
                hideButton.style.display = 'block';
            });
        } else {
            clearAllButton.style.display = 'none';
            hideButton.style.display = 'none';
        }
    });
}

document
    .getElementById('clearAllButton')
    .addEventListener('click', function () {
        const emptyIngredients = [];
        chrome.storage.sync.set(
            { badIngredients: emptyIngredients, isHidden: false },
            function () {
                document.getElementById('status').textContent =
                    'All ingredients cleared!';
                setTimeout(() => {
                    document.getElementById('status').textContent = '';
                }, 3000);

                displayIngredients(emptyIngredients);
                pagination(emptyIngredients, 3);
                checkForFlaggedIngredients();
                updateUIBasedOnHiddenState(false);

                const form = document.getElementById('allergy-form');
                const ingredientList =
                    document.getElementById('ingredient-list');

                form.style.visibility = 'visible';
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
                ingredientList.style.transform = 'translateY(0)';
            }
        );
    });

pagination();
