// club-interactive.js
// Sistema interactivo para los clubs juveniles

class ClubInteractive {
    constructor() {
        this.clubs = {
            'aventureros': {
                title: 'Los Aventureros',
                description: 'Club para niños de 6 a 9 años que aprenden sobre Jesús a través de actividades divertidas y educativas.',
                activities: [
                    'Historias bíblicas interactivas',
                    'Manualidades creativas',
                    'Juegos al aire libre',
                    'Canciones y música',
                    'Exploración de la naturaleza',
                    'Actividades de servicio'
                ],
                schedule: 'Sábados 3:00 PM',
                leader: 'Directora: Hna. María González',
                requirements: [
                    'Edad: 6 a 9 años',
                    'Autorización de padres',
                    'Participación en actividades',
                    'Manual de Aventureros'
                ]
            },
            'conquistadores': {
                title: 'Conquistadores',
                description: 'Programa integral para jóvenes de 10 a 15 años que desarrolla habilidades espirituales, físicas y sociales.',
                activities: [
                    'Especialidades y honores',
                    'Campamentos y caminatas',
                    'Servicio comunitario',
                    'Deportes y recreación',
                    'Estudio de la naturaleza',
                    'Desarrollo de liderazgo'
                ],
                schedule: 'Sábados 4:00 PM',
                leader: 'Director: Hno. Carlos Rodríguez',
                requirements: [
                    'Edad: 10 a 15 años',
                    'Compromiso de participación',
                    'Uniforme reglamentario',
                    'Manual del Conquistador'
                ]
            },
            'cadetes': {
                title: 'Cadetes',
                description: 'Programa avanzado para jóvenes de 16 a 21 años enfocado en liderazgo cristiano y servicio.',
                activities: [
                    'Liderazgo y mentoría',
                    'Proyectos misioneros',
                    'Estudio bíblico avanzado',
                    'Capacitación ministerial',
                    'Servicio en la iglesia',
                    'Desarrollo profesional'
                ],
                schedule: 'Domingos 5:00 PM',
                leader: 'Director: Hno. David Martínez',
                requirements: [
                    'Edad: 16 a 21 años',
                    'Compromiso de servicio',
                    'Participación activa',
                    'Manual de Cadetes'
                ]
            }
        };
        
        this.modal = null;
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // Inicializar todo
    init() {
        console.log('🎯 Inicializando Club Interactive...');
        this.initializeModal();
        this.attachEventListeners();
        console.log('✅ Club Interactive inicializado correctamente');
    }

    // Crear modal dinámicamente
    initializeModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'club-modal';
        this.modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close" aria-label="Cerrar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                    <div class="modal-body">
                        <div class="club-modal-header">
                            <div class="club-modal-icon"></div>
                            <h2 class="club-modal-title"></h2>
                        </div>
                        <div class="club-modal-content">
                            <p class="club-modal-description"></p>
                            
                            <div class="club-section">
                                <h3>Actividades Principales</h3>
                                <ul class="club-activities"></ul>
                            </div>
                            
                            <div class="club-details">
                                <div class="club-detail-item">
                                    <span class="detail-label">Horario:</span>
                                    <span class="club-schedule-text"></span>
                                </div>
                                <div class="club-detail-item">
                                    <span class="detail-label">Liderazgo:</span>
                                    <span class="club-leader-text"></span>
                                </div>
                            </div>
                            
                            <div class="club-section">
                                <h3>Requisitos</h3>
                                <ul class="club-requirements"></ul>
                            </div>
                            
                            <div class="club-actions">
                                <a href="index.html#contacto" class="btn-join">Únete Ahora</a>
                                <button class="btn-info">Más Información</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregar estilos
        this.addModalStyles();
        
        // Agregar al body
        document.body.appendChild(this.modal);
        
        // Event listeners del modal
        this.modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        this.modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        console.log('📋 Modal de clubs creado correctamente');
    }

