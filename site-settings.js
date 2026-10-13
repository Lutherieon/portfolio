(() => {
    'use strict';
    const s = window.SETTINGS || {};
    const clamp = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
    const theme = s.theme || {};
    const root = document.documentElement;
    for (const [key, variable] of [['background','--bg-color-dark'],['text','--text-color-light'],['accent','--accent-teal']]) if (/^#[a-f\d]{6}$/i.test(theme[key])) root.style.setProperty(variable, theme[key]);
    const fonts = ['Open Sans','Montserrat','Playfair Display','Arial','Georgia','Verdana','Courier New'];
    if (fonts.includes(theme.bodyFont)) root.style.setProperty('--font-body', `"${theme.bodyFont}",sans-serif`);
    if (fonts.includes(theme.headingFont)) root.style.setProperty('--font-headers', `"${theme.headingFont}",sans-serif`);
    const p = s.portfolio || {};
    const style = document.createElement('style');
    style.textContent = `.hero{min-height:max(280px,var(--hero-height,${clamp(theme.heroHeight,70,40,100)}svh))}.portfolio-grid{grid-template-columns:repeat(${Math.round(clamp(p.columns,3,1,4))},minmax(0,1fr));gap:${clamp(p.gap,40,8,100)}px}.card-image-wrapper{aspect-ratio:${clamp(p.ratio,.8889,.4,2)}}.showcase-section{padding-top:${clamp(theme.sectionSpacing,100,20,200)}px}.info-section{padding-top:${clamp(theme.sectionSpacing,100,20,200)}px;padding-bottom:${clamp(theme.sectionSpacing,100,20,200)}px}@media(max-width:700px){.portfolio-grid{grid-template-columns:minmax(0,1fr)}}`;
    document.head.append(style);
    document.addEventListener('DOMContentLoaded', async () => {
        await window.portfolioReady;
        // Dynamic page sections are created by their own DOMContentLoaded handlers.
        requestAnimationFrame(() => {
            if (document.querySelector('.hero')) {
                const main = document.querySelector('main');
                const dynamic = document.querySelector('#dynamic-home-sections');
                if (dynamic) { [...dynamic.children].forEach(node => main.insertBefore(node, dynamic)); dynamic.remove(); }
                const sections = Array.isArray(s.homeSections) ? s.homeSections : [];
                sections.forEach(item => {
                    const node = document.getElementById(String(item.id));
                    if (!node || !['HEADER','SECTION'].includes(node.tagName)) return;
                    node.hidden = item.visible === false;
                    if (node.tagName === 'HEADER' || main.contains(node)) main.append(node);
                    document.querySelectorAll('.dot-nav a').forEach(link => { if (link.getAttribute('href') === `#${item.id}`) link.parentElement.hidden = item.visible === false; });
                });
            }
            const shared = s.shared || {};
            if (!shared.enabled) return;
            const safe = window.PortfolioStore.safeUrl;
            const nav = document.querySelector('#navbar ul');
            if (nav && Array.isArray(shared.menu)) {
                nav.replaceChildren();
                shared.menu.forEach(item => { const href=safe(item.link); if(!href)return; const li=document.createElement('li'),a=document.createElement('a'); a.href=href;a.textContent=item.title; if(new URL(href,location.href).pathname===location.pathname&&!href.includes('#')){a.className='active';a.setAttribute('aria-current','page');} li.append(a);nav.append(li); });
            }
            const logo=document.querySelector('#navbar img'); if(logo&&safe(shared.logo))logo.src=safe(shared.logo);
            const footer=document.querySelector('footer > p');if(footer)footer.textContent=shared.copyright || '';
            const social=document.querySelector('footer .social-links');
            if(social&&Array.isArray(shared.social)){social.replaceChildren();shared.social.forEach(item=>{const href=safe(item.link);if(!href)return;const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',item.title);const icon=document.createElement('i');icon.className='fa-brands fa-'+String(item.icon||'').replace(/[^a-z-]/g,'');a.append(icon);social.append(a);});}
        });
    });
})();
