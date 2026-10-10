(() => {
    'use strict';
    const number = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
    const frame = (value = {}) => ({ x: number(value.x, 0, -50000, 50000), y: number(value.y, 0, -50000, 50000), width: number(value.width, 400, 40, 5000), height: number(value.height, 260, 40, 5000) });
    function normalize(board) {
        return { ...board, type: 'media-board', items: (board.items || []).filter(item => ['image', 'gif', 'video', 'pdf', 'text'].includes(item.type)).map(item => ({
            ...item, id: String(item.id || crypto.randomUUID()), frame: frame(item.frame), src: window.PortfolioStore.safeUrl(item.src),
            caption: String(item.caption || ''), value: String(item.value || '')
        })) };
    }
    function bounds(items) {
        if (!items.length) return { x: 0, y: 0, width: 1000, height: 650 };
        const left = Math.min(...items.map(item => item.frame.x)) - 30, top = Math.min(...items.map(item => item.frame.y)) - 30;
        return { x: left, y: top, width: Math.max(...items.map(item => item.frame.x + item.frame.width)) + 30 - left, height: Math.max(...items.map(item => item.frame.y + item.frame.height)) + 30 - top };
    }
    function fromMedia(blocks) {
        const items = [], pending = []; let row = 0;
        function gather(block) {
            if (block.type === 'media-board') { (block.items || []).forEach(item => items.push({ ...item, frame: frame(item.frame) })); return; }
            if (block.type === 'media-group') { (block.items || []).forEach(gather); return; }
            pending.push(block);
        }
        blocks.forEach(gather);
        const existing = items.length ? bounds(items) : null, offset = existing ? existing.x + existing.width + 40 : 0;
        function add(block) {
            if (!['image', 'gif', 'video', 'pdf'].includes(block.type)) return;
            const layout = window.PortfolioStore.mediaLayout(block.layout);
            const width = 420 * layout.width / 100, height = width / (layout.ratio || (block.type === 'pdf' ? 0.75 : 16 / 9));
            items.push({ ...block, id: crypto.randomUUID(), frame: frame({ x: offset + (row % 2) * 480 + layout.x * 4.2, y: Math.floor(row / 2) * 620 + layout.top, width, height }) }); row++;
        }
        pending.forEach(add); return normalize({ type: 'media-board', items });
    }
    function render(board) {
        const data = normalize(board), items = data.items.filter(item => item.type === 'text' ? item.value.trim() : item.src);
        if (!items.length) return '';
        const rect = bounds(items), escape = window.PortfolioStore.escape;
        const html = items.map(item => {
            const f = item.frame, style = `left:${(f.x - rect.x) / rect.width * 100}%;top:${(f.y - rect.y) / rect.height * 100}%;width:${f.width / rect.width * 100}%;height:${f.height / rect.height * 100}%`;
            let content;
            if (item.type === 'text') content = `<div class="canvas-board-text">${escape(item.value)}</div>`;
            else if (item.type === 'video') content = item.provider === 'youtube' ? `<iframe src="${escape(item.src)}" title="${escape(item.caption || 'Proje videosu')}" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>` : `<video src="${escape(item.src)}" controls playsinline preload="metadata"></video>`;
            else if (item.type === 'pdf') content = `<object data="${escape(item.src)}" type="application/pdf"><a href="${escape(item.src)}" target="_blank" rel="noopener">PDF'i aç</a></object>`;
            else content = `<img src="${escape(item.src)}" alt="${escape(item.caption || 'Proje görseli')}" loading="lazy" decoding="async">`;
            return `<figure class="canvas-board-item" style="${style}">${content}${item.caption ? `<figcaption>${escape(item.caption)}</figcaption>` : ''}</figure>`;
        }).join('');
        return `<div class="canvas-board" style="--board-ratio:${rect.width / rect.height}"><div class="canvas-board-frame" style="aspect-ratio:${rect.width}/${rect.height}">${html}</div><button type="button" class="canvas-board-expand" aria-label="Medya tuvalini tam ekran aç">Tam ekran ↗</button></div>`;
    }
    document.addEventListener('click', event => {
        const button = event.target.closest('.canvas-board-expand'); if (!button) return;
        const board = button.closest('.canvas-board');
        if (document.fullscreenElement === board) document.exitFullscreen?.(); else board.requestFullscreen?.().catch(() => {});
    });
    window.CanvasBoard = { normalize, frame, bounds, fromMedia, render };
})();
