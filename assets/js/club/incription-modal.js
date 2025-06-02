// inscription-modal.js
// Modal mejorado para inscripción a clubs con múltiples opciones de envío

class InscriptionModal {
    constructor() {
        this.email = 'jrojasj73@gmail.com';
        this.modal = null;
        this.childrenCount = 1;
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // Inicializar todo
    init() {
        console.log('📝 Inicializando Inscription Modal Mejorado...');
        this.createModal();
        this.attachEventListeners();
        console.log('✅ Inscription Modal inicializado correctamente');
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'inscription-modal';
        this.modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="header-content">
                            <div class="header-icon">📝</div>
                            <div class="header-text">
                                <h2>Inscripción a los Clubs</h2>
                                <p>Complete el formulario para inscribir a su(s) hijo(s)</p>
                            </div>
                        </div>
                        <button class="close-btn" id="close-modal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <form id="inscription-form" class="inscription-form">
                        <!-- Información del Padre/Tutor -->
                        <div class="form-section">
                            <div class="section-header">
                                <div class="section-icon">👤</div>
                                <h3>Información del Padre/Madre/Tutor</h3>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group full-width">
                                    <label>Nombre Completo *</label>
                                    <input type="text" name="parentName" required placeholder="Ingrese su nombre completo">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Teléfono *</label>
                                    <input type="tel" name="parentPhone" required placeholder="(787) 123-4567">
                                </div>
                                <div class="form-group">
                                    <label>Email *</label>
                                    <input type="email" name="parentEmail" required placeholder="ejemplo@email.com">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group full-width">
                                    <label>Dirección</label>
                                    <input type="text" name="parentAddress" placeholder="Dirección completa (opcional)">
                                </div>
                            </div>
                        </div>

                        <!-- Información de los Hijos -->
                        <div class="form-section">
                            <div class="section-header">
                                <div class="section-icon">👶</div>
                                <h3>Información de los Hijos</h3>
                                <button type="button" class="add-child-btn" id="add-child-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                    </svg>
                                    Agregar otro hijo
                                </button>
                            </div>
                            
                            <div id="children-container">
                                ${this.createChildForm(1)}
                            </div>
                        </div>

                        <!-- Botones -->
                        <div class="form-actions">
                            <button type="button" class="btn-cancel" id="cancel-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                                Cancelar
                            </button>
                            <button type="submit" class="btn-submit">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                                Enviar Inscripción
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Agregar estilos
        this.addStyles();
        
        // Agregar al body
        document.body.appendChild(this.modal);
    }

    createChildForm(childNumber) {
        return `
            <div class="child-form" data-child="${childNumber}">
                <div class="child-header">
                    <h4>Hijo/Hija #${childNumber}</h4>
                    ${childNumber > 1 ? `
                        <button type="button" class="remove-child-btn" data-child="${childNumber}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                            Remover
                        </button>
                    ` : ''}
                </div>
                
                <div class="form-row">
                    <div class="form-group full-width">
                        <label>Nombre Completo del Niño/Joven *</label>
                        <input type="text" name="childName_${childNumber}" required placeholder="Nombre completo del niño/joven">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Nacimiento *</label>
                        <input type="date" name="childBirthdate_${childNumber}" required>
                    </div>
                    <div class="form-group">
                        <label>Edad *</label>
                        <input type="number" name="childAge_${childNumber}" min="6" max="21" required placeholder="Edad">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Club Deseado *</label>
                        <select name="selectedClub_${childNumber}" required>
                            <option value="">Seleccionar Club</option>
                            <option value="aventureros">🌟 Los Aventureros (6-9 años)</option>
                            <option value="conquistadores">🏕️ Conquistadores (10-15 años)</option>
                            <option value="cadetes">🎯 Cadetes (16-21 años)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Género *</label>
                        <select name="childGender_${childNumber}" required>
                            <option value="">Seleccionar</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group full-width">
                        <label>Alergias o Condiciones Médicas</label>
                        <textarea name="childAllergies_${childNumber}" rows="3" placeholder="Describa cualquier alergia o condición médica importante (opcional)"></textarea>
                    </div>
                </div>
            </div>
        `;
    }

    addStyles() {
        // Verificar si ya existen los estilos
        if (document.getElementById('inscription-modal-styles')) {
            return;
        }

        const styles = `
            <style id="inscription-modal-styles">
                .inscription-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                    z-index: 1000;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    box-sizing: border-box;
                }

                .inscription-modal.active {
                    display: flex;
                }

                .inscription-modal .modal-content {
                    background: white;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
                    animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .inscription-modal .modal-header {
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                    padding: 30px;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .header-icon {
                    font-size: 3rem;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 15px;
                    border-radius: 50%;
                    backdrop-filter: blur(10px);
                }

                .header-text h2 {
                    margin: 0;
                    font-size: 1.8rem;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                }

                .header-text p {
                    margin: 5px 0 0 0;
                    opacity: 0.9;
                    font-size: 1rem;
                }

                .inscription-modal .close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                }

                .inscription-modal .close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1) rotate(90deg);
                }

                .inscription-form {
                    padding: 40px;
                }

                .form-section {
                    margin-bottom: 40px;
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 3px solid #e9ecef;
                }

                .section-header > div {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .section-icon {
                    font-size: 1.8rem;
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                    padding: 10px;
                    border-radius: 50%;
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .section-header h3 {
                    color: #2c3e50;
                    font-size: 1.4rem;
                    margin: 0;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                }

                .add-child-btn {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                }

                .add-child-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
                }

                .child-form {
                    background: #f8f9fa;
                    border: 2px solid #e9ecef;
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 25px;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .child-form:hover {
                    border-color: #28a745;
                    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.1);
                }

                .child-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #dee2e6;
                }

                .child-header h4 {
                    color: #495057;
                    font-size: 1.2rem;
                    margin: 0;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                }

                .remove-child-btn {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.3s ease;
                }

                .remove-child-btn:hover {
                    background: #c82333;
                    transform: scale(1.05);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.95rem;
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                    background: white;
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #28a745;
                    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
                    transform: translateY(-1px);
                }

                .form-group textarea {
                    resize: vertical;
                    min-height: 80px;
                    font-family: inherit;
                }

                .form-actions {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 3px solid #e9ecef;
                }

                .btn-cancel,
                .btn-submit {
                    padding: 15px 30px;
                    border: none;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 160px;
                    justify-content: center;
                }

                .btn-cancel {
                    background: #6c757d;
                    color: white;
                }

                .btn-cancel:hover {
                    background: #5a6268;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(108, 117, 125, 0.3);
                }

                .btn-submit {
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                }

                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .inscription-modal {
                        padding: 10px;
                    }

                    .inscription-modal .modal-content {
                        max-width: 100%;
                        max-height: 95vh;
                        border-radius: 15px;
                    }

                    .inscription-modal .modal-header {
                        padding: 20px;
                        border-radius: 15px 15px 0 0;
                    }

                    .header-content {
                        gap: 15px;
                    }

                    .header-icon {
                        font-size: 2rem;
                        padding: 10px;
                    }

                    .header-text h2 {
                        font-size: 1.4rem;
                    }

                    .header-text p {
                        font-size: 0.9rem;
                    }

                    .inscription-form {
                        padding: 25px;
                    }

                    .section-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }

                    .section-header > div {
                        gap: 10px;
                    }

                    .section-icon {
                        font-size: 1.5rem;
                        width: 40px;
                        height: 40px;
                        padding: 8px;
                    }

                    .section-header h3 {
                        font-size: 1.2rem;
                    }

                    .add-child-btn {
                        font-size: 0.85rem;
                        padding: 8px 16px;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }

                    .child-form {
                        padding: 20px;
                    }

                    .child-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }

                    .child-header h4 {
                        font-size: 1.1rem;
                    }

                    .form-actions {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .btn-cancel,
                    .btn-submit {
                        min-width: 100%;
                        padding: 12px 25px;
                    }
                }

                @media (max-width: 480px) {
                    .inscription-modal .modal-content {
                        border-radius: 10px;
                    }

                    .inscription-modal .modal-header {
                        padding: 15px;
                        border-radius: 10px 10px 0 0;
                    }

                    .header-content {
                        gap: 10px;
                    }

                    .header-icon {
                        font-size: 1.5rem;
                        padding: 8px;
                    }

                    .header-text h2 {
                        font-size: 1.2rem;
                    }

                    .inscription-form {
                        padding: 20px;
                    }

                    .child-form {
                        padding: 15px;
                    }

                    .form-group input,
                    .form-group select,
                    .form-group textarea {
                        padding: 10px 12px;
                        font-size: 0.95rem;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    attachEventListeners() {
        setTimeout(() => {
            // Botón para abrir modal
            const openBtn = document.getElementById('open-inscription');
            if (openBtn) {
                console.log('🔗 Conectando botón de inscripción...');
                openBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('🚀 Abriendo modal de inscripción');
                    this.openModal();
                });
                console.log('✅ Botón de inscripción conectado correctamente');
            } else {
                console.error('❌ No se encontró el botón #open-inscription');
                
                const inscriptionBtns = document.querySelectorAll('.inscription-btn');
                if (inscriptionBtns.length > 0) {
                    console.log('🔄 Intentando conectar botones con clase .inscription-btn');
                    inscriptionBtns.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            console.log('🚀 Abriendo modal de inscripción (desde clase)');
                            this.openModal();
                        });
                    });
                    console.log('✅ Botones de inscripción conectados por clase');
                }
            }

            // Event listeners del modal
            if (this.modal) {
                // Botón para cerrar modal
                const closeBtn = this.modal.querySelector('#close-modal');
                const cancelBtn = this.modal.querySelector('#cancel-btn');
                
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.closeModal());
                }
                
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => this.closeModal());
                }

                // Botón para agregar hijo
                const addChildBtn = this.modal.querySelector('#add-child-btn');
                if (addChildBtn) {
                    addChildBtn.addEventListener('click', () => this.addChild());
                }

                // Cerrar al hacer clic fuera del modal
                this.modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
                    if (e.target === e.currentTarget) {
                        this.closeModal();
                    }
                });

                // Enviar formulario
                const form = this.modal.querySelector('#inscription-form');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleSubmit(e);
                    });

                    // Agregar validación en tiempo real
                    this.addRealTimeValidation(form);
                }

                // Cerrar con Escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                        this.closeModal();
                    }
                });
            }
        }, 100);
    }

    addChild() {
        this.childrenCount++;
        const container = this.modal.querySelector('#children-container');
        const newChildForm = document.createElement('div');
        newChildForm.innerHTML = this.createChildForm(this.childrenCount);
        const childFormElement = newChildForm.firstElementChild;
        container.appendChild(childFormElement);

        // Agregar event listener para remover
        const removeBtn = childFormElement.querySelector('.remove-child-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                const childNumber = e.target.closest('.remove-child-btn').getAttribute('data-child');
                this.removeChild(childNumber);
            });
        }

        // Agregar validación al nuevo hijo
        this.addValidationToNewChild(childFormElement);

        console.log(`➕ Hijo #${this.childrenCount} agregado`);
    }

    removeChild(childNumber) {
        const childForm = this.modal.querySelector(`[data-child="${childNumber}"]`);
        if (childForm) {
            childForm.style.animation = 'slideOutChild 0.3s ease-out forwards';
            setTimeout(() => {
                childForm.remove();
                console.log(`➖ Hijo #${childNumber} removido`);
            }, 300);
        }
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('📋 Modal de inscripción abierto');
        } else {
            console.error('❌ Modal no encontrado');
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            console.log('❌ Modal de inscripción cerrado');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Validar formulario antes de procesar
        if (!this.validateForm(e.target)) {
            if (window.notifications) {
                window.notifications.error(
                    'Formulario Incompleto',
                    'Por favor, complete todos los campos requeridos marcados en rojo.',
                    {
                        duration: 4000
                    }
                );
            } else {
                alert('Por favor, complete todos los campos requeridos marcados en rojo.');
            }
            return;
        }

        const formData = new FormData(e.target);
        
        // Recopilar información del padre
        const parentData = {
            name: formData.get('parentName') || '',
            phone: formData.get('parentPhone') || '',
            email: formData.get('parentEmail') || '',
            address: formData.get('parentAddress') || 'N/A'
        };

        // Recopilar información de todos los hijos
        const children = [];
        const childForms = this.modal.querySelectorAll('.child-form');
        
        childForms.forEach((form, index) => {
            const childNumber = form.getAttribute('data-child');
            const childData = {
                number: childNumber,
                name: formData.get(`childName_${childNumber}`) || '',
                birthdate: formData.get(`childBirthdate_${childNumber}`) || '',
                age: formData.get(`childAge_${childNumber}`) || '',
                club: formData.get(`selectedClub_${childNumber}`) || '',
                gender: formData.get(`childGender_${childNumber}`) || 'N/A',
                allergies: formData.get(`childAllergies_${childNumber}`) || 'N/A'
            };
            children.push(childData);
        });

        const data = {
            parent: parentData,
            children: children
        };

        console.log('📨 Enviando datos de inscripción:', data);
        this.sendEmail(data);
    }

    validateForm(form) {
        let isValid = true;
        
        // Limpiar validaciones anteriores
        form.querySelectorAll('.form-group input, .form-group select').forEach(field => {
            field.style.borderColor = '#e9ecef';
        });

        // Validar campos del padre
        const requiredParentFields = [
            { name: 'parentName', label: 'Nombre del padre/madre' },
            { name: 'parentPhone', label: 'Teléfono' },
            { name: 'parentEmail', label: 'Email' }
        ];

        requiredParentFields.forEach(field => {
            const input = form.querySelector(`[name="${field.name}"]`);
            if (!input || !input.value.trim()) {
                if (input) input.style.borderColor = '#dc3545';
                isValid = false;
            }
        });

        // Validar email format
        const emailInput = form.querySelector('[name="parentEmail"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailInput.style.borderColor = '#dc3545';
                isValid = false;
            }
        }

        // Validar campos de cada hijo
        const childForms = form.querySelectorAll('.child-form');
        childForms.forEach(childForm => {
            const childNumber = childForm.getAttribute('data-child');
            const requiredChildFields = [
                { name: `childName_${childNumber}`, label: 'Nombre del niño' },
                { name: `childBirthdate_${childNumber}`, label: 'Fecha de nacimiento' },
                { name: `childAge_${childNumber}`, label: 'Edad' },
                { name: `selectedClub_${childNumber}`, label: 'Club deseado' },
                { name: `childGender_${childNumber}`, label: 'Género' }
            ];

            requiredChildFields.forEach(field => {
                const input = form.querySelector(`[name="${field.name}"]`);
                if (!input || !input.value.trim()) {
                    if (input) input.style.borderColor = '#dc3545';
                    isValid = false;
                }
            });

            // Validar edad
            const ageInput = form.querySelector(`[name="childAge_${childNumber}"]`);
            if (ageInput && ageInput.value) {
                const age = parseInt(ageInput.value);
                if (age < 6 || age > 21) {
                    ageInput.style.borderColor = '#dc3545';
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    addRealTimeValidation(form) {
        // Validación en tiempo real para campos requeridos
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        
        requiredFields.forEach(field => {
            // Limpiar error cuando el usuario comience a escribir
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.style.borderColor = '#28a745'; // Verde si tiene valor
                } else {
                    field.style.borderColor = '#e9ecef'; // Normal si está vacío
                }
            });

            field.addEventListener('blur', () => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545'; // Rojo si está vacío al perder foco
                }
            });
        });

        // Validación especial para email
        const emailField = form.querySelector('[name="parentEmail"]');
        if (emailField) {
            emailField.addEventListener('input', () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailField.value && !emailRegex.test(emailField.value)) {
                    emailField.style.borderColor = '#ffc107'; // Amarillo para formato inválido
                } else if (emailField.value) {
                    emailField.style.borderColor = '#28a745'; // Verde si es válido
                } else {
                    emailField.style.borderColor = '#e9ecef'; // Normal si está vacío
                }
            });
        }

        // Validación de edad
        const ageFields = form.querySelectorAll('[name*="childAge_"]');
        ageFields.forEach(ageField => {
            ageField.addEventListener('input', () => {
                const age = parseInt(ageField.value);
                if (ageField.value && (age < 6 || age > 21)) {
                    ageField.style.borderColor = '#ffc107'; // Amarillo para edad fuera de rango
                } else if (ageField.value) {
                    ageField.style.borderColor = '#28a745'; // Verde si es válido
                } else {
                    ageField.style.borderColor = '#e9ecef'; // Normal si está vacío
                }
            });
        });
    }

    // Función para agregar validación a nuevos hijos
    addValidationToNewChild(childForm) {
        const requiredFields = childForm.querySelectorAll('input[required], select[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.style.borderColor = '#28a745';
                } else {
                    field.style.borderColor = '#e9ecef';
                }
            });

            field.addEventListener('blur', () => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                }
            });
        });

        // Validación especial para edad en el nuevo hijo
        const ageField = childForm.querySelector('[name*="childAge_"]');
        if (ageField) {
            ageField.addEventListener('input', () => {
                const age = parseInt(ageField.value);
                if (ageField.value && (age < 6 || age > 21)) {
                    ageField.style.borderColor = '#ffc107';
                } else if (ageField.value) {
                    ageField.style.borderColor = '#28a745';
                } else {
                    ageField.style.borderColor = '#e9ecef';
                }
            });
        }
    }

    sendEmail(data) {
        const clubNames = {
            'aventureros': 'Los Aventureros (6-9 años)',
            'conquistadores': 'Conquistadores (10-15 años)',
            'cadetes': 'Cadetes (16-21 años)'
        };

        const subject = `Nueva Inscripción - Clubs Juveniles IASD Magnolia (${data.children.length} ${data.children.length === 1 ? 'hijo' : 'hijos'})`;
        
        let body = `SOLICITUD DE INSCRIPCIÓN A LOS CLUBS JUVENILES\n`;
        body += `=====================================================\n\n`;
        
        body += `INFORMACIÓN DEL PADRE/MADRE/TUTOR:\n`;
        body += `═══════════════════════════════════════\n`;
        body += `Nombre Completo: ${data.parent.name}\n`;
        body += `Teléfono: ${data.parent.phone}\n`;
        body += `Email: ${data.parent.email}\n`;
        body += `Dirección: ${data.parent.address}\n\n`;
        
        body += `INFORMACIÓN DE LOS HIJOS (Total: ${data.children.length}):\n`;
        body += `═══════════════════════════════════════════════\n`;
        
        data.children.forEach((child, index) => {
            body += `\n🧒 HIJO/HIJA #${index + 1}\n`;
            body += `────────────────────────────────────\n`;
            body += `Nombre Completo: ${child.name}\n`;
            body += `Fecha de Nacimiento: ${child.birthdate}\n`;
            body += `Edad: ${child.age} años\n`;
            body += `Género: ${child.gender}\n`;
            body += `Club Solicitado: ${clubNames[child.club] || child.club}\n`;
            body += `Alergias/Condiciones Médicas: ${child.allergies}\n`;
        });
        
        body += `\n═══════════════════════════════════════════════\n`;
        body += `📧 Enviado desde: Página Web IASD Magnolia\n`;
        body += `📅 Fecha de solicitud: ${new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}\n`;
        body += `👥 Total de inscripciones: ${data.children.length}\n`;
        body += `\n¡Gracias por su interés en nuestros clubs juveniles!\n`;
        body += `Nos pondremos en contacto pronto para confirmar la inscripción.\n\n`;
        body += `Bendiciones,\nIglesia Adventista del Séptimo Día Magnolia\n`;
        
        try {
            const mailtoLink = `mailto:${this.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Log para debugging
            console.log('📧 Email destinatario:', this.email);
            console.log('📋 Asunto:', subject);
            console.log('📝 Contenido:', body.substring(0, 200) + '...');
            console.log('🔗 Mailto link:', mailtoLink.substring(0, 100) + '...');
            
            // Intentar abrir el cliente de email
            window.location.href = mailtoLink;
            
            // Mostrar notificación simple
            const childrenText = data.children.length === 1 ? '1 hijo' : `${data.children.length} hijos`;
            
            if (window.notifications) {
                window.notifications.success(
                    '📧 ¡Inscripción Preparada!',
                    `Se ha preparado la solicitud para ${childrenText} y se abrió su cliente de correo. Por favor, revise su programa de email y haga clic en "Enviar" para completar la inscripción.`,
                    {
                        duration: 8000
                    }
                );
            } else {
                alert(`📧 ¡Inscripción Preparada!\n\nSe ha preparado la solicitud para ${childrenText} y se abrió su cliente de correo.\n\nPor favor, revise su programa de email y haga clic en "Enviar" para completar la inscripción.`);
            }
            
            this.closeModal();
            this.resetForm();
            
            console.log('✅ Email preparado correctamente para:', this.email);
        } catch (error) {
            console.error('❌ Error al preparar el email:', error);
            
            if (window.notifications) {
                window.notifications.error(
                    '❌ Error al Preparar Email',
                    `No se pudo abrir el cliente de correo automáticamente. Por favor, envíe un email manualmente a: ${this.email} con la información del formulario.`,
                    {
                        duration: 10000
                    }
                );
            } else {
                alert(`❌ Error al preparar el email.\n\nPor favor, envíe un email manualmente a: ${this.email}\n\nIncluya la información del formulario que completó.`);
            }
        }
    }

    resetForm() {
        const form = this.modal?.querySelector('#inscription-form');
        if (form) {
            form.reset();
            
            // Remover hijos adicionales, mantener solo el primero
            const childrenContainer = this.modal.querySelector('#children-container');
            const childForms = childrenContainer.querySelectorAll('.child-form');
            
            // Remover todos excepto el primero
            childForms.forEach((form, index) => {
                if (index > 0) {
                    form.remove();
                }
            });
            
            // Resetear contador
            this.childrenCount = 1;
            
            // Limpiar estilos de validación
            form.querySelectorAll('.form-group input, .form-group select').forEach(field => {
                field.style.borderColor = '#e9ecef';
            });
            
            console.log('🔄 Formulario reiniciado');
        }
    }
}

// Inicializar
console.log('🔄 Cargando Inscription Modal Mejorado...');
window.inscriptionModal = new InscriptionModal();