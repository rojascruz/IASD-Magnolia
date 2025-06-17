/**
 * Script para el slider de imágenes y testimonios
 * Para implementación futura en la landing page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un slider en la página
    const sliders = document.querySelectorAll('.slider');
    
    if (sliders.length > 0) {
        sliders.forEach(slider => {
            initializeSlider(slider);
        });
    }
    
    /**
     * Inicializa un slider con las funcionalidades básicas
     * @param {HTMLElement} sliderElement - El elemento contenedor del slider
     */
    function initializeSlider(sliderElement) {
        const slides = sliderElement.querySelectorAll('.slide');
        const nextButton = sliderElement.querySelector('.slider-next');
        const prevButton = sliderElement.querySelector('.slider-prev');
        const dots = sliderElement.querySelectorAll('.slider-dot');
        
        if (slides.length === 0) return;
        
        let currentIndex = 0;
        let interval;
        const autoPlayDelay = 5000; // 5 segundos entre slides
        
        // Mostrar el slide actual
        function showSlide(index) {
            // Ocultar todos los slides
            slides.forEach(slide => {
                slide.style.display = 'none';
                slide.classList.remove('active');
            });
            
            // Desactivar todos los dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Mostrar el slide actual
            slides[index].style.display = 'block';
            
            // Agregar una pequeña demora antes de la animación
            setTimeout(() => {
                slides[index].classList.add('active');
            }, 10);
            
            // Activar el dot correspondiente
            if (dots[index]) {
                dots[index].classList.add('active');
            }
            
            // Actualizar el índice actual
            currentIndex = index;
        }
        
        // Ir al siguiente slide
        function nextSlide() {
            let nextIndex = currentIndex + 1;
            
            // Volver al primer slide si llegamos al final
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            
            showSlide(nextIndex);
        }
        
        // Ir al slide anterior
        function prevSlide() {
            let prevIndex = currentIndex - 1;
            
            // Ir al último slide si estamos en el primero
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            
            showSlide(prevIndex);
        }
        
        // Iniciar el autoplay
        function startAutoPlay() {
            interval = setInterval(nextSlide, autoPlayDelay);
        }
        
        // Detener el autoplay
        function stopAutoPlay() {
            clearInterval(interval);
        }
        
        // Agregar event listeners a los botones
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            });
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            });
        }
        
        // Agregar event listeners a los dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                stopAutoPlay();
                showSlide(index);
                startAutoPlay();
            });
        });
        
        // Pausar autoplay cuando el cursor está sobre el slider
        sliderElement.addEventListener('mouseenter', stopAutoPlay);
        sliderElement.addEventListener('mouseleave', startAutoPlay);
        
        // Mostrar el primer slide e iniciar autoplay
        showSlide(0);
        startAutoPlay();
    }
});