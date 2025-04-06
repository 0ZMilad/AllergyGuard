function shortenItemName(name, maxLength) {
    if (name.length > maxLength) {
        return name.substring(0, maxLength) + '...';
    } else {
        return name;
    }
}

function displayResults(itemName, matchedIngredients) {
    const badIngredientsArray = [...matchedIngredients];

    const maxItemNameLength = 20;

    const displayedItemName = shortenItemName(itemName, maxItemNameLength);

    if (badIngredientsArray.length > 0) {
        const alertMessage = `Warning: The product ${displayedItemName} contains the following concerning ingredients:\n\n${badIngredientsArray.join(
            ', '
        )}`;
        console.log('Displaying dialog with message:', alertMessage);
        createDialog(alertMessage);
    } else {
        console.log(
            `No concerning ingredients found in "${displayedItemName}".`
        );
    }
}

export default displayResults;
