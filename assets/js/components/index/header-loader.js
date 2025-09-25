// header-loader.js
// Sistema para cargar dinámicamente el header desde index.html

class HeaderLoader {
    constructor() {
        this.headerLoaded = false;
        this.currentPage = this.getCurrentPage();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        
        // Mapear archivos a sus identificadores
        const pageMap = {
            'index': 'index',
            'club': 'club', 
            'departamentos': 'departamentos',
            '': 'index' // Para cuando se accede sin especificar archivo
        };
        
        return pageMap[filename] || 'index';
    }

    async loadHeader() {
        try {
            console.log('📄 Cargando header dinámicamente...');
            
            // Buscar el contenedor del header
            const headerContainer = document.getElementById('header-container');
            if (!headerContainer) {
                console.warn('⚠️ No se encontró #header-container, insertando header directamente');
                await this.loadAndInsertHeader();
                return;
            }

            // Si ya existe un header, no lo volver a cargar
            if (document.querySelector('.navbar')) {
                console.log('✅ Header ya existe, configurando navegación activa');
                this.setActiveNavigation();
                return;
            }

            // Cargar header desde index.html
            const response = await fetch('/index.html');
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const htmlContent = await response.text();
            
            // Crear un documento temporal para extraer el header
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            // Extraer el header
            const headerElement = tempDiv.querySelector('.navbar');
            if (!headerElement) {
                throw new Error('No se encontró el header en index.html');
            }

            // Insertar el header
            headerContainer.appendChild(headerElement.cloneNode(true));
            
            // Configurar navegación activa
            this.setActiveNavigation();
            
            // Inicializar funcionalidad del menú móvil
            this.initializeMobileMenu();
            
            console.log('✅ Header cargado exitosamente');
            this.headerLoaded = true;
            
        } catch (error) {
            console.error('❌ Error cargando header:', error);
            // Fallback: crear header básico
            this.createFallbackHeader();
        }
    }

    async loadAndInsertHeader() {
        try {
            // Para páginas que no tienen contenedor, insertar al inicio del body
            const response = await fetch('/index.html');
            const htmlContent = await response.text();
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            const headerElement = tempDiv.querySelector('.navbar');
            if (headerElement) {
                // Insertar como primer elemento del body
                document.body.insertBefore(headerElement.cloneNode(true), document.body.firstChild);
                this.setActiveNavigation();
                this.initializeMobileMenu();
                console.log('✅ Header insertado dinámicamente');
            }
        } catch (error) {
            console.error('❌ Error insertando header:', error);
        }
    }

    setActiveNavigation() {
        // Remover clase active de todos los enlaces
        const navLinks = document.querySelectorAll('.navbar nav a');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Agregar clase active al enlace correspondiente
        const activeSelectors = {
            'index': 'a[href="index.html"]',
            'club': 'a[href="club.html"]',
            'departamentos': 'a[href="departamentos.html"]'
        };
        
        const activeSelector = activeSelectors[this.currentPage];
        if (activeSelector) {
            const activeLink = document.querySelector(`.navbar ${activeSelector}`);
            if (activeLink) {
                activeLink.classList.add('active');
                console.log(`🎯 Navegación activa configurada para: ${this.currentPage}`);
            }
        }
    }

    initializeMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        
        if (menuToggle && nav) {
            // Remover event listeners existentes
            const newMenuToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
            
            // Agregar nuevo event listener
            newMenuToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                newMenuToggle.classList.toggle('active');
            });
            
            // Cerrar menú al hacer clic en enlaces
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    nav.classList.remove('active');
                    newMenuToggle.classList.remove('active');
                });
            });
            
            console.log('📱 Menú móvil inicializado');
        }
    }

    createFallbackHeader() {
        const fallbackHeader = `
            <header class="navbar">
                <div class="container">
                    <div class="logo">
                        <h2>IGLESIA ADVENTISTA DEL SÉPTIMO DÍA</h2>
                        <p class="subtitle">MAGNOLIA BAYAMÓN</p>
                    </div>
                    <nav>
                        <ul>
                            <li><a href="index.html">Sobre Nosotros</a></li>
                            <li><a href="departamentos.html">Departamentos</a></li>
                            <li><a href="club.html">Club</a></li>
                        </ul>
                    </nav>
                    <div class="navbar-logo">
                        <img src="assets/images/Logo.png" alt="Logo IASD Magnolia" class="logo-img">
                    </div>
                    <button class="menu-toggle" aria-label="Menú">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', fallbackHeader);
        this.setActiveNavigation();
        this.initializeMobileMenu();
        console.log('✅ Header fallback creado');
    }
}

// Instanciar y cargar header cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const headerLoader = new HeaderLoader();
    headerLoader.loadHeader();
});

// Exportar para uso global
window.headerLoader = HeaderLoader;