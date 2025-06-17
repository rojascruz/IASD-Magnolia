// footer-loader.js
// Script para cargar el footer dinámicamente desde el index.html

async function loadFooter() {
    try {
        // Obtener el HTML del index.html
        const response = await fetch('index.html');
        const html = await response.text();
        
        // Crear un elemento temporal para parsear el HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extraer el footer del index.html
        const footerElement = doc.querySelector('footer');
        
        if (footerElement) {
            // Buscar el contenedor donde insertar el footer
            const footerContainer = document.getElementById('footer-container');
            
            if (footerContainer) {
                // Insertar el footer
                footerContainer.innerHTML = footerElement.outerHTML;
                
                // Reactivar los scripts del footer si los hay
                const scripts = footerContainer.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    document.head.appendChild(newScript);
                });
                
                console.log('✅ Footer cargado exitosamente desde index.html');
            }
        }
    } catch (error) {
        console.error('❌ Error cargando footer:', error);
        // Mostrar footer de respaldo si falla
        showFallbackFooter();
    }
}

// Footer de respaldo en caso de error
function showFallbackFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer class="modern-footer">
                <div class="container">
                    <div class="copyright">
                        <p>© 2025 - Iglesia Adventista del Séptimo Día Magnolia Bayamón</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Cargar footer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadFooter);