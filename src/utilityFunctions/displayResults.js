// Function to display results to the user
function displayResults(itemName, matchedIngredients) {
    const badIngredientsArray = [...matchedIngredients];

    if (badIngredientsArray.length > 0) {
        const alertMessage = `Warning: The product "${itemName}" contains the following concerning ingredients:\n\n${badIngredientsArray.join(
            ', '
        )}`;
        console.log('Displaying dialog with message:', alertMessage);
        createDialog(alertMessage);
    } else {
        console.log(`No concerning ingredients found in "${itemName}".`);
    }
}

export default displayResults;
