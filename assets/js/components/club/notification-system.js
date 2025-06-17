// notification-system.js
// Sistema moderno de notificaciones con un solo template

class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.notificationCounter = 0;
        this.templates = new Map();
        this.init();
    }

    async init() {
        this.createContainer();
        await this.loadTemplate();
        console.log('🔔 Sistema de notificaciones inicializado');
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.id = 'notification-container';
        document.body.appendChild(this.container);
    }
    async loadTemplate() {
        try {
            const response = await fetch('/assets/template/components/club/notification-system/notification-template.html');
            if (response.ok) {
                const templateHTML = await response.text();
                
                // Crear un documento temporal para extraer los templates
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = templateHTML;
                
                // Extraer cada template y guardarlo en el Map
                const templateElements = tempDiv.querySelectorAll('template');
                templateElements.forEach(template => {
                    this.templates.set(template.id, template.innerHTML);
                });
                
                console.log('📄 Template cargado correctamente');
            } else {
                console.warn('⚠️ No se pudo cargar el template, usando fallback');
                this.useFallbackTemplates();
            }
        } catch (error) {
            console.error('❌ Error cargando template:', error);
            this.useFallbackTemplates();
        }
    }

    useFallbackTemplates() {
        // Templates de respaldo si no se puede cargar el archivo
        this.templates.set('notification-template', `
            <div class="notification-header">
                <div style="display: flex; align-items: center;">
                    <div class="notification-icon">{{icon}}</div>
                    <div class="notification-content">{{title}}{{message}}</div>
                </div>
                <button class="notification-close" data-close="{{notificationId}}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>{{actions}}{{progress}}
        `);
        
        this.templates.set('notification-title-template', '<h4 class="notification-title">{{title}}</h4>');
        this.templates.set('notification-message-template', '<p class="notification-message">{{message}}</p>');
        this.templates.set('notification-actions-template', '<div class="notification-actions">{{actionButtons}}</div>');
        this.templates.set('notification-action-button-template', '<button class="notification-btn notification-btn-{{actionType}}" data-action="{{actionIndex}}">{{actionIcon}}{{actionText}}</button>');
        this.templates.set('notification-progress-template', '<div class="notification-progress"><div class="notification-progress-bar" data-progress="{{notificationId}}"></div></div>');
    }

    replaceTemplate(template, replacements) {
        let result = template;
        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, value);
        }
        return result;
    }

    buildActionButtons(actions) {
        if (!actions.length || !this.templates.has('notification-action-button-template')) return '';

        const buttonTemplate = this.templates.get('notification-action-button-template');
        const buttons = actions.map((action, index) => {
            return this.replaceTemplate(buttonTemplate, {
                actionType: action.type || 'secondary',
                actionIndex: index,
                actionIcon: action.icon ? `<span>${action.icon}</span>` : '',
                actionText: action.text
            });
        }).join('');

        return this.replaceTemplate(this.templates.get('notification-actions-template'), {
            actionButtons: buttons
        });
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

        if (!this.templates.has('notification-template')) {
            console.error('❌ Template principal no cargado');
            return null;
        }

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

        // Construir title y message
        const titleHTML = title && this.templates.has('notification-title-template') 
            ? this.replaceTemplate(this.templates.get('notification-title-template'), { title })
            : '';

        const messageHTML = message && this.templates.has('notification-message-template')
            ? this.replaceTemplate(this.templates.get('notification-message-template'), { message })
            : '';

        // Construir actions
        const actionsHTML = this.buildActionButtons(actions);

        // Construir progress bar
        const progressHTML = (showProgress && !persistent && this.templates.has('notification-progress-template'))
            ? this.replaceTemplate(this.templates.get('notification-progress-template'), { notificationId })
            : '';

        // Construir notificación completa
        const mainTemplate = this.templates.get('notification-template');
        notification.innerHTML = this.replaceTemplate(mainTemplate, {
            icon: iconMap[type] || iconMap.info,
            title: titleHTML,
            message: messageHTML,
            notificationId: notificationId,
            actions: actionsHTML,
            progress: progressHTML
        });

        this.container.appendChild(notification);
        this.notifications.set(notificationId, notification);

        // Event listeners
        const closeBtn = notification.querySelector(`[data-close="${notificationId}"]`);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide(notificationId));
        }

        // Action buttons
        const actionBtns = notification.querySelectorAll('[data-action]');
        actionBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (actions[index]?.callback) {
                    actions[index].callback();
                }
                if (actions[index]?.closeOnClick !== false) {
                    this.hide(notificationId);
                }
            });
        });

        // Auto-hide y progress bar
        if (!persistent && duration > 0) {
            const progressBar = notification.querySelector(`[data-progress="${notificationId}"]`);
            
            if (progressBar) {
                this.setupProgressBar(progressBar, duration, notificationId, notification);
            } else {
                setTimeout(() => this.hide(notificationId), duration);
            }
        }

        console.log(`🔔 Notificación ${type} mostrada:`, title || message);
        return notificationId;
    }

    setupProgressBar(progressBar, duration, notificationId, notification) {
        let progress = 100;
        const interval = 50;
        const step = (interval / duration) * 100;
        let progressInterval;

        const startProgress = () => {
            progressInterval = setInterval(() => {
                progress -= step;
                progressBar.style.width = `${Math.max(0, progress)}%`;

                if (progress <= 0) {
                    clearInterval(progressInterval);
                    this.hide(notificationId);
                }
            }, interval);
        };

        const stopProgress = () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };

        // Iniciar progreso
        startProgress();

        // Pausar en hover
        notification.addEventListener('mouseenter', stopProgress);
        notification.addEventListener('mouseleave', () => {
            if (progress > 0) {
                startProgress();
            }
        });
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

// Crear instancia global de forma asíncrona
(async () => {
    window.notifications = new NotificationSystem();
    
    // Función de conveniencia para notificaciones rápidas
    window.showNotification = (type, title, message, options = {}) => {
        return window.notifications[type](title, message, options);
    };

    console.log('🔔 Sistema de notificaciones cargado correctamente');
})();