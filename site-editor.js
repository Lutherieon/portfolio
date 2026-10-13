(() => {
    'use strict';
    const files = window.LocalProjectFiles;
    const pages = { 'index.html': 'Ana sayfa', 'resume.html': 'Özgeçmiş sayfası', 'featured.html': 'Featured sayfası', 'portfolio.html': 'Portfolyo sayfası', 'project-detail.html': 'Proje sayfası ortak alanları', 'site-content.js': 'Hakkımda, deneyimler ve yayınlar' };
    const labels = { HOME_SECTIONS: 'Ana sayfa bölümleri', RESUME_DATA: 'Özgeçmiş', FEATURED_DATA: 'Featured', title: 'Başlık', subtitle: 'Alt başlık', text: 'Metin', id: 'Bölüm adresi', downloadLink: 'CV dosyası', downloadLabel: 'İndirme düğmesi', experience: 'Deneyimler', role: 'Pozisyon', company: 'Şirket', dates: 'Tarihler', bullets: 'Açıklamalar', groups: 'Yıl grupları', year: 'Yıl', image: 'Görsel', floatClass: 'Görsel sınıfı', entries: 'Kayıtlar', link: 'Bağlantı', location: 'Yer', description: 'Açıklama' };
    const templates = { HOME_SECTIONS: { id: 'yeni-bolum', title: 'Yeni bölüm', text: [''] }, experience: { id: 'yeni-deneyim', role: '', company: '', dates: '', bullets: [''] }, groups: { id: 'yeni-yil', year: '2026', image: '', floatClass: '', entries: [] }, entries: { title: '', link: '', location: '', description: '' } };
    Object.assign(labels, {SETTINGS:'Site ayarları',theme:'Genel görünüm',background:'Arka plan rengi',accent:'Vurgu rengi',bodyFont:'Metin yazı tipi',headingFont:'Başlık yazı tipi',sectionSpacing:'Bölüm boşluğu (px)',portfolio:'Portfolyo kartları',pageSize:'Sayfa başına proje',columns:'Sütun sayısı',gap:'Kart aralığı (px)',ratio:'Kart genişlik / yükseklik oranı',homeSections:'Ana sayfa bölüm sırası',visible:'Bölümü göster',shared:'Ortak menü ve sosyal hesaplar',enabled:'Bu ayarları tüm sayfalara uygula',logo:'Logo',copyright:'Alt bilgi yazısı',menu:'Menü bağlantıları',social:'Sosyal hesaplar',icon:'Simge adı',messages:'Site mesajları',contributions:'Katkılar başlığı',emptyCategory:'Boş kategori mesajı',pdfUnavailable:'PDF yüklenmedi mesajı',pdfLink:'PDF bağlantısı yazısı'});
    Object.assign(templates, {homeSections:{id:'background',visible:true},menu:{title:'Yeni bağlantı',link:'index.html'},social:{title:'GitHub',link:'https://github.com/',icon:'github'}});
    templates.HOME_SECTIONS.image = '';
    let dirty = false, busy = false, source = '', name, doc, data;
    let pageFonts = new WeakMap();
    async function detectFonts(documentToRead) {
        const copy = documentToRead.documentElement.cloneNode(true);
        const originals = [...documentToRead.body.querySelectorAll('*')];
        [...copy.querySelector('body').querySelectorAll('*')].forEach((element, i) => element.setAttribute('data-font-index', i));
        copy.querySelectorAll('script,iframe,embed,object,img,video,link:not([href="style.css"])').forEach(element => element.remove());
        const frame = document.createElement('iframe'); frame.setAttribute('aria-hidden', 'true'); frame.tabIndex = -1;
        frame.style.cssText = 'position:fixed;width:1px;height:1px;visibility:hidden;pointer-events:none;border:0';
        const ready = new Promise(resolve => { frame.onload = resolve; });
        frame.srcdoc = '<!DOCTYPE html>' + copy.outerHTML; document.body.append(frame);
        try {
            await ready;
            pageFonts = new WeakMap();
            frame.contentDocument.querySelectorAll('[data-font-index]').forEach(element => {
                pageFonts.set(originals[Number(element.dataset.fontIndex)], frame.contentWindow.getComputedStyle(element).fontFamily);
            });
        } finally { frame.remove(); }
    }
    const panel = document.createElement('section'); panel.hidden = true; panel.className = 'form-card site-editor';
    panel.innerHTML = '<div class="editor-header"><div><p class="eyebrow">SİTE İÇERİĞİ</p><h1>Tüm siteyi düzenle</h1></div><button type="button" id="site-back">Projelere dön</button></div><p>Önce sayfanı seç, ardından değiştirmek istediğin bölümü aç. İşin bittiğinde kaydet.</p><label>Hangi sayfayı düzenlemek istiyorsun?<select id="site-page"></select></label><div class="editor-actions"><button type="button" id="site-reload">Değişiklikleri geri al</button><button type="button" id="site-preview">Sayfayı görüntüle ↗</button><button type="button" id="site-save" class="primary">Kaydet</button></div><p id="site-status" role="status" aria-live="polite"></p><div id="site-fields"></div>';
    const workspace = document.querySelector('#workspace');
    const projectArea = workspace.querySelector('.editor-area');
    workspace.append(panel);
    const projectMode = document.querySelector('#mode-projects');
    const siteMode = document.querySelector('#mode-site');
    function showMode(site) {
        panel.hidden = !site;
        projectArea.hidden = site;
        workspace.classList.toggle('site-mode', site);
        workspace.querySelectorAll('.sidebar > :not(.editor-mode-bar)').forEach(node => { node.hidden = site; });
        projectMode.setAttribute('aria-pressed', String(!site));
        siteMode.setAttribute('aria-pressed', String(site));
    }
    const select = panel.querySelector('#site-page'), fields = panel.querySelector('#site-fields'), status = panel.querySelector('#site-status');
    Object.entries(pages).forEach(([value, title]) => select.add(new Option(title, value)));
    const open = document.createElement('button'); open.type = 'button'; open.textContent = 'Tüm siteyi düzenle'; open.hidden = true;
    document.querySelector('.top-actions').append(open);
    const message = value => { status.textContent = value; };
    function changed() { dirty = true; message('Kaydedilmemiş değişiklikler'); }
    function guard(action) {
        if (busy) return;
        if (dirty) {
            const dialog = document.createElement('dialog');
            const text = document.createElement('p'); text.textContent = 'Kaydedilmemiş site değişiklikleri var.';
            dialog.append(text, button('Düzenlemeye dön', () => { dialog.close(); dialog.remove(); }), button('Değişikliklerden vazgeç', () => { dirty = false; dialog.close(); dialog.remove(); action(); }));
            document.body.append(dialog); dialog.showModal();
            dialog.addEventListener('cancel', () => dialog.remove());
        } else action();
    }
    function button(text, action) { const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.onclick = action; return b; }
    function input(parent, title, value, update, upload = false, rich = false, font = '') {
        const label = document.createElement('label'); label.textContent = title;
        const node = document.createElement('textarea'); node.rows = String(value).length > 150 ? 4 : 1; node.value = value ?? '';
        node.oninput = () => { try { update(node.value); changed(); } catch (error) { message(error.message); } }; label.append(node);
        if (upload) label.append(button('Dosya yükle', () => {
            const picker = document.createElement('input'); picker.type = 'file'; picker.accept = 'image/jpeg,image/png,image/webp,image/gif,application/pdf';
            picker.onchange = async () => {
                if (!picker.files[0]) return;
                setBusy(true);
                try { node.value = await files.upload(picker.files[0]); update(node.value); changed(); }
                catch (error) { message(error.message); } finally { setBusy(false); }
            }; picker.click();
        }));
        parent.append(label);
        if (rich) window.TextEditor.attach(node, value, html => { update(html); changed(); }, font);
    }
    function settingInput(parent, object, key, setter) {
        const label=document.createElement('label'); label.textContent=labels[key]||key;
        let node;
        if (typeof object === 'boolean') { node=document.createElement('input');node.type='checkbox';node.checked=object;node.onchange=()=>{setter(node.checked);changed();}; }
        else if (typeof object === 'number') {
            node=document.createElement('input');node.type='number';node.value=object;
            const limits={pageSize:[1,48],columns:[1,4],gap:[8,100],ratio:[.4,2],sectionSpacing:[20,200]};
            const [min,max]=limits[key]||[0,1000];node.min=min;node.max=max;node.step=key==='ratio'?.01:1;
            node.oninput=()=>{if(node.value!==''&&node.checkValidity()){setter(Number(node.value));changed();}};
        } else if (['bodyFont','headingFont'].includes(key)) {
            node=document.createElement('select');['Open Sans','Montserrat','Playfair Display','Arial','Georgia','Verdana','Courier New'].forEach(font=>node.add(new Option(font,font)));node.value=object;node.onchange=()=>{setter(node.value);changed();};
        } else if (['background','accent'].includes(key) || (key==='text' && /^#/.test(object))) {
            node=document.createElement('input');node.type='color';node.value=object;node.oninput=()=>{setter(node.value);changed();};
        } else return false;
        label.append(node);parent.append(label);return true;
    }
    function setBusy(value) { busy = value; panel.querySelectorAll('button,input,textarea,select').forEach(node => { node.disabled = value; }); open.disabled = value; projectMode.disabled = value; siteMode.disabled = value; document.querySelector('#change-folder').disabled = value; }
    function structured(parent, object, key, setter) {
        if (Array.isArray(object)) {
            const box = document.createElement('fieldset'); box.className = 'form-card'; const legend = document.createElement('legend'); legend.textContent = labels[key] || key; box.append(legend);
            object.forEach((item, index) => {
                const row = document.createElement('div'); row.className = 'form-card';
                row.append(button('↑', () => { if (index) { [object[index - 1], object[index]] = [object[index], object[index - 1]]; renderData(); changed(); } }), button('↓', () => { if (index < object.length - 1) { [object[index + 1], object[index]] = [object[index], object[index + 1]]; renderData(); changed(); } }));
                if(key!=='homeSections') row.append(button('Kaldır', () => { object.splice(index, 1); renderData(); changed(); }));
                else { const title=document.createElement('strong');title.textContent=({top:'Karşılama',showcase:'Öne çıkan projeler',contact:'İletişim'})[item.id] || data.HOME_SECTIONS.find(section=>section.id===item.id)?.title || item.id;row.prepend(title); }
                structured(row, item, `${index + 1}`, value => { object[index] = value; }); box.append(row);
            });
            if(key!=='homeSections') box.append(button('+ Ekle', () => { object.push(JSON.parse(JSON.stringify(templates[key] || ''))); renderData(); changed(); })); parent.append(box);
        } else if (object && typeof object === 'object') {
            const box = document.createElement('fieldset'); box.className = 'form-card'; const legend = document.createElement('legend'); legend.textContent = labels[key] || key; box.append(legend);
            Object.entries(object).filter(([k]) => !['id', 'floatClass'].includes(k)).forEach(([k, value]) => structured(box, value, k, next => { object[k] = next; }));
            const technical = Object.entries(object).filter(([k]) => ['id', 'floatClass'].includes(k) && !('visible' in object));
            if (technical.length) {
                const settings = group('Bölüm ayarları', 'Mevcut bölüm adresini değiştirmek bu bölüme verilen bağlantıları etkileyebilir.', false, box);
                technical.forEach(([k, value]) => structured(settings, value, k, next => { object[k] = next; }));
            }
            parent.append(box);
        } else if (!settingInput(parent,object,key,setter)) input(parent, labels[key] || key, object, setter, ['image', 'downloadLink','logo'].includes(key), typeof object==='string' && (/^\d+$/.test(key) || ['description'].includes(key)));
    }
    function group(title, hint, expanded = false, parent = fields) {
        const box = document.createElement('details'); box.className = 'site-group'; box.open = expanded;
        const summary = document.createElement('summary'); summary.textContent = title;
        const body = document.createElement('div'); body.className = 'site-group-body';
        if (hint) { const note = document.createElement('p'); note.className = 'hint'; note.textContent = hint; body.append(note); }
        box.append(summary, body); parent.append(box); return body;
    }
    function renderData() {
        fields.replaceChildren();
        if(data.SETTINGS?.homeSections) {
            data.HOME_SECTIONS.forEach(section=>{if(!data.SETTINGS.homeSections.some(item=>item.id===section.id))data.SETTINGS.homeSections.push({id:section.id,visible:true});});
        }
        for (const [key, value] of Object.entries(data)) {
            const body = group(labels[key], ({HOME_SECTIONS:'Hakkımda metinlerini düzenle veya yeni bir bölüm ekle.',RESUME_DATA:'CV dosyanı ve iş deneyimlerini güncelle.',FEATURED_DATA:'Yayın, konuşma ve başarılarını ekle.',SETTINGS:'Kart düzeni, renkler, ana sayfa sırası ve ortak bağlantıları buradan ayarla. Ortak alanları etkinleştirirsen sayfalardaki ayrı menü ve alt bilgi ayarlarının yerine geçer. Ana sayfa bölüm adresleri: top, showcase, background, contact.'})[key], key === 'HOME_SECTIONS');
            structured(body, value, key, next => { data[key] = next; });
        }
    }
    function renderPage() {
        fields.replaceChildren();
        const sectionGroups = new Map();
        const sectionNames = { contact: 'İletişim', top: 'Karşılama', showcase: 'Öne çıkan projeler', experience: 'İş deneyimi' };
        function sectionFor(node) {
            const region = node.closest('section,header') || doc.querySelector('main') || doc.body;
            if (!sectionGroups.has(region)) {
                const title = sectionNames[region.id] || region.querySelector('h1,h2')?.textContent.trim() || 'Sayfa içeriği';
                sectionGroups.set(region, group(title, 'Bu bölümün yazılarını, görsellerini ve bağlantılarını birlikte düzenle.', sectionGroups.size === 0));
            }
            return sectionGroups.get(region);
        }
        doc.querySelectorAll('header.hero,main > section').forEach(sectionFor);
        const navigation = group('Menü ve alt bilgi', 'Menü yazıları ve sayfanın altındaki bilgiler.');
        const advanced = group('Gelişmiş ayarlar', 'Arama sonuçlarında ve sosyal medyada görünen bilgiler. Günlük içerik düzenlemesinde bu alanı açman gerekmez.');
        advanced.prepend(button('Site ayarlarını aç →', () => guard(async () => {select.value='site-content.js';await load();const settings=[...fields.querySelectorAll(':scope > details')].find(node=>node.querySelector('summary').textContent==='Site ayarları');if(settings){settings.open=true;settings.scrollIntoView({block:'start'});}})));
        input(advanced, 'Tarayıcı sekmesindeki başlık', doc.title, value => { doc.title = value; });
        const metaNames = { description: 'Arama sonuçlarındaki açıklama', keywords: 'Anahtar kelimeler', 'og:type': 'Paylaşım türü', 'og:url': 'Paylaşılan sayfa adresi', 'og:title': 'Paylaşım başlığı', 'og:description': 'Paylaşım açıklaması', 'og:image': 'Paylaşım görseli', 'twitter:card': 'X paylaşım kartı türü', 'twitter:url': 'X sayfa adresi', 'twitter:title': 'X paylaşım başlığı', 'twitter:description': 'X paylaşım açıklaması', 'twitter:image': 'X paylaşım görseli' };
        doc.querySelectorAll('meta[name="description"],meta[name="keywords"],meta[property^="og:"],meta[property^="twitter:"]').forEach(node => {
            const key = node.getAttribute('name') || node.getAttribute('property');
            input(advanced, metaNames[key] || 'Paylaşım bilgisi', node.content, value => { node.content = value; });
        });
        // Edit text nodes separately to retain links, icons, line breaks and all scripts.
        const walk = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
        const editedWrappers = new Set();
        let node;
        while ((node = walk.nextNode())) {
            const target = node;
            if (!target.textContent.trim() || target.parentElement.closest('script,style,noscript,svg')) continue;
            if (target.parentElement.closest('.dot-nav') || target.parentElement.closest('.skip-link')) continue;
            const existingWrapper = target.parentElement.closest('[data-editable-text]');
            if (existingWrapper && editedWrappers.has(existingWrapper)) continue;
            if (existingWrapper) editedWrappers.add(existingWrapper);
            const isNavigation = target.parentElement.closest('#navbar,footer');
            const type = /^H[1-6]$/.test(target.parentElement.tagName) ? 'başlık' : target.parentElement.matches('a') ? 'bağlantı yazısı' : 'metin';
            let replacement = existingWrapper;
            input(isNavigation ? navigation : sectionFor(target.parentElement), isNavigation ? `Menü / alt bilgi · ${target.textContent.trim().slice(0, 35)}` : type.charAt(0).toUpperCase() + type.slice(1), isNavigation ? target.textContent.trim() : existingWrapper?.innerHTML || storeText(target.textContent.trim()), value => {
                if (isNavigation) { target.textContent = value; return; }
                if (!replacement) { replacement = doc.createElement('span'); replacement.setAttribute('data-editable-text', ''); target.replaceWith(replacement); }
                replacement.innerHTML = window.PortfolioStore.richText(value);
            }, false, !isNavigation, pageFonts.get(target.parentElement) || '');
        }
        doc.querySelectorAll('a[href],img[src],iframe[src],link[rel="icon"]').forEach(node => {
            const attr = node.matches('img,iframe') ? 'src' : 'href';
            if (node.closest('.dot-nav') || node.matches('.skip-link')) return;
            const destination = node.closest('#navbar,footer') ? navigation : node.matches('link') ? advanced : sectionFor(node);
            const label = node.textContent.trim().slice(0, 55) || node.getAttribute('aria-label') || node.getAttribute('alt') || (node.matches('link') ? 'Tarayıcı simgesi' : 'Logo / görsel');
            input(destination, label, node.getAttribute(attr), value => { node.setAttribute(attr, value); }, node.tagName !== 'A' || node.hasAttribute('download'));
            if (node.tagName === 'IMG') input(destination, 'Görselin kısa açıklaması', node.alt, value => { node.alt = value; });
        });
        if (name === 'index.html') {
            const hero = doc.querySelector('.hero');
            const match = hero.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
            input(sectionFor(hero), 'Arka plan görseli (isteğe bağlı)', match?.[1] || '', value => { hero.style.backgroundImage = value ? `url("${validUrl(value)}")` : ''; }, true);
        }
        const dynamic = { 'index.html': ['Hakkımda bölümleri', 'HOME_SECTIONS'], 'resume.html': ['CV ve deneyimler', 'RESUME_DATA'], 'featured.html': ['Yayınlar ve konuşmalar', 'FEATURED_DATA'] }[name];
        if (dynamic) {
            const body = group(dynamic[0], 'Bölüm eklemek, kaldırmak veya sıralamak için içerik düzenleyicisini aç.');
            body.append(button('Bu bölümleri düzenle →', () => guard(async () => {
                select.value = 'site-content.js'; await load();
                const groups = [...fields.querySelectorAll(':scope > details')];
                const active = groups.find(node => node.querySelector('summary').textContent === labels[dynamic[1]]);
                groups.forEach(node => { node.open = node === active; });
                active?.scrollIntoView({block:'start'});
            })));
        }
        // Keep page sections ahead of shared settings, including lazily discovered regions.
        fields.append(navigation.parentElement, advanced.parentElement);
    }
    function storeText(value) { return window.PortfolioStore.escape(value); }
    function validUrl(value) {
        const text = String(value).trim();
        if (!text) return '';
        if (/[\x00-\x20"'<>\\]/.test(text) || (/^[a-z][\w+.-]*:/i.test(text) && !/^(https?:|mailto:|tel:)/i.test(text))) throw new Error('Geçersiz bağlantı veya dosya yolu.');
        return text;
    }
    async function load() {
        setBusy(true); message('Dosya okunuyor…');
        try {
            name = select.value; source = await files.readSiteFile(name);
            if (name === 'site-content.js') {
                const match = source.match(/^window\.SITE_CONTENT\s*=\s*([\s\S]*);\s*Object\.assign\(window, window\.SITE_CONTENT\);\s*$/);
                if (!match) throw new Error('İçerik dosyasının biçimi tanınamadı.');
                data = JSON.parse(match[1]); renderData();
            } else { doc = new DOMParser().parseFromString(source, 'text/html'); await detectFonts(doc); renderPage(); }
            dirty = false; message('Dosyadan yüklendi · Kaydetmeden önce değişikliklerini kontrol et.');
        } catch (error) { fields.replaceChildren(); source = ''; message(error.message); }
        finally { setBusy(false); }
    }
    panel.querySelector('#site-save').onclick = async () => {
        if (busy || !source) return;
        setBusy(true);
        try {
            let next;
            if (name === 'site-content.js') {
                const validate = value => { if (!value || typeof value !== 'object') return; Object.entries(value).forEach(([key, item]) => { if (['link', 'image', 'downloadLink'].includes(key)) validUrl(item); else validate(item); }); };
                validate(data);
                const clean = value => { if (!value || typeof value !== 'object') return; Object.entries(value).forEach(([key, item]) => { if (typeof item === 'string' && !['link', 'image', 'downloadLink', 'id', 'floatClass'].includes(key)) value[key] = window.PortfolioStore.richText(item); else clean(item); }); };
                const saved = JSON.parse(JSON.stringify(data)); clean(saved);
                next = `window.SITE_CONTENT = ${JSON.stringify(saved, null, 4)};\nObject.assign(window, window.SITE_CONTENT);\n`;
            } else {
                doc.querySelectorAll('a[href],img[src],iframe[src],link[rel="icon"]').forEach(node => validUrl(node.getAttribute(node.matches('img,iframe') ? 'src' : 'href')));
                next = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML + '\n';
            }
            await files.saveSiteFile(name, next, source); source = next; dirty = false; message('Kaydedildi · Önceki dosya .editor-backups klasörüne yedeklendi. Canlı site için dosyaları yayınla.');
        } catch (error) { message(`Kaydedilemedi: ${error.message}`); } finally { setBusy(false); }
    };
    select.onchange = () => { const next = select.value; select.value = name; guard(() => { select.value = next; load(); }); };
    panel.querySelector('#site-reload').onclick = () => guard(load);
    panel.querySelector('#site-preview').onclick = () => window.open(name === 'site-content.js' ? 'index.html' : name, '_blank', 'noopener');
    const backToProjects = () => guard(() => showMode(false));
    const openSite = () => { if (!panel.hidden || busy) return; window.ProjectEditorNavigate(() => { showMode(true); if (!source) load(); }); };
    panel.querySelector('#site-back').onclick = backToProjects;
    projectMode.onclick = backToProjects;
    siteMode.onclick = openSite;
    open.onclick = openSite;
    window.addEventListener('site-folder-connected', () => { open.hidden = false; showMode(false); source = ''; dirty = false; });
    const changeFolder = document.querySelector('#change-folder');
    const originalChange = changeFolder.onclick; changeFolder.onclick = () => guard(originalChange);
    window.addEventListener('beforeunload', event => { if (dirty || busy) { event.preventDefault(); event.returnValue = ''; } });
})();
