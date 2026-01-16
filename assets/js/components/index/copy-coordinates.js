// Función para copiar las coordenadas al portapapeles
function copyCoordinates() {
    const coordsText = document.getElementById('coordinates-text').innerText;
    
    // Crear elemento temporal
    const el = document.createElement('textarea');
    el.value = coordsText;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    
    // Seleccionar y copiar
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    // Mostrar notificación de éxito
    const notificationElement = document.getElementById('copy-notification');
    notificationElement.classList.add('show');
    
    // Ocultar la notificación después de 2 segundos
    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 2000);
}

// Función para inicializar todos los botones de copiar en la página
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            
            // Crear elemento temporal
            const el = document.createElement('textarea');
            el.value = textToCopy;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            
            // Seleccionar y copiar
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            
            // Mostrar notificación
            const notification = this.nextElementSibling;
            notification.classList.add('show');
            
            // Ocultar notificación después de 2 segundos
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCopyButtons);
