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
const clearAllButton = document.getElementById('clearAllButton');
const hideButton = document.getElementById('hideButton');

async function pagination(ingredientsList = null, itemsPPage = null, resetPage = true) {
    if (itemsPPage !== null) {
        itemsPerPage = itemsPPage;
    }

    const data = await chrome.storage.sync.get([
        'badIngredients',
        'currentPage',
        'isHidden'
    ]);
    badIngredients = ingredientsList || data.badIngredients || [];
    currentPage = data.currentPage || 1;

    if (ingredientsList !== null && resetPage) {
        currentPage = 1;
        chrome.storage.sync.set({ currentPage: 1 });
    }

    totalPages =
        badIngredients.length > 0
            ? Math.ceil(badIngredients.length / itemsPerPage)
            : 1;

    if (badIngredients.length === 0) {
        hideButton.style.display = 'none';
    } else {
        hideButton.style.display = 'block';
    }

    buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        document.body.appendChild(buttonContainer);
    }

    let prevPlaceholder = document.getElementById('prev-placeholder');
    if (!prevPlaceholder) {
        prevPlaceholder = document.createElement('div');
        prevPlaceholder.id = 'prev-placeholder';
        prevPlaceholder.style.display = 'inline-block';
        buttonContainer.appendChild(prevPlaceholder);
    }

    previousPage = document.getElementById('prev-button');
    if (!previousPage) {
        previousPage = document.createElement('button');
        previousPage.textContent = '←';
        previousPage.id = 'prev-button';
        prevPlaceholder.appendChild(previousPage);
    }

    let nextPlaceholder = document.getElementById('next-placeholder');
    if (!nextPlaceholder) {
        nextPlaceholder = document.createElement('div');
        nextPlaceholder.id = 'next-placeholder';
        nextPlaceholder.style.display = 'inline-block';
        buttonContainer.appendChild(nextPlaceholder);
    }

    nextPage = document.getElementById('next-button');
    if (!nextPage) {
        nextPage = document.createElement('button');
        nextPage.textContent = '→';
        nextPage.id = 'next-button';
        nextPlaceholder.appendChild(nextPage);
    }

    pageInfo = document.getElementById('page-info');
    if (!pageInfo) {
        pageInfo = document.createElement('span');
        pageInfo.id = 'page-info';
        document.body.appendChild(pageInfo);
    }

    updatePage();

    if (!eventListenersSetUp) {
        setupEventListeners();
        eventListenersSetUp = true;
    }
}

function updatePage() {
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentPageItems = badIngredients.slice(startIndex, endIndex);

    if (badIngredients.length === 0) {
        ingredientList.style.display = 'none';
        buttonContainer.style.display = 'none';
        pageInfo.style.display = 'none';
        hideButton.style.display = 'none';
        clearAllButton.style.display = 'none';
    } else {
        ingredientList.style.display = 'block';
        buttonContainer.style.display = 'flex';
        pageInfo.style.display = 'inline';
        hideButton.style.display = 'block';

        if (currentPage === totalPages) {
            clearAllButton.style.display = 'block';
            clearAllButton.style.transform = 'translateY(0)';
        } else {
            clearAllButton.style.display = 'none';
        }

        displayIngredients(currentPageItems);

        totalPages =
            badIngredients.length > 0
                ? Math.ceil(badIngredients.length / itemsPerPage)
                : 1;

        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        if (currentPage === 1) {
            previousPage.style.display = 'none';
        } else {
            previousPage.style.display = 'inline-block';
        }

        if (currentPage === totalPages) {
            nextPage.style.display = 'none';
        } else {
            nextPage.style.display = 'inline-block';
        }

        previousPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;
    }

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
