function createDialog(message) {
    const dialog = document.createElement('div');
    dialog.classList.add('dialog-overlay');

    const contentBox = document.createElement('div');
    contentBox.classList.add('dialog-box');

    const title = document.createElement('h2');
    title.textContent = 'Ingredient Alert';
    title.classList.add('dialog-title');

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message.replace(/\n/g, ' ');
    messageParagraph.classList.add('dialog-message');

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('dialog-close-button');

    closeButton.addEventListener('click', () => {
        dialog.remove();
    });

    // Close the dialog when clicking outside the dialog-box (on the overlay)
    dialog.addEventListener('click', (event) => {
        // If the click target is the overlay itself (not the contentBox), close the dialog
        if (event.target === dialog) {
            dialog.remove();
        }
    });

    // Assemble the dialog components
    contentBox.appendChild(title);
    contentBox.appendChild(messageParagraph);
    contentBox.appendChild(closeButton);
    dialog.appendChild(contentBox);
    document.body.appendChild(dialog);
}

// Make createDialog available globally
window.createDialog = createDialog;
