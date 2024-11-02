import displayIngredients from './displayIngredients';

let itemsPerPage = 3;
let currentPage = 1;
let totalPages = 1;
let badIngredients = [];

let nextPage;
let previousPage;
let pageInfo;
let buttonContainer;

let eventListenersSetUp = false;

const ingredientList = document.getElementById('ingredient-list');
const toggleContainer = document.querySelector('#toggleHide');
const toggleCheckbox = document.querySelector('#toggleHide input');
const clearAllButton = document.getElementById('clearAllButton');

async function pagination(ingredientsList = null, itemsPPage = null) {
    if (itemsPPage !== null) {
        itemsPerPage = itemsPPage;
    }

    // Retrieve the list of bad ingredients and current page from storage
    const data = await chrome.storage.sync.get([
        'badIngredients',
        'currentPage',
    ]);
    badIngredients = ingredientsList || data.badIngredients || [];
    currentPage = data.currentPage || 1;

    // Reset current page to 1 if ingredientsList is provided (indicating an update)
    if (ingredientsList !== null) {
        currentPage = 1;
        chrome.storage.sync.set({ currentPage: 1 });
    }

    // Calculate total pages
    totalPages =
        badIngredients.length > 0
            ? Math.ceil(badIngredients.length / itemsPerPage)
            : 1;

    // Show or hide the toggle based on the number of ingredients
    if (badIngredients.length === 0) {
        toggleCheckbox.style.display = 'none';
    } else {
        toggleCheckbox.style.display = 'block';
        toggleCheckbox.disabled = false;
    }

    buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        document.body.appendChild(buttonContainer);
    }

    previousPage = document.getElementById('prev-button');
    if (!previousPage) {
        previousPage = document.createElement('button');
        previousPage.textContent = '←';
        previousPage.id = 'prev-button';
        buttonContainer.appendChild(previousPage);
    }

    nextPage = document.getElementById('next-button');
    if (!nextPage) {
        nextPage = document.createElement('button');
        nextPage.textContent = '→';
        nextPage.id = 'next-button';
        buttonContainer.appendChild(nextPage);
    }

    pageInfo = document.getElementById('page-info');
    if (!pageInfo) {
        pageInfo = document.createElement('span');
        pageInfo.id = 'page-info';
        document.body.appendChild(pageInfo);
    }

    // Update the page display
    updatePage();

    // Set up event listeners only once
    if (!eventListenersSetUp) {
        setupEventListeners();
        eventListenersSetUp = true;
    }
}

function updatePage() {
    // Ensure currentPage is within valid range
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentPageItems = badIngredients.slice(startIndex, endIndex);

    // Display ingredients or hide the ingredient list and navigation if none
    if (badIngredients.length === 0) {
        ingredientList.style.display = 'none';
        buttonContainer.style.display = 'none';
        pageInfo.style.display = 'none';
        toggleContainer.style.display = 'none';
        clearAllButton.style.display = 'none';

        // Uncheck the toggle if the list is empty
        if (toggleCheckbox.checked) {
            toggleCheckbox.checked = false;
        }
    } else {
        ingredientList.style.display = 'block';
        buttonContainer.style.display = 'flex';
        pageInfo.style.display = 'inline';
        toggleContainer.style.display = 'block';
        toggleCheckbox.disabled = false;
        clearAllButton.style.display = 'block';

        displayIngredients(currentPageItems);

        // Update totalPages in case badIngredients changed
        totalPages =
            badIngredients.length > 0
                ? Math.ceil(badIngredients.length / itemsPerPage)
                : 1;

        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        previousPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;
    }

    // Disable the toggle if the list is empty
    if (badIngredients.length === 0) {
        toggleCheckbox.checked = false;
        toggleCheckbox.disabled = true;
    }

    // Save the current page to storage
    chrome.storage.sync.set({ currentPage: currentPage });
}

function setupEventListeners() {
    function nextPageHandler() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    }

    function previousPageHandler() {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    }

    function keydownHandler(event) {
        if (event.key === 'ArrowRight' && currentPage < totalPages) {
            currentPage++;
            updatePage();
        } else if (event.key === 'ArrowLeft' && currentPage > 1) {
            currentPage--;
            updatePage();
        }
    }

    nextPage.addEventListener('click', nextPageHandler);
    previousPage.addEventListener('click', previousPageHandler);
    document.addEventListener('keydown', keydownHandler);
}

export default pagination;
