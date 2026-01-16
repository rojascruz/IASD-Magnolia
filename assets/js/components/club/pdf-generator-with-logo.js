// Generador de PDF con Logo - Solución Gratuita y Confiable
// Usa html2canvas + jsPDF para renderizar HTML a PDF con imágenes

class PDFGeneratorWithLogo {
    constructor() {
        this.logoPath = 'assets/images/letter/LogoLetter.png';
        this.logoLoaded = false;
        this.logoBase64 = null;
        
        // Pre-cargar el logo
        this.preloadLogo();
    }

    async preloadLogo() {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    console.log('🖼️ Logo cargado exitosamente');
                    
                    // Convertir a base64
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    this.logoBase64 = canvas.toDataURL('image/png');
                    this.logoLoaded = true;
                    resolve(true);
                };
                
                img.onerror = () => {
                    console.warn('⚠️ No se pudo cargar el logo desde:', this.logoPath);
                    resolve(false);
                };
                
                img.src = this.logoPath;
            });
        } catch (error) {
            console.error('❌ Error cargando logo:', error);
            return false;
        }
    }

    // Método principal: Genera PDF usando HTML template
    async generatePDFFromHTML(data) {
        try {
            console.log('🏗️ Generando PDF desde HTML template (formato imagen completa)...');
            console.log('🔍 Verificando disponibilidad de html2canvas...');
            console.log('typeof html2canvas:', typeof html2canvas);
            console.log('window.html2canvas:', window.html2canvas);
            
            // Verificar html2canvas ANTES de continuar
            if (typeof html2canvas === 'undefined' && !window.html2canvas) {
                console.error('❌ html2canvas NO DISPONIBLE - El PDF será básico');
                console.error('🔧 Solución: Cargar html2canvas correctamente');
                
                // En lugar de fallar, voy a crear un PDF más profesional sin html2canvas
                return this.generateAdvancedBasicPDF(data);
            }
            
            console.log('✅ html2canvas disponible, procediendo con renderizado...');
            
            // Usar la función html2canvas correcta
            const html2canvasFunc = typeof html2canvas !== 'undefined' ? html2canvas : window.html2canvas;
            
            // Crear template HTML en memoria
            const htmlTemplate = this.createHTMLTemplate(data);
            console.log('📝 Template HTML creado');
            
            // Crear div temporal para renderizar
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlTemplate;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            tempDiv.style.width = '210mm'; // Ancho A4
            tempDiv.style.backgroundColor = 'white';
            tempDiv.style.padding = '20mm';
            tempDiv.style.boxSizing = 'border-box';
            tempDiv.style.fontFamily = 'Arial, sans-serif';
            
            document.body.appendChild(tempDiv);
            console.log('🔧 Elemento temporal agregado al DOM');
            
            // Esperar a que se renderice completamente
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('⏰ Esperando renderizado completado');
            
            console.log('📸 Iniciando captura con html2canvas...');
            
            // Capturar HTML como imagen con configuración optimizada
            const canvas = await html2canvasFunc(tempDiv, {
                scale: 2, // Alta calidad
                backgroundColor: '#ffffff',
                logging: true, // Habilitar logs para debugging
                useCORS: true,
                allowTaint: true,
                width: tempDiv.offsetWidth,
                height: tempDiv.offsetHeight
            });
            
            console.log('✅ Canvas creado exitosamente:', canvas.width + 'x' + canvas.height);
            
            // Limpiar DOM
            document.body.removeChild(tempDiv);
            
            console.log('🖼️ Imagen capturada exitosamente, creando PDF...');
            
            // Crear PDF
            const imgData = canvas.toDataURL('image/png');
            
            let pdf;
            if (window.jspdf && window.jspdf.jsPDF) {
                pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
            } else if (window.jsPDF) {
                pdf = new window.jsPDF('p', 'mm', 'a4');
            } else {
                pdf = new jsPDF('p', 'mm', 'a4');
            }
            
            // Calcular dimensiones para ajustar a A4 manteniendo aspect ratio
            const pdfWidth = 210; // A4 width in mm
            const pdfHeight = 297; // A4 height in mm
            const imgAspectRatio = canvas.width / canvas.height;
            const pdfAspectRatio = pdfWidth / pdfHeight;
            
            let imgWidth, imgHeight;
            if (imgAspectRatio > pdfAspectRatio) {
                imgWidth = pdfWidth;
                imgHeight = pdfWidth / imgAspectRatio;
            } else {
                imgHeight = pdfHeight;
                imgWidth = pdfHeight * imgAspectRatio;
            }
            
            const x = (pdfWidth - imgWidth) / 2;
            const y = (pdfHeight - imgHeight) / 2;
            
            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            
            // Generar nombre del archivo
            const fileName = this.generateFileName(data);
            
            // NUEVO: Guardar PDF blob para envío por email
            const pdfBlob = pdf.output('blob');
            window.lastGeneratedPDF = pdfBlob;
            console.log('💾 PDF blob guardado para email automático');
            
            // Descargar
            pdf.save(fileName);
            
            console.log('✅ ¡PDF FORMATO IMAGEN GENERADO EXITOSAMENTE!:', fileName);
            return true;
            
        } catch (error) {
            console.error('❌ Error generando PDF desde HTML:', error);
            console.error('Detalles del error:', error.message);
            console.error('Stack trace:', error.stack);
            
            // Fallback a PDF profesional sin html2canvas
            console.log('🔄 Intentando método profesional alternativo...');
            return this.generateAdvancedBasicPDF(data);
        }
    }

    // Método alternativo: PDF profesional sin html2canvas
    async generateAdvancedBasicPDF(data) {
        try {
            console.log('🎨 Generando PDF profesional avanzado (sin html2canvas)...');
            
            let pdf;
            if (window.jspdf && window.jspdf.jsPDF) {
                pdf = new window.jspdf.jsPDF();
            } else if (window.jsPDF) {
                pdf = new window.jsPDF();
            } else {
                pdf = new jsPDF();
            }
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // HEADER PROFESIONAL CON LOGO
            if (this.logoLoaded && this.logoBase64) {
                try {
                    // Logo en esquina superior derecha con aspect ratio correcto
                    const logoMaxWidth = 30;
                    const logoMaxHeight = 25;
                    pdf.addImage(this.logoBase64, 'PNG', pageWidth - logoMaxWidth - 15, 15, logoMaxWidth, logoMaxHeight);
                    console.log('🖼️ Logo profesional agregado');
                } catch (logoError) {
                    console.warn('⚠️ Error agregando logo:', logoError);
                }
            }
            
            // HEADER PRINCIPAL
            pdf.setFillColor(44, 90, 160); // Azul IASD
            pdf.rect(15, 10, pageWidth - 30, 35, 'F');
            
            pdf.setTextColor(255, 255, 255); // Texto blanco
            pdf.setFontSize(20);
            pdf.setFont(undefined, 'bold');
            pdf.text('INSCRIPCIÓN CLUB JUVENIL', pageWidth / 2, 25, { align: 'center' });
            
            pdf.setFontSize(14);
            pdf.text('IGLESIA ADVENTISTA DEL SÉPTIMO DÍA MAGNOLIA', pageWidth / 2, 35, { align: 'center' });
            
            pdf.setFontSize(12);
            pdf.text('Bayamón, Puerto Rico', pageWidth / 2, 42, { align: 'center' });
            
            // INFORMACIÓN DE SOLICITUD
            pdf.setTextColor(100, 100, 100);
            pdf.setFontSize(10);
            const currentDate = new Date();
            const dateStr = currentDate.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const timeStr = currentDate.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            pdf.text(`Fecha de solicitud: ${dateStr}, ${timeStr}`, 20, 55);
            const refNumber = 'INS-' + Math.floor(Math.random() * 900000 + 100000);
            pdf.text(`Número de referencia: ${refNumber}`, 20, 62);
            
            let currentY = 80;
            
            // SECCIÓN PADRE/MADRE
            pdf.setFillColor(240, 244, 248);
            pdf.rect(15, currentY - 5, pageWidth - 30, 8, 'F');
            
            pdf.setTextColor(44, 90, 160);
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('INFORMACIÓN DEL PADRE/MADRE/TUTOR', 20, currentY);
            
            // Línea decorativa
            pdf.setDrawColor(44, 90, 160);
            pdf.setLineWidth(1);
            pdf.line(20, currentY + 5, pageWidth - 20, currentY + 5);
            
            currentY += 20;
            
            // Información del padre en formato profesional
            pdf.setTextColor(50, 50, 50);
            pdf.setFontSize(11);
            pdf.setFont(undefined, 'bold');
            
            const parentInfo = [
                ['Nombre Completo:', data.parent.name],
                ['Teléfono:', data.parent.phone],
                ['Correo Electrónico:', data.parent.email]
            ];
            
            if (data.parent.address) {
                parentInfo.push(['Dirección:', data.parent.address]);
            }
            
            parentInfo.forEach(([label, value]) => {
                pdf.setFont(undefined, 'bold');
                pdf.setTextColor(50, 50, 50);
                pdf.text(label, 20, currentY);
                
                pdf.setFont(undefined, 'normal');
                pdf.setTextColor(0, 0, 0);
                pdf.text(value, 70, currentY);
                
                currentY += 8;
            });
            
            currentY += 15;
            
            // SECCIÓN HIJOS
            pdf.setFillColor(240, 244, 248);
            pdf.rect(15, currentY - 5, pageWidth - 30, 8, 'F');
            
            pdf.setTextColor(44, 90, 160);
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text(`INFORMACIÓN DE LOS HIJOS (Total: ${data.children.length})`, 20, currentY);
            
            // Línea decorativa
            pdf.setDrawColor(44, 90, 160);
            pdf.line(20, currentY + 5, pageWidth - 20, currentY + 5);
            
            currentY += 20;
            
            // Información de cada hijo
            data.children.forEach((child, index) => {
                // Verificar si necesitamos nueva página
                if (currentY > pageHeight - 60) {
                    pdf.addPage();
                    currentY = 30;
                    
                    // Logo en nueva página
                    if (this.logoLoaded && this.logoBase64) {
                        try {
                            pdf.addImage(this.logoBase64, 'PNG', pageWidth - 30 - 15, 15, 30, 25);
                        } catch (error) {
                            console.warn('Error agregando logo en nueva página');
                        }
                    }
                }
                
                // Header del hijo con color
                pdf.setFillColor(34, 139, 34); // Verde
                pdf.rect(15, currentY - 3, pageWidth - 30, 10, 'F');
                
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(12);
                pdf.setFont(undefined, 'bold');
                pdf.text(`HIJO/HIJA #${index + 1}`, 20, currentY + 2);
                
                currentY += 15;
                
                // Información del hijo
                const childInfo = [
                    ['Nombre Completo:', child.name],
                    ['Fecha de Nacimiento:', child.birthdate],
                    ['Edad:', `${child.age} años`],
                    ['Género:', child.gender || 'No especificado'],
                    ['Club Solicitado:', child.club]
                ];
                
                if (child.allergies && child.allergies.trim()) {
                    childInfo.push(['Alergias/Observaciones:', child.allergies]);
                }
                
                childInfo.forEach(([label, value]) => {
                    pdf.setFont(undefined, 'bold');
                    pdf.setTextColor(50, 50, 50);
                    pdf.setFontSize(10);
                    pdf.text(label, 25, currentY);
                    
                    pdf.setFont(undefined, 'normal');
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(value, 80, currentY);
                    
                    currentY += 7;
                });
                
                currentY += 10;
            });
            
            // FOOTER PROFESIONAL
            currentY += 20;
            if (currentY > pageHeight - 40) {
                pdf.addPage();
                currentY = 30;
            }
            
            // Línea separadora
            pdf.setDrawColor(44, 90, 160);
            pdf.setLineWidth(1);
            pdf.line(20, currentY, pageWidth - 20, currentY);
            
            currentY += 15;
            
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(44, 90, 160);
            pdf.text('INFORMACIÓN ADICIONAL', 20, currentY);
            
            currentY += 15;
            
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'normal');
            pdf.setTextColor(100, 100, 100);
            pdf.text('Enviado desde: Página Web IASD Magnolia', 20, currentY);
            currentY += 6;
            pdf.text(`Total de inscripciones: ${data.children.length}`, 20, currentY);
            
            currentY += 15;
            
            pdf.setFontSize(11);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(34, 139, 34);
            pdf.text('Gracias por su interés en nuestros clubs juveniles.', 20, currentY);
            
            currentY += 8;
            pdf.setFont(undefined, 'normal');
            pdf.setTextColor(50, 50, 50);
            pdf.text('Nos pondremos en contacto pronto para confirmar la inscripción.', 20, currentY);
            
            currentY += 20;
            
            // Firma
            pdf.setFont(undefined, 'italic');
            pdf.text('Bendiciones,', 20, currentY);
            currentY += 8;
            pdf.text('Iglesia Adventista del Séptimo Día Magnolia', 20, currentY);
            
            // Generar archivo
            const fileName = this.generateFileName(data);
            
            // NUEVO: Guardar PDF blob para envío por email
            const pdfBlob = pdf.output('blob');
            window.lastGeneratedPDF = pdfBlob;
            console.log('💾 PDF blob guardado para email automático');
            
            pdf.save(fileName);
            
            console.log('✅ PDF PROFESIONAL AVANZADO generado exitosamente:', fileName);
            return true;
            
        } catch (error) {
            console.error('❌ Error generando PDF profesional:', error);
            return false;
        }
    }

    // Método básico con logo (mantener como respaldo)
    async generateBasicPDFWithLogo(data) {
        try {
            console.log('📄 Generando PDF básico con logo...');
            
            let pdf;
            if (window.jspdf && window.jspdf.jsPDF) {
                pdf = new window.jspdf.jsPDF();
            } else if (window.jsPDF) {
                pdf = new window.jsPDF();
            } else {
                pdf = new jsPDF();
            }
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // HEADER CON LOGO
            if (this.logoLoaded && this.logoBase64) {
                try {
                    // Agregar logo en la esquina superior derecha manteniendo aspect ratio
                    const img = new Image();
                    img.src = this.logoBase64;
                    
                    // Esperar a que la imagen se cargue para obtener sus dimensiones reales
                    img.onload = () => {
                        const maxLogoWidth = 25;
                        const maxLogoHeight = 25;
                        
                        // Calcular dimensiones manteniendo aspect ratio
                        const aspectRatio = img.naturalWidth / img.naturalHeight;
                        let logoWidth, logoHeight;
                        
                        if (aspectRatio > 1) {
                            // Logo más ancho que alto
                            logoWidth = maxLogoWidth;
                            logoHeight = maxLogoWidth / aspectRatio;
                        } else {
                            // Logo más alto que ancho
                            logoHeight = maxLogoHeight;
                            logoWidth = maxLogoHeight * aspectRatio;
                        }
                        
                        // Posicionar en esquina superior derecha
                        const logoX = pageWidth - logoWidth - 10;
                        const logoY = 10;
                        
                        pdf.addImage(this.logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
                        console.log('🖼️ Logo agregado al PDF con dimensiones:', logoWidth, 'x', logoHeight);
                    };
                    
                    // Para compatibilidad, también agregar directamente (fallback)
                    const maxSize = 25;
                    pdf.addImage(this.logoBase64, 'PNG', pageWidth - maxSize - 10, 10, maxSize, maxSize);
                    console.log('🖼️ Logo agregado al PDF (método fallback)');
                } catch (logoError) {
                    console.warn('⚠️ Error agregando logo al PDF:', logoError);
                }
            }
            
            // TÍTULO
            pdf.setFontSize(18);
            pdf.setFont(undefined, 'bold');
            pdf.text('INSCRIPCIÓN CLUB JUVENIL', 20, 25);
            
            pdf.setFontSize(14);
            pdf.text('IGLESIA ADVENTISTA DEL SÉPTIMO DÍA MAGNOLIA', 20, 35);
            pdf.text('Bayamón, Puerto Rico', 20, 42);
            
            // Línea separadora
            pdf.setLineWidth(0.5);
            pdf.line(20, 50, pageWidth - 20, 50);
            
            let currentY = 65;
            
            // INFORMACIÓN DEL PADRE/MADRE
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.text('INFORMACIÓN DEL PADRE/MADRE:', 20, currentY);
            currentY += 10;
            
            pdf.setFont(undefined, 'normal');
            pdf.text(`Nombre: ${data.parent.name}`, 25, currentY);
            currentY += 7;
            pdf.text(`Teléfono: ${data.parent.phone}`, 25, currentY);
            currentY += 7;
            pdf.text(`Email: ${data.parent.email}`, 25, currentY);
            currentY += 7;
            
            if (data.parent.address) {
                pdf.text(`Dirección: ${data.parent.address}`, 25, currentY);
                currentY += 7;
            }
            
            currentY += 10;
            
            // INFORMACIÓN DE LOS HIJOS
            pdf.setFont(undefined, 'bold');
            pdf.text('INFORMACIÓN DE LOS HIJOS:', 20, currentY);
            currentY += 10;
            
            data.children.forEach((child, index) => {
                // Verificar si necesitamos una nueva página
                if (currentY > pageHeight - 50) {
                    pdf.addPage();
                    currentY = 30;
                    
                    // Agregar logo en nueva página también manteniendo aspect ratio
                    if (this.logoLoaded && this.logoBase64) {
                        try {
                            // Crear imagen temporal para obtener dimensiones
                            const tempImg = new Image();
                            tempImg.src = this.logoBase64;
                            
                            const maxLogoWidth = 25;
                            const maxLogoHeight = 25;
                            
                            // Calcular dimensiones estimadas (usar ratio común)
                            const estimatedRatio = 1; // Asumimos logo cuadrado por defecto
                            const logoWidth = maxLogoWidth;
                            const logoHeight = maxLogoHeight;
                            
                            const logoX = pageWidth - logoWidth - 10;
                            const logoY = 10;
                            
                            pdf.addImage(this.logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
                        } catch (logoError) {
                            console.warn('⚠️ Error agregando logo en nueva página:', logoError);
                        }
                    }
                }
                
                pdf.setFont(undefined, 'bold');
                pdf.text(`HIJO/HIJA ${index + 1}:`, 20, currentY);
                currentY += 8;
                
                pdf.setFont(undefined, 'normal');
                pdf.text(`Nombre: ${child.name}`, 30, currentY);
                currentY += 6;
                pdf.text(`Edad: ${child.age} años`, 30, currentY);
                currentY += 6;
                pdf.text(`Fecha de Nacimiento: ${child.birthdate}`, 30, currentY);
                currentY += 6;
                pdf.text(`Club Seleccionado: ${child.club}`, 30, currentY);
                currentY += 6;
                
                if (child.allergies && child.allergies.trim()) {
                    pdf.text(`Alergias/Observaciones: ${child.allergies}`, 30, currentY);
                    currentY += 6;
                }
                
                currentY += 8;
            });
            
            // FOOTER
            currentY += 10;
            if (currentY > pageHeight - 30) {
                pdf.addPage();
                currentY = 30;
            }
            
            pdf.setLineWidth(0.3);
            pdf.line(20, currentY, pageWidth - 20, currentY);
            currentY += 10;
            
            pdf.setFontSize(10);
            pdf.text(`Fecha de inscripción: ${new Date().toLocaleDateString('es-ES')}`, 20, currentY);
            currentY += 5;
            pdf.text(`Hora: ${new Date().toLocaleTimeString('es-ES')}`, 20, currentY);
            currentY += 10;
            
            pdf.setFontSize(8);
            pdf.text('Este documento fue generado automáticamente desde www.iasdmagnolia.org', 20, currentY);
            
            // Generar archivo
            const fileName = this.generateFileName(data);
            
            // NUEVO: Guardar PDF blob para envío por email
            const pdfBlob = pdf.output('blob');
            window.lastGeneratedPDF = pdfBlob;
            console.log('💾 PDF blob guardado para email automático');
            
            pdf.save(fileName);
            
            console.log('✅ PDF básico con logo generado:', fileName);
            return true;
            
        } catch (error) {
            console.error('❌ Error generando PDF básico:', error);
            return false;
        }
    }

    // Template HTML para renderizar
    createHTMLTemplate(data) {
        return `
        <div style="font-family: 'Arial', sans-serif; font-size: 12px; line-height: 1.4; color: #333;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #2c5aa0; padding-bottom: 15px;">
                <div>
                    <h1 style="margin: 0; color: #2c5aa0; font-size: 20px;">INSCRIPCIÓN CLUB JUVENIL</h1>
                    <h2 style="margin: 5px 0 0 0; color: #666; font-size: 14px;">IGLESIA ADVENTISTA DEL SÉPTIMO DÍA MAGNOLIA</h2>
                    <p style="margin: 2px 0 0 0; color: #888; font-size: 11px;">Bayamón, Puerto Rico</p>
                </div>
                ${this.logoLoaded ? `<img src="${this.logoBase64}" style="width: auto; height: 60px; max-width: 80px; object-fit: contain;" alt="Logo IASD">` : ''}
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="background-color: #f0f4f8; padding: 8px; margin: 0 0 10px 0; color: #2c5aa0; border-left: 4px solid #2c5aa0;">INFORMACIÓN DEL PADRE/MADRE</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 5px 0; font-weight: bold; width: 120px;">Nombre:</td><td style="padding: 5px 0;">${data.parent.name}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold;">Teléfono:</td><td style="padding: 5px 0;">${data.parent.phone}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold;">Email:</td><td style="padding: 5px 0;">${data.parent.email}</td></tr>
                    ${data.parent.address ? `<tr><td style="padding: 5px 0; font-weight: bold;">Dirección:</td><td style="padding: 5px 0;">${data.parent.address}</td></tr>` : ''}
                </table>
            </div>
            
            <div>
                <h3 style="background-color: #f0f4f8; padding: 8px; margin: 0 0 15px 0; color: #2c5aa0; border-left: 4px solid #2c5aa0;">INFORMACIÓN DE LOS HIJOS</h3>
                ${data.children.map((child, index) => `
                    <div style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
                        <h4 style="margin: 0 0 10px 0; color: #2c5aa0;">HIJO/HIJA ${index + 1}</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 4px 0; font-weight: bold; width: 140px;">Nombre:</td><td style="padding: 4px 0;">${child.name}</td></tr>
                            <tr><td style="padding: 4px 0; font-weight: bold;">Edad:</td><td style="padding: 4px 0;">${child.age} años</td></tr>
                            <tr><td style="padding: 4px 0; font-weight: bold;">Fecha de Nacimiento:</td><td style="padding: 4px 0;">${child.birthdate}</td></tr>
                            <tr><td style="padding: 4px 0; font-weight: bold;">Club Seleccionado:</td><td style="padding: 4px 0;">${child.club}</td></tr>
                            ${child.allergies ? `<tr><td style="padding: 4px 0; font-weight: bold;">Alergias/Observaciones:</td><td style="padding: 4px 0;">${child.allergies}</td></tr>` : ''}
                        </table>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; text-align: center; color: #666; font-size: 10px;">
                <p style="margin: 5px 0;">Fecha de inscripción: ${new Date().toLocaleDateString('es-ES')} - ${new Date().toLocaleTimeString('es-ES')}</p>
                <p style="margin: 5px 0;">Documento generado automáticamente desde www.iasdmagnolia.org</p>
            </div>
        </div>
        `;
    }

    generateFileName(data) {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        const timeStr = today.toTimeString().split(' ')[0].replace(/:/g, '');
        
        const childrenNames = data.children.map(child => 
            child.name.split(' ')[0].replace(/[^a-zA-Z]/g, '')
        ).join('_');
        
        return `Inscripcion_Club_${childrenNames}_${dateStr}_${timeStr}.pdf`;
    }

    // Método para debugging - probar generación
    async testGeneration() {
        const testData = {
            parent: {
                name: "María González",
                phone: "787-123-4567",
                email: "maria@example.com",
                address: "123 Calle Principal, Bayamón, PR"
            },
            children: [
                {
                    name: "Juan González",
                    age: 12,
                    birthdate: "2012-03-15",
                    club: "Conquistadores",
                    allergies: "Alergia a los maníes"
                }
            ]
        };

        console.log('🧪 Iniciando test de generación de PDF...');
        
        // Probar método HTML primero
        const htmlResult = await this.generatePDFFromHTML(testData);
        
        if (!htmlResult) {
            console.log('🔄 Probando método básico...');
            const basicResult = await this.generateBasicPDFWithLogo(testData);
            return basicResult;
        }
        
        return htmlResult;
    }
}

// Inicializar el generador cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    window.pdfGeneratorWithLogo = new PDFGeneratorWithLogo();
    console.log('✅ PDF Generator con Logo inicializado');
});

// Función para usar desde el modal de inscripción - SIEMPRE profesional
window.generatePDFWithLogo = async function(data) {
    if (!window.pdfGeneratorWithLogo) {
        console.error('❌ PDF Generator no inicializado');
        return false;
    }
    
    // PRIORIDAD 1: Intentar método HTML→Imagen
    console.log('🎯 Intentando método HTML→Imagen primero...');
    const htmlResult = await window.pdfGeneratorWithLogo.generatePDFFromHTML(data);
    
    if (htmlResult) {
        console.log('✅ Éxito con método HTML→Imagen');
        return true;
    }
    
    // PRIORIDAD 2: Método profesional sin html2canvas (GARANTIZADO)
    console.log('🎨 Usando método profesional garantizado...');
    const professionalResult = await window.pdfGeneratorWithLogo.generateAdvancedBasicPDF(data);
    
    return professionalResult;
};

// Función de test para debugging
window.testPDFWithLogo = async function() {
    if (!window.pdfGeneratorWithLogo) {
        console.error('❌ PDF Generator no inicializado');
        return false;
    }
    
    return await window.pdfGeneratorWithLogo.testGeneration();
};