import handleScrapedData from './utilityFunctions/handleScrapedData';

console.log('Content script loaded.');

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
            } else {
                console.error('Unexpected response format:', response);
            }
        }
    );
}

let isProcessingClick = false;

function handleAddToCartClick(event) {
    if (isProcessingClick) return;

    isProcessingClick = true;

    const url = window.location.href;
    console.log('Add to Cart clicked. Current URL:', url);
    sendUrlToBackgroundScript(url);

    setTimeout(() => (isProcessingClick = false), 1000);
}

function addEventListenersToButtons() {
    const addToCartButtons = [
        ...document.querySelectorAll('[id*="add-to-cart"] .a-button-input'),
        ...document.querySelectorAll('#freshAddToCartButton .a-button-input'),
        ...document.querySelectorAll(
            '.a-button-input[name="submit.add-to-cart"]'
        ),
        ...document.querySelectorAll(
            '.a-button-input[name="add-to-cart-button"]'
        ),

        ...document.querySelectorAll('.a-button-input[name="submit.buy-now"]'),
        ...document.querySelectorAll('[id*="buy-now-button"] .a-button-input'),
    ];

    addToCartButtons.forEach((button) => {
        if (!button.hasAddToCartListener) {
            console.log('Attaching event listener to button:', button);
            button.addEventListener('click', handleAddToCartClick);
            button.hasAddToCartListener = true;
        }
    });

    console.log(`Added event listeners to ${addToCartButtons.length} buttons`);
}

function initialise() {
    addEventListenersToButtons();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const buttons = node.querySelectorAll('.a-button-input');
                    if (buttons.length > 0) {
                        console.log(
                            'New buttons added, re-attaching event listeners'
                        );
                        addEventListenersToButtons();
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise);
} else {
    initialise();
}
