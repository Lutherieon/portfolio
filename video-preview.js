(() => {
    'use strict';
    const prepared = new WeakMap();

    function prepare(video) {
        const source = video.getAttribute('src');
        if (!source || video.hasAttribute('poster') || video.autoplay || prepared.get(video) === source) return;
        prepared.set(video, source);
        let seekingPreview = false;
        let cancelled = false;
        const cancel = () => { cancelled = true; cleanup(); };
        function cleanup() {
            video.removeEventListener('loadedmetadata', seek);
            video.removeEventListener('seeked', capture);
            video.removeEventListener('play', cancel);
            video.removeEventListener('error', cancel);
        }
        function seek() {
            if (cancelled || !video.paused || !Number.isFinite(video.duration) || video.duration <= 0) {
                cleanup(); return;
            }
            seekingPreview = true;
            // Skip opening fades while keeping the sample within short clips.
            video.currentTime = Math.min(3, video.duration * 0.1);
        }
        function capture() {
            if (!seekingPreview || cancelled || !video.paused || !video.videoWidth) return;
            cleanup();
            try {
                const canvas = document.createElement('canvas');
                canvas.width = Math.min(960, video.videoWidth);
                canvas.height = Math.max(1, Math.round(canvas.width * video.videoHeight / video.videoWidth));
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                video.poster = canvas.toDataURL('image/jpeg', 0.85);
            } catch (_) {
                // External videos can forbid canvas export; keep their sampled frame visible.
                video.addEventListener('play', () => { video.currentTime = 0; }, { once: true });
                return;
            }
            video.currentTime = 0;
        }
        video.addEventListener('loadedmetadata', seek);
        video.addEventListener('seeked', capture);
        video.addEventListener('play', cancel);
        video.addEventListener('error', cancel);
        if (video.readyState >= 1) seek();
    }

    function scan(node) {
        if (node.nodeType !== 1) return;
        if (node.matches('video')) prepare(node);
        node.querySelectorAll('video').forEach(prepare);
    }
    const observer = new MutationObserver(records => {
        for (const record of records) {
            if (record.type === 'attributes') prepare(record.target);
            else record.addedNodes.forEach(scan);
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    document.querySelectorAll('video').forEach(prepare);
})();
