(() => {
    'use strict';
    function attach(textarea, html, onChange = () => {}) {
        if (textarea._richEditor) { textarea._richEditor.innerHTML = window.PortfolioStore.richText(html); return; }
        const box = document.createElement('div'); box.className = 'text-editor';
        const toolbar = document.createElement('div'); toolbar.className = 'text-toolbar'; toolbar.setAttribute('role', 'group'); toolbar.setAttribute('aria-label', 'Metin biçimlendirme');
        const editor = document.createElement('div'); editor.className = 'text-surface'; editor.contentEditable = 'true'; editor.setAttribute('role', 'textbox'); editor.setAttribute('aria-multiline', 'true'); editor.setAttribute('aria-label', textarea.getAttribute('aria-label') || textarea.closest('label')?.firstChild?.textContent || 'Metin');
        editor.innerHTML = window.PortfolioStore.richText(html); textarea._richEditor = editor; textarea.hidden = true;
        let selection;
        const toggles = [];
        function remember() {
            const s = getSelection();
            if (s.rangeCount && editor.contains(s.anchorNode) && editor.contains(s.focusNode)) { selection = s.getRangeAt(0).cloneRange(); state(); }
        }
        function restore() {
            editor.focus();
            if (selection && editor.contains(selection.commonAncestorContainer)) { const s = getSelection(); s.removeAllRanges(); s.addRange(selection); }
        }
        function sync() {
            textarea.value = editor.innerText;
            textarea.dataset.originalText = textarea.value;
            textarea.dataset.originalHtml = window.PortfolioStore.richText(editor.innerHTML);
            textarea.dispatchEvent(new Event('input', { bubbles: true })); onChange(textarea.dataset.originalHtml); remember();
        }
        function command(name, value = null) {
            if (textarea.disabled) return;
            restore(); document.execCommand('styleWithCSS', false, true); document.execCommand(name, false, value); sync();
        }
        function tool(title, action, cmd) {
            const b = document.createElement('button'); b.type = 'button'; b.textContent = title; b.title = title;
            b.onmousedown = e => { e.preventDefault(); remember(); }; b.onclick = action;
            if(cmd) { b.setAttribute('aria-pressed', 'false'); toggles.push([b, cmd]); }
            toolbar.append(b); return b;
        }
        tool('Kalın', () => command('bold'), 'bold');
        tool('İtalik', () => command('italic'), 'italic');
        tool('Altı çizili', () => command('underline'), 'underline');
        tool('Üstü çizili', () => command('strikeThrough'), 'strikeThrough');
        function choice(label, options, action) {
            const select = document.createElement('select'); select.setAttribute('aria-label', label); select.add(new Option(label, ''));
            options.forEach(([title, value]) => select.add(new Option(title, value)));
            select.onmousedown = remember; select.onchange = () => { if(select.value) action(select.value); }; toolbar.append(select); return select;
        }
        const fonts = choice('Yazı tipi', [['Sitenin yazı tipi','inherit'],['Arial','Arial'],['Georgia','Georgia'],['Verdana','Verdana'],['Courier New','Courier New']], value => command('fontName',value));
        const sizes = choice('Yazı boyutu', [['Küçük · 10','1'],['Normal · 12','2'],['Orta · 14','3'],['Büyük · 18','4'],['Başlık · 24','5'],['Büyük başlık · 36','6']], value => command('fontSize',value));
        function color(label, cmd, initial) {
            const wrap=document.createElement('label'); wrap.className='text-color-control'; wrap.append(document.createTextNode(label));
            const picker=document.createElement('input'); picker.type='color'; picker.value=initial; picker.setAttribute('aria-label',label);
            picker.onmousedown=remember; picker.oninput=()=>command(cmd,picker.value); wrap.append(picker); toolbar.append(wrap);
        }
        color('Yazı rengi','foreColor','#ffffff'); color('Vurgu rengi','hiliteColor','#ffe066');
        tool('Vurguyu kaldır',()=>command('hiliteColor','transparent'));
        tool('Rengi sıfırla',()=>command('foreColor','inherit'));
        tool('Sola',()=>command('justifyLeft'),'justifyLeft'); tool('Ortala',()=>command('justifyCenter'),'justifyCenter'); tool('Sağa',()=>command('justifyRight'),'justifyRight');
        tool('Madde listesi',()=>command('insertUnorderedList'),'insertUnorderedList'); tool('Numaralı liste',()=>command('insertOrderedList'),'insertOrderedList');
        tool('Biçimi temizle',()=>command('removeFormat'));
        tool('Geri al',()=>command('undo')); tool('Yinele',()=>command('redo'));
        function state() {
            toggles.forEach(([b,cmd])=>b.setAttribute('aria-pressed',String(document.queryCommandState(cmd))));
            const font=String(document.queryCommandValue('fontName')).replace(/["']/g,''); fonts.value=[...fonts.options].some(o=>o.value===font)?font:'';
            sizes.value=String(document.queryCommandValue('fontSize'));
        }
        editor.addEventListener('keyup',remember); editor.addEventListener('mouseup',remember);
        document.addEventListener('selectionchange',()=>{ if(editor.isConnected) remember(); });
        editor.oninput=sync;
        editor.onkeydown=e=>{
            if((e.ctrlKey||e.metaKey)&&['b','i','u'].includes(e.key.toLowerCase())) { e.preventDefault(); command(({b:'bold',i:'italic',u:'underline'})[e.key.toLowerCase()]); }
        };
        editor.onpaste=e=>{ e.preventDefault(); command('insertText',e.clipboardData.getData('text/plain')); };
        const hint=document.createElement('small'); hint.className='hint'; hint.textContent='Yazıyı seçerek biçimlendir. Aktif düğmeye tekrar basarak kapatabilirsin. Ctrl+B / I / U · Ctrl+Z geri al.';
        box.append(toolbar,editor,hint); textarea.after(box);
        new MutationObserver(()=>{editor.contentEditable=String(!textarea.disabled);toolbar.querySelectorAll('button,select,input').forEach(n=>{n.disabled=textarea.disabled;});}).observe(textarea,{attributes:true,attributeFilter:['disabled']});
    }
    window.TextEditor={attach};
})();