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

                                if (toggleCheckbox) {
                                    toggleCheckbox.checked = false;
                                    toggleCheckbox.disabled = true;
                                }
                                if (toggleContainer) {
                                    toggleContainer.style.display = 'none';
                                }

                                pagination(updatedIngredients, 3);
                            }
                        );                    } else {
                        chrome.storage.sync.get(['currentPage', 'isHidden'], function(pageData) {
                            const toggleCheckbox = document.querySelector('#toggleHide input');
                            const isHidden = pageData.isHidden || false;
                            const itemsPerPage = (toggleCheckbox && toggleCheckbox.checked) || isHidden ? 5 : 3;
                            const currentPage = pageData.currentPage || 1;
                            
                            const newTotalPages = Math.ceil(updatedIngredients.length / itemsPerPage);
                            if (currentPage > newTotalPages) {
                                chrome.storage.sync.set({ currentPage: newTotalPages }, function() {
                                    pagination(updatedIngredients, itemsPerPage, false);
                                });
                            } else {
                                pagination(updatedIngredients, itemsPerPage, false);
                            }
                        });
                    }
                }
            );
        });
    });
};

export default removeIngredient;
