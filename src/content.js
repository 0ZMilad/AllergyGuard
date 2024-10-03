import handleScrapedData from './utilityFunctions/handleScrapedData';

// Placeholder for content script functionality
console.log('Content script loaded.');

// Function to send URL to background script
function sendUrlToBackgroundScript(url) {
    chrome.runtime.sendMessage(
        { message: 'log_url', url: url },
        function (response) {
            console.log('Received response from background script:', response);
        }
    );

    chrome.runtime.sendMessage(
        { message: 'url_scrape', url: url },
        function (response) {
            if (response.data) {
                handleScrapedData(response.data);
            } else if (response.error) {
                console.error('Error:', response.error);
            }
        }
    );
}

// Handle the click event
function handleAddToCartClick(event) {
    const url = window.location.href;
    console.log('Add to Cart clicked. Current URL:', url);
    sendUrlToBackgroundScript(url);
}

// Function to add click event listeners to "Add to Cart" buttons
function addEventListenersToButtons() {
    const addToCartButtons = [
        ...document.querySelectorAll('[id*="add-to-cart"] .a-button-input'),
        ...document.querySelectorAll('#freshAddToCartButton .a-button-input'),
        ...document.querySelectorAll(
            '.a-button-input[name="submit.add-to-cart"]'
        ),
        ...document.querySelectorAll('.a-button-input[name="submit.buy-now"]'),
    ];

    addToCartButtons.forEach((button) => {
        if (!button.hasAddToCartListener) {
            button.addEventListener('click', handleAddToCartClick);
            button.hasAddToCartListener = true;
        }
    });

    console.log(`Added event listeners to ${addToCartButtons.length} buttons`);
}
