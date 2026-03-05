document.addEventListener("DOMContentLoaded", () => {
    // 1. Fade-on-scroll animation
    window.initFadeAnimations = () => {
        const fadeElements = document.querySelectorAll('.fade-in-section:not(.is-visible)');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.05
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));
    };

    // Initial call
    window.initFadeAnimations();

    // 2. Dot Navigation Highlight on Scroll
    window.initDotNav = () => {
        const dotNav = document.querySelector('.dot-nav');
        const navDots = document.querySelectorAll('.dot-nav a');
        if (navDots.length === 0 || !dotNav) return;

        // Hide dot nav if page is not scrollable OR on mobile (respecting CSS)
        const checkScrollability = () => {
            if (window.innerWidth <= 1000 || document.documentElement.scrollHeight <= window.innerHeight + 10) {
                dotNav.style.display = 'none';
            } else {
                dotNav.style.display = 'block';
            }
        };

        // Remove old listener if re-initializing
        if (window._dotNavScrollHandler) {
            window.removeEventListener('scroll', window._dotNavScrollHandler);
            window.removeEventListener('resize', window._dotNavResizeHandler);
        }

        const updateActiveDot = () => {
            let currentSection = '';
            navDots.forEach(dot => {
                const href = dot.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                const targetId = href.substring(1);
                const section = document.getElementById(targetId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2 + 100) {
                        currentSection = targetId;
                    }
                }
            });

            // Force last dot if at very bottom
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
                const lastDot = navDots[navDots.length - 1];
                const lastHref = lastDot.getAttribute('href');
                if (lastHref) currentSection = lastHref.substring(1);
            }

            // Fallback for Hero
            if (window.scrollY < 200 && navDots.length > 0) {
                const firstHref = navDots[0].getAttribute('href');
                if (firstHref) currentSection = firstHref.substring(1);
            }

            navDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('href') === `#${currentSection}`) {
                    dot.classList.add('active');
                }
            });
        };

        window._dotNavScrollHandler = updateActiveDot;
        window._dotNavResizeHandler = checkScrollability;

        window.addEventListener('scroll', updateActiveDot);
        window.addEventListener('resize', checkScrollability);

        // Initial run
        updateActiveDot();
        checkScrollability();
    };

    // Initial call
    window.initDotNav();

    // 3. Smooth scrolling for dot navigation
    document.querySelectorAll('.dot-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Project Detail PDF Handling
    const pdfContainer = document.getElementById('pdf-canvas-container');
    if (pdfContainer) {
        const url = pdfContainer.getAttribute('data-pdf-url');
        if (url && typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

            const loadingTask = pdfjsLib.getDocument(url);
            loadingTask.promise.then(pdf => {
                // For simplicity, just render first page or all pages
                for (let i = 1; i <= pdf.numPages; i++) {
                    pdf.getPage(i).then(page => {
                        const viewport = page.getViewport({ scale: 1.5 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        canvas.style.width = "100%";
                        canvas.style.marginBottom = "20px";
                        pdfContainer.appendChild(canvas);

                        page.render({
                            canvasContext: context,
                            viewport: viewport
                        });
                    });
                }
            }).catch(err => {
                console.error("PDF error:", err);
                pdfContainer.innerHTML = `<div style="color: white; text-align: center; padding: 20px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ffcc00; margin-bottom: 15px;"></i>
                        <p>PDF yüklenemedi. Lütfen <b>${url}</b> dosyasının klasörde olduğundan emin olun.</p>
                    </div>`;
            });
        }
    }
});
