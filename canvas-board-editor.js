(() => {
    'use strict';
    const clone = value => JSON.parse(JSON.stringify(value));
    let session;
    const dialog = document.createElement('dialog'); dialog.className = 'board-editor-dialog';
    dialog.innerHTML = `<div class="board-toolbar"><strong>Serbest tuval</strong><div class="board-tools"><button type="button" data-action="upload">+ Dosyalar</button><button type="button" data-action="link">+ Bağlantı</button><button type="button" data-action="text">+ Not</button><button type="button" data-action="undo" aria-label="Geri al">↶</button><button type="button" data-action="redo" aria-label="Yinele">↷</button><button type="button" data-action="fit">Tümünü göster</button><button type="button" data-action="zoom-out" aria-label="Uzaklaştır">−</button><output class="board-zoom">100%</output><button type="button" data-action="zoom-in" aria-label="Yakınlaştır">+</button></div><button type="button" data-action="cancel">İptal</button><button type="button" class="primary" data-action="apply">Tuvale uygula</button></div>
        <div class="board-editor-body"><div class="board-viewport" tabindex="0" aria-label="Serbest medya tuvali. Tekerlekle yakınlaştır, boş alanı sürükleyerek gezin."><div class="board-world"></div><p class="board-empty">Dosyaları buraya bırak<br>GIF, görsel ve videoları serbestçe yerleştir</p></div>
        <aside class="board-inspector"><h2>Seçili medya</h2><p class="board-selection hint">Medya seç</p><div class="board-item-fields" hidden><label>Tür<select data-field="type"><option value="image">Görsel</option><option value="gif">GIF</option><option value="video">Video</option><option value="pdf">PDF</option><option value="text">Not</option></select></label><label data-source-label>Kaynak<input data-field="src" placeholder="Dosya yolu / YouTube / Vimeo"></label><label data-text-label hidden>Not<textarea data-field="value" rows="5"></textarea></label><label>Açıklama<textarea data-field="caption" rows="2"></textarea></label><div class="board-frame-fields"><label>X<input data-frame="x" type="number"></label><label>Y<input data-frame="y" type="number"></label><label>Genişlik<input data-frame="width" type="number" min="40"></label><label>Yükseklik<input data-frame="height" type="number" min="40"></label></div></div><div class="board-layer-actions"><button type="button" data-action="front">Öne getir</button><button type="button" data-action="back">Arkaya gönder</button><button type="button" data-action="delete">Kaldır</button></div><p class="hint">Sürükle: taşı<br>Köşeler: boyut<br>Shift + köşe: serbest oran<br>Tekerlek: zoom<br>Boş alan / orta tuş / Space: gezin<br>Shift + tık: çoklu seçim<br>Ctrl+Z: geri al</p></aside></div><footer class="board-footer"><span class="board-message" role="status" aria-live="polite">Yerleşim proje dosyasına Kaydet ile yazılır.</span></footer><input class="board-file-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,application/pdf" multiple hidden>`;
    document.body.append(dialog);
    const $ = selector => dialog.querySelector(selector), viewport = $('.board-viewport'), world = $('.board-world');
    const action = name => $(`[data-action="${name}"]`);
    const fields = [...dialog.querySelectorAll('[data-field],[data-frame]')];
    let space = false, gesture;
    const selected = () => session.items.filter(item => session.selection.has(item.id));
    const message = text => { $('.board-message').textContent = text; };
    function record(before) {
        if (JSON.stringify(before) === JSON.stringify(session.items)) return;
        session.history.push(before); if (session.history.length > 60) session.history.shift();
        session.future = []; session.dirty = true; updateInspector();
    }
    function mutate(callback) { const before = clone(session.items); callback(); record(before); render(); }
    function updateInspector() {
        const items = selected(), item = items.length === 1 ? items[0] : null;
        $('.board-selection').textContent = items.length ? `${items.length} medya seçili` : 'Medya seç';
        $('.board-item-fields').hidden = !item;
        action('undo').disabled = session.busy || !session.history.length; action('redo').disabled = session.busy || !session.future.length;
        for (const name of ['front', 'back', 'delete']) action(name).disabled = session.busy || !items.length;
        for (const input of fields) {
            input.disabled = session.busy;
            if (item && document.activeElement !== input) input.value = input.dataset.frame ? Math.round(item.frame[input.dataset.frame]) : item[input.dataset.field] || '';
        }
        if (item) { $('[data-source-label]').hidden = item.type === 'text'; $('[data-text-label]').hidden = item.type !== 'text'; }
    }
    function camera() {
        world.style.transform = `translate(${session.view.x}px,${session.view.y}px) scale(${session.view.scale})`;
        $('.board-zoom').textContent = Math.round(session.view.scale * 100) + '%';
        viewport.style.backgroundSize = `${40 * session.view.scale}px ${40 * session.view.scale}px`;
        viewport.style.backgroundPosition = `${session.view.x}px ${session.view.y}px`;
    }
    function fit() {
        const rect = window.CanvasBoard.bounds(session.items), width = viewport.clientWidth, height = viewport.clientHeight;
        session.view.scale = Math.max(0.05, Math.min(2, Math.min((width - 60) / rect.width, (height - 60) / rect.height)));
        session.view.x = (width - rect.width * session.view.scale) / 2 - rect.x * session.view.scale;
        session.view.y = (height - rect.height * session.view.scale) / 2 - rect.y * session.view.scale; camera();
    }
    function zoom(factor, x = viewport.clientWidth / 2, y = viewport.clientHeight / 2) {
        const view = session.view, scale = Math.max(0.05, Math.min(5, view.scale * factor));
        view.x = x - (x - view.x) * scale / view.scale; view.y = y - (y - view.y) * scale / view.scale; view.scale = scale; camera();
    }
    function paintPositions() {
        for (const item of session.items) {
            const node = [...world.children].find(node => node.dataset.boardId === item.id); if (!node) continue;
            Object.assign(node.style, { left: item.frame.x + 'px', top: item.frame.y + 'px', width: item.frame.width + 'px', height: item.frame.height + 'px' });
            node.classList.toggle('is-selected', session.selection.has(item.id));
        }
        updateInspector();
    }
    function render() {
        world.replaceChildren();
        for (const item of session.items) {
            const node = document.createElement('div'); node.className = 'board-edit-item'; node.dataset.boardId = item.id;
            const media = document.createElement('div'); media.className = 'board-edit-media';
            if (item.type === 'text') { media.textContent = item.value || 'Not'; media.classList.add('board-note'); }
            else if (['image', 'gif'].includes(item.type) && item.src) { const image = document.createElement('img'); image.src = item.src; image.alt = item.caption; image.draggable = false; media.append(image); }
            else if (item.type === 'video' && item.provider !== 'youtube' && item.src) { const video = document.createElement('video'); video.src = item.src; video.muted = true; video.preload = 'metadata'; media.append(video); }
            else media.textContent = item.type === 'video' ? '▶ Video · Oynatmak için proje önizlemesini aç' : item.type === 'pdf' ? 'PDF' : 'Kaynak ekle';
            const caption = document.createElement('span'); caption.className = 'board-edit-caption'; caption.textContent = item.caption;
            node.append(media, caption);
            for (const corner of ['nw', 'ne', 'sw', 'se']) { const handle = document.createElement('span'); handle.className = 'board-corner ' + corner; handle.dataset.corner = corner; node.append(handle); }
            world.append(node);
        }
        $('.board-empty').hidden = Boolean(session.items.length); paintPositions(); camera();
    }
    function setBusy(value) {
        session.busy = value; dialog.querySelectorAll('button,input,textarea,select').forEach(node => { node.disabled = value; }); updateInspector();
    }
    function center() { return { x: (viewport.clientWidth / 2 - session.view.x) / session.view.scale, y: (viewport.clientHeight / 2 - session.view.y) / session.view.scale }; }
    function add(type, data = {}, position = center()) {
        const item = { id: crypto.randomUUID(), type, src: '', caption: '', value: '', ...data, frame: window.CanvasBoard.frame({ x: position.x, y: position.y, width: 400, height: type === 'text' ? 180 : 260, ...data.frame }) };
        mutate(() => { session.items.push(item); session.selection = new Set([item.id]); }); return item;
    }
    async function upload(files, position = center()) {
        if (session.busy || !files.length) return;
        setBusy(true); const before = clone(session.items), added = [];
        try {
            for (const file of files) {
                message(`${file.name} ekleniyor…`);
                const src = await window.LocalProjectFiles.upload(file);
                const type = file.type === 'image/gif' ? 'gif' : file.type.startsWith('video/') ? 'video' : file.type === 'application/pdf' ? 'pdf' : 'image';
                let ratio = 16 / 9;
                if (['image', 'gif'].includes(type)) {
                    const image = new Image(); image.src = URL.createObjectURL(file);
                    try { await image.decode(); ratio = image.naturalWidth / image.naturalHeight; } finally { URL.revokeObjectURL(image.src); }
                }
                const height = Math.min(420, 400 / ratio), width = height * ratio;
                const item = { id: crypto.randomUUID(), type, src, caption: '', value: '', provider: 'native', frame: window.CanvasBoard.frame({ x: position.x + added.length * 60, y: position.y + added.length * 60, width, height }) };
                session.items.push(item); added.push(item.id);
            }
            session.selection = new Set(added); message('Dosyalar eklendi. Sürükleyerek yerleştir.');
        } catch (error) { message(`Dosya eklenemedi: ${error.message}`); }
        finally { record(before); setBusy(false); render(); }
    }
    function close(apply) {
        if (session.busy) { message('Dosya eklenirken tuvali açık tut.'); return; }
        fields.forEach(input => input.blur());
        if (apply && session.items.some(item => item.type !== 'text' && !item.src)) { message('Kaynağı boş olan medyaya dosya/bağlantı ekle veya onu kaldır.'); return; }
        if (!apply && session.dirty && !window.confirm('Tuvaldeki kaydedilmemiş değişikliklerden vazgeçilsin mi?')) return;
        const result = window.CanvasBoard.normalize({ ...session.board, items: session.items }), callback = session.callback;
        dialog.close(); session = null; space = false; gesture = null;
        if (apply) callback(result);
    }
    function open(board, callback, options = {}) {
        if (dialog.open) return;
        const normalized = window.CanvasBoard.normalize(board);
        session = { board: normalized, items: clone(normalized.items), callback, options, selection: new Set(), history: [], future: [], dirty: false, busy: false, view: { x: 0, y: 0, scale: 1 } };
        dialog.showModal(); message('Yerleşim proje dosyasına Kaydet ile yazılır.'); render(); requestAnimationFrame(fit); viewport.focus();
    }
    const actions = {
        upload: () => { $('.board-file-input').value = ''; $('.board-file-input').click(); },
        link: () => { add('image'); $('[data-field="src"]').focus(); }, text: () => { add('text', { value: 'Not' }); $('[data-field="value"]').focus(); },
        fit, 'zoom-in': () => zoom(1.2), 'zoom-out': () => zoom(1 / 1.2), apply: () => close(true), cancel: () => close(false),
        undo: () => { if (!session.history.length) return; session.future.push(clone(session.items)); session.items = session.history.pop(); session.dirty = true; render(); },
        redo: () => { if (!session.future.length) return; session.history.push(clone(session.items)); session.items = session.future.pop(); session.dirty = true; render(); },
        delete: () => mutate(() => { session.items = session.items.filter(item => !session.selection.has(item.id)); session.selection.clear(); }),
        front: () => mutate(() => { session.items = [...session.items.filter(item => !session.selection.has(item.id)), ...selected()]; }),
        back: () => mutate(() => { session.items = [...selected(), ...session.items.filter(item => !session.selection.has(item.id))]; })
    };
    dialog.querySelectorAll('[data-action]').forEach(button => { button.onclick = () => { if (session && !session.busy) actions[button.dataset.action](); }; });
    $('.board-file-input').onchange = event => upload([...event.target.files]);
    fields.forEach(input => { input.onchange = () => {
        if (!session || session.busy || selected().length !== 1) return;
        mutate(() => {
            const item = selected()[0];
            if (input.dataset.frame) item.frame = window.CanvasBoard.frame({ ...item.frame, [input.dataset.frame]: input.value });
            else {
                item[input.dataset.field] = input.value;
                if (input.dataset.field === 'src' || input.dataset.field === 'type') {
                    item.src = window.PortfolioStore.safeUrl(session.options.normalizeSource?.(item.src) || item.src); item.provider = session.options.hostedVideo?.(item.src) ? 'youtube' : 'native';
                    if (input.dataset.field === 'src' && item.src) {
                        const path = new URL(item.src, location.href).pathname.toLowerCase();
                        if (item.provider === 'youtube' || /\.(mp4|webm)$/.test(path)) item.type = 'video';
                        else if (path.endsWith('.gif')) item.type = 'gif';
                        else if (path.endsWith('.pdf')) item.type = 'pdf';
                        else if (/\.(png|jpe?g|webp)$/.test(path)) item.type = 'image';
                    }
                }
            }
        });
    }; });
    viewport.addEventListener('wheel', event => { if (!session || session.busy) return; event.preventDefault(); const rect = viewport.getBoundingClientRect(); zoom(Math.exp(-event.deltaY * .0015), event.clientX - rect.left, event.clientY - rect.top); }, { passive: false });
    viewport.oncontextmenu = event => event.preventDefault();
    viewport.onpointerdown = event => {
        if (!session || session.busy || gesture || ![0, 1, 2].includes(event.button)) return;
        event.preventDefault(); viewport.focus();
        const node = event.target.closest('[data-board-id]'), panning = space || event.button !== 0 || !node;
        if (!panning) {
            if (event.shiftKey && !event.target.dataset.corner) { if (session.selection.has(node.dataset.boardId)) session.selection.delete(node.dataset.boardId); else session.selection.add(node.dataset.boardId); paintPositions(); return; }
            if (!session.selection.has(node.dataset.boardId)) session.selection = new Set([node.dataset.boardId]);
        } else if (!space && event.button === 0) session.selection.clear();
        paintPositions(); gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, before: clone(session.items), view: { ...session.view }, pan: panning, corner: event.target.dataset.corner, frames: selected().map(item => ({ id: item.id, frame: { ...item.frame } })) };
        viewport.setPointerCapture(event.pointerId);
    };
    viewport.onpointermove = event => {
        if (!gesture || event.pointerId !== gesture.id) return;
        const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
        if (gesture.pan) { session.view.x = gesture.view.x + dx; session.view.y = gesture.view.y + dy; camera(); return; }
        for (const start of gesture.frames) {
            const item = session.items.find(item => item.id === start.id), f = start.frame;
            if (!gesture.corner) item.frame = window.CanvasBoard.frame({ ...f, x: f.x + dx / session.view.scale, y: f.y + dy / session.view.scale });
            else {
                const west = gesture.corner.includes('w'), north = gesture.corner.includes('n');
                let width = Math.max(40, f.width + dx / session.view.scale * (west ? -1 : 1)), height = Math.max(40, f.height + dy / session.view.scale * (north ? -1 : 1));
                if (!event.shiftKey) { if (Math.abs(width / f.width - 1) >= Math.abs(height / f.height - 1)) height = width * f.height / f.width; else width = height * f.width / f.height; }
                const size = window.CanvasBoard.frame({ width, height });
                item.frame = window.CanvasBoard.frame({ width: size.width, height: size.height, x: west ? f.x + f.width - size.width : f.x, y: north ? f.y + f.height - size.height : f.y });
            }
        }
        paintPositions();
    };
    function endGesture(event) {
        if (!gesture || event.pointerId !== gesture.id) return;
        const start = gesture; gesture = null;
        if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
        if (!start.pan) record(start.before);
    }
    viewport.onpointerup = endGesture; viewport.onpointercancel = endGesture; viewport.onlostpointercapture = endGesture;
    viewport.ondragover = event => { if (event.dataTransfer.types.includes('Files')) event.preventDefault(); };
    viewport.ondrop = event => {
        event.preventDefault(); const rect = viewport.getBoundingClientRect(); upload([...event.dataTransfer.files], { x: (event.clientX - rect.left - session.view.x) / session.view.scale, y: (event.clientY - rect.top - session.view.y) / session.view.scale });
    };
    dialog.oncancel = event => { event.preventDefault(); close(false); };
    dialog.addEventListener('keydown', event => {
        if (!session || session.busy || event.target.matches('input,textarea,select')) return;
        if (event.code === 'Space') { event.preventDefault(); space = true; viewport.classList.add('is-panning'); }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); actions[event.shiftKey ? 'redo' : 'undo'](); }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') { event.preventDefault(); session.selection = new Set(session.items.map(item => item.id)); paintPositions(); }
        if (['Delete', 'Backspace'].includes(event.key) && session.selection.size) { event.preventDefault(); actions.delete(); }
        if (event.key.startsWith('Arrow') && session.selection.size) {
            event.preventDefault(); const step = event.shiftKey ? 50 : 10;
            mutate(() => selected().forEach(item => { item.frame = window.CanvasBoard.frame({ ...item.frame, x: item.frame.x + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0), y: item.frame.y + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0) }); }));
        }
    });
    window.addEventListener('keyup', event => { if (event.code === 'Space') { space = false; viewport.classList.remove('is-panning'); } });
    window.addEventListener('blur', () => { space = false; viewport.classList.remove('is-panning'); });
    dialog.addEventListener('paste', event => { if (!session || session.busy || event.target.matches('input,textarea')) return; const files = [...event.clipboardData.files]; if (files.length) { event.preventDefault(); upload(files); } });
    window.addEventListener('beforeunload', event => { if (session && (session.dirty || session.busy || gesture)) { event.preventDefault(); event.returnValue = ''; } });
    function attach(node, board, changed, options) {
        let value = window.CanvasBoard.normalize(board);
        const preview = document.createElement('div'); preview.className = 'board-thumbnail';
        const hint = document.createElement('p'); hint.className = 'hint'; hint.textContent = 'GIF, görsel ve videolar tek tuvalde serbestçe yerleşir. Üst üste koyabilir, zoom yapabilirsin.';
        const button = document.createElement('button'); button.type = 'button'; button.className = 'primary'; button.textContent = 'Tuvali aç ↗';
        const paint = () => { preview.innerHTML = window.CanvasBoard.render(value) || '<p class="hint">Henüz medya yok. Tuvali açıp dosyalarını bırak.</p>'; };
        const openBoard = () => open(value, result => { value = result; paint(); changed(); }, options);
        button.onclick = openBoard; node.append(hint, preview, button); node._getBoard = () => clone(value); node._openBoard = openBoard; paint();
    }
    window.CanvasBoardEditor = { open, attach };
})();
