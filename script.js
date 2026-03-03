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
});
