// /assets/js/components/inscription-modal.js
// Modal mejorado para inscripción a clubs con PDF integrado

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
        console.log('📝 Inicializando Inscription Modal con PDF integrado...');
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
        return `
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
            // Mostrar notificación de procesamiento
            if (window.notifications) {
                window.notifications.info(
                    '📄 Procesando Inscripción...',
                    'Generando PDF y preparando email...',
                    { duration: 3000 }
                );
            }

            // Intentar generar PDF
            const pdfGenerated = await this.tryGeneratePDF(data);
            
            // Siempre enviar email (con información sobre si se generó PDF)
            this.sendEmailWithPDFInfo(data, pdfGenerated);
            
        } catch (error) {
            console.error('❌ Error procesando inscripción:', error);
            // Si falla todo, enviar solo email
            this.sendEmailWithPDFInfo(data, false);
        }
    }

    // NUEVO MÉTODO: Intenta generar PDF
    async tryGeneratePDF(data) {
        try {
            console.log('🔍 Verificando disponibilidad de jsPDF...');
            
            // Verificar múltiples formas de acceso a jsPDF
            let jsPDFLibrary = null;
            
            if (typeof window.jsPDF !== 'undefined') {
                jsPDFLibrary = window.jsPDF;
                console.log('✅ jsPDF encontrado en window.jsPDF');
            } else if (typeof jsPDF !== 'undefined') {
                jsPDFLibrary = jsPDF;
                console.log('✅ jsPDF encontrado en jsPDF global');
            } else if (window.jspdf && window.jspdf.jsPDF) {
                jsPDFLibrary = window.jspdf.jsPDF;
                console.log('✅ jsPDF encontrado en window.jspdf.jsPDF');
            }

            if (!jsPDFLibrary) {
                console.warn('⚠️ jsPDF no disponible, omitiendo generación de PDF');
                return false;
            }

            console.log('📄 Generando PDF...');
            
            const doc = new jsPDFLibrary.jsPDF();
            
            // Configuración del documento
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 20;
            let yPos = margin;
            
            // Función auxiliar para agregar texto
            const addText = (text, fontSize = 10, style = 'normal', color = [0, 0, 0]) => {
                doc.setFontSize(fontSize);
                doc.setFont('helvetica', style);
                doc.setTextColor(...color);
                
                const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));
                
                // Verificar si necesitamos una nueva página
                if (yPos + (lines.length * fontSize * 0.5) > pageHeight - margin) {
                    doc.addPage();
                    yPos = margin;
                }
                
                doc.text(lines, margin, yPos);
                yPos += lines.length * fontSize * 0.5 + 3;
            };
            
            const addSpace = (space = 8) => {
                yPos += space;
            };

            // CONTENIDO DEL PDF - MISMO FORMATO QUE EL EMAIL
            addText('SOLICITUD DE INSCRIPCIÓN A LOS CLUBS JUVENILES', 16, 'bold', [0, 100, 200]);
            addText('=====================================================', 12, 'normal', [100, 100, 100]);
            addSpace(15);
            
            // Información del padre/madre/tutor
            addText('INFORMACIÓN DEL PADRE/MADRE/TUTOR:', 12, 'bold', [150, 0, 0]);
            addText('═══════════════════════════════════════', 10, 'normal', [150, 150, 150]);
            addSpace(5);
            
            addText(`Nombre Completo: ${data.parent.name}`, 10);
            addText(`Teléfono: ${data.parent.phone}`, 10);
            addText(`Email: ${data.parent.email}`, 10);
            addText(`Dirección: ${data.parent.address}`, 10);
            addSpace(15);
            
            // Información de los hijos
            addText(`INFORMACIÓN DE LOS HIJOS (Total: ${data.children.length}):`, 12, 'bold', [150, 0, 0]);
            addText('═══════════════════════════════════════════════', 10, 'normal', [150, 150, 150]);
            addSpace(10);
            
            const clubNames = {
                'aventureros': 'Los Aventureros (6-9 años)',
                'conquistadores': 'Conquistadores (10-15 años)',
                'cadetes': 'Cadetes (16-21 años)'
            };
            
            data.children.forEach((child, index) => {
                addText(`🧒 HIJO/HIJA #${index + 1}`, 11, 'bold', [0, 150, 0]);
                addText('────────────────────────────────────', 9, 'normal', [150, 150, 150]);
                addSpace(3);
                
                addText(`Nombre Completo: ${child.name}`, 10);
                addText(`Fecha de Nacimiento: ${child.birthdate}`, 10);
                addText(`Edad: ${child.age} años`, 10);
                addText(`Género: ${child.gender}`, 10);
                addText(`Club Solicitado: ${clubNames[child.club] || child.club}`, 10);
                addText(`Alergias/Condiciones Médicas: ${child.allergies}`, 10);
                addSpace(12);
            });
            
            // Pie del documento
            addSpace(10);
            addText('═══════════════════════════════════════════════', 10, 'normal', [150, 150, 150]);
            addText('📧 Enviado desde: Página Web IASD Magnolia', 9, 'normal', [100, 100, 100]);
            addText(`📅 Fecha de solicitud: ${new Date().toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 9, 'normal', [100, 100, 100]);
            addText(`👥 Total de inscripciones: ${data.children.length}`, 9, 'normal', [100, 100, 100]);
            addSpace(10);
            addText('¡Gracias por su interés en nuestros clubs juveniles!', 11, 'bold', [0, 100, 0]);
            addText('Nos pondremos en contacto pronto para confirmar la inscripción.', 10);
            addSpace(8);
            addText('Bendiciones,', 10, 'italic');
            addText('Iglesia Adventista del Séptimo Día Magnolia', 10, 'italic');
            
            // Generar nombre del archivo
            const fileName = this.generateFileName(data);
            
            // Detectar dispositivo y guardar
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                await this.handleMobilePDF(doc, fileName, data);
            } else {
                doc.save(fileName);
                console.log('📄 PDF descargado exitosamente:', fileName);
            }
            
            console.log('✅ PDF generado correctamente');
            return true;
            
        } catch (error) {
            console.error('❌ Error generando PDF:', error);
            return false;
        }
    }

    async handleMobilePDF(doc, fileName, data) {
        try {
            if (navigator.share) {
                const pdfBlob = doc.output('blob');
                const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
                
                await navigator.share({
                    title: 'Inscripción Clubs IASD Magnolia',
                    text: `Solicitud de inscripción para ${data.children.length} ${data.children.length === 1 ? 'hijo' : 'hijos'}`,
                    files: [file]
                });
                
                console.log('📱 PDF compartido exitosamente');
            } else {
                doc.save(fileName);
                console.log('📄 PDF descargado en móvil:', fileName);
            }
        } catch (shareError) {
            console.warn('⚠️ Error compartiendo:', shareError);
            doc.save(fileName);
        }
    }

    generateFileName(data) {
        const date = new Date().toISOString().split('T')[0];
        const childrenCount = data.children.length;
        const firstName = data.parent.name.split(' ')[0];
        return `Inscripcion_Clubs_${firstName}_${childrenCount}hijos_${date}.pdf`;
    }

    // MÉTODO MEJORADO: Envía email con información sobre el PDF
    sendEmailWithPDFInfo(data, pdfGenerated) {
        const clubNames = {
            'aventureros': 'Los Aventureros (6-9 años)',
            'conquistadores': 'Conquistadores (10-15 años)',
            'cadetes': 'Cadetes (16-21 años)'
        };

        const subject = `Nueva Inscripción - Clubs Juveniles IASD Magnolia (${data.children.length} ${data.children.length === 1 ? 'hijo' : 'hijos'})`;
        
        // TU FORMATO EXACTO DEL EMAIL
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
            console.log('📝 Contenido preparado para email');
            console.log('📄 PDF generado:', pdfGenerated ? 'SÍ' : 'NO');
            
            // Intentar abrir el cliente de email
            window.location.href = mailtoLink;
            
            // Mostrar notificación de éxito
            const childrenText = data.children.length === 1 ? '1 hijo' : `${data.children.length} hijos`;
            
            let message = '';
            if (pdfGenerated) {
                message = `¡Perfecto! Se generó y descargó el PDF profesional, y se preparó el email para ${childrenText}. Revise su cliente de correo para enviar la solicitud.`;
            } else {
                message = `Email preparado para ${childrenText}. Se ha abierto su cliente de correo para enviar la solicitud. (PDF no disponible en este momento)`;
            }
            
            if (window.notifications) {
                window.notifications.success(
                    '✅ ¡Inscripción Procesada!',
                    message,
                    {
                        duration: 8000
                    }
                );
            } else {
                alert(`✅ ¡Inscripción Procesada!\n\n${message}`);
            }
            
            this.closeModal();
            this.resetForm();
            
            console.log('✅ Proceso completado - PDF:', pdfGenerated ? 'Generado ✅' : 'No disponible ⚠️', '+ Email preparado para:', this.email);
        } catch (error) {
            console.error('❌ Error al preparar el email:', error);
            
            if (window.notifications) {
                window.notifications.error(
                    '❌ Error al Preparar Email',
                    `No se pudo abrir el cliente de correo automáticamente. Por favor, envíe un email manualmente a: ${this.email}`,
                    {
                        duration: 10000
                    }
                );
            } else {
                alert(`❌ Error al preparar el email.\n\nPor favor, envíe un email manualmente a: ${this.email}`);
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
            
            form.querySelectorAll('.form-group input, .form-group select').forEach(field => {
                field.style.borderColor = '#e9ecef';
            });
            
            console.log('🔄 Formulario reiniciado');
        }
    }
}

// Inicializar
console.log('🔄 Cargando Inscription Modal con PDF integrado...');
window.inscriptionModal = new InscriptionModal();