// EMAIL SENDER AUTOMÁTICO - Sistema de envío con PDF adjunto
// Usa EmailJS para envío sin backend

class EmailSender {
    constructor() {
        this.serviceId = 'service_iasd_magnolia';  // Se configurará en EmailJS
        this.templateId = 'template_inscription';   // Se configurará en EmailJS
        this.publicKey = 'YOUR_PUBLIC_KEY';        // Se configurará en EmailJS
        this.isInitialized = false;
        
        console.log('📧 Inicializando sistema de email automático...');
        this.init();
    }

    async init() {
        try {
            // Cargar EmailJS dinámicamente
            await this.loadEmailJS();
            
            // Inicializar EmailJS con la clave pública
            if (window.emailjs) {
                emailjs.init(this.publicKey);
                this.isInitialized = true;
                console.log('✅ EmailJS inicializado correctamente');
            }
        } catch (error) {
            console.error('❌ Error inicializando EmailJS:', error);
            this.isInitialized = false;
        }
    }

    async loadEmailJS() {
        return new Promise((resolve, reject) => {
            // Verificar si ya está cargado
            if (window.emailjs) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.async = true;
            
            script.onload = () => {
                console.log('📦 EmailJS library cargada');
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Error cargando EmailJS'));
            };
            
            document.head.appendChild(script);
        });
    }

    // Método principal: Enviar email con PDF
    async sendInscriptionEmail(formData, pdfBlob) {
        if (!this.isInitialized) {
            throw new Error('EmailJS no está inicializado');
        }

        try {
            console.log('📧 Preparando envío de email...');

            // Convertir PDF a base64 para adjuntar
            const pdfBase64 = await this.blobToBase64(pdfBlob);
            
            // Preparar datos del template
            const templateParams = {
                // Información del remitente (automático)
                from_name: 'IASD Magnolia Bayamón',
                from_email: 'noreply@tes.com',
                
                // Información del destinatario (del formulario)
                to_email: formData.parentEmail,
                to_name: `${formData.parentName} ${formData.parentLastname}`,
                
                // Información de la inscripción
                parent_name: `${formData.parentName} ${formData.parentLastname}`,
                parent_phone: formData.parentPhone,
                children_count: formData.children?.length || 0,
                children_names: this.formatChildrenNames(formData.children),
                children_details: this.formatChildrenDetails(formData.children),
                
                // Fecha y hora
                inscription_date: new Date().toLocaleDateString('es-PR'),
                inscription_time: new Date().toLocaleTimeString('es-PR'),
                
                // PDF adjunto
                pdf_attachment: pdfBase64,
                pdf_filename: this.generatePDFFileName(formData),
                
                // Mensaje personalizado
                message: this.createPersonalizedMessage(formData),
                
                // Información de la iglesia
                church_name: 'Iglesia Adventista del Séptimo Día',
                church_location: 'Magnolia, Bayamón',
                church_website: 'www.iasdmagnolia.org'
            };

            console.log('📤 Enviando email con datos:', {
                to: templateParams.to_email,
                children: templateParams.children_count,
                pdfSize: `${(pdfBase64.length / 1024).toFixed(2)}KB`
            });

            // Enviar email usando EmailJS
            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );

            console.log('✅ Email enviado exitosamente:', response);
            return {
                success: true,
                messageId: response.text,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Error enviando email:', error);
            throw error;
        }
    }

    // Convertir Blob a Base64
    async blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Obtener solo la parte base64 (sin el prefijo data:...)
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Formatear nombres de hijos
    formatChildrenNames(children) {
        if (!children || children.length === 0) return 'Ninguno';
        
        return children.map(child => 
            `${child.name} ${child.lastname}`
        ).join(', ');
    }

    // Formatear detalles de hijos
    formatChildrenDetails(children) {
        if (!children || children.length === 0) return 'No hay hijos registrados.';
        
        return children.map((child, index) => {
            const clubName = this.getClubDisplayName(child.selectedClub);
            return `${index + 1}. ${child.name} ${child.lastname} (${child.age} años) - ${clubName}`;
        }).join('\n');
    }

    // Obtener nombre del club para mostrar
    getClubDisplayName(clubValue) {
        const clubs = {
            'aventureros': 'Aventureros (6-9 años)',
            'conquistadores': 'Conquistadores (10-15 años)',
            'cadetes': 'Cadetes (16-21 años)'
        };
        return clubs[clubValue] || 'Club no especificado';
    }

    // Generar nombre del archivo PDF
    generatePDFFileName(formData) {
        const date = new Date().toISOString().slice(0, 10);
        const parentName = formData.parentName.replace(/[^a-zA-Z0-9]/g, '');
        return `Inscripcion_IASD_${parentName}_${date}.pdf`;
    }

    // Crear mensaje personalizado
    createPersonalizedMessage(formData) {
        const childCount = formData.children?.length || 0;
        const childText = childCount === 1 ? 'hijo' : 'hijos';
        
        return `Estimado/a ${formData.parentName} ${formData.parentLastname},

¡Gracias por inscribir a su${childCount > 1 ? 's' : ''} ${childText} en nuestros clubs juveniles!

Hemos recibido su solicitud de inscripción para ${childCount} ${childText}. En el PDF adjunto encontrará todos los detalles de la inscripción.

Nos pondremos en contacto con usted pronto para confirmar las fechas de inicio y proporcionar más información.

¡Esperamos ver pronto a su familia en nuestra iglesia!

Bendiciones,
Equipo IASD Magnolia Bayamón`;
    }

    // Método para mostrar configuración necesaria
    showConfigurationInstructions() {
        const instructions = `
📧 CONFIGURACIÓN REQUERIDA PARA EMAILJS:

1. Crear cuenta en https://emailjs.com
2. Crear un servicio de email (Gmail, Outlook, etc.)
3. Crear template de email con estos campos:
   - {{from_name}}, {{from_email}}
   - {{to_name}}, {{to_email}}
   - {{parent_name}}, {{parent_phone}}
   - {{children_details}}, {{message}}
   - {{pdf_attachment}} (como adjunto)
   - {{church_name}}, {{church_location}}

4. Obtener:
   - Service ID
   - Template ID  
   - Public Key

5. Actualizar las constantes en este archivo.
        `;
        
        console.log(instructions);
        return instructions;
    }

    // Método de prueba
    async testConfiguration() {
        console.log('🧪 Probando configuración de EmailJS...');
        
        if (!this.isInitialized) {
            console.error('❌ EmailJS no inicializado');
            return false;
        }

        // Datos de prueba
        const testData = {
            parentName: 'Juan',
            parentLastname: 'Pérez',
            parentEmail: 'test@example.com',
            parentPhone: '787-123-4567',
            children: [{
                name: 'María',
                lastname: 'Pérez',
                age: 8,
                selectedClub: 'aventureros'
            }]
        };

        try {
            // Crear PDF de prueba simple
            const testPdfBlob = new Blob(['Test PDF content'], { type: 'application/pdf' });
            
            await this.sendInscriptionEmail(testData, testPdfBlob);
            console.log('✅ Configuración funcionando correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error en la configuración:', error);
            return false;
        }
    }
}

// Exponer globalmente
window.EmailSender = EmailSender;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.emailSender = new EmailSender();
    console.log('📧 Email Sender inicializado y disponible globalmente');
});