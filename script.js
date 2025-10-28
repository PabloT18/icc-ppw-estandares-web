/**
 * JAVASCRIPT PARA DEMOSTRACIÓN DE ESTÁNDARES WEB
 * Implementa funcionalidad accesible y mejores prácticas
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // FUNCIONALIDADES DE ACCESIBILIDAD
    // =============================================

    /**
     * Manejo del formulario con validación accesible
     */
    function initAccessibleForm() {
        const form = document.querySelector('.accessible-form');
        const statusElement = document.getElementById('form-status');

        if (!form || !statusElement) return;

        // Validación en tiempo real
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                // Limpiar error cuando el usuario empiece a escribir
                if (this.getAttribute('aria-invalid') === 'true') {
                    clearFieldError(this);
                }
            });
        });

        // Manejo del envío del formulario
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            // Validar todos los campos
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                showSuccessMessage('Formulario enviado correctamente. Esta es solo una demostración.');
                form.reset();
                // Limpiar todos los aria-invalid
                inputs.forEach(input => {
                    input.removeAttribute('aria-invalid');
                });
            } else {
                showErrorMessage('Por favor, corrija los errores en el formulario.');
                // Enfocar el primer campo con error
                const firstError = form.querySelector('[aria-invalid="true"]');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    }

    /**
     * Validar un campo individual
     */
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // Validación de campo requerido
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es requerido.';
        }

        // Validación de email
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, ingrese un email válido.';
            }
        }

        if (isValid) {
            clearFieldError(field);
        } else {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    /**
     * Mostrar error en un campo
     */
    function showFieldError(field, message) {
        field.setAttribute('aria-invalid', 'true');

        // Buscar o crear elemento de error
        let errorElement = document.getElementById(field.id + '-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = field.id + '-error';
            errorElement.className = 'field-error';
            errorElement.setAttribute('role', 'alert');
            errorElement.style.color = 'var(--accent-color)';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = 'var(--spacing-xs)';
            field.parentNode.appendChild(errorElement);

            // Actualizar aria-describedby
            const describedBy = field.getAttribute('aria-describedby') || '';
            field.setAttribute('aria-describedby', describedBy + ' ' + errorElement.id);
        }

        errorElement.textContent = message;
    }

    /**
     * Limpiar error de un campo
     */
    function clearFieldError(field) {
        field.setAttribute('aria-invalid', 'false');

        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.remove();

            // Actualizar aria-describedby
            const describedBy = field.getAttribute('aria-describedby') || '';
            const newDescribedBy = describedBy.replace(field.id + '-error', '').trim();
            if (newDescribedBy) {
                field.setAttribute('aria-describedby', newDescribedBy);
            } else {
                field.removeAttribute('aria-describedby');
            }
        }
    }

    /**
     * Mostrar mensaje de éxito
     */
    function showSuccessMessage(message) {
        const statusElement = document.getElementById('form-status');
        statusElement.textContent = message;
        statusElement.className = 'sr-only success-message';
        statusElement.style.color = 'var(--success-color)';

        // Hacer visible temporalmente
        statusElement.classList.remove('sr-only');
        setTimeout(() => {
            statusElement.classList.add('sr-only');
        }, 5000);
    }

    /**
     * Mostrar mensaje de error
     */
    function showErrorMessage(message) {
        const statusElement = document.getElementById('form-status');
        statusElement.textContent = message;
        statusElement.className = 'sr-only error-message';
        statusElement.style.color = 'var(--accent-color)';

        // Hacer visible temporalmente
        statusElement.classList.remove('sr-only');
        setTimeout(() => {
            statusElement.classList.add('sr-only');
        }, 5000);
    }

    // =============================================
    // NAVEGACIÓN MEJORADA
    // =============================================

    /**
     * Smooth scroll para navegación interna
     */
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Anunciar navegación a lectores de pantalla
                    announceNavigation(targetElement);

                    // Scroll suave
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Enfocar el elemento target para navegación por teclado
                    setTimeout(() => {
                        targetElement.focus();
                        // Agregar tabindex temporal si no es focuseable
                        if (!targetElement.hasAttribute('tabindex')) {
                            targetElement.setAttribute('tabindex', '-1');
                            targetElement.addEventListener('blur', function () {
                                this.removeAttribute('tabindex');
                            }, { once: true });
                        }
                    }, 500);
                }
            });
        });
    }

    /**
     * Anunciar navegación para lectores de pantalla
     */
    function announceNavigation(targetElement) {
        const heading = targetElement.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = `Navegando a la sección: ${heading.textContent}`;

            document.body.appendChild(announcement);

            // Remover el anuncio después de un momento
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
    }

    // =============================================
    // FUNCIONALIDADES INTERACTIVAS
    // =============================================

    /**
     * Manejo accesible de details/summary
     */
    function initAccessibleDetails() {
        const detailsElements = document.querySelectorAll('details');

        detailsElements.forEach(details => {
            const summary = details.querySelector('summary');

            if (summary) {
                summary.addEventListener('click', function () {
                    // Anunciar cambio de estado
                    setTimeout(() => {
                        const isOpen = details.hasAttribute('open');
                        const announcement = document.createElement('div');
                        announcement.setAttribute('aria-live', 'polite');
                        announcement.className = 'sr-only';
                        announcement.textContent = isOpen ? 'Sección expandida' : 'Sección colapsada';

                        document.body.appendChild(announcement);

                        setTimeout(() => {
                            document.body.removeChild(announcement);
                        }, 1000);
                    }, 100);
                });
            }
        });
    }

    /**
     * Mejorar navegación por teclado en la tabla
     */
    function initAccessibleTable() {
        const tables = document.querySelectorAll('table');

        tables.forEach(table => {
            // Añadir instrucciones de navegación
            const caption = table.querySelector('caption');
            if (caption) {
                const instructions = document.createElement('div');
                instructions.className = 'sr-only';
                instructions.textContent = 'Usa las teclas de flecha para navegar por la tabla.';
                caption.appendChild(instructions);
            }

            // Mejorar navegación por teclado en celdas
            const cells = table.querySelectorAll('td, th');
            cells.forEach((cell, index) => {
                cell.setAttribute('tabindex', index === 0 ? '0' : '-1');

                cell.addEventListener('keydown', function (e) {
                    const currentRow = this.parentElement;
                    const currentIndex = Array.from(currentRow.children).indexOf(this);
                    const rows = Array.from(table.querySelectorAll('tr'));
                    const currentRowIndex = rows.indexOf(currentRow);

                    let targetCell = null;

                    switch (e.key) {
                        case 'ArrowRight':
                            targetCell = this.nextElementSibling;
                            break;
                        case 'ArrowLeft':
                            targetCell = this.previousElementSibling;
                            break;
                        case 'ArrowDown':
                            if (rows[currentRowIndex + 1]) {
                                targetCell = rows[currentRowIndex + 1].children[currentIndex];
                            }
                            break;
                        case 'ArrowUp':
                            if (rows[currentRowIndex - 1]) {
                                targetCell = rows[currentRowIndex - 1].children[currentIndex];
                            }
                            break;
                        case 'Home':
                            targetCell = currentRow.children[0];
                            break;
                        case 'End':
                            targetCell = currentRow.children[currentRow.children.length - 1];
                            break;
                    }

                    if (targetCell) {
                        e.preventDefault();
                        this.setAttribute('tabindex', '-1');
                        targetCell.setAttribute('tabindex', '0');
                        targetCell.focus();
                    }
                });
            });
        });
    }

    // =============================================
    // FEATURES DE USABILIDAD
    // =============================================

    /**
     * Botón "Volver arriba" inteligente
     */
    function initBackToTop() {
        const backToTopButton = document.querySelector('.back-to-top a');

        if (backToTopButton) {
            // Mostrar/ocultar según scroll
            function toggleBackToTop() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                backToTopButton.style.opacity = scrollTop > 300 ? '1' : '0.5';
            }

            window.addEventListener('scroll', toggleBackToTop);

            // Mejorar comportamiento del click
            backToTopButton.addEventListener('click', function (e) {
                e.preventDefault();

                // Anunciar acción
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'sr-only';
                announcement.textContent = 'Volviendo al inicio de la página';

                document.body.appendChild(announcement);

                // Scroll suave al inicio
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Enfocar skip link o primer heading
                setTimeout(() => {
                    const skipLink = document.querySelector('.skip-link');
                    const firstHeading = document.querySelector('h1');
                    const targetElement = skipLink || firstHeading;

                    if (targetElement) {
                        targetElement.focus();
                    }

                    document.body.removeChild(announcement);
                }, 1000);
            });
        }
    }

    /**
     * Mejorar contraste al enfocar elementos
     */
    function initFocusEnhancement() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', function () {
                this.style.outline = '3px solid var(--accent-color)';
                this.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', function () {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }

    /**
     * Detectar y anunciar cambios dinámicos
     */
    function initAriaLiveRegions() {
        // Observar cambios en elementos con aria-live
        const liveRegions = document.querySelectorAll('[aria-live]');

        liveRegions.forEach(region => {
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        // El contenido cambió, los lectores de pantalla lo anunciarán automáticamente
                        console.log('Cambio detectado en región live:', region.textContent);
                    }
                });
            });

            observer.observe(region, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });
    }

    // =============================================
    // PERFORMANCE Y OPTIMIZACIÓN
    // =============================================

    /**
     * Lazy loading para imágenes
     */
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        // Fallback para navegadores que no soportan loading="lazy"
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                if (img.complete) return;
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Optimizar animaciones basado en preferencias del usuario
     */
    function initMotionPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        function handleMotionPreference() {
            if (prefersReducedMotion.matches) {
                // Deshabilitar o reducir animaciones
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
                document.documentElement.style.setProperty('--transition-duration', '0.01ms');
            } else {
                // Restaurar animaciones normales
                document.documentElement.style.removeProperty('--animation-duration');
                document.documentElement.style.removeProperty('--transition-duration');
            }
        }

        // Ejecutar al cargar y cuando cambie la preferencia
        handleMotionPreference();
        prefersReducedMotion.addEventListener('change', handleMotionPreference);
    }

    // =============================================
    // ANALYTICS Y SEO
    // =============================================

    /**
     * Tracking de eventos para analytics (simulado)
     */
    function initAnalytics() {
        // Simular Google Analytics events
        function trackEvent(action, category, label) {
            console.log('Analytics Event:', {
                action: action,
                category: category,
                label: label,
                timestamp: new Date().toISOString()
            });

            // Aquí iría el código real de GA4:
            // gtag('event', action, {
            //     event_category: category,
            //     event_label: label
            // });
        }

        // Tracking de clicks en navegación
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function () {
                trackEvent('click', 'navigation', this.textContent.trim());
            });
        });

        // Tracking de envío de formularios
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function () {
                trackEvent('submit', 'form', form.getAttribute('aria-labelledby') || 'unknown');
            });
        });

        // Tracking de scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', function () {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
                maxScrollDepth = scrollPercent;
                trackEvent('scroll', 'engagement', `${scrollPercent}%`);
            }
        });
    }

    // =============================================
    // INICIALIZACIÓN
    // =============================================

    console.log('🚀 Inicializando funcionalidades de estándares web...');

    // Inicializar todas las funcionalidades
    initAccessibleForm();
    initSmoothScroll();
    initAccessibleDetails();
    initAccessibleTable();
    initBackToTop();
    initFocusEnhancement();
    initAriaLiveRegions();
    initLazyLoading();
    initMotionPreferences();
    initAnalytics();

    console.log('✅ Todas las funcionalidades inicializadas correctamente');

    // Anunciar que la página está lista
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Página de estándares web cargada completamente. Navegación mejorada disponible.';

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 2000);
});

