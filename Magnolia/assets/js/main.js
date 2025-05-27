/**
 * Script principal para la landing page de la Iglesia Adventista
 * 
 * Incluye:
 * - Funcionalidad del menú móvil
 * - Animaciones al hacer scroll
 * - Validación del formulario de contacto
 */

document.addEventListener('DOMContentLoaded', function() {
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Animaciones al hacer scroll
    const animateElements = document.querySelectorAll('.card, .worship-card, .event-card');
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Función para animar elementos cuando están en viewport
    function checkVisibility() {
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    // Revisar visibilidad al cargar y al hacer scroll
    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
    
    // Validación del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            // Validar nombre
            if (!nameInput.value.trim()) {
                markAsInvalid(nameInput, 'Por favor ingrese su nombre');
                isValid = false;
            } else {
                markAsValid(nameInput);
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                markAsInvalid(emailInput, 'Por favor ingrese un email válido');
                isValid = false;
            } else {
                markAsValid(emailInput);
            }
            
            // Validar mensaje
            if (!messageInput.value.trim()) {
                markAsInvalid(messageInput, 'Por favor ingrese su mensaje');
                isValid = false;
            } else {
                markAsValid(messageInput);
            }
            
            // Si todo es válido, se enviaría el formulario
            if (isValid) {
                // Aquí se agregaría el código para enviar el formulario
                // Por ahora, simularemos un envío exitoso
                
                // Desactivar el botón para prevenir envíos múltiples
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
                
                // Simulación de envío (se puede reemplazar con una llamada AJAX real)
                setTimeout(function() {
                    contactForm.innerHTML = '<div class="success-message">¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</div>';
                }, 1500);
            }
        });
    }
    
    // Funciones auxiliares para la validación
    function markAsInvalid(inputElement, message) {
        inputElement.classList.add('invalid');
        
        // Buscar o crear mensaje de error
        let errorMessage = inputElement.parentElement.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            inputElement.parentElement.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }
    
    function markAsValid(inputElement) {
        inputElement.classList.remove('invalid');
        
        // Eliminar mensaje de error si existe
        const errorMessage = inputElement.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
});

