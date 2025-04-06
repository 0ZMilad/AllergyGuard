chrome.runtime.onInstalled.addListener(() => {
    console.log('AllergyGuard for Groceries installed.');
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Received message from content script:', request);

    if (request.message === 'log_url') {
        console.log('URL from content script:', request.url);
        sendResponse({ message: 'URL logged successfully' });
    }

    if (request.message === 'url_scrape') {
        console.log('Sending URL to server:', request.url);

        const encodedUrl = encodeURIComponent(request.url);
        const endpoint = `http://localhost:3000/item/${encodedUrl}`;

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

        return true;
    }
});
