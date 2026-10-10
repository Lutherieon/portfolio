(() => {
    'use strict';
    const filename = 'project-library.js';
    let directory, handle, lastSource;
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
    async function upload(file) {
        await permission();
        const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'application/pdf': 'pdf' };
        const extension = extensions[file.type];
        if (!extension || file.size > 20 * 1024 * 1024) throw new Error('JPEG, PNG, WebP, GIF veya PDF seç; dosya en fazla 20 MB olabilir.');
        const folder = await directory.getDirectoryHandle('images', { create: true });
        const name = `project-${crypto.randomUUID()}.${extension}`;
        const fileHandle = await folder.getFileHandle(name, { create: true });
        const writer = await fileHandle.createWritable(); await writer.write(file); await writer.close();
        return `images/${name}`;
    }
    window.LocalProjectFiles = { local, connect, read, save, upload, parse, serialize };
})();
