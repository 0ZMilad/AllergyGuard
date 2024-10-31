function createDialog(message, options = {}) {
    const dialog = document.createElement('div');
    dialog.classList.add('notification-box');

    // Remove any existing dialog before creating a new one
    const existingDialog = document.querySelector('.notification-box');
    if (existingDialog) {
        existingDialog.remove();
    }

    // Close button
    const closeButton = document.createElement('button');
    closeButton.classList.add('notification-close-button');
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close notification');

    closeButton.addEventListener('click', () => {
        dialog.remove();
        if (options.onClose) {
            options.onClose();
        }
    });

    // Optional icon
    if (options.iconUrl) {
        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add('notification-icon');

        const iconImg = document.createElement('img');
        iconImg.src = options.iconUrl;
        iconImg.alt = 'Notification Icon';

        iconWrapper.appendChild(iconImg);
        dialog.appendChild(iconWrapper);
    }

    // Create the header with colored circles
    const header = document.createElement('div');
    header.classList.add('notification-header');

    const circleColors = ['#3b82f6', '#a855f7', '#ec4899']; // Blue, Purple, Pink

    circleColors.forEach((color) => {
        const circleWrapper = document.createElement('div');
        circleWrapper.classList.add('circle-wrapper');

        const circle = document.createElement('span');
        circle.classList.add('circle');
        circle.style.backgroundColor = color;

        circleWrapper.appendChild(circle);
        header.appendChild(circleWrapper);
    });

    // Create the message content
    const messageContent = document.createElement('div');
    messageContent.classList.add('notification-content');

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;
    messageContent.appendChild(messageParagraph);

    // Assemble the dialog components
    dialog.appendChild(closeButton);
    dialog.appendChild(header);
    dialog.appendChild(messageContent);

    // Auto-dismiss functionality
    let autoDismissTimeout;
    if (options.autoDismiss) {
        autoDismissTimeout = setTimeout(() => {
            dialog.remove();
            if (options.onClose) {
                options.onClose();
            }
        }, options.autoDismiss);

        // Pause auto-dismiss on hover
        dialog.addEventListener('mouseenter', () => {
            clearTimeout(autoDismissTimeout);
        });

        dialog.addEventListener('mouseleave', () => {
            autoDismissTimeout = setTimeout(() => {
                dialog.remove();
                if (options.onClose) {
                    options.onClose();
                }
            }, options.autoDismiss);
        });
    }

    document.body.appendChild(dialog);
}

// Make createDialog available globally
window.createDialog = createDialog;
