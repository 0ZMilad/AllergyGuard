chrome.runtime.onInstalled.addListener(() => {
    console.log('AllergyGuard for Groceries installed.');
});

// Configuration injected at build time
const API_CONFIG = {
    apiKey: process.env.EXTENSION_API_KEY,
    baseUrl: process.env.API_BASE_URL
};

// Lightweight client cache and in-flight request map
const RESULT_TTL_MS = 60 * 1000; // 1 minute client cache to avoid spam
const cache = new Map(); // key: encodedUrl -> { data, expires }
const inflight = new Map(); // key: encodedUrl -> Promise

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Received message from content script:', request);

    if (request.message === 'log_url') {
        console.log('URL from content script:', request.url);
        sendResponse({ message: 'URL logged successfully' });
    }

    if (request.message === 'url_scrape') {
        console.log('Sending URL to server:', request.url);

        if (!API_CONFIG.apiKey) {
            sendResponse({
                message: 'Error: Extension not properly configured.',
                error: 'API key missing - please reinstall the extension.'
            });
            return;
        }

        const encodedUrl = encodeURIComponent(request.url);
        const endpoint = `${API_CONFIG.baseUrl}/item/${encodedUrl}`;

        // Client cache hit
        const cached = cache.get(encodedUrl);
        if (cached && cached.expires > Date.now()) {
            sendResponse({ message: 'Cached result', data: cached.data });
            return true;
        }

        // Deduplicate in-flight requests
        if (inflight.has(encodedUrl)) {
            inflight.get(encodedUrl)
                .then((data) => sendResponse({ message: 'Parsed JSON data received from server.', data }))
                .catch((err) => sendResponse({ message: 'Error sending URL to server.', error: err.message }));
            return true;
        }

        const reqPromise = fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_CONFIG.apiKey,
                // Send extension identity to backend as a fallback when Origin is missing
                'x-extension-id': chrome.runtime.id,
            },
        })
        .then((res) => {
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Extension authentication failed - please contact support');
                } else if (res.status === 429) {
                    throw new Error('Rate limit exceeded - please try again later');
                }
                throw new Error('Server responded with status: ' + res.status);
            }
            return res.json();
        })
        .then((data) => {
            cache.set(encodedUrl, { data, expires: Date.now() + RESULT_TTL_MS });
            return data;
        })
        .finally(() => {
            inflight.delete(encodedUrl);
        });

        inflight.set(encodedUrl, reqPromise);

        reqPromise
            .then((data) => {
                sendResponse({ message: 'Parsed JSON data received from server.', data });
            })
            .catch((err) => {
                console.error('Error:', err);
                sendResponse({ message: 'Error sending URL to server.', error: err.message });
            });

        return true;
    }
});