// =============================================
// SERVICE WORKER PARA PWA (Opcional)
// =============================================

/**
 * Registrar Service Worker si está disponible
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        // Esta sería la implementación para una PWA completa
        console.log('Service Worker compatible, pero no implementado en este demo');

        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registrado con éxito:', registration.scope);
        //     })
        //     .catch(function(error) {
        //         console.log('Error al registrar SW:', error);
        //     });
    });
}

// =============================================
// UTILIDADES ADICIONALES
// =============================================

/**
 * Función para detectar capacidades del navegador
 */
function detectBrowserCapabilities() {
    const capabilities = {
        intersectionObserver: 'IntersectionObserver' in window,
        webp: false,
        grid: CSS.supports('display', 'grid'),
        flexbox: CSS.supports('display', 'flex'),
        customProperties: CSS.supports('--var', '0'),
        prefers: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // Test WebP support
    const webpTest = new Image();
    webpTest.onload = function () {
        capabilities.webp = true;
        console.log('Capacidades del navegador:', capabilities);
    };
    webpTest.onerror = function () {
        capabilities.webp = false;
        console.log('Capacidades del navegador:', capabilities);
    };
    webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

    return capabilities;
}

// Detectar capacidades al cargar
window.addEventListener('load', function () {
    const capabilities = detectBrowserCapabilities();

    // Añadir clases CSS basadas en capacidades
    if (capabilities.grid) {
        document.documentElement.classList.add('supports-grid');
    }

    if (capabilities.customProperties) {
        document.documentElement.classList.add('supports-custom-properties');
    }

    if (capabilities.prefers) {
        document.documentElement.classList.add('prefers-reduced-motion');
    }
});

/**
 * Polyfill para IntersectionObserver (si se necesita)
 */
function polyfillIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver no soportado, aplicando fallback...');

        // Implementación simplificada para lazy loading
        window.addEventListener('scroll', function () {
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                }
            });
        });
    }
}

// Ejecutar polyfill si es necesario
polyfillIntersectionObserver();