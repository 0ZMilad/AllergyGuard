// Function to remove ingredient from list which takes in the remove button, ingredient, and list item
import pagination from './pagination';

const removeIngredient = (removeButton, ingredient, li) => {
    // Add a click event listener to the button to handle removal
    removeButton.addEventListener('click', function () {
        // Remove ingredient from DOM
        li.remove();

        // Retrieve the current list of bad ingredients from Chrome storage
        chrome.storage.sync.get('badIngredients', function (data) {
            // Filter out the ingredient that was removed
            const updatedIngredients = data.badIngredients.filter(
                (item) => item !== ingredient
            );
            // Save the updated list of ingredients back to Chrome storage
            chrome.storage.sync.set(
                { badIngredients: updatedIngredients },
                function () {
                    const toggleCheckbox =
                        document.querySelector('#toggleHide input');

                    // Reinitialise pagination with the updated list of ingredients
                    if (toggleCheckbox.checked) {
                        pagination(null, 5);
                    } else {
                        pagination();
                    }

                    // Reset form visibility and opacity if the list is empty
                    if (updatedIngredients.length === 0) {
                        const form = document.getElementById('allergy-form');
                        form.style.visibility = 'visible';
                        form.style.opacity = '1';
                        form.style.pointerEvents = 'auto';
                    }
                }
            );
        });
    });
};

export default removeIngredient;
