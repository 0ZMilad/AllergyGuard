import displayIngredients from './displayIngredients';

async function pagination() {
    const itemsPerPage = 3;

    let currentPage = 1;

    const data = await chrome.storage.sync.get('badIngredients');

    const badIngredients = data.badIngredients || [];

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
