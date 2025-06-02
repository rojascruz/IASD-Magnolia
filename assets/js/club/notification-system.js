// notification-system.js
// Sistema moderno de notificaciones para reemplazar alerts

class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.notificationCounter = 0;
        this.init();
    }

    init() {
        this.createContainer();
        this.addStyles();
        console.log('🔔 Sistema de notificaciones inicializado');
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.id = 'notification-container';
        document.body.appendChild(this.container);
    }

    addStyles() {
        if (document.getElementById('notification-styles')) {
            return;
        }

        const styles = `
            <style id="notification-styles">
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    pointer-events: none;
                    max-width: 400px;
                    width: 100%;
                }

                .notification {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                    margin-bottom: 16px;
                    padding: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(20px);
                    pointer-events: auto;
                    position: relative;
                    overflow: hidden;
                    animation: slideInNotification 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform-origin: top right;
                }

                @keyframes slideInNotification {
                    from {
                        opacity: 0;
                        transform: translateX(100%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }

                .notification.notification-success {
                    border-left: 5px solid #28a745;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fff9 100%);
                }

                .notification.notification-error {
                    border-left: 5px solid #dc3545;
                    background: linear-gradient(135deg, #ffffff 0%, #fff8f8 100%);
                }

                .notification.notification-warning {
                    border-left: 5px solid #ffc107;
                    background: linear-gradient(135deg, #ffffff 0%, #fffef8 100%);
                }

                .notification.notification-info {
                    border-left: 5px solid #007bff;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fcff 100%);
                }

                .notification::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .notification-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }

                .notification-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-right: 16px;
                    flex-shrink: 0;
                }

                .notification-success .notification-icon {
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                }

                .notification-error .notification-icon {
                    background: linear-gradient(135deg, #dc3545, #c82333);
                    color: white;
                }

                .notification-warning .notification-icon {
                    background: linear-gradient(135deg, #ffc107, #e0a800);
                    color: white;
                }

                .notification-info .notification-icon {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                }

                .notification-content {
                    flex: 1;
                }

                .notification-title {
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin: 0 0 8px 0;
                    color: #2c3e50;
                    font-family: 'Montserrat', sans-serif;
                }

                .notification-message {
                    font-size: 0.95rem;
                    color: #6c757d;
                    line-height: 1.5;
                    margin: 0;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: #6c757d;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    margin-left: 12px;
                    flex-shrink: 0;
                }

                .notification-close:hover {
                    background: rgba(108, 117, 125, 0.1);
                    color: #495057;
                    transform: scale(1.1);
                }

                .notification-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 0 0 16px 16px;
                    overflow: hidden;
                }

                .notification-progress-bar {
                    height: 100%;
                    border-radius: 0 0 16px 16px;
                    transition: width 0.1s linear;
                }

                .notification-success .notification-progress-bar {
                    background: linear-gradient(90deg, #28a745, #20c997);
                }

                .notification-error .notification-progress-bar {
                    background: linear-gradient(90deg, #dc3545, #c82333);
                }

                .notification-warning .notification-progress-bar {
                    background: linear-gradient(90deg, #ffc107, #e0a800);
                }

                .notification-info .notification-progress-bar {
                    background: linear-gradient(90deg, #007bff, #0056b3);
                }

                .notification-actions {
                    margin-top: 16px;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .notification-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .notification-btn-primary {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                }

                .notification-btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                }

                .notification-btn-secondary {
                    background: #f8f9fa;
                    color: #6c757d;
                    border: 1px solid #dee2e6;
                }

                .notification-btn-secondary:hover {
                    background: #e9ecef;
                    color: #495057;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .notification-container {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }

                    .notification {
                        padding: 16px;
                        margin-bottom: 12px;
                    }

                    .notification-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 20px;
                        margin-right: 12px;
                    }

                    .notification-title {
                        font-size: 1rem;
                    }

                    .notification-message {
                        font-size: 0.9rem;
                    }

                    .notification-actions {
                        flex-direction: column;
                    }

                    .notification-btn {
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .notification-container {
                        top: 5px;
                        right: 5px;
                        left: 5px;
                    }

                    .notification {
                        padding: 12px;
                    }

                    .notification-header {
                        margin-bottom: 8px;
                    }
                }

                /* Animación de salida */
                .notification.notification-exit {
                    animation: slideOutNotification 0.3s ease-in forwards;
                }

                @keyframes slideOutNotification {
                    from {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                        max-height: 200px;
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%) scale(0.8);
                        max-height: 0;
                        margin-bottom: 0;
                        padding-top: 0;
                        padding-bottom: 0;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    show(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000,
            showProgress = true,
            actions = [],
            persistent = false
        } = options;

        const notificationId = ++this.notificationCounter;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('data-id', notificationId);

        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        let actionsHTML = '';
        if (actions.length > 0) {
            actionsHTML = `
                <div class="notification-actions">
                    ${actions.map((action, index) => `
                        <button class="notification-btn notification-btn-${action.type || 'secondary'}" 
                                data-action="${index}">
                            ${action.icon ? `<span>${action.icon}</span>` : ''}
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        notification.innerHTML = `
            <div class="notification-header">
                <div style="display: flex; align-items: center;">
                    <div class="notification-icon">
                        ${iconMap[type] || iconMap.info}
                    </div>
                    <div class="notification-content">
                        ${title ? `<h4 class="notification-title">${title}</h4>` : ''}
                        ${message ? `<p class="notification-message">${message}</p>` : ''}
                    </div>
                </div>
                <button class="notification-close" data-close="${notificationId}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            ${actionsHTML}
            ${showProgress && !persistent ? `
                <div class="notification-progress">
                    <div class="notification-progress-bar" data-progress="${notificationId}"></div>
                </div>
            ` : ''}
        `;

        this.container.appendChild(notification);
        this.notifications.set(notificationId, notification);

        // Event listeners
        const closeBtn = notification.querySelector(`[data-close="${notificationId}"]`);
        closeBtn.addEventListener('click', () => this.hide(notificationId));

        // Action buttons
        const actionBtns = notification.querySelectorAll('[data-action]');
        actionBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (actions[index].callback) {
                    actions[index].callback();
                }
                if (actions[index].closeOnClick !== false) {
                    this.hide(notificationId);
                }
            });
        });

        // Auto-hide y progress bar
        if (!persistent && duration > 0) {
            const progressBar = notification.querySelector(`[data-progress="${notificationId}"]`);
            
            if (progressBar) {
                let progress = 100;
                const interval = 50;
                const step = (interval / duration) * 100;

                const progressInterval = setInterval(() => {
                    progress -= step;
                    progressBar.style.width = `${Math.max(0, progress)}%`;

                    if (progress <= 0) {
                        clearInterval(progressInterval);
                        this.hide(notificationId);
                    }
                }, interval);

                // Pausar en hover
                notification.addEventListener('mouseenter', () => {
                    clearInterval(progressInterval);
                });

                notification.addEventListener('mouseleave', () => {
                    if (progress > 0) {
                        const newInterval = setInterval(() => {
                            progress -= step;
                            progressBar.style.width = `${Math.max(0, progress)}%`;

                            if (progress <= 0) {
                                clearInterval(newInterval);
                                this.hide(notificationId);
                            }
                        }, interval);
                    }
                });
            } else {
                setTimeout(() => this.hide(notificationId), duration);
            }
        }

        console.log(`🔔 Notificación ${type} mostrada:`, title || message);
        return notificationId;
    }

    hide(notificationId) {
        const notification = this.notifications.get(notificationId);
        if (notification) {
            notification.classList.add('notification-exit');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
                this.notifications.delete(notificationId);
            }, 300);
        }
    }

    success(title, message, options = {}) {
        return this.show({
            type: 'success',
            title,
            message,
            ...options
        });
    }

    error(title, message, options = {}) {
        return this.show({
            type: 'error',
            title,
            message,
            ...options
        });
    }

    warning(title, message, options = {}) {
        return this.show({
            type: 'warning',
            title,
            message,
            ...options
        });
    }

    info(title, message, options = {}) {
        return this.show({
            type: 'info',
            title,
            message,
            ...options
        });
    }

    clear() {
        this.notifications.forEach((notification, id) => {
            this.hide(id);
        });
    }
}

// Crear instancia global
window.notifications = new NotificationSystem();

// Función de conveniencia para notificaciones rápidas
window.showNotification = (type, title, message, options = {}) => {
    return window.notifications[type](title, message, options);
};

console.log('🔔 Sistema de notificaciones cargado correctamente');