// CALCULADORA DE EDAD AUTOMÁTICA - Versión Simple y Directa

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧮 Iniciando calculadora automática de edad...');
    
    // FUNCIÓN PRINCIPAL: Calcular edad exacta desde fecha de nacimiento
    function calcularEdadExacta(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const diferenciaEnMeses = hoy.getMonth() - nacimiento.getMonth();
        
        // Si aún no ha cumplido años este año, restar 1
        if (diferenciaEnMeses < 0 || (diferenciaEnMeses === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        return edad;
    }
    
    // FUNCIÓN: Sugerir club según la edad
    function sugerirClub(edad) {
        if (edad >= 6 && edad <= 9) return 'aventureros';
        if (edad >= 10 && edad <= 15) return 'conquistadores';
        if (edad >= 16 && edad <= 21) return 'cadetes';
        return '';
    }
    
    // FUNCIÓN: Procesar cambio de fecha de nacimiento
    function procesarFechaNacimiento(campoFecha) {
        const numeroHijo = campoFecha.name.replace('childBirthdate_', '');
        
        // Buscar campos con más robustez
        let campoEdad = document.querySelector(`input[name="childAge_${numeroHijo}"]`);
        let campoClub = document.querySelector(`select[name="selectedClub_${numeroHijo}"]`);
        
        // Si no encuentra los campos, buscar por proximidad (mismo contenedor)
        if (!campoEdad || !campoClub) {
            const parentForm = campoFecha.closest('.child-form');
            if (parentForm) {
                campoEdad = parentForm.querySelector('input[name*="childAge_"]');
                campoClub = parentForm.querySelector('select[name*="selectedClub_"]');
            }
        }
        
        if (!campoFecha.value) {
            console.log('❌ No hay fecha seleccionada');
            return;
        }
        
        console.log(`📅 Procesando fecha para hijo ${numeroHijo}: ${campoFecha.value}`);
        console.log(`🔍 Campo edad encontrado:`, !!campoEdad, campoEdad?.name);
        console.log(`🔍 Campo club encontrado:`, !!campoClub, campoClub?.name);
        
        // CALCULAR EDAD
        const edad = calcularEdadExacta(campoFecha.value);
        console.log(`🧮 Edad calculada: ${edad} años`);
        
        // VALIDAR EDAD
        if (edad < 0) {
            alert('⚠️ La fecha de nacimiento no puede ser en el futuro.');
            campoFecha.value = '';
            return;
        }
        
        if (edad > 50) {
            alert('⚠️ Por favor, verifique la fecha de nacimiento.');
            campoFecha.value = '';
            return;
        }
        
        // INSERTAR EDAD EN EL CAMPO
        if (campoEdad) {
            campoEdad.value = edad;
            campoEdad.style.backgroundColor = '#e8f5e8';
            campoEdad.style.border = '2px solid #4CAF50';
            campoEdad.readOnly = true;
            console.log(`✅ Edad ${edad} insertada en el campo ${campoEdad.name}`);
        } else {
            console.error(`❌ No se encontró campo de edad para hijo ${numeroHijo}`);
        }
        
        // SUGERIR CLUB AUTOMÁTICAMENTE
        if (campoClub && edad >= 6 && edad <= 21) {
            const clubSugerido = sugerirClub(edad);
            if (clubSugerido) {
                campoClub.value = clubSugerido;
                campoClub.style.backgroundColor = '#fff3cd';
                campoClub.style.border = '2px solid #ffc107';
                console.log(`🎯 Club ${clubSugerido} sugerido para ${campoClub.name}`);
            }
        } else if (!campoClub) {
            console.error(`❌ No se encontró campo de club para hijo ${numeroHijo}`);
        }
        
        // // MOSTRAR CONFIRMACIÓN
        // if (edad >= 6 && edad <= 21) {
        //     alert(`✅ Edad calculada: ${edad} años\n🎯 Club sugerido automáticamente`);
        // } else {
        //     alert(`✅ Edad calculada: ${edad} años\n⚠️ Edad fuera del rango de clubs (6-21 años)`);
        // }
    }
    
    // FUNCIÓN: Configurar listeners para fechas
    function configurarCalculadoraEdad() {
        // Buscar todos los campos de fecha de nacimiento
        const camposFecha = document.querySelectorAll('input[name*="childBirthdate_"]');
        
        console.log(`🔍 Buscando campos de fecha... Encontrados: ${camposFecha.length}`);
        
        camposFecha.forEach(function(campo) {
            console.log(`📅 Configurando: ${campo.name}`);
            
            // Remover listener anterior si existe
            if (campo._calculadoraEdad) {
                campo.removeEventListener('change', campo._calculadoraEdad);
                campo.removeEventListener('input', campo._calculadoraEdad);
            }
            
            // Crear nueva función para este campo
            campo._calculadoraEdad = function() {
                console.log(`🎯 Evento disparado en: ${this.name}`);
                procesarFechaNacimiento(this);
            };
            
            // Agregar listeners tanto para change como input
            campo.addEventListener('change', campo._calculadoraEdad);
            campo.addEventListener('input', campo._calculadoraEdad);
            
            // Marcar como configurado
            campo.setAttribute('data-configured', 'true');
            
            console.log(`✅ Calculadora configurada para: ${campo.name}`);
        });
        
        console.log(`✅ Configurados ${camposFecha.length} campos de fecha de nacimiento`);
        
        // También verificar campos existentes
        const camposEdad = document.querySelectorAll('input[name*="childAge_"]');
        const camposClub = document.querySelectorAll('select[name*="selectedClub_"]');
        console.log(`📊 Campos encontrados - Fecha: ${camposFecha.length}, Edad: ${camposEdad.length}, Club: ${camposClub.length}`);
    }

    // EXPONER FUNCIÓN GLOBALMENTE para que inscription-modal.js pueda usarla
    window.configurarCalculadoraEdad = configurarCalculadoraEdad;
    
    // EJECUTAR CONFIGURACIÓN
    setTimeout(function() {
        configurarCalculadoraEdad();
        
        // Reconfigurar cada vez que se abra el modal
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'open-inscription') {
                setTimeout(configurarCalculadoraEdad, 1000);
            }
        });

        // NUEVO: Escuchar cambios en los hijos para reconfigurar
        document.addEventListener('childrenChanged', function() {
            console.log('🔄 Detectados cambios en hijos, reconfigurando calculadora...');
            setTimeout(configurarCalculadoraEdad, 300);
        });
        
        // Observar cambios en el DOM para nuevos campos - MÁS AGRESIVO
        const observer = new MutationObserver(function(mutations) {
            let shouldReconfig = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && (
                            node.querySelector && node.querySelector('input[name*="childBirthdate_"]') ||
                            node.matches && node.matches('input[name*="childBirthdate_"]')
                        )) {
                            shouldReconfig = true;
                        }
                    });
                }
            });
            
            if (shouldReconfig) {
                console.log('🔄 Detectados nuevos campos de fecha, reconfigurando...');
                setTimeout(configurarCalculadoraEdad, 100);
            }
        });
        
        const modal = document.querySelector('#inscription-modal');
        if (modal) {
            observer.observe(modal, { 
                childList: true, 
                subtree: true,
                attributes: true,
                attributeFilter: ['name', 'data-child']
            });
        }
        
        // Reconfigurar periódicamente como respaldo
        setInterval(function() {
            const camposSinListener = document.querySelectorAll('input[name*="childBirthdate_"]:not([data-configured])');
            if (camposSinListener.length > 0) {
                console.log(`🔄 Encontrados ${camposSinListener.length} campos sin configurar, reconfigurando...`);
                configurarCalculadoraEdad();
            }
        }, 2000);
        
    }, 1000);
    
    console.log('🎯 Calculadora automática de edad lista para usar');
});