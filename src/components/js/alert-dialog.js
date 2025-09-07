function createDialog(message, options = {}) {
    const dialog = document.createElement('div');
    dialog.classList.add('notification-box');

    const existingDialog = document.querySelector('.notification-box');
    if (existingDialog) {
        existingDialog.remove();
    }

    const isMatchMessage =
        message.includes('Warning: The product') &&
        message.includes('contains the following concerning ingredients');

    const isScrapingMessage =
        message.includes('scraping') ||
        message.includes('scanning') ||
        message.includes('analyzing') ||
        options.type === 'scraping';

    if (isMatchMessage) {
        dialog.classList.add('notification-match');
    } else if (isScrapingMessage) {
        dialog.classList.add('notification-scraping');
    }

    if (options.type) {
        dialog.classList.add(`notification-${options.type}`);
    } else {
        if (isMatchMessage) {
            dialog.classList.add('notification-match');
        } else if (
            message.includes('successfully') ||
            message.includes('Added') ||
            message.includes('cleared')
        ) {
            dialog.classList.add('notification-success');
        } else if (
            message.includes('not saved') ||
            message.includes('Please enter')
        ) {
            dialog.classList.add('notification-error');
        } else if (message.includes('already')) {
            dialog.classList.add('notification-warning');
        } else if (isScrapingMessage) {
            dialog.classList.add('notification-scraping');
        } else {
            dialog.classList.add('notification-info');
        }
    }

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

    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('notification-icon');

    const icon = document.createElement('span');
    icon.classList.add('notification-icon-symbol');

    if (options.iconUrl) {
        const iconImg = document.createElement('img');
        iconImg.src = options.iconUrl;
        iconImg.alt = 'Notification Icon';
        iconWrapper.appendChild(iconImg);
    } else {
        if (isMatchMessage) {
            icon.innerHTML = '⚠️';
            icon.classList.add('icon-match');
        } else if (
            message.includes('successfully') ||
            message.includes('Added') ||
            message.includes('cleared')
        ) {
            icon.innerHTML = '✓';
            icon.classList.add('icon-success');
        } else if (
            message.includes('not saved') ||
            message.includes('Please enter')
        ) {
            icon.innerHTML = '!';
            icon.classList.add('icon-error');
        } else if (message.includes('already')) {
            icon.innerHTML = 'ℹ';
            icon.classList.add('icon-warning');
        } else if (isScrapingMessage) {
            icon.innerHTML = '🔍';
        } else {
            icon.innerHTML = 'ℹ';
            icon.classList.add('icon-info');
        }
        iconWrapper.appendChild(icon);
    }

    dialog.appendChild(iconWrapper);

    const messageContent = document.createElement('div');
    messageContent.classList.add('notification-content');

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;
    messageContent.appendChild(messageParagraph);

    dialog.appendChild(closeButton);
    dialog.appendChild(messageContent);

    let autoDismissTimeout;
    if (options.autoDismiss) {
        autoDismissTimeout = setTimeout(() => {
            dialog.classList.add('fade-out');
            setTimeout(() => {
                dialog.remove();
                if (options.onClose) {
                    options.onClose();
                }
            }, 300);
        }, options.autoDismiss);

        dialog.addEventListener('mouseenter', () => {
            clearTimeout(autoDismissTimeout);
        });

        dialog.addEventListener('mouseleave', () => {
            autoDismissTimeout = setTimeout(() => {
                dialog.classList.add('fade-out');
                setTimeout(() => {
                    dialog.remove();
                    if (options.onClose) {
                        options.onClose();
                    }
                }, 300);
            }, options.autoDismiss);
        });
    }

    document.body.appendChild(dialog);
}

window.createDialog = createDialog;
