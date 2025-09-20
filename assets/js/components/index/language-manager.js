/* 
 * Sistema de traducción para la página de la iglesia
 * Maneja el cambio dinámico entre español e inglés
 */

const translations = {
    es: {
        // Navegación
        'nav-about': 'Sobre Nosotros',
        'nav-departments': 'Departamentos',
        'nav-club': 'Club',
        
        // Header
        'church-title': 'IGLESIA ADVENTISTA DEL SÉPTIMO DÍA',
        'church-subtitle': 'MAGNOLIA BAYAMÓN',
        
        // Index - Página principal
        'verse-title': 'Versículo del Día',
        'verse-text': 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
        'verse-reference': 'Juan 3:16',
        'about-title': 'Sobre Nosotros',
        'church-card-title': 'NUESTRA IGLESIA',
        'church-card-text': 'Somos una comunidad de fe comprometida con el mensaje de esperanza y salvación en Jesucristo. Desde nuestro hogar en Magnolia, Bayamón, servimos a las familias locales compartiendo el amor de Dios a través de la adoración, el estudio bíblico y el servicio comunitario. Creemos en la pronta segunda venida de Cristo y vivimos cada día preparándonos para ese glorioso encuentro.',
        'purpose-card-title': 'NUESTRO PROPÓSITO',
        'purpose-card-text': 'Predicar el evangelio eterno a toda nación, tribu, lengua y pueblo, proclamando el mensaje de salvación y la esperanza en la segunda venida de Cristo. Nuestra misión es hacer discípulos, fortalecer la fe y servir a nuestra comunidad con amor.',
        'worship-title': 'Horarios de Culto',
        'worship-subtitle': 'Te invitamos a acompañarnos en nuestros servicios',
        'schedule-title': 'Nuestro Cronograma',
        'saturday-worship': 'Culto de Adoración',
        'saturday-time': 'Sábados 9:00 AM',
        'sabbath-school': 'Escuela Sabática',
        'sabbath-time': 'Sábados 10:30 AM',
        'youth-meeting': 'Reunión de Jóvenes',
        'youth-time': 'Sábados 5:00 PM',
        'prayer-meeting': 'Reunión de Oración',
        'prayer-time': 'Miércoles 7:00 PM',
        'location-title': 'Nuestra Ubicación',
        'location-subtitle': 'Encuéntranos en el corazón de Magnolia',
        'address': 'Calle Principal #123, Magnolia, Bayamón, PR 00956',
        'phone': 'Teléfono: (787) 123-4567',
        'email': 'Email: info@iasdmagnolia.org',
        'map-google': 'Ver en Google Maps',
        'map-waze': 'Abrir en Waze',
        'map-apple': 'Ver en Apple Maps',
        'contact-title': 'Contáctanos',
        'contact-subtitle': 'Estamos aquí para servirte y responder tus preguntas',
        'name-placeholder': 'Tu nombre completo',
        'email-placeholder': 'Tu correo electrónico',
        'message-placeholder': 'Escribe tu mensaje aquí...',
        'send-message': 'Enviar Mensaje',
        'whatsapp-text': 'Escríbenos por WhatsApp',
        'copyright': '© 2025 - Iglesia Adventista del Séptimo Día Magnolia Bayamón',
        
        // Departamentos - Página de departamentos
        'departments-title': 'Nuestros Departamentos',
        'departments-subtitle': 'Conoce los diferentes ministerios y departamentos de nuestra iglesia',
        'departments-intro': 'En nuestra iglesia, contamos con diversos departamentos y ministerios que trabajan en conjunto para fortalecer nuestra fe y servir a la comunidad. Cada departamento tiene un propósito específico y está dirigido por líderes comprometidos.',
        'departments-contact-text': 'Si tienes interés en participar en algún ministerio o necesitas más información, no dudes en contactar a nuestros coordinadores.',
        'departments-contact-btn': 'Contactar Departamentos',
        
        // Club - Página principal
        'clubs-title': 'Nuestros Clubs',
        'inscription-btn': '📝 Inscripción',
        
        // Aventureros
        'aventureros-title': 'Los Aventureros',
        'aventureros-age': '6 - 9 años',
        'aventureros-description': 'Un programa diseñado para los más pequeños, donde aprenden sobre Jesús a través de juegos, manualidades y actividades al aire libre.',
        'aventureros-feature1': 'Manualidades',
        'aventureros-feature2': 'Música y Cantos',
        'aventureros-feature3': 'Naturaleza',
        
        // Conquistadores
        'conquistadores-title': 'Conquistadores',
        'conquistadores-age': '10 - 15 años',
        'conquistadores-description': 'Programa integral que desarrolla habilidades prácticas, espirituales y sociales a través de especialidades, campamentos y servicio comunitario.',
        'conquistadores-feature1': 'Campamentos',
        'conquistadores-feature2': 'Especialidades',
        'conquistadores-feature3': 'Servicio Comunitario',
        
        // Cadetes
        'cadetes-title': 'Cadetes',
        'cadetes-age': '16 - 21 años',
        'cadetes-description': 'Programa avanzado para jóvenes que buscan desarrollar liderazgo cristiano y prepararse para el servicio en la iglesia y la comunidad.',
        'cadetes-feature1': 'Liderazgo',
        'cadetes-feature2': 'Estudio Avanzado',
        'cadetes-feature3': 'Proyectos Misioneros',
        
        // Horarios
        'schedule': 'Reuniones: Sábados 5:00 PM',
        
        // Información adicional
        'manual-title': 'Manual de Actividades',
        'manual-description': 'Cada club sigue un programa estructurado con actividades diseñadas para el desarrollo integral de nuestros jóvenes en un ambiente cristiano.',
        'leaders-title': 'Líderes Capacitados',
        'leaders-description': 'Nuestros directores y consejeros están certificados y comprometidos con el desarrollo espiritual y personal de cada participante.',
        
        // Modal de inscripción
        'modal-title': 'Inscripción a los Clubs',
        'modal-subtitle': 'Complete el formulario para inscribir a su(s) hijo(s)',
        'parent-info-title': 'Información del Padre/Madre/Tutor',
        'parent-name': 'Nombre Completo',
        'parent-name-placeholder': 'Ingrese su nombre completo',
        'parent-phone': 'Teléfono',
        'parent-phone-placeholder': '(787) 123-4567',
        'parent-email': 'Email',
        'parent-email-placeholder': 'ejemplo@email.com',
        'parent-address': 'Dirección',
        'parent-address-placeholder': 'Dirección completa (opcional)',
        'children-info-title': 'Información de los Hijos',
        'add-child-btn': 'Agregar otro hijo',
        'child-title': 'Hijo/Hija',
        'child-name-label': 'Nombre Completo del Niño/Joven *',
        'child-name-placeholder': 'Nombre completo del niño/joven',
        'child-birthdate-label': 'Fecha de Nacimiento *',
        'child-age-label': 'Edad *',
        'child-age-placeholder': 'Edad',
        'child-club-label': 'Club Deseado *',
        'child-gender-label': 'Género *',
        'child-allergies-label': 'Alergias o Condiciones Médicas',
        'child-allergies-placeholder': 'Describa cualquier alergia o condición médica importante (opcional)',
        
        // Club options
        'select-club-option': 'Seleccionar Club',
        'club-aventureros': '🌟 Los Aventureros (6-9 años)',
        'club-conquistadores': '🏕️ Conquistadores (10-15 años)',
        'club-cadetes': '🎯 Cadetes (16-21 años)',
        
        // Gender options
        'select-gender-option': 'Seleccionar',
        'gender-male': 'Masculino',
        'gender-female': 'Femenino',
        
        // Action buttons
        'remove-child-btn': 'Remover',
        'cancel-btn': 'Cancelar',
        'submit-btn': 'Enviar Inscripción',
        
        // Schedule/Horarios
        'schedule-label': 'Reuniones:',
        'schedule': 'Sábados 5:00 PM',
        
        // Footer
        'footer-location': 'UBICACIÓN',
        'footer-google-maps': 'Ver en Google Maps',
        'footer-waze': 'Navegar con Waze',
        'footer-apple-maps': 'Abrir en Apple Maps',
        'footer-map-info': 'Para direcciones específicas o si necesitas ayuda para llegar, contáctanos por WhatsApp.',
        'footer-follow': 'SÍGUENOS',
        'footer-contact': 'CONTÁCTANOS',
        'footer-contact-message': 'Envíanos un mensaje y nos pondremos en contacto contigo lo antes posible.',
        'footer-whatsapp': 'Contáctanos vía WhatsApp',
        'footer-schedule-title': 'Horario de Atención',
        'footer-schedule-hours': 'Lunes - Viernes: 9:00 AM - 5:00 PM',
        'footer-copyright': '© 2025 - Iglesia Adventista del Séptimo Día Magnolia Bayamón',
        
        // Botón de idioma
        'language-btn': 'EN'
    },
    
    en: {
        // Navigation
        'nav-about': 'About Us',
        'nav-departments': 'Departments',
        'nav-club': 'Club',
        
        // Header
        'church-title': 'SEVENTH-DAY ADVENTIST CHURCH',
        'church-subtitle': 'MAGNOLIA BAYAMÓN',
        
        // Index - Main page
        'verse-title': 'Verse of the Day',
        'verse-text': 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
        'verse-reference': 'John 3:16',
        'about-title': 'About Us',
        'church-card-title': 'OUR CHURCH',
        'church-card-text': 'We are a faith community committed to the message of hope and salvation in Jesus Christ. From our home in Magnolia, Bayamón, we serve local families by sharing God\'s love through worship, Bible study and community service. We believe in the imminent second coming of Christ and live each day preparing for that glorious encounter.',
        'purpose-card-title': 'OUR PURPOSE',
        'purpose-card-text': 'To preach the everlasting gospel to every nation, tribe, tongue and people, proclaiming the message of salvation and hope in Christ\'s second coming. Our mission is to make disciples, strengthen faith and serve our community with love.',
        'worship-title': 'Worship Schedule',
        'worship-subtitle': 'We invite you to join us in our services',
        'schedule-title': 'Our Schedule',
        'saturday-worship': 'Worship Service',
        'saturday-time': 'Saturdays 9:00 AM',
        'sabbath-school': 'Sabbath School',
        'sabbath-time': 'Saturdays 10:30 AM',
        'youth-meeting': 'Youth Meeting',
        'youth-time': 'Saturdays 5:00 PM',
        'prayer-meeting': 'Prayer Meeting',
        'prayer-time': 'Wednesdays 7:00 PM',
        'location-title': 'Our Location',
        'location-subtitle': 'Find us in the heart of Magnolia',
        'address': 'Main Street #123, Magnolia, Bayamón, PR 00956',
        'phone': 'Phone: (787) 123-4567',
        'email': 'Email: info@iasdmagnolia.org',
        'map-google': 'View on Google Maps',
        'map-waze': 'Open in Waze',
        'map-apple': 'View on Apple Maps',
        'contact-title': 'Contact Us',
        'contact-subtitle': 'We are here to serve you and answer your questions',
        'name-placeholder': 'Your full name',
        'email-placeholder': 'Your email address',
        'message-placeholder': 'Write your message here...',
        'send-message': 'Send Message',
        'whatsapp-text': 'Text us on WhatsApp',
        'copyright': '© 2025 - Seventh-day Adventist Church Magnolia Bayamón',
        
        // Departments - Departments page
        'departments-title': 'Our Departments',
        'departments-subtitle': 'Learn about the different ministries and departments of our church',
        'departments-intro': 'In our church, we have various departments and ministries that work together to strengthen our faith and serve the community. Each department has a specific purpose and is led by committed leaders.',
        'departments-contact-text': 'If you are interested in participating in any ministry or need more information, do not hesitate to contact our coordinators.',
        'departments-contact-btn': 'Contact Departments',
        
        // Club - Main page
        'clubs-title': 'Our Clubs',
        'inscription-btn': '📝 Registration',
        
        // Pathfinders (Aventureros)
        'aventureros-title': 'The Adventurers',
        'aventureros-age': '6 - 9 years',
        'aventureros-description': 'A program designed for the little ones, where they learn about Jesus through games, crafts and outdoor activities.',
        'aventureros-feature1': 'Crafts',
        'aventureros-feature2': 'Music and Songs',
        'aventureros-feature3': 'Nature',
        
        // Pathfinders
        'conquistadores-title': 'Pathfinders',
        'conquistadores-age': '10 - 15 years',
        'conquistadores-description': 'Comprehensive program that develops practical, spiritual and social skills through honors, camping and community service.',
        'conquistadores-feature1': 'Camping',
        'conquistadores-feature2': 'Honors',
        'conquistadores-feature3': 'Community Service',
        
        // Ambassadors (Cadetes)
        'cadetes-title': 'Ambassadors',
        'cadetes-age': '16 - 21 years',
        'cadetes-description': 'Advanced program for young people seeking to develop Christian leadership and prepare for service in the church and community.',
        'cadetes-feature1': 'Leadership',
        'cadetes-feature2': 'Advanced Study',
        'cadetes-feature3': 'Mission Projects',
        
        // Schedule
        'schedule': 'Meetings: Saturdays 5:00 PM',
        
        // Additional information
        'manual-title': 'Activity Manual',
        'manual-description': 'Each club follows a structured program with activities designed for the integral development of our youth in a Christian environment.',
        'leaders-title': 'Trained Leaders',
        'leaders-description': 'Our directors and counselors are certified and committed to the spiritual and personal development of each participant.',
        
        // Registration modal
        'modal-title': 'Club Registration',
        'modal-subtitle': 'Complete the form to register your child(ren)',
        'parent-info-title': 'Parent/Guardian Information',
        'parent-name': 'Full Name',
        'parent-name-placeholder': 'Enter your full name',
        'parent-phone': 'Phone',
        'parent-phone-placeholder': '(787) 123-4567',
        'parent-email': 'Email',
        'parent-email-placeholder': 'example@email.com',
        'parent-address': 'Address',
        'parent-address-placeholder': 'Complete address (optional)',
        'children-info-title': 'Children Information',
        'add-child-btn': 'Add another child',
        'child-title': 'Child',
        'child-name-label': 'Child/Youth Full Name *',
        'child-name-placeholder': 'Child/youth full name',
        'child-birthdate-label': 'Date of Birth *',
        'child-age-label': 'Age *',
        'child-age-placeholder': 'Age',
        'child-club-label': 'Desired Club *',
        'child-gender-label': 'Gender *',
        'child-allergies-label': 'Allergies or Medical Conditions',
        'child-allergies-placeholder': 'Describe any important allergies or medical conditions (optional)',
        
        // Club options
        'select-club-option': 'Select Club',
        'club-aventureros': '🌟 The Adventurers (6-9 years)',
        'club-conquistadores': '🏕️ Pathfinders (10-15 years)',
        'club-cadetes': '🎯 Ambassadors (16-21 years)',
        
        // Gender options
        'select-gender-option': 'Select',
        'gender-male': 'Male',
        'gender-female': 'Female',
        
        // Action buttons
        'remove-child-btn': 'Remove',
        'cancel-btn': 'Cancel',
        'submit-btn': 'Submit Registration',
        
        // Schedule/Horarios
        'schedule-label': 'Meetings:',
        'schedule': 'Saturdays 5:00 PM',
        
        // Footer
        'footer-location': 'LOCATION',
        'footer-google-maps': 'View on Google Maps',
        'footer-waze': 'Navigate with Waze',
        'footer-apple-maps': 'Open in Apple Maps',
        'footer-map-info': 'For specific directions or if you need help getting here, contact us via WhatsApp.',
        'footer-follow': 'FOLLOW US',
        'footer-contact': 'CONTACT US',
        'footer-contact-message': 'Send us a message and we will get in touch with you as soon as possible.',
        'footer-whatsapp': 'Contact us via WhatsApp',
        'footer-schedule-title': 'Office Hours',
        'footer-schedule-hours': 'Monday - Friday: 9:00 AM - 5:00 PM',
        'footer-copyright': '© 2025 - Seventh-day Adventist Church Magnolia Bayamón',
        
        // Language button
        'language-btn': 'ES'
    }
};

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'es';
        this.init();
    }
    
    init() {
        this.createLanguageButton();
        this.applyTranslations();
        this.updateLanguageButton();
    }
    
    createLanguageButton() {
        // Buscar si ya existe el botón
        let existingBtn = document.getElementById('language-toggle');
        if (existingBtn) return;
        
        // Crear el botón de idioma
        const languageBtn = document.createElement('button');
        languageBtn.id = 'language-toggle';
        languageBtn.className = 'language-toggle';
        languageBtn.setAttribute('aria-label', 'Cambiar idioma');
        
        // Insertar el botón en la esquina superior derecha
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'language-container';
        buttonContainer.appendChild(languageBtn);
        
        // Agregar al body para posicionamiento fijo
        document.body.appendChild(buttonContainer);
        
        // Agregar event listener
        languageBtn.addEventListener('click', () => this.toggleLanguage());
    }
    
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
        localStorage.setItem('language', this.currentLanguage);
        this.applyTranslations();
        this.updateLanguageButton();
        
        // Disparar evento personalizado para que otros componentes se actualicen
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
        
        // Aplicar traducciones al modal si está abierto
        const modal = document.querySelector('.inscription-modal.active');
        if (modal) {
            this.applyTranslations(modal);
        }
    }
    
    updateLanguageButton() {
        const btn = document.getElementById('language-toggle');
        if (btn) {
            btn.textContent = translations[this.currentLanguage]['language-btn'];
        }
    }
    
    applyTranslations(container = document) {
        const currentTranslations = translations[this.currentLanguage];
        
        // Traducir elementos por data-translate
        container.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            }
        });
        
        // Traducir placeholders
        container.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (currentTranslations[key]) {
                element.placeholder = currentTranslations[key];
            }
        });
        
        // Traducir títulos (title attribute)
        container.querySelectorAll('[data-translate-title]').forEach(element => {
            const key = element.getAttribute('data-translate-title');
            if (currentTranslations[key]) {
                element.title = currentTranslations[key];
            }
        });
        
        // Traducir alt texts
        container.querySelectorAll('[data-translate-alt]').forEach(element => {
            const key = element.getAttribute('data-translate-alt');
            if (currentTranslations[key]) {
                element.alt = currentTranslations[key];
            }
        });
        
        // Solo aplicar traducciones por ID si estamos trabajando con el documento completo
        if (container === document) {
            // Traducir elementos por ID específicos (para compatibilidad con el código existente)
            Object.keys(currentTranslations).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.textContent = currentTranslations[key];
                }
            });
            
            // Actualizar el título de la página según el idioma
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (this.currentLanguage === 'en') {
                if (currentPage.includes('club')) {
                    document.title = 'Club - Seventh-day Adventist Church Magnolia';
                } else if (currentPage.includes('departamentos')) {
                    document.title = 'Departments - Seventh-day Adventist Church Magnolia';
                } else {
                    document.title = 'Seventh-day Adventist Church Magnolia';
                }
            } else {
                if (currentPage.includes('club')) {
                    document.title = 'Club - Iglesia Adventista del Séptimo Día Magnolia';
                } else if (currentPage.includes('departamentos')) {
                    document.title = 'Departamentos - Iglesia Adventista del Séptimo Día Magnolia';
                } else {
                    document.title = 'Iglesia Adventista del Séptimo Día Magnolia';
                }
            }
            
            // Actualizar el atributo lang del documento
            document.documentElement.lang = this.currentLanguage;
        }
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getCurrentTranslations() {
        return translations[this.currentLanguage];
    }
}

// Inicializar el sistema de traducción cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.languageManager = new LanguageManager();
});

// CSS para el botón de idioma en la esquina
const languageCSS = `
.language-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    align-items: center;
}

.language-toggle {
    background: #2c2c2c;
    color: white;
    border: 2px solid #2c2c2c;
    border-radius: 25px;
    padding: 8px 16px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: var(--font-primary, 'Montserrat', sans-serif);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 45px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.language-toggle:hover {
    background: white;
    color: #2c2c2c;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
    .language-container {
        top: 15px;
        right: 15px;
    }
    
    .language-toggle {
        padding: 6px 12px;
        font-size: 0.75rem;
        min-width: 40px;
    }
}
`;

// Agregar los estilos CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = languageCSS;
document.head.appendChild(styleSheet);