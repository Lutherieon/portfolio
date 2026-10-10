(() => {
    'use strict';
    const $ = selector => document.querySelector(selector);
    const form = $('#project-form');
    const store = window.PortfolioStore;
    const clone = value => JSON.parse(JSON.stringify(value));
    let rows = [], current, dirty = false, busy = false, filter = 'all', pendingAction, uploadTarget;
    const status = message => { $('#save-status').textContent = message; };
    const loginStatus = message => { $('#login-status').textContent = message; };
    const field = name => form.elements.namedItem(name);
    function button(text, action, className = '') {
        const node = document.createElement('button'); node.type = 'button'; node.textContent = text; node.className = className;
        node.addEventListener('click', action); return node;
    }
    function markDirty() { dirty = true; status('Kaydedilmemiş değişiklikler'); }
    function setBusy(value) {
        busy = value;
        form.querySelectorAll('button,input,textarea,select').forEach(node => { node.disabled = value || (node.name === 'id' && Boolean(current?.persisted)); });
        $('#new-project').disabled = value; $('#reload-projects').disabled = value;
    }
    function safely(action) {
        if (busy) return;
        if (!dirty) { action(); return; }
        pendingAction = action; $('#unsaved-dialog').showModal();
    }
    $('#keep-editing').onclick = () => { pendingAction = null; $('#unsaved-dialog').close(); };
    $('#discard-changes').onclick = () => { dirty = false; $('#unsaved-dialog').close(); const action = pendingAction; pendingAction = null; action?.(); };
    window.addEventListener('beforeunload', event => { if (dirty || busy) { event.preventDefault(); event.returnValue = ''; } });
    function plainText(html) {
        const template = document.createElement('template'); template.innerHTML = store.richText(html);
        template.content.querySelectorAll('br').forEach(node => node.replaceWith('\n'));
        template.content.querySelectorAll('p,li').forEach(node => node.append('\n'));
        return template.content.textContent.trim();
    }
    function setRichInput(node, html) { node.value = plainText(html || ''); node.dataset.originalText = node.value; node.dataset.originalHtml = html || ''; }
    function getRichInput(node) { return node.value === node.dataset.originalText ? node.dataset.originalHtml : store.escape(node.value).replace(/\r?\n/g, '<br>'); }
    function slug(value) { return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'new-project'; }
    function videoUrl(value) {
        try {
            const url = new URL(value);
            if (url.hostname === 'youtu.be') return `https://www.youtube.com/embed/${url.pathname.slice(1).split('/')[0]}`;
            if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname) && url.searchParams.get('v')) return `https://www.youtube.com/embed/${url.searchParams.get('v')}`;
            if (url.hostname === 'vimeo.com' && /^\/\d+$/.test(url.pathname)) return `https://player.vimeo.com/video${url.pathname}`;
        } catch (_) {}
        return value;
    }
    function validVideo(value) {
        try { const url = new URL(value); return ['www.youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'].includes(url.hostname) && (/^\/embed\/[\w-]+$/.test(url.pathname) || /^\/video\/\d+$/.test(url.pathname)); }
        catch (_) { return false; }
    }
    function renderList() {
        const search = $('#project-search').value.toLocaleLowerCase('tr');
        const matches = rows.filter(row => (filter === 'all' || row.published === (filter === 'published')) && `${row.data.title} ${row.data.category}`.toLocaleLowerCase('tr').includes(search));
        $('#project-total').textContent = `${rows.length} proje · ${rows.filter(row => row.published).length} görünür · ${rows.filter(row => !row.published).length} gizli`;
        const list = $('#project-list'); list.replaceChildren();
        matches.forEach(row => {
            const choice = button('', () => safely(() => selectProject(row)), 'project-choice');
            choice.setAttribute('aria-current', String(current?.id === row.id));
            const title = document.createElement('strong'); title.textContent = row.data.title || 'İsimsiz proje';
            const caption = document.createElement('small');
            const badge = document.createElement('span'); badge.className = `badge ${row.published ? 'published' : ''}`; badge.textContent = row.published ? 'Görünen' : 'Gizli';
            caption.append(badge, document.createTextNode(row.data.category || 'Kategori yok'));
            choice.append(title, caption); list.appendChild(choice);
        });
        if (!matches.length) { const message = document.createElement('p'); message.className = 'hint'; message.textContent = 'Bu filtrede proje yok.'; list.appendChild(message); }
        $('#category-options').replaceChildren(...[...new Set(rows.map(row => row.data.category).filter(Boolean))].map(category => { const option = document.createElement('option'); option.value = category; return option; }));
    }
    function labeledInput(text, value, placeholder = '') {
        const label = document.createElement('label'); label.textContent = text;
        const input = document.createElement('input'); input.value = value || ''; input.placeholder = placeholder; label.appendChild(input); return label;
    }
    function addPair(container, item, type) {
        const row = document.createElement('div'); row.className = 'repeat-row';
        row.append(labeledInput(type === 'fact' ? 'Başlık' : 'Bağlantı adı', item.label, type === 'fact' ? 'Engine / Team / Platform' : 'Oyna / Videoyu izle'));
        row.append(labeledInput(type === 'fact' ? 'Bilgi' : 'Adres', type === 'fact' ? item.value : item.href, type === 'fact' ? 'Unreal Engine 5' : 'https://…'));
        row.append(button('Kaldır', () => { row.remove(); markDirty(); })); container.appendChild(row);
    }
    function reorder(node, direction) {
        if (direction < 0 && node.previousElementSibling) node.previousElementSibling.before(node);
        else if (direction > 0 && node.nextElementSibling) node.nextElementSibling.after(node);
        markDirty();
    }
    function mediaEditor(block) {
        const node = document.createElement('div'); node.className = 'content-block-editor'; node.dataset.type = block.type;
        node._original = clone(block);
        const heading = document.createElement('div'); heading.className = 'block-heading';
        const label = document.createElement('strong'); label.textContent = ({ text: 'Metin', image: 'Görsel', video: 'Video', pdf: 'PDF', 'media-group': 'Görsel grubu' })[block.type] || block.type;
        const actions = document.createElement('div'); actions.className = 'block-actions';
        actions.append(button('↑', () => reorder(node, -1)), button('↓', () => reorder(node, 1)), button('Kaldır', () => { node.remove(); markDirty(); })); heading.append(label, actions); node.appendChild(heading);
        if (block.type === 'text') {
            const textarea = document.createElement('textarea'); textarea.rows = 5; textarea.setAttribute('aria-label', 'Bölüm metni'); setRichInput(textarea, block.value); node.appendChild(textarea);
        } else if (block.type === 'media-group') {
            const children = document.createElement('div'); children.className = 'group-items'; (block.items || []).forEach(item => children.appendChild(mediaEditor(item))); node.appendChild(children);
            node.appendChild(button('+ Görsel', () => { children.appendChild(mediaEditor({ type: 'image', src: '', caption: '' })); markDirty(); }));
        } else {
            const source = labeledInput('Kaynak', block.src, block.type === 'video' ? 'YouTube / Vimeo bağlantısı' : 'Dosya yolu veya https://…'); source.querySelector('input').dataset.mediaSrc = 'true';
            if (['image', 'pdf'].includes(block.type)) source.appendChild(button('Dosya yükle', () => chooseUpload(source.querySelector('input'))));
            const caption = labeledInput('Açıklama', block.caption); caption.querySelector('input').dataset.mediaCaption = 'true'; node.append(source, caption);
        }
        return node;
    }
    function addSection(section) {
        const node = document.createElement('div'); node.className = 'section-editor'; node._original = clone(section);
        const top = document.createElement('div'); top.className = 'section-top';
        const title = document.createElement('input'); title.value = section.title || ''; title.placeholder = 'Örn. Main aim / Core loop / My contribution'; title.setAttribute('aria-label', 'Bölüm başlığı'); title.dataset.sectionTitle = 'true';
        top.append(title, button('↑', () => reorder(node, -1)), button('↓', () => reorder(node, 1)), button('Bölümü kaldır', () => { node.remove(); markDirty(); }));
        const blocks = document.createElement('div'); blocks.className = 'section-blocks';
        (section.blocks || (section.content ? [{ type: 'text', value: section.content }] : [])).forEach(block => blocks.appendChild(mediaEditor(block)));
        const tools = document.createElement('div'); tools.className = 'block-tools';
        [['text', 'Metin'], ['image', 'Görsel'], ['video', 'Video'], ['pdf', 'PDF']].forEach(([type, name]) => tools.appendChild(button(`+ ${name}`, () => { blocks.appendChild(mediaEditor({ type, value: '', src: '', caption: '' })); markDirty(); })));
        node.append(top, blocks, tools); $('#sections-editor').appendChild(node);
    }
    function selectProject(row) {
        current = clone(row); dirty = false;
        const project = current.data;
        ['title', 'id', 'category', 'metadata', 'thumbnailDescription', 'thumbnail', 'thumbnailAlt', 'bannerSrc'].forEach(name => { field(name).value = name === 'id' ? current.id : project[name] || ''; });
        field('bannerType').value = project.bannerType || 'image';
        field('tags').value = (project.tags || []).join(', '); field('contributions').value = (project.contributions || []).join('\n');
        field('published').checked = current.published; field('showcase').checked = current.showcase;
        setRichInput(field('intro'), project.intro);
        $('#facts-editor').replaceChildren(); (project.facts || []).forEach(item => addPair($('#facts-editor'), item, 'fact'));
        $('#links-editor').replaceChildren(); (project.links || []).forEach(item => addPair($('#links-editor'), item, 'link'));
        $('#sections-editor').replaceChildren(); (project.sections || []).forEach(addSection);
        $('#editor-title').textContent = project.title || 'Yeni proje';
        $('#save-project').textContent = 'Kaydet';
        $('#reload-projects').hidden = false;
        status(current.updated_at ? `Son kayıt: ${new Date(current.updated_at).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}` : current.persisted ? 'Site dosyasından yüklendi' : 'Yeni proje · Önce gizli olarak kaydedebilirsin');
        updateCover(); setBusy(false); renderList();
    }
    function updateCover() {
        const src = store.safeUrl(field('thumbnail').value); const image = $('#cover-preview'); image.hidden = !src;
        image.onerror = () => { image.hidden = true; }; if (src) image.src = src;
    }
    function readBlock(node) {
        const block = clone(node._original); block.type = node.dataset.type;
        if (block.type === 'text') block.value = getRichInput(node.querySelector('textarea'));
        else if (block.type === 'media-group') block.items = [...node.querySelector('.group-items').children].map(readBlock);
        else { block.src = store.safeUrl(videoUrl(node.querySelector('[data-media-src]').value)); block.caption = node.querySelector('[data-media-caption]').value; if (block.type === 'video') block.provider = validVideo(block.src) ? 'youtube' : 'native'; }
        return block;
    }
    function collect() {
        if (!form.reportValidity()) return null;
        const project = clone(current.data);
        ['title', 'id', 'category', 'metadata', 'thumbnailDescription', 'thumbnailAlt', 'bannerType'].forEach(name => { project[name] = field(name).value.trim(); });
        if (rows.some(row => row.id === project.id && row.id !== current.id)) { status('Bu proje adresi zaten kullanılıyor. Farklı bir ID yaz.'); return null; }
        project.thumbnail = store.safeUrl(field('thumbnail').value);
        project.bannerSrc = store.safeUrl(videoUrl(field('bannerSrc').value));
        if (project.bannerType === 'none') project.bannerSrc = '';
        if (project.bannerType === 'video' && project.bannerSrc && !validVideo(project.bannerSrc)) { status('Üst video için geçerli bir YouTube veya Vimeo bağlantısı kullan.'); return null; }
        if (field('published').checked && (!project.thumbnail || !field('intro').value.trim())) { status('Yayınlamadan önce kart görseli ve giriş metni ekle.'); return null; }
        project.published = field('published').checked; project.showcase = field('showcase').checked;
        project.tags = field('tags').value.split(',').map(value => value.trim()).filter(Boolean);
        project.contributions = field('contributions').value.split('\n').map(value => value.trim()).filter(Boolean); project.intro = getRichInput(field('intro'));
        project.facts = [...$('#facts-editor').children].map(row => { const inputs = row.querySelectorAll('input'); return { label: inputs[0].value.trim(), value: inputs[1].value.trim() }; });
        if (project.facts.some(item => Boolean(item.label) !== Boolean(item.value))) { status('Kısa bilgilerde hem başlık hem bilgi yaz; kullanmayacağın satırı kaldır.'); return null; }
        project.facts = project.facts.filter(item => item.label);
        project.links = [...$('#links-editor').children].map(row => { const inputs = row.querySelectorAll('input'); return { label: inputs[0].value.trim(), href: store.safeUrl(inputs[1].value), typedUrl: inputs[1].value.trim() }; });
        if (project.links.some(item => (item.label || item.typedUrl) && (!item.label || !item.href))) { status('Bağlantılarda bir ad ve geçerli bir http/https adresi yaz.'); return null; }
        project.links = project.links.filter(item => item.label).map(({ label, href }) => ({ label, href }));
        project.sections = [...$('#sections-editor').children].map((node, index) => {
            const section = clone(node._original); section.id = `section-${index + 1}`; section.title = node.querySelector('[data-section-title]').value.trim();
            section.blocks = [...node.querySelector('.section-blocks').children].map(readBlock); delete section.content; return section;
        });
        if (project.sections.some(section => !section.title && section.blocks.length)) { status('Eklediğin bölüme bir başlık yaz veya boş bölümü kaldır.'); return null; }
        project.sections = project.sections.filter(section => section.title);
        return project;
    }
    function toRows(projects) {
        return projects.map((data, position) => ({ data, id: data.id, published: data.published === true, showcase: Boolean(data.showcase), position, persisted: true, updated_at: data.updatedAt || null }));
    }
    async function save(event) {
        event.preventDefault(); if (busy || !current) return;
        const project = collect(); if (!project) return;
        project.updatedAt = new Date().toISOString();
        const saved = { id: project.id, data: project, published: project.published, showcase: project.showcase, position: current.position, persisted: true, updated_at: project.updatedAt };
        const nextRows = clone(rows);
        const index = nextRows.findIndex(row => row.id === current.id);
        if (index < 0) nextRows.push(saved); else nextRows[index] = saved;
        setBusy(true); status('Site dosyasına kaydediliyor…');
        try {
            await window.LocalProjectFiles.save(nextRows.map(row => ({ ...row.data, id: row.id, published: row.published, showcase: row.showcase })));
            rows = nextRows; selectProject(saved);
            status('Kaydedildi · Site dosyası güncellendi ve önceki sürüm yedeklendi');
        } catch (error) { status(`Kaydedilemedi: ${error.message}`); }
        finally { setBusy(false); }
    }
    async function refreshProjects() {
        status('Dosyalar okunuyor…'); setBusy(true);
        try {
            rows = toRows(await window.LocalProjectFiles.read());
            if (rows.length) selectProject(rows.find(row => row.id === current?.id) || rows[0]); else newProject();
        } catch (error) { status(`Projeler yüklenemedi: ${error.message}`); }
        finally { setBusy(false); }
    }
    function newProject() {
        let id = 'new-project'; let number = 1; while (rows.some(row => row.id === id)) id = `new-project-${++number}`;
        selectProject({ id, published: false, showcase: false, position: Math.max(-1, ...rows.map(row => row.position || 0)) + 1, data: { id, title: '', category: 'Games & Tools', sections: [] } }); field('title').focus();
    }
    function chooseUpload(input) {
        uploadTarget = input; $('#asset-input').value = ''; $('#asset-input').click();
    }
    $('#asset-input').addEventListener('change', async event => {
        const file = event.target.files[0]; if (!file || !uploadTarget || busy) return;
        const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'application/pdf': 'pdf' };
        if (!extensions[file.type] || file.size > 20 * 1024 * 1024) { status('JPEG, PNG, WebP, GIF veya PDF seç; dosya en fazla 20 MB olabilir.'); return; }
        setBusy(true); status('Dosya yükleniyor…');
        try {
            uploadTarget.value = await window.LocalProjectFiles.upload(file);
            markDirty(); updateCover(); status('Dosya images klasörüne eklendi · Projeyi kaydetmeyi unutma');
        } catch (error) { status(`Dosya yüklenemedi: ${error.message}`); } finally { setBusy(false); }
    });
    $('#new-project').onclick = () => safely(newProject);
    $('#project-search').oninput = renderList;
    document.querySelectorAll('[data-filter]').forEach(node => { node.onclick = () => { filter = node.dataset.filter; document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === node))); renderList(); }; });
    $('#add-fact').onclick = () => { addPair($('#facts-editor'), {}, 'fact'); markDirty(); };
    $('#add-link').onclick = () => { addPair($('#links-editor'), {}, 'link'); markDirty(); };
    $('#add-section').onclick = () => { addSection({ title: '', blocks: [{ type: 'text', value: '' }] }); markDirty(); };
    document.querySelectorAll('[data-upload-target]').forEach(node => { node.onclick = () => chooseUpload(field(node.dataset.uploadTarget)); });
    form.addEventListener('input', event => { markDirty(); if (event.target === field('thumbnail')) updateCover(); if (event.target === field('title') && !current.persisted) field('id').value = slug(field('title').value); });
    form.addEventListener('change', markDirty); form.addEventListener('submit', save);
    $('#reload-projects').onclick = () => safely(refreshProjects);
    $('#preview-project').onclick = () => {
        const project = collect(); if (!project) return;
        sessionStorage.setItem('portfolio-project-preview', JSON.stringify({ project, createdAt: Date.now() }));
        const tab = window.open(`project-detail.html?id=${encodeURIComponent(project.id)}&preview=1`, '_blank'); if (tab) tab.opener = null;
    };
    async function connectFolder() {
        const connectButton = $('#connect-folder'); connectButton.disabled = true;
        loginStatus('Site klasörünü seç…');
        try {
            const selected = await window.LocalProjectFiles.connect();
            rows = toRows(selected.projects);
            $('#folder-name').textContent = selected.name;
            $('#login-panel').hidden = true; $('#workspace').hidden = false; $('#change-folder').hidden = false;
            if (rows.length) selectProject(rows[0]); else newProject();
            loginStatus('');
        } catch (error) {
            const message = error.name === 'AbortError' ? 'Klasör seçimi iptal edildi. Hazır olduğunda tekrar seçebilirsin.' : error.message;
            loginStatus(message); if (!$('#workspace').hidden) status(message);
        } finally { connectButton.disabled = false; }
    }
    $('#connect-folder').onclick = connectFolder;
    $('#change-folder').onclick = () => safely(connectFolder);
    if (!window.LocalProjectFiles.local || !window.showDirectoryPicker) {
        $('#connect-folder').disabled = true;
        loginStatus('Editörü bilgisayarında Chrome veya Edge ile aç. Site klasörünü seçtikten sonra doğrudan dosyalara kayıt yapabilirsin.');
    }
})();
