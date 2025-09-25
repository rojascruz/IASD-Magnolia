// /assets/js/components/inscription-modal.js
// Modal mejorado para inscripción a clubs con PDF profesional y auto-completado de email

class InscriptionModal {
    constructor() {
        this.email = 'jrojasj73@gmail.com';
        this.modal = null;
        this.childrenCount = 1;
        this.templates = new Map();
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log('📝 Inicializando Inscription Modal con PDF profesional...');
        await this.loadTemplates();
        this.createModal();
        this.attachEventListeners();
        

        
        console.log('✅ Inscription Modal inicializado correctamente');
    }

    async loadTemplates() {
        try {
            const response = await fetch('/assets/template/components/club/inscription-modal/inscription-modal.html');
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
                
                console.log('📄 Templates del modal cargados correctamente');
            } else {
                console.warn('⚠️ No se pudo cargar el template del modal, usando fallback');
                this.useFallbackTemplates();
            }
        } catch (error) {
            console.error('❌ Error cargando templates del modal:', error);
            this.useFallbackTemplates();
        }
    }

    useFallbackTemplates() {
        // Templates de respaldo simplificados
        this.templates.set('inscription-modal-template', `
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
                        <button class="close-btn" id="close-modal">×</button>
                    </div>
                    <form id="inscription-form" class="inscription-form">
                        {{parentSection}}{{childrenSection}}{{formActions}}
                    </form>
                </div>
            </div>
        `);
        
        this.templates.set('parent-section-template', `
            <div class="form-section">
                <div class="section-header">
                    <div><div class="section-icon">👤</div><h3>Información del Padre/Madre/Tutor</h3></div>
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
        `);

        this.templates.set('children-section-template', `
            <div class="form-section">
                <div class="section-header">
                    <div>
                        <div class="section-icon">👶</div>
                        <h3>Información de los Hijos</h3>
                    </div>
                    <button type="button" class="add-child-btn" id="add-child-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        Agregar otro hijo
                    </button>
                </div>
                <div id="children-container">
                    {{childForms}}
                </div>
            </div>
        `);

        console.log('📄 Templates fallback cargados');
    }

    replaceTemplate(template, replacements) {
        let result = template;
        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, value);
        }
        return result;
    }

    createChildForm(childNumber) {

        const childFormTemplate = this.templates.get('child-form-template');
        const removeButtonTemplate = this.templates.get('remove-button-template');
        
        if (childFormTemplate) {
            // Crear el botón de remover solo si no es el primer hijo
            const removeButton = childNumber > 1 && removeButtonTemplate 
                ? this.replaceTemplate(removeButtonTemplate, { childNumber })
                : '';
                
            // Reemplazar las variables del template
            return this.replaceTemplate(childFormTemplate, {
                childNumber,
                removeButton
            });
        }
        
        // Fallback al método anterior si no hay template
        return this.createChildFormFallback(childNumber);
    }

    createChildFormFallback(childNumber) {
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

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'inscription-modal';
        
        if (!this.templates.has('inscription-modal-template')) {
            console.error('❌ Template principal del modal no encontrado');
            return;
        }

        // Construir las secciones
        const parentSection = this.templates.get('parent-section-template') || '';
        const childrenSection = this.buildChildrenSection();
        const formActions = this.buildFormActions();

        // Construir el modal completo
        const modalTemplate = this.templates.get('inscription-modal-template');
        this.modal.innerHTML = this.replaceTemplate(modalTemplate, {
            parentSection,
            childrenSection,
            formActions
        });

        // Agregar al body
        document.body.appendChild(this.modal);
    }

    buildChildrenSection() {
        const childrenSectionTemplate = this.templates.get('children-section-template') || `
            <div class="form-section">
                <div class="section-header">
                    <div>
                        <div class="section-icon">👶</div>
                        <h3>Información de los Hijos</h3>
                    </div>
                    <button type="button" class="add-child-btn" id="add-child-btn">
                        Agregar otro hijo
                    </button>
                </div>
                <div id="children-container">
                    {{childForms}}
                </div>
            </div>
        `;

        const firstChildForm = this.createChildForm(1);

        return this.replaceTemplate(childrenSectionTemplate, {
            childForms: firstChildForm
        });
    }

    buildFormActions() {
        const template = this.templates.get('form-actions-template');
        if (template) {
            return template;
        }
        
        // Fallback con data-translate
        return `
            <div class="form-actions">
                <button type="button" class="btn-cancel" id="cancel-btn" data-translate="cancel-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Cancelar
                </button>
                <button type="submit" class="btn-submit" id="submit-btn" data-translate="submit-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                    Enviar Inscripción
                </button>
            </div>
        `;
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
                const closeBtn = this.modal.querySelector('#close-modal');
                const cancelBtn = this.modal.querySelector('#cancel-btn');
                
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.closeModal());
                }
                
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => this.closeModal());
                }

                const addChildBtn = this.modal.querySelector('#add-child-btn');
                if (addChildBtn) {
                    addChildBtn.addEventListener('click', () => this.addChild());
                }

                this.modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
                    if (e.target === e.currentTarget) {
                        this.closeModal();
                    }
                });

                const form = this.modal.querySelector('#inscription-form');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleSubmit(e);
                    });

                    this.addRealTimeValidation(form);
                }

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

        const removeBtn = childFormElement.querySelector('.remove-child-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                const childNumber = e.target.closest('.remove-child-btn').getAttribute('data-child');
                this.removeChild(childNumber);
            });
        }

        this.addValidationToNewChild(childFormElement);
        

        
        // Reconfigurar calculadora inmediatamente para el nuevo hijo
        this.reconfigureAgeCalculator();
        
        console.log(`➕ Hijo #${this.childrenCount} agregado y configurado`);
    }

    removeChild(childNumber) {
        const childForm = this.modal.querySelector(`[data-child="${childNumber}"]`);
        if (childForm) {
            childForm.style.animation = 'slideOutChild 0.3s ease-out forwards';
            setTimeout(() => {
                childForm.remove();
                this.renumberChildren(); // Renumerar después de eliminar
                console.log(`➖ Hijo #${childNumber} removido y renumerado`);
            }, 300);
        }
    }

    // NUEVA FUNCIÓN: Renumerar todos los hijos dinámicamente
    renumberChildren() {
        const container = this.modal.querySelector('#children-container');
        const childForms = container.querySelectorAll('.child-form');
        
        childForms.forEach((childForm, index) => {
            const newNumber = index + 1;
            const oldNumber = childForm.getAttribute('data-child');
            
            // Actualizar data-child
            childForm.setAttribute('data-child', newNumber);
            
            // Actualizar título
            const title = childForm.querySelector('h4');
            if (title) {
                title.textContent = `Hijo/Hija #${newNumber}`;
            }
            
            // Actualizar nombres de los campos
            this.updateFieldNames(childForm, oldNumber, newNumber);
            
            // Actualizar botón de remover
            const removeBtn = childForm.querySelector('.remove-child-btn');
            if (removeBtn) {
                removeBtn.setAttribute('data-child', newNumber);
                // Mostrar/ocultar botón según sea el primer hijo
                removeBtn.style.display = newNumber === 1 ? 'none' : 'flex';
            }
        });
        
        // Actualizar contador
        this.childrenCount = childForms.length;
        
        // Reconfigurar validaciones y calculadora de edad
        this.setupValidationForAllChildren();
        this.reconfigureAgeCalculator();
        
        console.log(`🔄 Hijos renumerados: ${this.childrenCount} hijos total`);
    }

    // NUEVA FUNCIÓN: Actualizar nombres de campos
    updateFieldNames(childForm, oldNumber, newNumber) {
        const fields = childForm.querySelectorAll('input, select');
        fields.forEach(field => {
            if (field.name) {
                field.name = field.name.replace(`_${oldNumber}`, `_${newNumber}`);
                
                // Remover data-configured para que se reconfigure la calculadora
                if (field.hasAttribute('data-configured')) {
                    field.removeAttribute('data-configured');
                }
            }
        });
    }

    // NUEVA FUNCIÓN: Reconfigurar calculadora de edad después de cambios
    reconfigureAgeCalculator() {
        console.log('🔄 Reconfigurando calculadora de edad...');
        
        // Disparar evento para que la calculadora se reconfigure
        const event = new CustomEvent('childrenChanged');
        document.dispatchEvent(event);
        
        // También ejecutar directamente si la función está disponible
        if (window.configurarCalculadoraEdad) {
            console.log('✅ Función configurarCalculadoraEdad encontrada, ejecutando...');
            setTimeout(() => {
                window.configurarCalculadoraEdad();
                console.log('🎯 Calculadora reconfigurada');
            }, 100);
        } else {
            console.warn('⚠️ window.configurarCalculadoraEdad no está disponible');
        }
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Aplicar traducciones si el language manager está disponible

            
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
        
        if (!this.validateForm(e.target)) {
            if (window.notifications) {
                window.notifications.error(
                    'Formulario Incompleto',
                    'Por favor, complete todos los campos requeridos marcados en rojo.',
                    { duration: 4000 }
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
        
        // NUEVO: Generar PDF automáticamente Y enviar email
        this.processInscription(data);
    }

    // NUEVO MÉTODO: Procesa la inscripción generando PDF y enviando email
    async processInscription(data) {
        try {
            // Verificar disponibilidad del nuevo generador
            console.log('🔍 Verificando generadores de PDF disponibles:');
            console.log('- window.generatePDFWithLogo:', !!window.generatePDFWithLogo);
            console.log('- window.pdfGeneratorWithLogo:', !!window.pdfGeneratorWithLogo);
            
            // Mostrar notificación de procesamiento
            if (window.notifications) {
                window.notifications.info(
                    '📄 Procesando Inscripción...',
                    'Generando PDF profesional y preparando email...',
                    { duration: 3000 }
                );
            }

            // Intentar generar PDF con el nuevo sistema
            const pdfGenerated = await this.tryGeneratePDF(data);
            
            // Siempre enviar email (con información sobre si se generó PDF)
            this.sendEmailWithPDFInfo(data, pdfGenerated);
            
        } catch (error) {
            console.error('❌ Error procesando inscripción:', error);
            // Si falla todo, enviar solo email
            this.sendEmailWithPDFInfo(data, false);
        }
    }

    // MÉTODO ACTUALIZADO: Usa el nuevo generador de PDF profesional
    async tryGeneratePDF(data) {
        try {
            console.log('🎯 Usando nuevo generador de PDF profesional...');
            
            // PRIORIDAD 1: Usar el nuevo generador profesional con logo
            if (window.generatePDFWithLogo) {
                console.log('✅ Generador profesional disponible, generando PDF...');
                const success = await window.generatePDFWithLogo(data);
                if (success) {
                    console.log('🎨 ¡PDF profesional generado exitosamente!');
                    return true;
                } else {
                    console.warn('⚠️ El generador profesional falló');
                }
            } else {
                console.warn('⚠️ Generador profesional no disponible');
            }
            
            // PRIORIDAD 2: Acceso directo al generador profesional
            if (window.pdfGeneratorWithLogo) {
                console.log('🔄 Intentando acceso directo al generador profesional...');
                const success = await window.pdfGeneratorWithLogo.generateAdvancedBasicPDF(data);
                if (success) {
                    console.log('🎨 ¡PDF profesional generado por acceso directo!');
                    return true;
                }
            }
            
            console.error('❌ Nuevo generador de PDF no disponible - no se generará PDF básico');
            return false;
            
        } catch (error) {
            console.error('❌ Error usando nuevo generador de PDF:', error);
            return false;
        }
    }

    // MÉTODO MEJORADO: Manejo de PDF en móvil con auto-completado de email
    async handleMobilePDF(doc, fileName, data) {
        try {
            if (navigator.share) {
                const pdfBlob = doc.output('blob');
                
                // NUEVO: Crear un archivo de texto con información del email para auto-completar
                const emailContent = this.createEmailContent(data);
                const emailBlob = new Blob([emailContent], { type: 'text/plain' });
                
                const files = [
                    new File([pdfBlob], fileName, { type: 'application/pdf' }),
                    new File([emailBlob], 'info_email.txt', { type: 'text/plain' })
                ];
                
                const shareData = {
                    title: 'Inscripción Clubs IASD Magnolia',
                    text: `📧 Para: ${this.email}\n\nSolicitud de inscripción para ${data.children.length} ${data.children.length === 1 ? 'hijo' : 'hijos'}.\n\nPor favor, envíe este PDF a: ${this.email}`,
                    files: [new File([pdfBlob], fileName, { type: 'application/pdf' })]
                };
                
                // NUEVO: Detectar si el usuario eligió una app de email
                try {
                    await navigator.share(shareData);
                    console.log('📱 PDF compartido exitosamente');
                    
                    // DESPUÉS del share, mostrar instrucciones adicionales para email
                    setTimeout(() => {
                        if (window.notifications) {
                            window.notifications.info(
                                '📧 Si eligió Email',
                                `Recuerde escribir en "Para": ${this.email}`,
                                { duration: 6000 }
                            );
                        }
                    }, 1000);
                    
                } catch (shareError) {
                    console.warn('⚠️ Error compartiendo:', shareError);
                    // Fallback: descarga tradicional con instrucciones
                    doc.save(fileName);
                    this.showEmailInstructions(data);
                }
            } else {
                // No hay Web Share API disponible
                doc.save(fileName);
                this.showEmailInstructions(data);
            }
        } catch (error) {
            console.warn('⚠️ Error en handleMobilePDF:', error);
            doc.save(fileName);
            this.showEmailInstructions(data);
        }
    }

    // NUEVO MÉTODO: Crear contenido de email estructurado
    createEmailContent(data) {
        const clubNames = {
            'aventureros': 'Los Aventureros (6-9 años)',
            'conquistadores': 'Conquistadores (10-15 años)',
            'cadetes': 'Cadetes (16-21 años)'
        };

        const subject = `Nueva Inscripción - Clubs Juveniles IASD Magnolia (${data.children.length} ${data.children.length === 1 ? 'hijo' : 'hijos'})`;
        
        let body = `Para: ${this.email}\n`;
        body += `Asunto: ${subject}\n\n`;
        body += `SOLICITUD DE INSCRIPCION A LOS CLUBS JUVENILES\n`;
        body += `=====================================================\n\n`;
        
        body += `INFORMACION DEL PADRE/MADRE/TUTOR:\n`;
        body += `=======================================\n`;
        body += `Nombre Completo: ${data.parent.name}\n`;
        body += `Telefono: ${data.parent.phone}\n`;
        body += `Email: ${data.parent.email}\n`;
        body += `Direccion: ${data.parent.address}\n\n`;
        
        body += `INFORMACION DE LOS HIJOS (Total: ${data.children.length}):\n`;
        body += `===============================================\n`;
        
        data.children.forEach((child, index) => {
            body += `\nHIJO/HIJA #${index + 1}\n`;
            body += `--------------------------------\n`;
            body += `Nombre Completo: ${child.name}\n`;
            body += `Fecha de Nacimiento: ${child.birthdate}\n`;
            body += `Edad: ${child.age} años\n`;
            body += `Genero: ${child.gender}\n`;
            body += `Club Solicitado: ${clubNames[child.club] || child.club}\n`;
            body += `Alergias/Condiciones Medicas: ${child.allergies}\n`;
        });
        
        body += `\n===============================================\n`;
        body += `Enviado desde: Pagina Web IASD Magnolia\n`;
        body += `Fecha de solicitud: ${new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}\n`;
        body += `Total de inscripciones: ${data.children.length}\n`;
        body += `\nGracias por su interes en nuestros clubs juveniles!\n`;
        body += `Nos pondremos en contacto pronto para confirmar la inscripcion.\n\n`;
        body += `Bendiciones,\nIglesia Adventista del Septimo Dia Magnolia\n`;

        return body;
    }

    // NUEVO MÉTODO: Mostrar instrucciones para email manual
    showEmailInstructions(data) {
        const message = `📧 Para enviar por email:\n\n• Para: ${this.email}\n• Asunto: Nueva Inscripción - Clubs Juveniles\n• Adjunte el PDF descargado\n\n¡Gracias por su inscripción!`;
        
        if (window.notifications) {
            window.notifications.info(
                '📧 Instrucciones de Email',
                `Para enviar por email, use: ${this.email}`,
                { duration: 8000 }
            );
        } else {
            alert(message);
        }
    }

    generateFileName(data) {
        const date = new Date().toISOString().split('T')[0];
        const childrenCount = data.children.length;
        const firstName = data.parent.name.split(' ')[0];
        return `Inscripcion_Clubs_${firstName}_${childrenCount}hijos_${date}.pdf`;
    }

    // MÉTODO PROFESIONAL: Envía email con mensaje corto y profesional
    sendEmailWithPDFInfo(data, pdfGenerated) {
        console.log('📧 Preparando email profesional...');
        
        // Crear mensaje profesional y conciso
        const subject = 'Inscripción Club Juvenil - IASD Magnolia';
        
        // Determinar nombres de los hijos para el mensaje
        const childrenNames = data.children.map(child => child.name).join(', ');
        const childCount = data.children.length;
        const childText = childCount === 1 ? 'hijo/hija' : 'hijos/hijas';
        
        // MENSAJE PROFESIONAL CORTO
        const body = `Estimados hermanos,

Saludos cordiales. Envío el PDF con la inscripción de su ${childText} ${childrenNames} para el club juvenil.

El PDF contiene toda la información detallada de la inscripción. Por favor, revisen la información y nos pondremos en contacto pronto para confirmar la participación.

Que Dios les bendiga,

Iglesia Adventista del Séptimo Día Magnolia
Bayamón, Puerto Rico

---
Enviado desde: www.iasdmagnolia.org
Fecha: ${new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
        
        try {
            const mailtoLink = `mailto:${this.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Log para debugging
            console.log('📧 Email destinatario:', this.email);
            console.log('📋 Asunto:', subject);
            console.log('📝 Mensaje profesional preparado');
            console.log('📄 PDF generado:', pdfGenerated ? 'SÍ ✅' : 'NO ⚠️');
            
            // Intentar abrir el cliente de email
            window.location.href = mailtoLink;
            
            // Mensaje de instrucciones profesional
            let message = '';
            if (pdfGenerated) {
                message = `¡Excelente! Se ha generado el PDF profesional y preparado el email.

PRÓXIMOS PASOS:
1. ✅ El PDF se descargó automáticamente
2. 📧 Se abrió su cliente de correo con el mensaje
3. 📎 Adjunte manualmente el PDF descargado
4. ✉️ Envíe el correo

El mensaje ya está preparado profesionalmente para enviar.`;
            } else {
                message = `Email preparado para ${childCount} ${childText}. 

⚠️ Nota: El PDF no se pudo generar automáticamente. 
Por favor incluya la información en el correo o intente nuevamente.`;
            }
            
            if (window.notifications) {
                window.notifications.success(
                    'Email Profesional Preparado',
                    message,
                    {
                        duration: 12000
                    }
                );
            } else {
                alert(`Email Profesional Preparado\n\n${message}`);
            }
            
            this.closeModal();
            this.resetForm();
            
            console.log('✅ Proceso completado - PDF:', pdfGenerated ? 'Generado ✅' : 'No disponible ⚠️', '+ Email profesional preparado para:', this.email);

            // Mostrar notificación de éxito
            const childrenText = data.children.length === 1 ? '1 hijo' : `${data.children.length} hijos`;
            
            let message2 = '';
            if (pdfGenerated) {
                message2 = `Perfecto! Se generó y descargó el PDF profesional, y se preparó el email para ${childrenText}. Revise su cliente de correo para enviar la solicitud.`;
            } else {
                message2 = `Email preparado para ${childrenText}. Se ha abierto su cliente de correo para enviar la solicitud. (PDF no disponible en este momento)`;
            }
            
            if (window.notifications) {
                window.notifications.success(
                    'Inscripción Procesada!',
                    message2,
                    {
                        duration: 8000
                    }
                );
            } else {
                alert(`Inscripción Procesada!\n\n${message2}`);
            }
            
            this.closeModal();
            this.resetForm();
            
            console.log('✅ Proceso completado - PDF:', pdfGenerated ? 'Generado ✅' : 'No disponible ⚠️', '+ Email preparado para:', this.email);
        } catch (error) {
            console.error('❌ Error al preparar el email:', error);
            
            if (window.notifications) {
                window.notifications.error(
                    'Error al Preparar Email',
                    `No se pudo abrir el cliente de correo automáticamente. Por favor, envíe un email manualmente a: ${this.email}`,
                    {
                        duration: 10000
                    }
                );
            } else {
                alert(`Error al preparar el email.\n\nEnvíe manualmente a: ${this.email}\nAsunto: ${subject}\nY adjunte el PDF descargado.`);
            }
        }
    }

    validateForm(form) {
        let isValid = true;
        
        form.querySelectorAll('.form-group input, .form-group select').forEach(field => {
            field.style.borderColor = '#e9ecef';
        });

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

        const emailInput = form.querySelector('[name="parentEmail"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailInput.style.borderColor = '#dc3545';
                isValid = false;
            }
        }

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
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        
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

        const emailField = form.querySelector('[name="parentEmail"]');
        if (emailField) {
            emailField.addEventListener('input', () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailField.value && !emailRegex.test(emailField.value)) {
                    emailField.style.borderColor = '#ffc107';
                } else if (emailField.value) {
                    emailField.style.borderColor = '#28a745';
                } else {
                    emailField.style.borderColor = '#e9ecef';
                }
            });
        }

        const ageFields = form.querySelectorAll('[name*="childAge_"]');
        ageFields.forEach(ageField => {
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
        });
    }

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

    // NUEVA FUNCIÓN: Configurar validaciones para todos los hijos existentes
    setupValidationForAllChildren() {
        const container = this.modal.querySelector('#children-container');
        const childForms = container.querySelectorAll('.child-form');
        
        childForms.forEach(childForm => {
            // Remover listeners anteriores para evitar duplicados
            const fields = childForm.querySelectorAll('input, select');
            fields.forEach(field => {
                field.replaceWith(field.cloneNode(true));
            });
            
            // Reconfigurar validaciones
            this.addValidationToNewChild(childForm);
        });
        
        console.log(`✅ Validaciones configuradas para ${childForms.length} hijos`);
    }

    resetForm() {
        const form = this.modal?.querySelector('#inscription-form');
        if (form) {
            form.reset();
            
            const childrenContainer = this.modal.querySelector('#children-container');
            const childForms = childrenContainer.querySelectorAll('.child-form');
            
            childForms.forEach((form, index) => {
                if (index > 0) {
                    form.remove();
                }
            });
            
            this.childrenCount = 1;
            
            // Asegurar numeración correcta del primer hijo
            this.renumberChildren();
            
            form.querySelectorAll('.form-group input, .form-group select').forEach(field => {
                field.style.borderColor = '#e9ecef';
            });
            
            console.log('🔄 Formulario reiniciado y renumerado');
        }
    }
}

// Inicializar
console.log('🔄 Cargando Inscription Modal con auto-completado de email...');
window.inscriptionModal = new InscriptionModal();