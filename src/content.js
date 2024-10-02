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
