(function(){
    // Timeline progress for the history section.
    // Shows .history-timer-box when the history area enters the viewport
    // and updates the vertical progress bar based on scroll.

    function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

    const timerBox = document.querySelector('.history-timer-box');
    const scrollEl = document.querySelector('.history-scroll');
    const contentEl = document.querySelector('.history-content');
    if (!timerBox || !scrollEl || !contentEl) return;
    // Ensure there is a .progress element inside .time-line to update height
    let progressEl = timerBox.querySelector('.time-line .progress');
    const timeLineEl = timerBox.querySelector('.time-line');
    if (!timeLineEl) return;
    if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.className = 'progress';
        // minimal styles so it fills from bottom
        progressEl.style.position = 'absolute';
        progressEl.style.left = '0';
        progressEl.style.right = '0';
        progressEl.style.bottom = '0';
        progressEl.style.height = '0%';
        // use the timeline's background color for the progress
        const cs = window.getComputedStyle(timeLineEl);
        progressEl.style.backgroundColor = cs.backgroundColor || '#fff';
        timeLineEl.style.position = timeLineEl.style.position || 'absolute';
        timeLineEl.appendChild(progressEl);
    }

    let ticking = false;
    function updateProgress(){
        const rect = contentEl.getBoundingClientRect();
        const winH = window.innerHeight || document.documentElement.clientHeight;
        // When the content is fully inside viewport we compute progress from
        // the moment its top reaches viewport top to when its bottom reaches viewport bottom.
        const total = Math.max(rect.height, winH);
        // distance traveled: how far the top has moved up from viewport top (clamped)
        const traveled = clamp(-rect.top, 0, rect.height + winH);
        const raw = traveled / (rect.height + winH);
        const pct = clamp(raw, 0, 1) * 100;
        if (progressEl) progressEl.style.height = pct + '%';
        ticking = false;
    }

    function onScroll(){
        if (!ticking){
            ticking = true;
            requestAnimationFrame(updateProgress);
        }
    }

    let visible = false;
    function checkVisibility(){
        const rect = contentEl.getBoundingClientRect();
        const winH = window.innerHeight || document.documentElement.clientHeight;
        const shouldShow = rect.top <= winH / 2 && rect.bottom > 0;
        if (shouldShow && !visible) {
            visible = true;
            timerBox.classList.add('in-view');
            updateProgress();
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
        } else if (!shouldShow && visible) {
            visible = false;
            timerBox.classList.remove('in-view');
            if (progressEl) progressEl.style.height = '0%';
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    checkVisibility();
})();
