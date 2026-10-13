(() => {
    'use strict';
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const round = value => Math.round(value * 10) / 10;
    function attach(node, block, source, changed, isBusy) {
        let layout = window.PortfolioStore.mediaLayout(block.layout), naturalRatio = block.type === 'pdf' ? 0.75 : 16 / 9;
        const panel = document.createElement('div'); panel.className = 'media-layout-editor';
        const hint = document.createElement('p'); hint.className = 'hint'; hint.textContent = 'Önizlemeyi sürükle: konum · Sağ alt köşe: boyut · Taşı tutamacı: içerik sırası';
        const stage = document.createElement('div'); stage.className = 'media-layout-stage';
        const box = document.createElement('div'); box.className = 'media-layout-box';
        const media = document.createElement('div'); media.className = 'media-layout-preview';
        const drag = document.createElement('button'); drag.type = 'button'; drag.className = 'media-position-handle'; drag.textContent = '✥ Konum'; drag.setAttribute('aria-label', 'Medyayı sürükleyerek konumlandır');
        const resize = document.createElement('button'); resize.type = 'button'; resize.className = 'media-resize-handle'; resize.textContent = '↘'; resize.setAttribute('aria-label', 'Medyayı sürükleyerek boyutlandır');
        box.append(media, drag, resize); stage.append(box);
        const controls = document.createElement('div'); controls.className = 'media-layout-controls';
        const inputs = {};
        for (const [key, labelText, min, max] of [['width', 'Genişlik %', 10, 100], ['x', 'Soldan %', 0, 90], ['top', 'Üst boşluk px', 0, 240]]) {
            const label = document.createElement('label'); label.textContent = labelText;
            const input = document.createElement('input'); input.type = 'number'; input.min = min; input.max = max; input.step = '0.1'; input.dataset.layoutField = key;
            input.addEventListener('input', () => { layout[key] = Number(input.value); layout = window.PortfolioStore.mediaLayout(layout); paint(); changed(); });
            input.addEventListener('blur', () => { input.value = round(layout[key]); });
            inputs[key] = input; label.append(input); controls.append(label);
        }
        const presets = document.createElement('div'); presets.className = 'media-layout-presets';
        if (['image', 'gif'].includes(block.type)) {
            for (const [key, title, min, max, step] of [['zoom','Yakınlaştırma',1,4,0.05],['cropX','Görselde yatay konum',0,100,1],['cropY','Görselde dikey konum',0,100,1]]) {
                const label = document.createElement('label'); label.textContent = title;
                const input = document.createElement('input'); input.type = 'range'; input.min = min; input.max = max; input.step = step; input.dataset.layoutField = key;
                input.oninput = () => { layout[key] = Number(input.value); paint(); changed(); }; inputs[key] = input; label.append(input); controls.append(label);
            }
        }
        for (const [text, action] of [
            ['Sol', () => { layout.x = 0; }], ['Orta', () => { layout.x = (100 - layout.width) / 2; }], ['Sağ', () => { layout.x = 100 - layout.width; }],
            ['Sıfırla', () => { layout = window.PortfolioStore.mediaLayout(); }]
        ]) {
            const button = document.createElement('button'); button.type = 'button'; button.textContent = text;
            button.onclick = () => { action(); paint(); changed(); }; presets.append(button);
        }
        panel.append(hint, stage, controls, presets); node.append(panel);
        function paint() {
            box.style.width = layout.width + '%'; box.style.left = layout.x + '%'; box.style.top = layout.top + 'px';
            box.style.aspectRatio = layout.ratio || naturalRatio;
            stage.style.height = Math.max(150, stage.clientWidth * layout.width / 100 / (layout.ratio || naturalRatio) + layout.top + 20) + 'px';
            for (const key of Object.keys(inputs)) if (document.activeElement !== inputs[key]) inputs[key].value = round(layout[key]);
            inputs.x.max = round(100 - layout.width);
            const image = media.querySelector('img');
            if (image) { image.style.transform = `scale(${layout.zoom})`; image.style.transformOrigin = `${layout.cropX}% ${layout.cropY}%`; }
        }
        function updateSource() {
            media.replaceChildren();
            const src = window.PortfolioStore.safeUrl(source.value);
            if (!src) { media.textContent = 'Dosya ekleyince burada görünür'; paint(); return; }
            let preview;
            if (['image', 'gif'].includes(block.type)) {
                preview = document.createElement('img'); preview.alt = 'Medya önizlemesi'; preview.draggable = false;
                preview.onload = () => { naturalRatio = clamp(preview.naturalWidth / preview.naturalHeight, 0.2, 5); paint(); };
            } else if (block.type === 'video') {
                const hosted = /https:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be|player\.vimeo\.com|vimeo\.com)\//i.test(src);
                if (hosted) {
                    // Keep the layout surface draggable without a third-party player intercepting the pointer.
                    const text = document.createElement('span'); text.textContent = '▶ Video · Oynatmak için Önizle'; media.append(text); paint(); return;
                }
                preview = document.createElement('video'); preview.muted = true; preview.preload = 'metadata';
                preview.onloadedmetadata = () => { if (preview.videoWidth) { naturalRatio = clamp(preview.videoWidth / preview.videoHeight, 0.2, 5); paint(); } };
            } else { media.textContent = 'PDF · Belgeyi görmek için Önizle'; paint(); return; }
            preview.src = src; media.append(preview); paint();
        }
        source.addEventListener('input', updateSource);
        source.addEventListener('change', updateSource);
        let measuredWidth = -1;
        const observer = new ResizeObserver(() => {
            if (!node.isConnected) { observer.disconnect(); return; }
            if (stage.clientWidth === measuredWidth) return;
            measuredWidth = stage.clientWidth; requestAnimationFrame(() => { if (node.isConnected) paint(); });
        });
        observer.observe(stage);
        function gesture(event) {
            if (isBusy() || event.button !== 0 || !stage.clientWidth) return;
            event.preventDefault();
            const resizing = event.target.closest('.media-resize-handle');
            const start = { x: event.clientX, y: event.clientY, layout: { ...layout }, width: stage.clientWidth, height: box.getBoundingClientRect().height };
            const pointer = event.pointerId; box.setPointerCapture(pointer); box.classList.add('is-adjusting');
            const move = e => {
                if (e.pointerId !== pointer) return;
                const dx = e.clientX - start.x, dy = e.clientY - start.y;
                if (resizing) {
                    layout.width = round(clamp(start.layout.width + dx / start.width * 100, 10, 100 - start.layout.x));
                    const height = clamp(start.height + dy, start.width * layout.width / 100 / 5, start.width * layout.width / 100 / 0.2);
                    layout.ratio = round(clamp(start.width * layout.width / 100 / height, 0.2, 5));
                } else {
                    layout.x = round(clamp(start.layout.x + dx / start.width * 100, 0, 100 - layout.width));
                    layout.top = round(clamp(start.layout.top + dy, 0, 240));
                }
                paint(); changed();
            };
            const end = e => {
                if (e.pointerId !== pointer) return;
                box.removeEventListener('pointermove', move); box.removeEventListener('pointerup', end); box.removeEventListener('pointercancel', end); box.removeEventListener('lostpointercapture', end);
                if (box.hasPointerCapture(pointer)) box.releasePointerCapture(pointer); box.classList.remove('is-adjusting');
            };
            box.addEventListener('pointermove', move); box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end); box.addEventListener('lostpointercapture', end);
        }
        box.addEventListener('pointerdown', gesture);
        function keyboard(event, resizing) {
            if (isBusy() || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
            event.preventDefault();
            const direction = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1;
            if (resizing) {
                if (['ArrowLeft', 'ArrowRight'].includes(event.key)) layout.width = clamp(layout.width + direction * 2, 10, 100 - layout.x);
                else {
                    const width = stage.clientWidth * layout.width / 100;
                    layout.ratio = clamp(width / Math.max(1, width / (layout.ratio || naturalRatio) + direction * 12), 0.2, 5);
                }
            } else if (['ArrowLeft', 'ArrowRight'].includes(event.key)) layout.x = clamp(layout.x + direction * 2, 0, 100 - layout.width);
            else layout.top = clamp(layout.top + direction * 10, 0, 240);
            paint(); changed();
        }
        drag.addEventListener('keydown', event => keyboard(event, false)); resize.addEventListener('keydown', event => keyboard(event, true));
        node._getLayout = () => window.PortfolioStore.mediaLayout({ ...layout, ratio: layout.ratio || (block.type === 'video' ? naturalRatio : null) });
        updateSource();
    }
    window.MediaEditor = { attach };
})();
