// worship-days-interactive.js
// Sistema interactivo para mostrar GIFs al hacer clic en los días de culto

class WorshipDaysInteractive {
    constructor() {
        // Mapeo de días y sus GIFs correspondientes
        this.dayGifs = {
            'LUN': {
                gif: 'assets/images/Gif/HB.gif',
                title: 'Noche de Oración y Salud Emocional',
                description: 'Únete a nosotros para orar y cuidar nuestra salud emocional'
            },
            'MIÉ': {
                gif: 'assets/images/Gif/HB.gif',
                title: 'Noche de Testimonios e Intercesión',
                description: 'Compartamos testimonios y oremos los unos por los otros'
            },
            'VIE': {
                gif: 'assets/images/Gif/HB.gif',
                title: 'Sociedad de Jóvenes',
                description: 'Actividades especiales para nuestros jóvenes adventistas'
            },
            'SÁB': {
                gif: 'assets/images/Gif/HB.gif',
                title: 'Escuela Sabática y Culto Divino',
                description: 'Estudio bíblico y adoración en el día del Señor'
            }
        };
        
        this.modal = null;
        this.initializeModal();
        this.attachEventListeners();
    }

    // Crear el modal dinámicamente
    initializeModal() {
        // Crear estructura del modal
        this.modal = document.createElement('div');
        this.modal.className = 'worship-modal';
        this.modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close" aria-label="Cerrar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                    <div class="modal-body">
                        <div class="gif-container">
                            <img class="worship-gif" src="" alt="GIF del día de culto">
                        </div>
                        <div class="worship-info">
                            <h3 class="worship-title"></h3>
                            <p class="worship-description"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar estilos CSS
        this.addModalStyles();
        
        // Agregar al body
        document.body.appendChild(this.modal);
        
        // Event listener para cerrar modal
        this.modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        this.modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    // Agregar estilos CSS para el modal
    addModalStyles() {
        const styles = `
            <style id="worship-modal-styles">
                .worship-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 10000;
                }
                
                .worship-modal.active {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                }
                
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                }
                
                .modal-content {
                    position: relative;
                    background: white;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
                    animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    margin: auto;
                }
                
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.7) translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(0, 0, 0, 0.8);
                    border: none;
                    border-radius: 50%;
                    width: 45px;
                    height: 45px;
                    cursor: pointer;
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .modal-close:hover {
                    background: rgba(0, 0, 0, 0.9);
                    transform: scale(1.1) rotate(90deg);
                }
                
                .modal-close svg {
                    width: 22px;
                    height: 22px;
                    color: white;
                }
                
                .modal-body {
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                }
                
                .gif-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1;
                    overflow: hidden;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .worship-gif {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center;
                    border-radius: 0;
                }
                
                .worship-info {
                    padding: 30px;
                    text-align: center;
                    background: white;
                }
                
                .worship-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #2c3e50;
                    margin-bottom: 15px;
                    line-height: 1.3;
                    font-family: 'Montserrat', sans-serif;
                }
                
                .worship-description {
                    font-size: 1.1rem;
                    color: #6c757d;
                    line-height: 1.6;
                    margin: 0;
                    font-family: 'Open Sans', sans-serif;
                }
                
                /* Tablet */
                @media (max-width: 768px) {
                    .worship-modal.active {
                        padding: 15px;
                    }
                    
                    .modal-overlay {
                        padding: 15px;
                    }
                    
                    .modal-content {
                        max-width: 500px;
                        max-height: 85vh;
                    }
                    
                    .modal-close {
                        width: 40px;
                        height: 40px;
                        top: 12px;
                        right: 12px;
                    }
                    
                    .modal-close svg {
                        width: 20px;
                        height: 20px;
                    }
                    
                    .worship-info {
                        padding: 25px;
                    }
                    
                    .worship-title {
                        font-size: 1.5rem;
                    }
                    
                    .worship-description {
                        font-size: 1rem;
                    }
                }
                
                /* Móvil */
                @media (max-width: 480px) {
                    .worship-modal.active {
                        padding: 10px;
                    }
                    
                    .modal-overlay {
                        padding: 10px;
                    }
                    
                    .modal-content {
                        max-width: 95vw;
                        max-height: 80vh;
                        border-radius: 15px;
                    }
                    
                    .modal-close {
                        width: 35px;
                        height: 35px;
                        top: 10px;
                        right: 10px;
                    }
                    
                    .modal-close svg {
                        width: 18px;
                        height: 18px;
                    }
                    
                    .worship-info {
                        padding: 20px;
                    }
                    
                    .worship-title {
                        font-size: 1.3rem;
                        margin-bottom: 12px;
                    }
                    
                    .worship-description {
                        font-size: 0.95rem;
                        line-height: 1.5;
                    }
                }
                
                /* Móvil pequeño */
                @media (max-width: 360px) {
                    .worship-modal.active {
                        padding: 8px;
                    }
                    
                    .modal-overlay {
                        padding: 8px;
                    }
                    
                    .modal-content {
                        border-radius: 12px;
                    }
                    
                    .worship-info {
                        padding: 15px;
                    }
                    
                    .worship-title {
                        font-size: 1.2rem;
                    }
                    
                    .worship-description {
                        font-size: 0.9rem;
                    }
                }
                
                /* Landscape móvil */
                @media (max-height: 500px) and (orientation: landscape) {
                    .modal-content {
                        max-height: 95vh;
                        flex-direction: row;
                        max-width: 90vw;
                    }
                    
                    .gif-container {
                        width: 50%;
                        aspect-ratio: 1;
                    }
                    
                    .worship-info {
                        width: 50%;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    
                    .worship-title {
                        font-size: 1.4rem;
                    }
                    
                    .worship-description {
                        font-size: 0.95rem;
                    }
                }
                
                /* Mejoras adicionales */
                .gif-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%);
                    pointer-events: none;
                    z-index: 1;
                }
                
                .worship-gif {
                    position: relative;
                    z-index: 2;
                }
                
                /* Loading state */
                .gif-container.loading {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                .gif-container.loading::after {
                    content: '⏳ Cargando...';
                    position: absolute;
                    color: white;
                    font-weight: 600;
                    font-size: 1.1rem;
                    z-index: 3;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Agregar event listeners a las tarjetas de días
    attachEventListeners() {
        // Esperar a que el DOM esté completamente cargado
        document.addEventListener('DOMContentLoaded', () => {
            const worshipCards = document.querySelectorAll('.worship-card');
            console.log(`🔍 Encontradas ${worshipCards.length} tarjetas de culto`);
            
            worshipCards.forEach((card, index) => {
                // Obtener el día desde el elemento .day dentro de la tarjeta
                const dayElement = card.querySelector('.day');
                if (dayElement) {
                    const day = dayElement.textContent.trim();
                    console.log(`📅 Tarjeta ${index + 1}: Día detectado = "${day}"`);
                    
                    // Verificar si existe configuración para este día
                    if (this.dayGifs[day]) {
                        console.log(`✅ Configuración encontrada para "${day}": ${this.dayGifs[day].gif}`);
                    } else {
                        console.warn(`❌ No hay configuración para "${day}"`);
                        console.log('Días disponibles:', Object.keys(this.dayGifs));
                    }
                    
                    // Agregar cursor pointer para indicar que es clickeable
                    card.style.cursor = 'pointer';
                    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                    
                    // Efectos hover
                    card.addEventListener('mouseenter', () => {
                        card.style.transform = 'translateY(-5px)';
                        card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        card.style.transform = 'translateY(0)';
                        card.style.boxShadow = '';
                    });
                    
                    // Click event
                    card.addEventListener('click', () => {
                        console.log(`🖱️ Click en tarjeta: "${day}"`);
                        this.showDayGif(day);
                    });
                }
            });
        });
    }

    // Mostrar el GIF del día seleccionado
    showDayGif(day) {
        const dayData = this.dayGifs[day];
        
        if (dayData) {
            // Actualizar contenido del modal
            const gif = this.modal.querySelector('.worship-gif');
            const gifContainer = this.modal.querySelector('.gif-container');
            const title = this.modal.querySelector('.worship-title');
            const description = this.modal.querySelector('.worship-description');
            
            // Mostrar estado de carga
            gifContainer.classList.add('loading');
            
            // Configurar el GIF
            gif.style.opacity = '0';
            gif.src = dayData.gif;
            gif.alt = `GIF de ${dayData.title}`;
            
            // Cuando el GIF se carga
            gif.onload = () => {
                gifContainer.classList.remove('loading');
                gif.style.transition = 'opacity 0.3s ease';
                gif.style.opacity = '1';
            };
            
            // Si hay error cargando el GIF
            gif.onerror = () => {
                gifContainer.classList.remove('loading');
                gifContainer.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #6c757d;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <p style="margin: 10px 0 0 0; font-size: 0.9rem;">No se pudo cargar el GIF</p>
                    </div>
                `;
            };
            
            title.textContent = dayData.title;
            description.textContent = dayData.description;
            
            // Mostrar modal
            this.openModal();
            
            // Log para debugging
            console.log(`📅 Mostrando GIF para ${day}: ${dayData.gif}`);
        } else {
            console.warn(`⚠️ No se encontró configuración para el día: ${day}`);
        }
    }

    // Abrir modal
    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    // Cerrar modal
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll del body
    }

    // Método para actualizar los GIFs dinámicamente
    updateDayGif(day, gifPath, title, description) {
        if (this.dayGifs[day]) {
            this.dayGifs[day] = {
                gif: gifPath,
                title: title || this.dayGifs[day].title,
                description: description || this.dayGifs[day].description
            };
            console.log(`✅ GIF actualizado para ${day}: ${gifPath}`);
        }
    }
}

// Inicializar cuando el documento esté listo
const worshipInteractive = new WorshipDaysInteractive();

// Hacer disponible globalmente para debugging
window.worshipInteractive = worshipInteractive;