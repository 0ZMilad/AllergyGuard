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

    // Calculate total pages
    totalPages =
        badIngredients.length > 0
            ? Math.ceil(badIngredients.length / itemsPerPage)
            : 1;

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

    displayIngredients(currentPageItems);

    // Update totalPages in case badIngredients changed
    totalPages =
        badIngredients.length > 0
            ? Math.ceil(badIngredients.length / itemsPerPage)
            : 1;

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    previousPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;

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
