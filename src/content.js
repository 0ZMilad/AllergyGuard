import handleScrapedData from './utilityFunctions/handleScrapedData';

// Placeholder for content script functionality
console.log('Content script loaded.');

// Get the current page URL
const url = window.location.href;
console.log('Current URL:', url);

// Send a message to the background script to log the current URL
chrome.runtime.sendMessage(
    { message: 'log_url', url: url },
    function (response) {
        // Log the response from the background script
        console.log('Received response from background script:', response);
    }
);

// Send a message to the background script to forward the URL to the server for scraping
chrome.runtime.sendMessage(
    { message: 'url_scrape', url: url },
    function (response) {
        if (response.data) {
            // If scraped data is received, log it to the console
            handleScrapedData(response.data);
        } else if (response.error) {
            // If an error occurs, log the error message
            console.error('Error:', response.error);
        }
    }
);

// Function to escape special characters in regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
