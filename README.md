# AllergyGuard

Shop with confidence. AllergyGuard is a lightweight browser extension that reads product pages and flags ingredients you want to avoid—right when you need it.

## Get the extension

- Install from Chrome Web Store: https://chromewebstore.google.com/detail/gdjilfahcoemgclgihajfmdbcpgnhfdl
- For development, you can also load it unpacked:
  - Build the project first to generate the `dist/` folder (see Development below).
  - In Chrome, go to Extensions → enable Developer mode → Load unpacked → select the `AllergyGuard/` folder (the one containing `manifest.json`).

## Supported stores

- Amazon (amazon.com, amazon.co.uk)
- Amazon Fresh (fresh.amazon.com)

## How it works

1. Install the extension and open the popup.
2. Add ingredients you’d like to avoid (e.g., “Peanuts”, “Soy lecithin”, “Gluten”).
3. Visit a product page. AllergyGuard sends the page URL to a small scraper service.
4. The scraper fetches the page, extracts the ingredient list, and returns it.
5. The extension compares that list against yours and highlights any matches (you’ll see an alert if there’s a match).

## Permissions used

- activeTab: read the current tab’s URL to send to the scraper.
- storage: store your ingredient list locally.
- scripting: inject content scripts to highlight matches on pages.
- host permissions: amazon.com, amazon.co.uk, instacart.com, and the scraper API domain.

## Privacy

- Your ingredient list is stored locally in your browser.
- No account needed. No tracking. Just helpful alerts.

## Backend scraper service

This extension relies on a small scraping API to fetch ingredient lists. The backend (AllergyScraper) is private and not publicly accessible.

Note: The hosted API used by the Chrome Web Store build is private—no public API keys are issued. If you need access or have questions, contact me. For local development, you’ll need access to the private backend; once granted, run it locally and set `API_BASE_URL` to your local server.

That’s it—happy (and safer) shopping!
