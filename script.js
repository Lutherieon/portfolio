document.addEventListener("DOMContentLoaded", () => {
    // 1. Fade-in on scroll animation
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05 // Trigger when 5% of the element is visible (fixes double scroll on tall elements)
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Optional: Stop observing once faded in
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 2. Dot Navigation Highlight on Scroll
    const navDots = document.querySelectorAll('.dot-nav a');

    if (navDots.length > 0) {

        const updateActiveDot = () => {
            let currentSection = '';

            navDots.forEach(dot => {
                const targetId = dot.getAttribute('href').substring(1);
                const section = document.getElementById(targetId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // If the section's top has crossed the middle of the viewport
                    if (rect.top <= window.innerHeight / 2 + 100) {
                        currentSection = targetId;
                    }
                }
            });

            navDots.forEach(dot => {
                dot.classList.remove('active');
                if (currentSection && dot.getAttribute('href').includes(currentSection)) {
                    dot.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', updateActiveDot);
        updateActiveDot(); // Trigger once on load
    }

    // 3. Dynamic Content Support (Intersection Observer Re-run)
    // We export this so project-detail.html can call it after injecting sections.
    window.initFadeAnimations = () => {
        const fadeElements = document.querySelectorAll('.fade-in-section:not(.is-visible)');
        fadeElements.forEach(el => observer.observe(el));
    };

    // 4. PDF Viewer Carousel (Project Detail Page)
    const pdfCanvas = document.getElementById('pdf-canvas');
    if (pdfCanvas) {
        // Use the global PDF_SRC if available, otherwise fallback
        const checkPdfSrc = setInterval(() => {
            if (window.PDF_SRC) {
                clearInterval(checkPdfSrc);
                loadPDF(window.PDF_SRC);
            }
        }, 100);

        // Also try immediately just in case
        if (window.PDF_SRC) {
            clearInterval(checkPdfSrc);
            loadPDF(window.PDF_SRC);
        }

        function loadPDF(url) {
            let pdfDoc = null,
                pageNum = 1,
                pageRendering = false,
                pageNumPending = null,
                scale = 1.5,
                ctx = pdfCanvas.getContext('2d');

            function renderPage(num) {
                pageRendering = true;
                pdfDoc.getPage(num).then((page) => {
                    const viewport = page.getViewport({ scale: scale });
                    pdfCanvas.height = viewport.height;
                    pdfCanvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    };
                    const renderTask = page.render(renderContext);

                    renderTask.promise.then(() => {
                        pageRendering = false;
                        if (pageNumPending !== null) {
                            renderPage(pageNumPending);
                            pageNumPending = null;
                        }
                    });
                });
                document.getElementById('page-num').textContent = num;
            }

            function queueRenderPage(num) {
                if (pageRendering) {
                    pageNumPending = num;
                } else {
                    renderPage(num);
                }
            }

            function onPrevPage() {
                if (pageNum <= 1) return;
                pageNum--;
                queueRenderPage(pageNum);
            }
            document.getElementById('prev-page').addEventListener('click', onPrevPage);

            function onNextPage() {
                if (pageNum >= pdfDoc.numPages) return;
                pageNum++;
                queueRenderPage(pageNum);
            }
            document.getElementById('next-page').addEventListener('click', onNextPage);

            pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
                pdfDoc = pdfDoc_;
                document.getElementById('page-count').textContent = pdfDoc.numPages;
                renderPage(pageNum);
            }).catch(err => {
                console.error('Error loading PDF:', err);
                const container = document.getElementById('pdf-viewer-container');
                container.innerHTML = `<div style="color: white; text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ffcc00; margin-bottom: 15px;"></i>
                    <p>PDF yüklenemedi. Lütfen <b>${url}</b> dosyasının klasörde olduğundan emin olun.</p>
                </div>`;
            });
        }
    }
});
