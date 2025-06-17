// /assets/js/components/club/club-interactive.js
// Sistema interactivo para los clubs juveniles con templates separados

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
                schedule: 'Sábados 5:00 PM',
                leader: 'Directora: XXXXXXXXXXXXXXXXXXXXX',
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
                schedule: 'Sábados 5:00 PM',
                leader: 'Director: XXXXXXXXXXXXXXXXXXXX',
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
                schedule: 'Sábados 5:00 PM',
                leader: 'Director: XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                requirements: [
                    'Edad: 16 a 21 años',
                    'Compromiso de servicio',
                    'Participación activa',
                    'Manual de Cadetes'
                ]
            }
        };
        
        this.modal = null;
        this.templates = new Map();
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log('🎯 Inicializando Club Interactive...');
        await this.loadTemplates();
        this.initializeModal();
        this.attachEventListeners();
        console.log('✅ Club Interactive inicializado correctamente');
    }

    async loadTemplates() {
        try {
            // RUTA CORREGIDA según tu estructura
            const response = await fetch('/assets/template/components/club/club-interative/club-interative.html');
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
                
                console.log('📄 Templates del club interactive cargados correctamente');
                console.log('📊 Templates encontrados:', Array.from(this.templates.keys()));
            } else {
                console.warn('⚠️ No se pudo cargar el template del club interactive, usando fallback');
                this.useFallbackTemplates();
            }
        } catch (error) {
            console.error('❌ Error cargando templates del club interactive:', error);
            this.useFallbackTemplates();
        }
    }

    useFallbackTemplates() {
        // Templates de respaldo SIMPLIFICADOS
        console.log('🔄 Usando templates de respaldo...');
        
        this.templates.set('club-modal-template', `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close" aria-label="Cerrar">×</button>
                    <div class="modal-body">{{header}}{{content}}</div>
                </div>
            </div>
        `);

        this.templates.set('club-modal-header-template', `
            <div class="club-modal-header">
                <div class="club-modal-icon"></div>
                <h2 class="club-modal-title">{{title}}</h2>
            </div>
        `);

        this.templates.set('club-modal-content-template', `
            <div class="club-modal-content">
                <p class="club-modal-description">{{description}}</p>
                <div class="club-section">
                    <h3>Actividades Principales</h3>
                    <ul class="club-activities">{{activities}}</ul>
                </div>
                <div class="club-details">
                    <div class="club-detail-item">
                        <span class="detail-label">Horario:</span>
                        <span class="club-schedule-text">{{schedule}}</span>
                    </div>
                    <div class="club-detail-item">
                        <span class="detail-label">Liderazgo:</span>
                        <span class="club-leader-text">{{leader}}</span>
                    </div>
                </div>
                <div class="club-section">
                    <h3>Requisitos</h3>
                    <ul class="club-requirements">{{requirements}}</ul>
                </div>
                <div class="club-actions">
                    <button class="btn-join" id="btn-join-club">Únete Ahora</button>
                </div>
            </div>
        `);

        this.templates.set('club-activity-item-template', '<li>{{activity}}</li>');
        this.templates.set('club-requirement-item-template', '<li>{{requirement}}</li>');

        console.log('📄 Templates fallback del club interactive cargados');
    }

    replaceTemplate(template, replacements) {
        let result = template;
        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, value);
        }
        return result;
    }

    buildActivitiesList(activities) {
        if (!this.templates.has('club-activity-item-template')) {
            return activities.map(activity => `<li>${activity}</li>`).join('');
        }

        const itemTemplate = this.templates.get('club-activity-item-template');
        return activities.map(activity => 
            this.replaceTemplate(itemTemplate, { activity })
        ).join('');
    }

    buildRequirementsList(requirements) {
        if (!this.templates.has('club-requirement-item-template')) {
            return requirements.map(requirement => `<li>${requirement}</li>`).join('');
        }

        const itemTemplate = this.templates.get('club-requirement-item-template');
        return requirements.map(requirement => 
            this.replaceTemplate(itemTemplate, { requirement })
        ).join('');
    }

    buildModalContent(clubData) {
        // Construir header
        const headerTemplate = this.templates.get('club-modal-header-template') || 
            '<div class="club-modal-header"><div class="club-modal-icon"></div><h2 class="club-modal-title">{{title}}</h2></div>';
        
        const header = this.replaceTemplate(headerTemplate, {
            title: clubData.title
        });

        // Construir actividades y requisitos
        const activities = this.buildActivitiesList(clubData.activities);
        const requirements = this.buildRequirementsList(clubData.requirements);

        // Construir contenido
        const contentTemplate = this.templates.get('club-modal-content-template') || '';
        const content = this.replaceTemplate(contentTemplate, {
            description: clubData.description,
            activities: activities,
            schedule: clubData.schedule,
            leader: clubData.leader,
            requirements: requirements
        });

        return { header, content };
    }

    initializeModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'club-modal';
        
        if (!this.templates.has('club-modal-template')) {
            console.error('❌ Template principal del modal club no encontrado');
            return;
        }

        // Crear modal básico sin contenido específico
        const modalTemplate = this.templates.get('club-modal-template');
        this.modal.innerHTML = this.replaceTemplate(modalTemplate, {
            header: '<div class="club-modal-header"><div class="club-modal-icon"></div><h2 class="club-modal-title"></h2></div>',
            content: '<div class="club-modal-content"></div>'
        });

        // Agregar al body
        document.body.appendChild(this.modal);
        
        // Event listeners del modal
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        const overlay = this.modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.closeModal();
                }
            });
        }
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        console.log('📋 Modal de clubs creado correctamente');
    }

    openInscriptionModal() {
        console.log('🚀 Abriendo modal de inscripción desde club...');
        
        // Cerrar el modal actual del club
        this.closeModal();
        
        // Esperar un poco para que se cierre el modal actual
        setTimeout(() => {
            // Verificar si existe el modal de inscripción
            if (window.inscriptionModal) {
                window.inscriptionModal.openModal();
                console.log('✅ Modal de inscripción abierto desde club');
            } else {
                console.error('❌ No se encontró el modal de inscripción');
                // Fallback: intentar hacer clic en el botón de inscripción principal
                const inscriptionBtn = document.getElementById('open-inscription');
                if (inscriptionBtn) {
                    inscriptionBtn.click();
                    console.log('🔄 Usando botón de inscripción principal como fallback');
                } else {
                    // Último fallback: mostrar alerta
                    if (window.notifications) {
                        window.notifications.info(
                            'Formulario de Inscripción',
                            'Por favor, use el botón "📝 Inscripción" en la parte superior de la página para inscribirse.',
                            { duration: 5000 }
                        );
                    } else {
                        alert('Por favor, use el botón "📝 Inscripción" en la parte superior de la página para inscribirse.');
                    }
                }
            }
        }, 300);
    }

    attachEventListeners() {
        // Esperar un poco para asegurar que el DOM esté completamente cargado
        setTimeout(() => {
            const clubCards = document.querySelectorAll('.club-card');
            console.log(`🔍 Encontradas ${clubCards.length} tarjetas de club`);
            
            clubCards.forEach(card => {
                const clubType = card.getAttribute('data-club');
                
                if (clubType && this.clubs[clubType]) {
                    // Agregar efectos hover
                    card.style.cursor = 'pointer';
                    
                    // Click event
                    card.addEventListener('click', () => {
                        console.log(`🎯 Click en club: ${clubType}`);
                        this.showClubModal(clubType);
                    });
                    
                    console.log(`✅ Club "${clubType}" configurado correctamente`);
                } else {
                    console.warn(`⚠️ No se encontró configuración para el club: ${clubType}`);
                }
            });
        }, 500);
    }

    showClubModal(clubType) {
        const clubData = this.clubs[clubType];
        
        if (!clubData) {
            console.error(`❌ No se encontró información para el club: ${clubType}`);
            return;
        }

        console.log(`📋 Construyendo modal para: ${clubData.title}`);

        // Construir contenido del modal usando templates
        const { header, content } = this.buildModalContent(clubData);

        // Actualizar el modal existente
        const modalBody = this.modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = header + content;
        } else {
            console.error('❌ No se encontró .modal-body en el modal');
            return;
        }

        // Agregar event listener para el botón "Únete Ahora"
        const joinBtn = this.modal.querySelector('#btn-join-club');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => {
                console.log('🚀 Click en "Únete Ahora"');
                this.openInscriptionModal();
            });
        }
        
        // Agregar clase específica del club para estilos
        this.modal.className = `club-modal ${clubType}`;
        
        // Mostrar modal
        this.openModal();
        
        console.log(`📋 Modal mostrado para: ${clubData.title}`);
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('📖 Modal de club abierto');
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            console.log('📕 Modal de club cerrado');
        }
    }

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