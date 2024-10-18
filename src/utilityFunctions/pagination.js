import displayIngredients from './displayIngredients';

async function pagination(ingredientsList = null, itemsPPage = null) {
    const itemsPerPage = itemsPPage ?? 3;

    // Get the current page from chrome storage or default to 1
    let currentPage = await new Promise((resolve) => {
        chrome.storage.sync.get('currentPage', (data) => {
            resolve(data.currentPage || 1);
        });
    });

    // Use the provided list of ingredients or retrieve the full list
    const data = await chrome.storage.sync.get('badIngredients');
    const badIngredients = ingredientsList || data.badIngredients || [];

    let totalPages;
    if (badIngredients.length === 0) {
        totalPages = 1;
    } else {
        totalPages = Math.ceil(badIngredients.length / itemsPerPage);
    }

    let buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        document.body.appendChild(buttonContainer);
    }

    let previousPage = document.getElementById('prev-button');
    if (!previousPage) {
        previousPage = document.createElement('button');
        previousPage.textContent = '←';
        previousPage.id = 'prev-button';
        buttonContainer.appendChild(previousPage);
    }

    let nextPage = document.getElementById('next-button');
    if (!nextPage) {
        nextPage = document.createElement('button');
        nextPage.textContent = '→';
        nextPage.id = 'next-button';
        buttonContainer.appendChild(nextPage);
    }

    let pageInfo = document.getElementById('page-info');
    if (!pageInfo) {
        pageInfo = document.createElement('span');
        pageInfo.id = 'page-info';
        document.body.appendChild(pageInfo);
    }

    function updatePage() {
        // Ensure currentPage is valid in case ingredients were removed
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const currentPageItems = badIngredients.slice(startIndex, endIndex);

        displayIngredients(currentPageItems);

        if (badIngredients.length === 0) {
            totalPages = 1;
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            nextPage.disabled = currentPage === totalPages;
        }
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        previousPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;

        // Save the current page to storage
        chrome.storage.sync.set({ currentPage: currentPage });
    }

    nextPage.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    });

    previousPage.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight' && currentPage < totalPages) {
            currentPage++;
            updatePage();
        } else if (event.key === 'ArrowLeft' && currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });

    updatePage();
}

export default pagination;
