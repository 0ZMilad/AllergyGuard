// This runs when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("AllergyGuard for Groceries installed.");
});

// Message received from content script  - add listener to listen for message from content script

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "send_url") {
    console.log("Received URL from content script;", request);

    // Handle 'log_url' message
    if (request.message === "log_url") {
      // Log the URL received from the content script
      console.log("URL from content script:", request.url);
      // Send a response back to the content script
      sendResponse({ message: "URL logged successfully" });
    }

    // Post request to server
    fetch("http://localhost:3000/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: request.url }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        sendResponse({ message: "URL sent to server." });
      })
      .catch((err) => {
        console.log(err);
      });

    return true;
  }
});
