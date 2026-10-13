(() => {
    'use strict';
    const escape = value => String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    function safeUrl(value) {
        const input = String(value || '').trim();
        if (!input || /[\s"'<>\\()]/.test(input)) return '';
        try {
            const url = new URL(input, location.href);
            return ['http:', 'https:'].includes(url.protocol) || (url.protocol === 'file:' && !/^[a-z]+:/i.test(input)) ? input : '';
        } catch (_) { return ''; }
    }
    function richText(value) {
        const template = document.createElement('template');
        template.innerHTML = String(value || '');
        const allowed = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'SPAN', 'DIV', 'BR', 'P', 'UL', 'OL', 'LI', 'A']);
        function clean(parent) {
            [...parent.childNodes].forEach(node => {
                if (node.nodeType === Node.COMMENT_NODE) { node.remove(); return; }
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH'].includes(node.tagName)) { node.remove(); return; }
                clean(node);
                if (!allowed.has(node.tagName)) { node.replaceWith(...node.childNodes); return; }
                const href = node.tagName === 'A' ? safeUrl(node.getAttribute('href')) : '';
                const styles = {};
                if (node.tagName === 'SPAN') {
                    const choices = {fontFamily:['inherit','Arial','Georgia','Verdana','"Courier New"','Courier New'],fontSize:['0.875em','1em','1.25em','1.5em','x-small','small','medium','large','x-large','xx-large','xxx-large'],fontWeight:['700','bold','normal','400'],fontStyle:['italic','normal'],textDecoration:['underline','line-through','none','underline line-through']};
                    Object.entries(choices).forEach(([key, values]) => { if (values.includes(node.style[key])) styles[key] = node.style[key]; });
                    for (const key of ['color','backgroundColor']) {
                        const value = node.style[key];
                        if (/^(#[\da-f]{3,8}|rgba?\([\d.,% ]+\)|transparent|inherit)$/i.test(value)) styles[key] = value;
                    }
                }
                if (['P','DIV'].includes(node.tagName) && ['left','center','right','justify'].includes(node.style.textAlign)) styles.textAlign = node.style.textAlign;
                [...node.attributes].forEach(attribute => node.removeAttribute(attribute.name));
                Object.assign(node.style, styles);
                if (href) { node.setAttribute('href', href); node.setAttribute('target', '_blank'); node.setAttribute('rel', 'noopener noreferrer'); }
            });
        }
        clean(template.content);
        return template.innerHTML;
    }
    function mediaLayout(value = {}) {
        const number = (input, fallback, min, max) => Number.isFinite(Number(input)) ? Math.min(max, Math.max(min, Number(input))) : fallback;
        const width = number(value?.width, 100, 10, 100);
        return { width, x: number(value?.x, 0, 0, 100 - width), top: number(value?.top, 0, 0, 240), ratio: value?.ratio ? number(value.ratio, null, 0.2, 5) : null };
    }
    function coverPosition(value = {}) {
        const coordinate = input => input !== null && input !== '' && Number.isFinite(Number(input)) ? Math.min(100, Math.max(0, Number(input))) : 50;
        return { x: coordinate(value?.x), y: coordinate(value?.y) };
    }
    function normalize(project) {
        const p = JSON.parse(JSON.stringify(project));
        ['title', 'category', 'metadata', 'thumbnailDescription', 'thumbnailAlt'].forEach(key => { p[key] = String(p[key] || ''); });
        p.id = String(p.id || '').replace(/[^a-zA-Z0-9_-]/g, '');
        p.thumbnail = safeUrl(p.thumbnail);
        p.thumbnailPosition = coverPosition(p.thumbnailPosition);
        p.bannerSrc = safeUrl(p.bannerSrc);
        p.intro = richText(p.intro);
        p.tags = (p.tags || []).map(value => String(value));
        p.contributions = (p.contributions || []).map(value => String(value));
        p.links = (p.links || []).map(link => ({ label: String(link.label || ''), href: safeUrl(link.href) })).filter(link => link.href);
        function media(block) {
            if (block.type === 'text') return { ...block, value: richText(block.value) };
            if (block.type === 'media-board') return window.CanvasBoard ? window.CanvasBoard.normalize(block) : block;
            return { ...block, columns: Number(block.columns) === 3 ? 3 : 2, layout: block.layout ? mediaLayout(block.layout) : undefined, src: safeUrl(block.src), caption: escape(block.caption), items: (block.items || []).map(media) };
        }
        p.mainMedia = p.mainMedia ? media(p.mainMedia) : null;
        p.sections = (p.sections || []).map((section, index) => ({
            ...section, id: `project-section-${index + 1}`, title: escape(section.title),
            content: richText(section.content), blocks: section.blocks ? section.blocks.map(media) : undefined
        }));
        return p;
    }
    // These pages use innerHTML for cards and rich text. Normalize data before it reaches them.
    function setProjects(projects) {
        window.PROJECTS = projects.map(normalize);
        window.PORTFOLIO_CATEGORIES = ['All', ...new Set(window.PROJECTS.map(project => project.category))];
    }
    window.PortfolioStore = { escape, safeUrl, richText, normalize, mediaLayout, coverPosition };
    window.portfolioReady = (async () => {
        if (new URLSearchParams(location.search).get('preview') === '1') {
            try {
                const preview = JSON.parse(sessionStorage.getItem('portfolio-project-preview'));
                if (preview && Date.now() - preview.createdAt < 3600000) {
                    setProjects([{ ...preview.project, published: true }]);
                    document.addEventListener('DOMContentLoaded', () => {
                        const note = document.createElement('p');
                        note.textContent = 'Önizleme — kaydedilmemiş değişiklikler. Ziyaretçiler bu önizlemeyi görmez.';
                        note.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:10000;background:#103c39;color:white;padding:12px;text-align:center;margin:0;font:14px sans-serif';
                        document.body.appendChild(note);
                        const robots = document.createElement('meta'); robots.name = 'robots'; robots.content = 'noindex'; document.head.appendChild(robots);
                    });
                    return;
                }
            } catch (_) { /* Expired or absent preview uses the regular project source. */ }
        }
        setProjects(window.PROJECTS || []);
    })();
})();
