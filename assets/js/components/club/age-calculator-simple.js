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
        const campoEdad = document.querySelector(`input[name="childAge_${numeroHijo}"]`);
        const campoClub = document.querySelector(`select[name="selectedClub_${numeroHijo}"]`);
        
        if (!campoFecha.value) {
            console.log('❌ No hay fecha seleccionada');
            return;
        }
        
        console.log(`📅 Procesando fecha para hijo ${numeroHijo}: ${campoFecha.value}`);
        
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
            console.log(`✅ Edad ${edad} insertada en el campo`);
        }
        
        // SUGERIR CLUB AUTOMÁTICAMENTE
        if (campoClub && edad >= 6 && edad <= 21) {
            const clubSugerido = sugerirClub(edad);
            if (clubSugerido) {
                campoClub.value = clubSugerido;
                campoClub.style.backgroundColor = '#fff3cd';
                campoClub.style.border = '2px solid #ffc107';
                console.log(`🎯 Club sugerido: ${clubSugerido}`);
            }
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
        
        camposFecha.forEach(function(campo) {
            // Remover listener anterior si existe
            campo.removeEventListener('change', campo._calculadoraEdad);
            
            // Crear nueva función para este campo
            campo._calculadoraEdad = function() {
                procesarFechaNacimiento(this);
            };
            
            // Agregar listener al campo
            campo.addEventListener('change', campo._calculadoraEdad);
            
            console.log(`📅 Calculadora de edad configurada para: ${campo.name}`);
        });
        
        console.log(`✅ Configurados ${camposFecha.length} campos de fecha de nacimiento`);
    }
    
    // EJECUTAR CONFIGURACIÓN
    setTimeout(function() {
        configurarCalculadoraEdad();
        
        // Reconfigurar cada vez que se abra el modal
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'open-inscription') {
                setTimeout(configurarCalculadoraEdad, 1000);
            }
        });
        
        // Observar cambios en el DOM para nuevos campos
        const observer = new MutationObserver(function() {
            setTimeout(configurarCalculadoraEdad, 200);
        });
        
        const modal = document.querySelector('#inscription-modal');
        if (modal) {
            observer.observe(modal, { childList: true, subtree: true });
        }
        
    }, 1000);
    
    console.log('🎯 Calculadora automática de edad lista para usar');
});