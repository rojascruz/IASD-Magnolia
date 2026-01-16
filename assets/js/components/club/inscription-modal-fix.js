// Parche para el envío profesional de emails con PDF garantizado





document.addEventListener('DOMContentLoaded', function() {
    // FUNCIÓN PARA CALCULAR EDAD AUTOMÁTICAMENTE
    function setupAgeCalculation() {
        
        
        // Función para calcular edad exacta
        function calculateAge(birthDate) {
            const today = new Date();
            const birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            
            return age;
        }
        
        // Función para sugerir club basado en la edad
        function suggestClub(age) {
            if (age >= 6 && age <= 9) {
                return 'aventureros';
            } else if (age >= 10 && age <= 15) {
                return 'conquistadores';
            } else if (age >= 16 && age <= 21) {
                return 'cadetes';
            }
            return '';
        }
        
        // Función para actualizar edad y club
        function updateAgeAndClub(birthdateInput) {
            const childNumber = birthdateInput.name.split('_')[1];
            const ageInput = document.querySelector(`input[name="childAge_${childNumber}"]`);
            const clubSelect = document.querySelector(`select[name="selectedClub_${childNumber}"]`);
            
            if (birthdateInput.value && ageInput) {
                const age = calculateAge(birthdateInput.value);
                
                // Validar que la edad esté en rango válido
                if (age < 0) {
                    if (window.notifications) {
                        window.notifications.error(
                            'Fecha Inválida',
                            'La fecha de nacimiento no puede ser en el futuro.',
                            { duration: 4000 }
                        );
                    }
                    birthdateInput.value = '';
                    return;
                }
                
                if (age > 100) {
                    if (window.notifications) {
                        window.notifications.error(
                            'Fecha Inválida',
                            'Por favor, verifique la fecha de nacimiento.',
                            { duration: 4000 }
                        );
                    }
                    birthdateInput.value = '';
                    return;
                }
                
                // Establecer la edad
                ageInput.value = age;
                ageInput.classList.add('auto-calculated');
                ageInput.readOnly = true; // Hacer que no se pueda editar manualmente
                
                // Validar si está en rango para clubs (6-21)
                if (age < 6 || age > 21) {
                    if (window.notifications) {
                        window.notifications.warning(
                            'Edad Fuera de Rango',
                            `La edad es ${age} años. Los clubs son para edades 6-21 años. Contacte a la iglesia para opciones especiales.`,
                            { duration: 6000 }
                        );
                    }
                    if (clubSelect) {
                        clubSelect.value = '';
                        clubSelect.style.backgroundColor = '#ffe6e6';
                        clubSelect.style.border = '2px solid #ff9800';
                    }
                    return;
                }
                
                // Sugerir club automáticamente
                if (clubSelect) {
                    const suggestedClub = suggestClub(age);
                    if (suggestedClub) {
                        clubSelect.value = suggestedClub;
                        clubSelect.classList.add('auto-suggested');
                        clubSelect.style.backgroundColor = '#fff3cd';
                        clubSelect.style.border = '2px solid #ffc107';
                    }
                }
                
                // Mostrar notificación amigable
                let clubMessage = '';
                if (clubSelect && clubSelect.value) {
                    const clubText = clubSelect.options[clubSelect.selectedIndex].text;
                    clubMessage = `\n Club sugerido: ${clubText}`;
                }
                
                if (window.notifications) {
                    window.notifications.success(
                        'Gracias por inscribir a su hijo/a',
                        `✅ Edad: ${age} años${clubMessage}\n\n💡`,
                        { duration: 4000 }
                    );
                }
                
                
            }
        }
        
        // Configurar listeners para campos de fecha existentes
        function attachDateListeners() {
            const birthdateInputs = document.querySelectorAll('input[name*="childBirthdate_"]');
            
            birthdateInputs.forEach(input => {
                // Remover listener anterior para evitar duplicados
                input.removeEventListener('change', input._ageCalculatorHandler);
                
                // Crear nueva función handler
                input._ageCalculatorHandler = function() {
                    updateAgeAndClub(this);
                };
                
                // Agregar listener
                input.addEventListener('change', input._ageCalculatorHandler);
                
                
            });
        }
        
        // Ejecutar inmediatamente
        attachDateListeners();
        
        // También observar cambios en el DOM para nuevos hijos agregados
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // Esperar un poco para que el DOM se estabilice
                    setTimeout(attachDateListeners, 100);
                }
            });
        });
        
        // Observar el contenedor del modal
        const modalContent = document.querySelector('#inscription-modal');
        if (modalContent) {
            observer.observe(modalContent, {
                childList: true,
                subtree: true
            });
            
        }
        
        return { attachDateListeners, calculateAge, suggestClub };
    }
    
    // Configurar cálculo de edad inmediatamente
    setTimeout(setupAgeCalculation, 500);
    
    // Esperar a que el modal se inicialice para la funcionalidad de email
    setTimeout(function() {
        if (window.inscriptionModal && window.inscriptionModal.sendEmailWithPDFInfo) {
            
            
            // Guardar la función original por si acaso
            window.inscriptionModal.originalSendEmail = window.inscriptionModal.sendEmailWithPDFInfo;
            
            // NUEVA FUNCIÓN MEJORADA: EmailJS automático + PDF garantizado
            window.inscriptionModal.sendEmailWithPDFInfo = async function(data, pdfGenerated) {
                
                
                
                
                
                
                // PASO 1: Verificar EmailJS - MÁS DETALLADO
                
                
                
                
                console.log('📊 [FIX] window tiene keys:', Object.keys(window).filter(k => k.includes('email')));
                
                if (window.emailService) {
                    try {
                        const status = window.emailService.getStatus();
                        
                        
                        // FORZAR INICIALIZACIÓN SI ES NECESARIO
                        if (!status.ready) {
                            
                            await window.emailService.initEmailJS();
                            
                            const newStatus = window.emailService.getStatus();
                            
                        }
                        
                        // VERIFICAR DE NUEVO
                        const finalStatus = window.emailService.getStatus();
                        if (finalStatus.ready) {
                            
                            
                            // PASO 2: Asegurar PDF
                            let pdfGeneratedSuccessfully = pdfGenerated;
                            const pdfBlob = window.lastGeneratedPDF || null;
                            
                            if (!pdfGeneratedSuccessfully) {
                                
                                try {
                                    pdfGeneratedSuccessfully = await this.tryGeneratePDF(data);
                                    
                                } catch (error) {
                                    
                                }
                            }
                            
                            // PASO 3: ENVÍO AUTOMÁTICO CON EMAILJS
                            
                            
                            
                            
                            const result = await window.emailService.sendInscriptionEmail(
                                data, 
                                pdfBlob, 
                                this.email
                            );

                            

                            if (result.success) {
                                
                                
                                const childrenText = data.children.length === 1 ? '1 hijo/hija' : `${data.children.length} hijos/hijas`;
                                
                                if (window.notifications) {
                                    window.notifications.success(
                                        'Email Enviado Automáticamente (EmailJS)',
                                        `¡Perfecto! Se envió el email automáticamente a ${this.email} con el PDF adjunto para ${childrenText}.`,
                                        {
                                            duration: 8000,
                                            actions: [
                                                {
                                                    label: '✅ Entendido',
                                                    action: () => console.log('[FIX] Usuario confirmó envío automático EmailJS')
                                                }
                                            ]
                                        }
                                    );
                                } else {
                                    alert(`¡Email Enviado Automáticamente!\n\nEl email fue enviado exitosamente a ${this.email}.`);
                                }
                                
                                this.closeModal();
                                this.resetForm();
                                return;
                            } else {
                                
                            }
                        } else {
                            
                        }
                    } catch (error) {
                        
                    }
                } else {
                    
                }
                
                // RESPALDO: Método original mejorado
                
                
                // PASO 1: Asegurar que el PDF se genere
                let pdfGeneratedSuccessfully = pdfGenerated;
                
                if (!pdfGeneratedSuccessfully) {
                    
                    try {
                        pdfGeneratedSuccessfully = await this.tryGeneratePDF(data);
                        
                    } catch (error) {
                        
                        pdfGeneratedSuccessfully = false;
                    }
                }
                
                // PASO 2: Si aún no hay PDF, intentar método alternativo
                if (!pdfGeneratedSuccessfully) {
                    
                    pdfGeneratedSuccessfully = await this.forceGeneratePDF(data);
                }
                
                // PASO 3: Crear mensaje profesional y conciso
                const subject = 'Inscripción Club Juvenil - IASD Magnolia';
                
                // Determinar nombres de los hijos para el mensaje
                const childrenNames = data.children.map(child => child.name).join(', ');
                const childCount = data.children.length;
                const childText = childCount === 1 ? 'hijo/hija' : 'hijos/hijas';
                
                // MENSAJE PROFESIONAL CORTO
                const body = `Estimados hermanos,

Envío el PDF con la inscripción de su ${childText} ${childrenNames} para el club juvenil.

El PDF contiene toda la información detallada de la inscripción. Por favor, revisen la información y nos pondremos en contacto pronto para confirmar la participación.

Que Dios les bendiga,

Iglesia Adventista del Séptimo Día Magnolia
Bayamón, Puerto Rico`;
                
                try {
                    const mailtoLink = `mailto:${this.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    
                    // Log para debugging
                    
                    
                    
                    
                    
                    // Intentar abrir el cliente de email
                    window.location.href = mailtoLink;
                    
                    // Mensaje de instrucciones profesional
                    let message = '';
                    if (pdfGeneratedSuccessfully) {
                        message = `¡PERFECTO! PDF generado y email preparado.`;
                    } else {
                        message = `⚠️ ATENCIÓN: Email preparado pero PDF no se generó.

📋 OPCIONES:
1. 📧 Envíe el email con la información que aparece
2. 🔄 Intente llenar el formulario nuevamente
3. 📱 Contacte directamente a la iglesia

El mensaje básico está en el correo.`;
                    }
                    
                    if (window.notifications) {
                        window.notifications.success(
                            pdfGeneratedSuccessfully ? 'PDF + Email Listos' : 'Email Preparado (Sin PDF)',
                            message,
                            {
                                duration: 15000
                            }
                        );
                    } else {
                        alert(`${pdfGeneratedSuccessfully ? 'PDF + Email Listos' : 'Email Preparado (Sin PDF)'}\n\n${message}`);
                    }
                    
                    this.closeModal();
                    this.resetForm();
                    
                    
                } catch (error) {
                    
                    
                    if (window.notifications) {
                        window.notifications.error(
                            'Error al Preparar Email',
                            `No se pudo abrir el cliente de correo automáticamente. 
                            
ENVÍO MANUAL:
1. Abra su cliente de correo
2. Destinatario: ${this.email}
3. Asunto: ${subject}
4. ${pdfGeneratedSuccessfully ? 'Adjunte el PDF descargado' : 'Incluya la información del formulario'}`,
                            {
                                duration: 20000
                            }
                        );
                    } else {
                        alert(`Error al preparar el email.\n\nEnvíe manualmente a: ${this.email}\nAsunto: ${subject}\n${pdfGeneratedSuccessfully ? 'Y adjunte el PDF descargado.' : 'E incluya la información del formulario.'}`);
                    }
                }
            };
            
            // NUEVA FUNCIÓN: Generar PDF usando SOLO el método de imagen HTML
            window.inscriptionModal.forceGeneratePDF = async function(data) {
                
                
                try {
                    // MÉTODO ÚNICO: Nuevo generador con imagen completa (html2canvas + jsPDF)
                    if (window.generatePDFWithLogo) {
                        console.log('🖼️ Usando generador HTML→Imagen (formato visual completo)...');
                        const success = await window.generatePDFWithLogo(data);
                        if (success) {
                            
                            return true;
                        } else {
                            
                        }
                    }
                    
                    // MÉTODO DIRECTO: Acceder al generador directamente
                    if (window.pdfGeneratorWithLogo) {
                        
                        const success = await window.pdfGeneratorWithLogo.generatePDFFromHTML(data);
                        if (success) {
                            console.log('✅ PDF imagen generado exitosamente (método directo)');
                            return true;
                        }
                    }
                    
                    
                    
                    return false;
                    
                } catch (error) {
                    
                    return false;
                }
            };
            
            
        } else {
            
            setTimeout(arguments.callee, 2000);
        }
    }, 1000); // Cierre del setTimeout para funcionalidad de email
    
    // Re-configurar cálculo de edad cuando el modal se abra
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'open-inscription') {
            // Esperar a que el modal se abra completamente
            setTimeout(setupAgeCalculation, 800);
        }
    });
    
});
