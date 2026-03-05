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

    // 3. PDF Viewer Carousel (Project Detail Page)
    const pdfCanvas = document.getElementById('pdf-canvas');
    if (pdfCanvas) {
        // Use the specific file provided by the user
        const url = 'PschologyFinal.pdf';

        let pdfDoc = null,
            pageNum = 1,
            pageRendering = false,
            pageNumPending = null,
            scale = 1.5,
            ctx = pdfCanvas.getContext('2d');

        /**
         * Get page info from document, resize canvas accordingly, and render page.
         * @param num Page number.
         */
        function renderPage(num) {
            pageRendering = true;
            // Using promise to fetch the page
            pdfDoc.getPage(num).then((page) => {
                const viewport = page.getViewport({ scale: scale });
                pdfCanvas.height = viewport.height;
                pdfCanvas.width = viewport.width;

                // Render PDF page into canvas context
                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                const renderTask = page.render(renderContext);

                // Wait for rendering to finish
                renderTask.promise.then(() => {
                    pageRendering = false;
                    if (pageNumPending !== null) {
                        // New page rendering is pending
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
            });

            // Update page counters
            document.getElementById('page-num').textContent = num;
        }

        /**
         * If another page rendering in progress, waits until the rendering is
         * finised. Otherwise, executes rendering immediately.
         */
        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        /**
         * Displays previous page.
         */
        function onPrevPage() {
            if (pageNum <= 1) {
                return;
            }
            pageNum--;
            queueRenderPage(pageNum);
        }
        document.getElementById('prev-page').addEventListener('click', onPrevPage);

        /**
         * Displays next page.
         */
        function onNextPage() {
            if (pageNum >= pdfDoc.numPages) {
                return;
            }
            pageNum++;
            queueRenderPage(pageNum);
        }
        document.getElementById('next-page').addEventListener('click', onNextPage);

        /**
         * Asynchronously downloads PDF.
         */
        pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
            pdfDoc = pdfDoc_;
            document.getElementById('page-count').textContent = pdfDoc.numPages;

            // Initial/first page rendering
            renderPage(pageNum);
        }).catch(err => {
            console.error('Error loading PDF:', err);
            // Show a friendly message on the canvas or container if PDF fails to load
            const container = document.getElementById('pdf-viewer-container');
            container.innerHTML = `<div style="color: white; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ffcc00; margin-bottom: 15px;"></i>
                <p>PDF yüklenemedi. Lütfen <b>${url}</b> dosyasının <b>/portfolio</b> klasöründe olduğundan emin olun.</p>
            </div>`;
        });
    }
});
