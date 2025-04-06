function createDialog(message, options = {}) {
    const dialog = document.createElement('div');
    dialog.classList.add('notification-box');

    const existingDialog = document.querySelector('.notification-box');
    if (existingDialog) {
        existingDialog.remove();
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

    if (options.iconUrl) {
        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add('notification-icon');

        const iconImg = document.createElement('img');
        iconImg.src = options.iconUrl;
        iconImg.alt = 'Notification Icon';

        iconWrapper.appendChild(iconImg);
        dialog.appendChild(iconWrapper);
    }

    const header = document.createElement('div');
    header.classList.add('notification-header');

    const circleColors = ['#3b82f6', '#a855f7', '#ec4899'];

    circleColors.forEach((color) => {
        const circleWrapper = document.createElement('div');
        circleWrapper.classList.add('circle-wrapper');

        const circle = document.createElement('span');
        circle.classList.add('circle');
        circle.style.backgroundColor = color;

        circleWrapper.appendChild(circle);
        header.appendChild(circleWrapper);
    });

    const messageContent = document.createElement('div');
    messageContent.classList.add('notification-content');

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;
    messageContent.appendChild(messageParagraph);

    dialog.appendChild(closeButton);
    dialog.appendChild(header);
    dialog.appendChild(messageContent);

    let autoDismissTimeout;
    if (options.autoDismiss) {
        autoDismissTimeout = setTimeout(() => {
            dialog.remove();
            if (options.onClose) {
                options.onClose();
            }
        }, options.autoDismiss);

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

window.createDialog = createDialog;
