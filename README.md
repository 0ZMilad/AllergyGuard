# AllergyGuard

Shop with confidence. AllergyGuard is a lightweight browser extension that reads product pages and flags ingredients you want to avoid—right when you need it.

## Get the extension

- Add to Chrome: https://chromewebstore.google.com/detail/ALLERGYGUARD-EXTENSION-ID (coming soon)
- If the store link isn’t live yet, you can load it unpacked to view the UI (Extensions → Developer mode → Load unpacked → select the `dist/` folder).

## What it does

- Scrapes ingredients on supported stores (like Amazon, Amazon Fresh, etc.).
- Highlights matches against your personal “avoid” list.
- Gives quick, friendly alerts without getting in your way.
- Remembers your list so you don’t have to.

## Supported stores

- Amazon (amazon.com)
- Amazon Fresh (fresh.amazon.com)

## How it works

1. You add ingredients you’d like to avoid in the popup.
2. On a product page, AllergyGuard sends the page URL to a small scraper service.
3. The scraper fetches the page, extracts the ingredient list, and returns it.
4. The extension compares that list against yours and highlights any matches.

## Quick start

1. Install the extension and open the popup.
2. Add ingredients you’d like to avoid (e.g., “Peanuts”, “Soy lecithin”, “Gluten”).
3. Visit a product page, click buy. If there’s a match, you’ll see an alert and the matching items highlighted.

## Example

- Your list: Peanuts, Soy lecithin
- Product page lists: “Ingredients: Cocoa, Sugar, Soy lecithin, Vanilla…”
- AllergyGuard shows an alert and highlights “Soy lecithin.” Simple and fast.

## Privacy

- Your ingredient list is stored locally in your browser.
- No account needed. No tracking. Just helpful alerts.

That’s it—happy (and safer) shopping!
