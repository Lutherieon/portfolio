(() => {
    'use strict';
    const filename = 'project-library.js';
    let directory, handle, lastSource;
    let uploadQueue = Promise.resolve();
    const local = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
    function parse(source) {
        const match = source.replace(/^\uFEFF/, '').match(/^\s*(?:\/\/[^\n]*\n)*window\.PROJECT_LIBRARY\s*=\s*(\[[\s\S]*\])\s*;\s*$/);
        if (!match) throw new Error('Proje veri dosyası beklenen biçimde değil. Dosyanın üzerine yazılmadı.');
        const projects = JSON.parse(match[1]);
        const ids = new Set();
        projects.forEach(project => {
            if (!project || !/^[a-zA-Z0-9_-]{1,100}$/.test(project.id) || ids.has(project.id) || !String(project.title || '').trim()) throw new Error('Proje dosyasında geçersiz veya tekrarlanan bir proje var.');
            ids.add(project.id);
        });
        return projects;
    }
    const serialize = projects => '// Managed by the local project editor.\nwindow.PROJECT_LIBRARY = ' + JSON.stringify(projects, null, 4).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + ';\n';
    async function permission() {
        if (!directory) throw new Error('Önce site klasörünü seç.');
        if (await directory.queryPermission({ mode: 'readwrite' }) !== 'granted' && await directory.requestPermission({ mode: 'readwrite' }) !== 'granted') throw new Error('Klasöre yazma izni verilmedi. Değişikliklerin formda duruyor.');
    }
    async function connect() {
        if (!local) throw new Error('Editörü bilgisayarındaki admin.html dosyasından veya localhost üzerinden aç.');
        if (!window.showDirectoryPicker) throw new Error('Klasöre kayıt için bu sayfayı bilgisayarında Chrome veya Edge ile aç.');
        const selected = await window.showDirectoryPicker({ id: 'portfolio-site-folder', mode: 'readwrite' });
        try {
            await Promise.all(['index.html', 'projects-data.js', 'admin.html'].map(name => selected.getFileHandle(name)));
            const library = await selected.getFileHandle(filename);
            const source = await (await library.getFile()).text();
            const projects = parse(source);
            directory = selected; handle = library; lastSource = source;
            return { name: directory.name, projects };
        } catch (error) {
            if (error.name === 'NotFoundError') throw new Error('Site dosyaları bu klasörde bulunamadı. Portfolio_site klasörünü seç.');
            throw error;
        }
    }
    async function read() {
        await permission();
        const source = await (await handle.getFile()).text();
        const projects = parse(source); lastSource = source; return projects;
    }
    async function save(projects) {
        await permission();
        const source = serialize(projects); parse(source);
        const previous = await (await handle.getFile()).text();
        if (previous !== lastSource) throw new Error('Proje dosyası başka bir yerde değiştirilmiş. Üzerine yazılmadı. Metnini kopyalayıp dosyaları yeniden yükle.');
        const backups = await directory.getDirectoryHandle('.editor-backups', { create: true });
        const backupName = `project-library-${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID().slice(0, 8)}.js`;
        const backup = await backups.getFileHandle(backupName, { create: true });
        const backupWriter = await backup.createWritable();
        await backupWriter.write(previous); await backupWriter.close();
        const writer = await handle.createWritable();
        try {
            await writer.write(source);
            if (await (await handle.getFile()).text() !== lastSource) throw new Error('Kayıt sırasında proje dosyası değişmiş. Üzerine yazılmadı. Dosyaları yeniden yükle.');
            await writer.close(); lastSource = source;
        } catch (error) { try { await writer.abort(); } catch (_) {} throw error; }
        return { backup: `.editor-backups/${backupName}` };
    }
    async function digest(file) {
        const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
        return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    }
    function assetPath(name) {
        return 'images/' + encodeURIComponent(name).replace(/[!'()*]/g, character => '%' + character.charCodeAt(0).toString(16).toUpperCase());
    }
    async function storeUpload(file) {
        await permission();
        const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'application/pdf': 'pdf', 'video/mp4': 'mp4', 'video/webm': 'webm' };
        const extension = extensions[file.type];
        const limit = file.type.startsWith('video/') || file.type === 'image/gif' ? 100 : 20;
        if (!extension || file.size > limit * 1024 * 1024) throw new Error('JPEG, PNG, WebP veya PDF en fazla 20 MB; GIF / MP4 / WebM en fazla 100 MB olabilir.');
        const folder = await directory.getDirectoryHandle('images', { create: true });
        const incomingHash = await digest(file);
        // Compare bytes, not names: renamed files are reused, changed files stay separate.
        for await (const [name, entry] of folder.entries()) {
            const suffix = name.split('.').pop().toLowerCase();
            if (entry.kind !== 'file' || (suffix !== extension && !(extension === 'jpg' && suffix === 'jpeg'))) continue;
            let existing;
            try { existing = await entry.getFile(); }
            catch (error) { if (error.name === 'NotFoundError') continue; throw error; }
            if (existing.size === file.size && await digest(existing) === incomingHash) return assetPath(name);
        }
        const name = `project-${crypto.randomUUID()}.${extension}`;
        const fileHandle = await folder.getFileHandle(name, { create: true });
        let writer;
        try {
            writer = await fileHandle.createWritable(); await writer.write(file); await writer.close();
        } catch (error) {
            try { if (writer) await writer.abort(); } catch (_) {}
            try { await folder.removeEntry(name); } catch (_) {}
            throw error;
        }
        return assetPath(name);
    }
    function upload(file) {
        // Keep lookup and write together so simultaneous imports cannot create copies.
        const pending = uploadQueue.then(() => storeUpload(file));
        uploadQueue = pending.catch(() => {});
        return pending;
    }
    async function readSiteFile(name) {
        await permission();
        if (!/^(index|resume|featured|portfolio|project-detail)\.html$|^site-content\.js$/.test(name)) throw new Error('Geçersiz site dosyası.');
        return (await (await directory.getFileHandle(name)).getFile()).text();
    }
    async function saveSiteFile(name, source, original) {
        const previous = await readSiteFile(name);
        if (previous !== original) throw new Error('Dosya başka bir yerde değişmiş. Önce yeniden yükle.');
        const backups = await directory.getDirectoryHandle('.editor-backups', { create: true });
        const backup = await backups.getFileHandle(`${name}-${Date.now()}-${crypto.randomUUID()}.bak`, { create: true });
        const backupWriter = await backup.createWritable();
        await backupWriter.write(previous); await backupWriter.close();
        const target = await directory.getFileHandle(name);
        const writer = await target.createWritable();
        try {
            await writer.write(source);
            if (await readSiteFile(name) !== original) throw new Error('Kayıt sırasında dosya değişti. Yeniden yükle.');
            await writer.close();
        } catch (error) { try { await writer.abort(); } catch (_) {} throw error; }
    }
    window.LocalProjectFiles = { local, connect, read, save, upload, parse, serialize, readSiteFile, saveSiteFile };
})();
