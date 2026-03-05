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
            // --- Navigation Lock ---
            if (window.isDotNavigating) return;
            if (window.dotNavUnlockScrollY !== undefined && window.dotNavUnlockScrollY !== -1) {
                // Unlock only if user manually scrolls more than 50px away from resting place
                if (Math.abs(window.scrollY - window.dotNavUnlockScrollY) < 50) return;
                window.dotNavUnlockScrollY = -1;
            }

            let currentSection = '';

            // Highlight the first dot when at the very top of the page
            if (window.scrollY < 100 && navDots.length > 0) {
                const firstHref = navDots[0].getAttribute('href');
                if (firstHref) currentSection = firstHref.substring(1);
            } else {
                // Find the section that occupies the focal area of the screen (top-middle)
                let minDistance = Infinity;
                const focalPoint = window.innerHeight * 0.4;

                for (let i = 0; i < navDots.length; i++) {
                    const dot = navDots[i];
                    const href = dot.getAttribute('href');
                    if (!href || !href.startsWith('#')) continue;

                    const targetId = href.substring(1);
                    const section = document.getElementById(targetId);

                    if (section) {
                        const rect = section.getBoundingClientRect();
                        // Consider sections currently on screen
                        if (rect.bottom > 0 && rect.top < window.innerHeight) {
                            const sectionCenter = (rect.top + rect.bottom) / 2;
                            const distance = Math.abs(sectionCenter - focalPoint);

                            if (distance < minDistance) {
                                minDistance = distance;
                                currentSection = targetId;
                            }
                        }
                    }
                }
            }

            if (currentSection) {
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('href') === `#${currentSection}`) {
                        dot.classList.add('active');
                    }
                });
            }
        };

        window._dotNavScrollHandler = updateActiveDot;
        window._dotNavResizeHandler = checkScrollability;

        window.addEventListener('scroll', updateActiveDot, { passive: true });
        window.addEventListener('resize', checkScrollability, { passive: true });

        // Initial run
        updateActiveDot();
        checkScrollability();
    };

    // Initial call
    window.initDotNav();

    // 3. Smooth scrolling for dot navigation (using Event Delegation)
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('.dot-nav a');
        if (anchor) {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');

            // --- Navigation Lock ---
            // Prevent the scroll spy from overriding the clicked dot during animation
            window.isDotNavigating = true;

            // Instantly update the dot visually
            document.querySelectorAll('.dot-nav a').forEach(dot => dot.classList.remove('active'));
            anchor.classList.add('active');

            // Clear any previous timeouts
            if (window.dotNavTimeout) clearTimeout(window.dotNavTimeout);

            // Re-enable scroll spy after smooth scroll finishes (~800ms)
            // It will only unlock completely after the user manually scrolls 50px
            window.dotNavTimeout = setTimeout(() => {
                window.dotNavUnlockScrollY = window.scrollY;
                window.isDotNavigating = false;
            }, 800);

            // Special handling for scrolling to Top
            if (targetId === '#navbar' || targetId === '#top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
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

                // --- Mobile Swipe Integration ---
                let touchStartX = 0;
                let touchEndX = 0;
                let touchStartY = 0;
                let touchEndY = 0;

                pdfContainer.addEventListener('touchstart', e => {
                    touchStartX = e.changedTouches[0].screenX;
                    touchStartY = e.changedTouches[0].screenY;
                }, { passive: true });

                pdfContainer.addEventListener('touchmove', e => {
                    const currentX = e.changedTouches[0].screenX;
                    const currentY = e.changedTouches[0].screenY;
                    const diffX = Math.abs(currentX - touchStartX);
                    const diffY = Math.abs(currentY - touchStartY);

                    // If the user is swiping horizontally more than vertically, prevent vertical scroll
                    if (diffX > diffY && diffX > 10) {
                        e.preventDefault();
                    }
                }, { passive: false });

                pdfContainer.addEventListener('touchend', e => {
                    touchEndX = e.changedTouches[0].screenX;
                    touchEndY = e.changedTouches[0].screenY;

                    const diffX = touchEndX - touchStartX;
                    const diffY = Math.abs(touchEndY - touchStartY);

                    // Thresholds: Must swipe at least 50px horizontally, and the swipe shouldn't be too vertical
                    if (Math.abs(diffX) > 50 && diffY < 50) {
                        if (diffX < 0) {
                            // Swiped left => Next page
                            const nextBtn = document.getElementById('next-page');
                            if (nextBtn) nextBtn.click();
                        } else {
                            // Swiped right => Prev page
                            const prevBtn = document.getElementById('prev-page');
                            if (prevBtn) prevBtn.click();
                        }
                    }
                }, { passive: true });

            }).catch(err => {
                console.error("PDF error:", err);
                pdfContainer.innerHTML = `<div style="color: white; text-align: center; padding: 20px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ffcc00; margin-bottom: 15px;"></i>
                        <p>PDF could not be loaded. Please ensure the file <b>${url}</b> is placed in the correct directory.</p>
                    </div>`;
            });
        }
    }
});
