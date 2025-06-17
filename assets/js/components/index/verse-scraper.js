// verse-scraper.js
// Versión limpia para obtener versículo del día automáticamente

class DailyVerseScrapperJS {
    constructor() {
        this.targetUrl = 'https://www.verseoftheday.com/es/';
        
        // Proxies CORS funcionales
        this.corsProxies = [
            'https://api.allorigins.win/get?url=',
            'https://thingproxy.freeboard.io/fetch/',
            'https://cors-proxy.htmldriven.com/?url='
        ];
    }

    // Obtener HTML del sitio web
    async fetchHtmlContent() {
        for (let proxy of this.corsProxies) {
            try {
                const response = await fetch(`${proxy}${encodeURIComponent(this.targetUrl)}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                let html;
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    html = data.contents || data.body || data;
                } else {
                    html = await response.text();
                }
                
                return html;
                
            } catch (error) {
                continue; // Intentar siguiente proxy
            }
        }
        
        throw new Error("No se pudo obtener el contenido");
    }

    // Extraer versículo del HTML
    parseHtmlContent(html) {
        try {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(html, 'text/html');
            
            // Selectores para encontrar el versículo y referencia
            const textSelectors = [
                "div.bilingual-left",
                "blockquote p",
                ".verse-text",
                "blockquote",
                ".daily-verse-text"
            ];
            
            const refSelectors = [
                "div.bilingual-left div.reference a",
                "div.reference a",
                ".verse-reference",
                "blockquote cite",
                "cite"
            ];

            let verseNode = null;
            let textNode = null;

            // Buscar texto del versículo
            for (let selector of textSelectors) {
                verseNode = htmlDoc.querySelector(selector);
                if (verseNode && verseNode.textContent.trim()) {
                    break;
                }
            }

            // Buscar referencia
            for (let selector of refSelectors) {
                textNode = htmlDoc.querySelector(selector);
                if (textNode && textNode.textContent.trim()) {
                    break;
                }
            }

            if (!verseNode || !textNode) {
                throw new Error("No se encontraron los elementos del versículo");
            }

            let verseText = verseNode.textContent.trim();
            const reference = textNode.textContent.trim();

            // Limpiar referencias bíblicas del texto del versículo
            // Remover patrones como "—Isaías 40:28-29" o "- Juan 3:16" etc.
            verseText = verseText.replace(/[—\-]\s*([1-3]?\s*[A-Za-zÁ-ÿ]+\s+\d+:\d+(?:-\d+)?)\s*$/i, '').trim();
            verseText = verseText.replace(/\s*\([1-3]?\s*[A-Za-zÁ-ÿ]+\s+\d+:\d+(?:-\d+)?\)\s*$/i, '').trim();

            return {
                reference: reference,
                text: verseText,
                source: 'verseoftheday.com',
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            throw error;
        }
    }

    // Obtener versículo del día (siempre fresco, sin caché persistente)
    async getDailyVerseFromWeb() {
        try {
            const html = await this.fetchHtmlContent();
            const scripture = this.parseHtmlContent(html);
            return scripture;
        } catch (error) {
            // Si falla, usar versículo de respaldo
            return this.getFallbackVerse();
        }
    }

    // Versículo de respaldo
    getFallbackVerse() {
        const fallbackVerses = [
            {
                text: "¿Acaso no lo sabes? ¿Es que no lo has oído? El Dios eterno, el Señor, el creador de los confines de la tierra no se fatiga ni se cansa. Su entendimiento es inescrutable. El da fuerzas al fatigado, y al que no tiene fuerzas, aumenta el vigor.",
                reference: "Isaías 40:28-29"
            },
            {
                text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
                reference: "Juan 3:16"
            },
            {
                text: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.",
                reference: "Romanos 8:28"
            }
        ];
        
        const today = new Date().getDate();
        const index = today % fallbackVerses.length;
        
        return {
            ...fallbackVerses[index],
            source: 'versículo local',
            timestamp: new Date().toISOString()
        };
    }

    // Actualizar la sección de oración (SIN texto extra)
    async updatePrayerSection() {
        try {
            // Elementos del DOM
            const prayerTextElement = document.querySelector('.hero-content .hero-text p');
            const referenceElement = document.querySelector('.scripture-reference');
            
            // Obtener versículo automáticamente
            const scripture = await this.getDailyVerseFromWeb();
            
            // Actualizar SOLO con el versículo, sin texto adicional
            if (scripture && prayerTextElement) {
                // Solo mostrar el versículo tal como viene
                prayerTextElement.innerHTML = `<em>${scripture.text}"</em>`;
            }
            
            if (scripture && referenceElement) {
                referenceElement.textContent = scripture.reference;
            }
            
        } catch (error) {
            // En caso de error, mostrar versículo de respaldo
            this.showFallbackContent();
        }
    }

    // Contenido de respaldo simple
    showFallbackContent() {
        const prayerTextElement = document.querySelector('.hero-content .hero-text p');
        const referenceElement = document.querySelector('.scripture-reference');
        
        const fallback = this.getFallbackVerse();
        
        if (prayerTextElement) {
            prayerTextElement.innerHTML = `<em>"${fallback.text}"</em>`;
        }
        
        if (referenceElement) {
            referenceElement.textContent = fallback.reference;
        }
    }
}

// Inicialización automática (sin botones, sin logs, sin caché persistente)
document.addEventListener('DOMContentLoaded', async function() {
    // Limpiar cualquier caché anterior automáticamente
    const keys = Object.keys(localStorage);
    const verseKeys = keys.filter(key => key.startsWith('DailyVerse_'));
    verseKeys.forEach(key => localStorage.removeItem(key));
    
    // Crear scraper y actualizar
    const scraper = new DailyVerseScrapperJS();
    await scraper.updatePrayerSection();
});

// Limpiar caché también cuando se recarga la página
window.addEventListener('beforeunload', function() {
    const keys = Object.keys(localStorage);
    const verseKeys = keys.filter(key => key.startsWith('DailyVerse_'));
    verseKeys.forEach(key => localStorage.removeItem(key));
});