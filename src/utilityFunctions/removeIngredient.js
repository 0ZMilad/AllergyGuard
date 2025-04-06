import pagination from './pagination';

const removeIngredient = (removeButton, ingredient, li) => {
    removeButton.addEventListener('click', function () {
        li.remove();

        chrome.storage.sync.get('badIngredients', function (data) {
            const updatedIngredients = data.badIngredients.filter(
                (item) => item !== ingredient
            );
            chrome.storage.sync.set(
                { badIngredients: updatedIngredients },
                function () {
                    const toggleContainer =
                        document.querySelector('#toggleHide');
                    const toggleCheckbox =
                        document.querySelector('#toggleHide input');

                    if (updatedIngredients.length === 0) {
                        chrome.storage.sync.set(
                            { currentPage: 1 },
                            function () {
                                const form =
                                    document.getElementById('allergy-form');
                                form.style.visibility = 'visible';
                                form.style.opacity = '1';
                                form.style.pointerEvents = 'auto';
                                const ingredientList =
                                    document.getElementById('ingredient-list');
                                ingredientList.style.transform =
                                    'translateY(0)';
                                const clearAllButton =
                                    document.getElementById('clearAllButton');
                                clearAllButton.style.transform = '';

                                toggleCheckbox.checked = false;
                                toggleCheckbox.disabled = true;
                                toggleContainer.style.display = 'none';

                                pagination(updatedIngredients, 3);
                            }
                        );
                    } else {
                        const toggleCheckbox =
                            document.querySelector('#toggleHide input');
                        if (toggleCheckbox.checked) {
                            pagination(updatedIngredients, 5);
                        } else {
                            pagination(updatedIngredients, 3);
                        }
                    }
                }
            );
        });
    });
};

export default removeIngredient;
