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
                { badIngredients: uniqueIngredients, currentPage: 1 },
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
                    const toggleCheckbox =
                        document.querySelector('#toggleHide input');
                    if (toggleCheckbox.checked) {
                        pagination(null, 5);
                    } else {
                        pagination(null, 3);
                    }
                    checkForFlaggedIngredients();

                    document.getElementById('allergy-input').value = '';

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
                        clearAllButton.style.transform = '';
                    } else {
                        form.style.visibility = 'visible';
                        form.style.opacity = '1';
                        form.style.pointerEvents = 'auto';
                        ingredientList.style.transform = 'translateY(0)';
                        clearAllButton.style.transform = '';
                        toggleCheckbox.disabled = false;
                    }
                }
            );
        });
    });

document.getElementById('search-bar').addEventListener('input', function () {
    const query = this.value.toLowerCase();

    chrome.storage.sync.get('badIngredients', function (data) {
        const allIngredients = data.badIngredients || [];

        if (query === '') {
            pagination();
        } else {
            const filteredIngredients = allIngredients.filter((ingredient) =>
                ingredient.toLowerCase().includes(query)
            );

            const toggleCheckbox = document.querySelector('#toggleHide input');

            if (toggleCheckbox.checked) {
                pagination(filteredIngredients, 5);
            } else {
                pagination(filteredIngredients);
            }
        }
    });
});

chrome.storage.sync.get('badIngredients', function (data) {
    if (data.badIngredients && data.badIngredients.length > 0) {
        displayIngredients(data.badIngredients);
    }
    checkForFlaggedIngredients();
    pagination();
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
            clearAllButton.style.transform = '';
            pagination(null, 5);
        } else {
            form.style.visibility = 'visible';
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
            ingredientList.style.transform = 'translateY(0)';
            clearAllButton.style.transform = '';
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
            clearAllButton.style.transform = '';
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

                toggleCheckbox.style.display = 'none';
            }
        );
    });

showLess();
pagination();
