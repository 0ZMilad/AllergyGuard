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
            } else {
                console.error('Unexpected response format:', response);
            }
        }
    );
}

// Debounce flag to prevent multiple clicks being processed at once
let isProcessingClick = false;

// Handle the click event
function handleAddToCartClick(event) {
    if (isProcessingClick) return; // Ignore click if a request is still being processed

    isProcessingClick = true; // Set the flag to true to block further clicks

    const url = window.location.href;
    console.log('Add to Cart clicked. Current URL:', url);
    sendUrlToBackgroundScript(url);

    // Allow the default "Add to Cart" behavior to continue after processing
    setTimeout(() => (isProcessingClick = false), 1000);
}

// Function to add click event listeners to "Add to Cart" and "Buy Now" buttons
function addEventListenersToButtons() {
    const addToCartButtons = [
        // Add to Basket (Add to Cart) buttons
        ...document.querySelectorAll('[id*="add-to-cart"] .a-button-input'),
        ...document.querySelectorAll('#freshAddToCartButton .a-button-input'),
        ...document.querySelectorAll(
            '.a-button-input[name="submit.add-to-cart"]'
        ),
        ...document.querySelectorAll(
            '.a-button-input[name="add-to-cart-button"]'
        ),

        // Buy Now buttons
        ...document.querySelectorAll('.a-button-input[name="submit.buy-now"]'),
        ...document.querySelectorAll('[id*="buy-now-button"] .a-button-input'),
    ];

    addToCartButtons.forEach((button) => {
        if (!button.hasAddToCartListener) {
            console.log('Attaching event listener to button:', button);
            button.addEventListener('click', handleAddToCartClick);
            button.hasAddToCartListener = true; // Mark button to avoid duplicate listeners
        }
    });

    console.log(`Added event listeners to ${addToCartButtons.length} buttons`);
}

// Initial setup function
function initialise() {
    addEventListenersToButtons();

    // Use a MutationObserver to handle dynamically added buttons
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // Check if the node added is an element and contains buttons
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

// Wait for the DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise);
} else {
    initialise();
}
