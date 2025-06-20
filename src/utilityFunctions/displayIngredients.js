import removeIngredient from './removeIngredient';

function displayIngredients(ingredients) {
    const ingredientList = document.getElementById('ingredient-list');
    const ingredientItems = document.getElementById('ingredient-items');
    ingredientItems.innerHTML = '';

    if (ingredients.length === 0) {
        const searchBar = document.getElementById('search-bar');
        if (searchBar && searchBar.value.trim() !== '') {
            const noResultsLi = document.createElement('li');
            noResultsLi.textContent = 'No ingredients found';
            noResultsLi.classList.add('no-results');
            ingredientItems.appendChild(noResultsLi);
        }
    } else {
        ingredients.forEach((ingredient) => {
            const li = document.createElement('li');
            li.textContent = ingredient;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            removeButton.classList.add('remove-button');

            removeIngredient(removeButton, ingredient, li);

            li.appendChild(removeButton);
            ingredientItems.appendChild(li);
        });
    }

    ingredientList.classList.remove('hidden');
}

export default displayIngredients;