    // Agregar estilos CSS para el modal
    addModalStyles() {
        // Verificar si ya existen los estilos
        if (document.getElementById('club-modal-styles')) {
            return;
        }

        const styles = `
            <style id="club-modal-styles">
                .club-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 10000;
                }
                
                .club-modal.active {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                }
                
                .club-modal .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                }
                
                .club-modal .modal-content {
                    position: relative;
                    background: white;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 700px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
                    animation: clubModalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                @keyframes clubModalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .club-modal .modal-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .club-modal .modal-close:hover {
                    background: rgba(0, 0, 0, 0.9);
                    transform: scale(1.1) rotate(90deg);
                }
                
                .club-modal .modal-close svg {
                    width: 20px;
                    height: 20px;
                    color: white;
                }
                
                .club-modal-header {
                    text-align: center;
                    padding: 40px 40px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 20px 20px 0 0;
                }
                
                .club-modal-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                }
                
                .club-modal-title {
                    font-size: 2.2rem;
                    font-weight: 700;
                    margin: 0;
                    font-family: 'Montserrat', sans-serif;
                }
                
                .club-modal-content {
                    padding: 40px;
                }
                
                .club-modal-description {
                    font-size: 1.1rem;
                    color: #6c757d;
                    line-height: 1.7;
                    margin-bottom: 30px;
                    text-align: center;
                }
                
                .club-section {
                    margin-bottom: 30px;
                }
                
                .club-section h3 {
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 15px;
                    font-family: 'Montserrat', sans-serif;
                }
                
                .club-activities, .club-requirements {
                    list-style: none;
                    padding: 0;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 10px;
                }
                
                .club-activities li, .club-requirements li {
                    background: #f8f9fa;
                    padding: 12px 16px;
                    border-radius: 8px;
                    border-left: 4px solid #667eea;
                    font-size: 0.95rem;
                    color: #495057;
                    transition: all 0.3s ease;
                }
                
                .club-activities li:hover, .club-requirements li:hover {
                    background: #e9ecef;
                    transform: translateX(5px);
                }
                
                .club-details {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                }
                
                .club-detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .club-detail-item:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }
                
                .detail-label {
                    font-weight: 600;
                    color: #495057;
                }
                
                .club-schedule-text, .club-leader-text {
                    color: #6c757d;
                    font-weight: 500;
                }
                
                .club-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 30px;
                }
                
                .btn-join, .btn-info {
                    padding: 12px 25px;
                    border-radius: 25px;
                    font-weight: 600;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                }
                
                .btn-join {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .btn-join:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                }
                
                .btn-info {
                    background: #f8f9fa;
                    color: #495057;
                    border: 2px solid #dee2e6;
                }
                
                .btn-info:hover {
                    background: #e9ecef;
                    border-color: #adb5bd;
                }
                
                /* Colores específicos por club */
                .club-modal.aventureros .club-modal-header {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }
                
                .club-modal.aventureros .club-activities li {
                    border-left-color: #f5576c;
                }
                
                .club-modal.aventureros .btn-join {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }
                
                .club-modal.conquistadores .club-modal-header {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }
                
                .club-modal.conquistadores .club-activities li {
                    border-left-color: #00f2fe;
                }
                
                .club-modal.conquistadores .btn-join {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }
                
                .club-modal.cadetes .club-modal-header {
                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                }
                
                .club-modal.cadetes .club-activities li {
                    border-left-color: #38f9d7;
                }
                
                .club-modal.cadetes .btn-join {
                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .club-modal .modal-content {
                        max-width: 95vw;
                        max-height: 95vh;
                    }
                    
                    .club-modal-header {
                        padding: 30px 30px 20px;
                    }
                    
                    .club-modal-title {
                        font-size: 1.8rem;
                    }
                    
                    .club-modal-content {
                        padding: 30px;
                    }
                    
                    .club-activities, .club-requirements {
                        grid-template-columns: 1fr;
                    }
                    
                    .club-actions {
                        flex-direction: column;
                    }
                    
                    .club-detail-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 5px;
                    }
                }
                
                @media (max-width: 480px) {
                    .club-modal-header {
                        padding: 25px 20px 15px;
                    }
                    
                    .club-modal-title {
                        font-size: 1.5rem;
                    }
                    
                    .club-modal-content {
                        padding: 20px;
                    }
                    
                    .club-modal-icon {
                        width: 60px;
                        height: 60px;
                        margin-bottom: 15px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Agregar event listeners
    attachEventListeners() {
        const clubCards = document.querySelectorAll('.club-card');
        
        clubCards.forEach(card => {
            const clubType = card.getAttribute('data-club');
            
            if (clubType && this.clubs[clubType]) {
                // Agregar efectos hover
                card.style.cursor = 'pointer';
                
                // Click event
                card.addEventListener('click', () => {
                    this.showClubModal(clubType);
                });
                
                console.log(`✅ Club "${clubType}" configurado correctamente`);
            } else {
                console.warn(`⚠️ No se encontró configuración para el club: ${clubType}`);
            }
        });
    }

    // Mostrar modal del club
    showClubModal(clubType) {
        const clubData = this.clubs[clubType];
        
        if (!clubData) {
            console.error(`❌ No se encontró información para el club: ${clubType}`);
            return;
        }

        // Actualizar contenido del modal
        this.modal.querySelector('.club-modal-title').textContent = clubData.title;
        this.modal.querySelector('.club-modal-description').textContent = clubData.description;
        this.modal.querySelector('.club-schedule-text').textContent = clubData.schedule;
        this.modal.querySelector('.club-leader-text').textContent = clubData.leader;
        
        // Limpiar y llenar actividades
        const activitiesList = this.modal.querySelector('.club-activities');
        activitiesList.innerHTML = '';
        clubData.activities.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = activity;
            activitiesList.appendChild(li);
        });
        
        // Limpiar y llenar requisitos
        const requirementsList = this.modal.querySelector('.club-requirements');
        requirementsList.innerHTML = '';
        clubData.requirements.forEach(requirement => {
            const li = document.createElement('li');
            li.textContent = requirement;
            requirementsList.appendChild(li);
        });
        
        // Agregar clase específica del club para estilos
        this.modal.className = `club-modal ${clubType}`;
        
        // Mostrar modal
        this.openModal();
        
        console.log(`📋 Mostrando información del club: ${clubData.title}`);
    }

    // Abrir modal
    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Cerrar modal
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Mostrar más información (redireccionar a contacto)
    showMoreInfo() {
        this.closeModal();
        // Scroll suave a la sección de contacto
        setTimeout(() => {
            window.location.href = 'index.html#contacto';
        }, 300);
    }
}

// Inicializar cuando el documento esté listo
console.log('🔄 Cargando Club Interactive...');
window.clubInteractive = new ClubInteractive();