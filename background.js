// This runs when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("AllergyGuard for Groceries installed.");
});

// Message received from content script  - add listener to listen for message from content script

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Received URL from content script;", request);

  // Handle 'log_url' message - log the URL
  if (request.message === "log_url") {
    // Log the URL received from the content script
    console.log("URL from content script:", request.url);
    // Send a response back to the content script
    sendResponse({ message: "URL logged successfully" });
  }

  // Handle 'url_scrape' message - send URL to server
  if (request.message === "url_scrape") {
    console.log("Sending URL to server:", request.url);

    // Send a POST request to the server with the URL
    fetch("http://localhost:3000/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: request.url }),
    })
      .then((res) => {
        // Check if the response is ok (status in the range 200-299)
        if (!res.ok) {
          throw new Error("Server responded with status: " + res.status);
        }
        // Parse the JSON response
        return res.json();
      })
      .then((data) => {
        // Send a response back to the content script
        sendResponse({
          message: "Parsed JSON data received from server.",
          data: data,
        });

        // store the data in local storage
        chrome.storage.local.set({ data: data }, function () {
          console.log("Data is set to local storage");
        });
      })
      .catch((err) => {
        // Log any errors that occur
        console.error("Error:", err);
        // Send an error response back to the content script
        sendResponse({
          message: "Error sending URL to server.",
          error: err.message,
        });
      });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});
