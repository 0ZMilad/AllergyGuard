import handleScrapedData from './utilityFunctions/handleScrapedData';

console.log('Content script loaded.');

// Centralized add-to-cart selector list (event delegation)
const ADD_TO_CART_SELECTORS = [
    '[id*="add-to-cart"] .a-button-input',
    '#freshAddToCartButton .a-button-input',
    '.a-button-input[name="submit.add-to-cart"]',
    '.a-button-input[name="add-to-cart-button"]',
    '.a-button-input[name="submit.buy-now"]',
    '[id*="buy-now-button"] .a-button-input',
];

function matchesAddToCart(target) {
    if (!target || target.nodeType !== Node.ELEMENT_NODE) return false;
    for (const sel of ADD_TO_CART_SELECTORS) {
        const match = target.closest(sel);
        if (match) return true;
    }
    return false;
}

function sendUrlToBackgroundScript(url) {
    chrome.runtime.sendMessage(
        { message: 'url_scrape', url: url },
        function (response) {
            if (response && response.data) {
                handleScrapedData(response.data);
            } else if (response && response.error) {
                console.error('Error:', response.error);
            }
        }
    );
}

let isProcessingClick = false;
let lastSentAt = 0;
let lastSentUrl = '';

function handleDelegatedClick(event) {
    const target = event.target;
    if (!matchesAddToCart(target)) return;

    if (isProcessingClick) return;
    isProcessingClick = true;

    const url = window.location.href;
    const now = Date.now();
    // Dedupe rapid repeats on same URL
    if (url === lastSentUrl && now - lastSentAt < 1500) {
        isProcessingClick = false;
        return;
    }
    lastSentUrl = url;
    lastSentAt = now;

    sendUrlToBackgroundScript(url);
    setTimeout(() => (isProcessingClick = false), 300);
}

function initialise() {
    // Single delegated listener covers dynamic DOM without MutationObserver
    document.addEventListener('click', handleDelegatedClick, true);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise);
} else {
    initialise();
}
