// This runs when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('AllergyGuard for Groceries installed.');
});

// Message received from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Received message from content script:', request);

    // Handle 'log_url' message - log the URL
    if (request.message === 'log_url') {
        console.log('URL from content script:', request.url);
        sendResponse({ message: 'URL logged successfully' });
    }

    // Handle 'url_scrape' message - send URL to server
    if (request.message === 'url_scrape') {
        console.log('Sending URL to server:', request.url);

        // Encode the URL to be used in the endpoint
        const encodedUrl = encodeURIComponent(request.url);
        const endpoint = `http://localhost:3000/item/${encodedUrl}`;

        // Send a GET request to the server with the URL in the endpoint
        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        'Server responded with status: ' + res.status
                    );
                }
                return res.json();
            })
            .then((data) => {
                sendResponse({
                    message: 'Parsed JSON data received from server.',
                    data: data,
                });
            })
            .catch((err) => {
                console.error('Error:', err);
                sendResponse({
                    message: 'Error sending URL to server.',
                    error: err.message,
                });
            });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
