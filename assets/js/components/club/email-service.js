/**
 * 📧 SERVICIO EMAILJS PROFESIONAL
 * Envío automático de emails con PDF adjunto
 * From: noreply@magnolia
 * Configuración: Completamente gratuito
 */

class EmailService {
    constructor() {
        // Configuración EmailJS
        this.serviceId = 'service_5z51hwo';
        this.templateId = 'template_lbd1vod';
        this.publicKey = 'rxIFsrCp--brpWy-2';
        
        this.isInitialized = false;
        this.initEmailJS();
    }

    // Inicializar EmailJS
    async initEmailJS() {
        try {
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.publicKey);
                this.isInitialized = true;
                return;
            }
            await this.loadEmailJSScript();
            
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.publicKey);
                this.isInitialized = true;
                
            }
        } catch (error) {
            
            this.isInitialized = false;
        }
    }

    // Cargar script EmailJS
    loadEmailJSScript() {
        return new Promise((resolve, reject) => {
            if (typeof emailjs !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                
                resolve();
            };
            script.onerror = (error) => {
                
                reject(error);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * ENVÍO AUTOMÁTICO DE EMAIL CON PDF
     * @param {Object} data - Datos de inscripción
     * @param {Blob} pdfBlob - PDF generado
     * @param {string} recipientEmail - Email destinatario
     * @returns {Promise<boolean>} - Éxito del envío
     */
    async sendInscriptionEmail(data, pdfBlob, recipientEmail) {
        

        try {
            // Verificar inicialización
            if (!this.isInitialized) {
                
                await this.initEmailJS();
                
                if (!this.isInitialized) {
                    throw new Error('EmailJS no se pudo inicializar');
                }
            }

            // Preparar datos del email
            const emailData = await this.prepareEmailData(data, recipientEmail, pdfBlob);

            
            
            
            
            
            // Verificar que attachments existe y su tamaño del PDF para evitar error 413
            if (emailData.attachments && emailData.attachments.length > 0) {
                const pdfBase64 = emailData.attachments[0].data;
                const pdfSizeKB = Math.round(pdfBase64.length / 1024);
                
                console.log('📏 Tamaño PDF Base64:', pdfSizeKB + 'KB (límite: 40KB)');
                console.log('📎 Attachments:', emailData.attachments.length + ' archivo(s)');
                
                // Si el PDF es muy grande, enviarlo sin attachment y forzar descarga
                if (pdfSizeKB > 40) { // Aumentado de 35KB a 40KB
                    console.warn('⚠️ PDF muy grande (' + pdfSizeKB + 'KB), enviando sin attachment + descarga automática...');
                    
                    // Crear copia sin attachments
                    const emailDataWithoutPDF = { ...emailData };
                    emailDataWithoutPDF.attachments = [];
                    emailDataWithoutPDF.has_pdf = false;
                    
                    // Agregar nota al mensaje
                    emailDataWithoutPDF.message += '\n\n--- NOTA IMPORTANTE ---\nEl PDF de inscripción se descargó automáticamente en su dispositivo.\nPor favor, revise la carpeta de Descargas y adjúntelo manualmente a este email.';
                    
                    console.log('📋 Datos para EmailJS (SIN PDF):', emailDataWithoutPDF);
                    
                    // ENVÍO SIN PDF
                    const result = await emailjs.send(
                        this.serviceId,
                        this.templateId,
                        emailDataWithoutPDF
                    );
                    
                    
                    
                    // FORZAR DESCARGA AUTOMÁTICA DEL PDF
                    if (pdfBlob) {
                        
                        const url = URL.createObjectURL(pdfBlob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Inscripcion_${data.child_name || 'Club'}_${new Date().toISOString().split('T')[0]}.pdf`;
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        
                    }
                    
                    return {
                        success: true,
                        messageId: result.text,
                        pdfDownloaded: true,
                        message: 'Email enviado exitosamente. PDF descargado automáticamente.'
                    };
                }
            } else {
                
                
            }
            
            

            // ENVÍO AUTOMÁTICO
            const result = await emailjs.send(
                this.serviceId,
                this.templateId,
                emailData
            );

            

            return {
                success: true,
                messageId: result.text,
                message: 'Email enviado automáticamente con éxito'
            };

        } catch (error) {
            
            
            return {
                success: false,
                error: error.message,
                message: 'Error en el envío automático'
            };
        }
    }

    /**
     * PREPARAR DATOS PARA EMAILJS
     */
    async prepareEmailData(data, recipientEmail, pdfBlob) {
        const childrenNames = data.children.map(child => child.name).join(', ');
        const childCount = data.children.length;
        const childText = childCount === 1 ? 'hijo/hija' : 'hijos/hijas';

        // Convertir PDF a base64 para adjunto
        let pdfAttachment = '';
        if (pdfBlob) {
            try {
                // Convertir blob a base64
                pdfAttachment = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64 = reader.result.split(',')[1]; // Solo la parte base64
                        
                        resolve(base64);
                    };
                    reader.onerror = () => {
                        
                        reject(new Error('Error converting PDF to Base64'));
                    };
                    reader.readAsDataURL(pdfBlob);
                });
            } catch (error) {
                
                pdfAttachment = '';
            }
        } else {
            
        }

        // DATOS DEL EMAIL CORREGIDOS
        const emailData = {
            // CONFIGURACIÓN AUTOMÁTICA - FROM: Tu cuenta EmailJS (estático)
            from_email: 'jrojasj73@gmail.com', // Tu cuenta EmailJS
            from_name: 'IASD Magnolia - Club Juvenil',
            
            // TO: Email del formulario de inscripción (dinámico)
            to_email: recipientEmail, // Email de la inscripción
            to_name: data.parent.name,
            
            // CONTENIDO PERSONALIZADO
            subject: 'Inscripción Club Juvenil - IASD Magnolia',
            children_names: childrenNames,
            children_count: childCount,
            child_text: childText,
            parent_name: data.parent.name,
            
            // MENSAJE EXACTO SOLICITADO (como estaba antes)
            message: `Estimados hermanos,

Envío el PDF con la inscripción de su ${childText} ${childrenNames} para el club juvenil.

El PDF contiene toda la información detallada de la inscripción. Por favor, revisen la información y nos pondremos en contacto pronto para confirmar la participación.

Que Dios les bendiga,

Iglesia Adventista del Séptimo Día Magnolia
Bayamón, Puerto Rico`,

            // METADATOS
            timestamp: new Date().toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            website: 'www.iasdmagnolia.org',
            
            // 📎 PDF ATTACHMENT (Base64 para EmailJS)
            attachments: pdfAttachment ? [{
                name: `Inscripcion_${data.parent.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
                data: pdfAttachment,  // Cambiar 'content' por 'data' para EmailJS
                type: 'application/pdf'
            }] : [],
            
            // PDF INFO
            has_pdf: !!pdfAttachment,
            pdf_status: pdfAttachment ? 'PDF adjuntado exitosamente' : 'PDF no disponible en este momento'
        };
        
        // DEBUG: Verificar que attachments se creó correctamente
        
        console.log('  - attachments es array?', Array.isArray(emailData.attachments));
        
        
        
        
        return emailData;
    }

    /**
     * OBTENER NOMBRE COMPLETO DEL CLUB
     */
    getClubFullName(clubCode) {
        const clubNames = {
            'aventureros': '🌟 Los Aventureros (6-9 años)',
            'conquistadores': '🏕️ Conquistadores (10-15 años)', 
            'cadetes': '🎯 Cadetes (16-21 años)',
            'guias': '🌸 Guías Mayores (16-21 años)'
        };
        return clubNames[clubCode] || clubCode;
    }

    /**
     * VERIFICAR ESTADO DEL SERVICIO
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            serviceId: this.serviceId,
            templateId: this.templateId,
            ready: this.isInitialized && typeof emailjs !== 'undefined'
        };
    }

    /**
     * MÉTODO DE RESPALDO: Usar mailto si EmailJS falla
     */
    fallbackToMailto(data, recipientEmail) {
        console.log('📧 Usando método de respaldo (mailto)...');
        
        const childrenNames = data.children.map(child => child.name).join(', ');
        const childCount = data.children.length;
        const childText = childCount === 1 ? 'hijo/hija' : 'hijos/hijas';
        
        const subject = 'Inscripción Club Juvenil - IASD Magnolia';
        const body = `Estimados hermanos,

Saludos cordiales. Adjunto encontrarán la inscripción de ${childText} ${childrenNames} para el club juvenil.

Por favor, revisen la información y nos pondremos en contacto pronto.

Que Dios les bendiga,
IASD Magnolia`;

        const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        
        return {
            success: true,
            method: 'mailto',
            message: 'Cliente de email abierto (método de respaldo)'
        };
    }
}

// Instancia global
window.emailService = new EmailService();


console.log('📊 Estado inicial EmailJS:', window.emailService.getStatus());

// Verificar EmailJS en 2 segundos
setTimeout(() => {
    console.log('📊 Estado EmailJS después de 2 segundos:', window.emailService.getStatus());
    
}, 2000);
