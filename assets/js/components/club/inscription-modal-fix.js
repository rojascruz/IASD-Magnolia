// Parche para el envío profesional de emails con PDF garantizado

document.addEventListener('DOMContentLoaded', function() {
    // FUNCIÓN PARA CALCULAR EDAD AUTOMÁTICAMENTE
    function setupAgeCalculation() {
        console.log('🧮 Configurando cálculo automático de edad...');
        
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
                
                console.log(`🧮 Edad calculada para hijo ${childNumber}: ${age} años`);
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
                
                console.log(`📅 Listener de edad agregado a: ${input.name}`);
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
            console.log('👀 Observador de DOM configurado para nuevos campos de fecha');
        }
        
        return { attachDateListeners, calculateAge, suggestClub };
    }
    
    // Configurar cálculo de edad inmediatamente
    setTimeout(setupAgeCalculation, 500);
    
    // Esperar a que el modal se inicialice para la funcionalidad de email
    setTimeout(function() {
        if (window.inscriptionModal && window.inscriptionModal.sendEmailWithPDFInfo) {
            console.log('📧 Aplicando mejora profesional al envío de emails...');
            
            // Guardar la función original por si acaso
            window.inscriptionModal.originalSendEmail = window.inscriptionModal.sendEmailWithPDFInfo;
            
            // NUEVA FUNCIÓN MEJORADA: Genera PDF garantizado + Email profesional
            window.inscriptionModal.sendEmailWithPDFInfo = async function(data, pdfGenerated) {
                console.log('📧 Preparando email profesional con PDF garantizado...');
                
                // PASO 1: Asegurar que el PDF se genere
                let pdfGeneratedSuccessfully = pdfGenerated;
                
                if (!pdfGeneratedSuccessfully) {
                    console.log('🔧 PDF no generado previamente, intentando generar ahora...');
                    try {
                        pdfGeneratedSuccessfully = await this.tryGeneratePDF(data);
                        console.log('📄 Resultado de generación de PDF:', pdfGeneratedSuccessfully ? 'ÉXITO ✅' : 'FALLÓ ❌');
                    } catch (error) {
                        console.error('❌ Error generando PDF:', error);
                        pdfGeneratedSuccessfully = false;
                    }
                }
                
                // PASO 2: Si aún no hay PDF, intentar método alternativo
                if (!pdfGeneratedSuccessfully) {
                    console.log('🔄 Intentando método de PDF alternativo...');
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
                    console.log('📄 PDF generado:', pdfGeneratedSuccessfully ? 'SÍ ✅' : 'NO ⚠️');
                    
                    // Intentar abrir el cliente de email
                    window.location.href = mailtoLink;
                    
                    // Mensaje de instrucciones profesional
                    let message = '';
                    if (pdfGeneratedSuccessfully) {
                        message = `¡PERFECTO! PDF generado y email preparado.


El mensaje profesional ya está listo.`;
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
                    
                    console.log('✅ Proceso completado - PDF:', pdfGeneratedSuccessfully ? 'Generado ✅' : 'No disponible ⚠️', '+ Email profesional preparado para:', this.email);
                } catch (error) {
                    console.error('❌ Error al preparar el email:', error);
                    
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
                console.log('🎯 Generando PDF usando método HTML→Imagen exclusivamente...');
                
                try {
                    // MÉTODO ÚNICO: Nuevo generador con imagen completa (html2canvas + jsPDF)
                    if (window.generatePDFWithLogo) {
                        console.log('🖼️ Usando generador HTML→Imagen (formato visual completo)...');
                        const success = await window.generatePDFWithLogo(data);
                        if (success) {
                            console.log('✅ PDF visual con imagen completa generado exitosamente');
                            return true;
                        } else {
                            console.warn('⚠️ Método HTML→Imagen falló, reintentando...');
                        }
                    }
                    
                    // MÉTODO DIRECTO: Acceder al generador directamente
                    if (window.pdfGeneratorWithLogo) {
                        console.log('🔄 Intentando método directo HTML→Imagen...');
                        const success = await window.pdfGeneratorWithLogo.generatePDFFromHTML(data);
                        if (success) {
                            console.log('✅ PDF imagen generado exitosamente (método directo)');
                            return true;
                        }
                    }
                    
                    console.error('❌ NO se usará método básico de texto - solo formato imagen');
                    console.error('❌ Verifique que html2canvas esté cargado correctamente');
                    return false;
                    
                } catch (error) {
                    console.error('❌ Error en método de imagen HTML:', error);
                    return false;
                }
            };
            
            console.log('✅ Función de email profesional con PDF garantizado aplicada correctamente');
        } else {
            console.warn('⚠️ Modal de inscripción no encontrado, reintentando en 2 segundos...');
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
