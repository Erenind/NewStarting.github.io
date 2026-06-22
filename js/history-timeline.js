(function(){
    function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

    const timerBox = document.querySelector('.history-timer-box');
    const scrollEl = document.querySelector('.history-scroll');
    const contentEl = document.querySelector('.history-content');
    if (!timerBox || !scrollEl || !contentEl) return;

    const timeLine = timerBox.querySelector('.time-line');
    if (!timeLine) return;

    let progressEl = timeLine.querySelector('.progress');
    if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.className = 'progress';
        progressEl.style.position = 'absolute';
        progressEl.style.left = '0';
        progressEl.style.right = '0';
        progressEl.style.bottom = '0';
        progressEl.style.height = '0%';
        const cs = window.getComputedStyle(timeLine);
        progressEl.style.backgroundColor = cs.backgroundColor || '#fff';
        timeLine.appendChild(progressEl);
    }

    let dimOverlay = null;

    function addLabelClick(label) {
        label.addEventListener('click', function jumpTo() {
            const t = this.textContent.trim();
            const els = document.querySelectorAll('.history-item .history-item-time');
            for (const el of els) {
                if (el.textContent.trim() === t) {
                    const item = el.closest('.history-item');
                    if (item) {
                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        break;
                    }
                }
            }
        });
    }

    // ── Time clock wheels ──────────────────────────────────────
    let yearWheel = null, monthWheel = null, dayWheel = null;
    let yearTexts = null, monthTexts = null, dayTexts = null;

    const CX = 200, CY = 200;

    function createRing(svg, circleRadius, textRadius, labels, cls, fontSize) {
        const wheel = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        wheel.setAttribute('class', cls);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', CX);
        circle.setAttribute('cy', CY);
        circle.setAttribute('r', circleRadius);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'currentColor');
        circle.setAttribute('stroke-width', '2.5');
        circle.setAttribute('opacity', '0.3');
        wheel.appendChild(circle);
        svg.appendChild(wheel);

        const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        textGroup.setAttribute('class', cls + '-texts');
        const n = labels.length;
        labels.forEach((label, i) => {
            const angle = -Math.PI / 2 - (i / n) * Math.PI * 2;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', CX + textRadius * Math.cos(angle));
            text.setAttribute('y', CY + textRadius * Math.sin(angle));
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            text.setAttribute('fill', 'currentColor');
            text.setAttribute('font-size', fontSize);
            text.setAttribute('opacity', cls === 'day-ring' ? '0.35' : '0.8');
            text.setAttribute('font-weight', '700');
            text.textContent = label;
            textGroup.appendChild(text);
        });
        svg.appendChild(textGroup);

        return { wheel, textGroup, n, textRadius };
    }

    function createTimeClock() {
        const clockEl = timerBox.querySelector('.time-clock');
        if (!clockEl) return;
        clockEl.innerHTML = '';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 400 400');
        svg.style.display = 'block';

        const yr = createRing(svg, 85, 65, ['2023', '2024', '2025', '2026'], 'year-ring', '15');
        yearWheel = yr.wheel; yearTexts = yr;

        const mr = createRing(svg, 140, 120, Array.from({ length: 12 }, (_, i) => String(i + 1)), 'month-ring', '12');
        monthWheel = mr.wheel; monthTexts = mr;

        const dr = createRing(svg, 190, 170, Array.from({ length: 30 }, (_, i) => String(i + 1)), 'day-ring', '7');
        dayWheel = dr.wheel; dayTexts = dr;

        // center dot
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', CX);
        dot.setAttribute('cy', CY);
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', 'currentColor');
        dot.setAttribute('opacity', '0.3');
        svg.appendChild(dot);

        // top indicator triangle
        const tri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const triSize = 7;
        const triY = CY - 205;
        tri.setAttribute('points', `${CX - triSize},${triY} ${CX + triSize},${triY} ${CX},${triY - 10}`);
        tri.setAttribute('fill', 'currentColor');
        tri.setAttribute('opacity', '0.7');
        svg.appendChild(tri);

        clockEl.appendChild(svg);
    }

    function updateTextPositions(textInfo, angleDeg) {
        if (!textInfo) return;
        const angleRad = angleDeg * Math.PI / 180;
        const texts = textInfo.textGroup.querySelectorAll('text');
        const n = textInfo.n;
        const r = textInfo.textRadius;
        texts.forEach((text, i) => {
            const a = -Math.PI / 2 - (i / n) * Math.PI * 2 + angleRad;
            text.setAttribute('x', CX + r * Math.cos(a));
            text.setAttribute('y', CY + r * Math.sin(a));
        });
    }

    createTimeClock();

    // ── Timeline segments ──────────────────────────────────────
    async function createTimelineSegments() {
        try {
            const res = await fetch('history.json', { cache: 'no-store' });
            if (!res.ok) return;
            const entries = await res.json();

            timeLine.querySelectorAll('.time-segment, .time-label, .time-dim-overlay').forEach(el => el.remove());

            dimOverlay = document.createElement('div');
            dimOverlay.className = 'time-dim-overlay';
            timeLine.appendChild(dimOverlay);

            const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
            const groups = [];
            for (const entry of sorted) {
                const last = groups[groups.length - 1];
                if (last && last.timestamp === entry.timestamp) {
                    last.entries.push(entry);
                } else {
                    groups.push({ timestamp: entry.timestamp, entries: [entry] });
                }
            }
            if (groups.length < 2) return;

            const lastGroup = groups[groups.length - 1];

            const segments = [];
            for (let i = 0; i < groups.length - 1; i++) {
                const end = groups[i + 1].timestamp;
                const dur = Math.max(end - groups[i].timestamp, 0);
                if (dur > 0) segments.push({ duration: dur, group: groups[i] });
            }
            if (segments.length === 0) return;

            await new Promise(r => requestAnimationFrame(r));
            const lineH = timeLine.clientHeight;
            if (lineH < 1) return;

            const total = segments.reduce((s, seg) => s + seg.duration, 0);
            const gap = 3;
            const totalGaps = gap * (segments.length - 1);
            const availH = lineH - totalGaps;

            const hStart = 180, hEnd = 300;

            function makeLabel(text, bottom, entries) {
                const label = document.createElement('div');
                label.className = 'time-label';
                label.textContent = text;
                label.style.bottom = bottom + 'px';
                label.title = entries.map(e => e.title).join(' / ');
                addLabelClick(label);
                timeLine.insertBefore(label, progressEl);
                return label;
            }

            let bottom = 0;
            for (let i = segments.length - 1; i >= 0; i--) {
                const seg = segments[i];
                const h = Math.round((seg.duration / total) * availH);
                const t = segments.length > 1 ? i / (segments.length - 1) : 0;
                const hue = Math.round(hStart + (hEnd - hStart) * t);

                const div = document.createElement('div');
                div.className = 'time-segment';
                div.style.height = h + 'px';
                div.style.bottom = bottom + 'px';
                div.style.background = `linear-gradient(to top, hsl(${hue - 8}, 56%, 58%), hsl(${hue + 8}, 56%, 64%))`;

                timeLine.insertBefore(div, dimOverlay);

                if (i > 0) {
                    const labelBottom = bottom + h + gap / 2;
                    const labelTime = segments[i].group.entries[0].time;
                    makeLabel(labelTime, labelBottom, segments[i].group.entries);
                }

                bottom += h;
                if (i > 0) bottom += gap;
            }

            makeLabel(segments[0].group.entries[0].time, lineH - 4, segments[0].group.entries);
            makeLabel(lastGroup.entries[0].time, 4, lastGroup.entries);

            timeLine.style.backgroundColor = 'transparent';

            if (visible) updateOverlay();
        } catch (e) {}
    }

    createTimelineSegments();

    // ── Scroll progress ────────────────────────────────────────
    let ticking = false;

    function updateOverlay() {
        if (!dimOverlay) return;
        const items = document.querySelectorAll('.history-item');
        if (items.length === 0) return;
        const winH = window.innerHeight || document.documentElement.clientHeight;
        const midLine = winH / 2;

        let total = 0;
        for (const item of items) {
            const r = item.getBoundingClientRect();
            const top = r.top;
            const bottom = r.top + r.height;
            if (bottom <= midLine) {
                total += 1;
            } else if (top >= midLine) {
                total += 0;
            } else {
                total += (midLine - top) / (bottom - top);
            }
        }

        const pct = clamp(total / items.length, 0, 1) * 100;
        dimOverlay.style.clipPath = `inset(${pct}% 0 0 0)`;

        // rotate clock wheels
        if (yearWheel) yearWheel.setAttribute('transform', `rotate(${pct * 3.6}, ${CX}, ${CY})`);
        if (monthWheel) monthWheel.setAttribute('transform', `rotate(${pct * 10.8}, ${CX}, ${CY})`);
        if (dayWheel) dayWheel.setAttribute('transform', `rotate(${pct * 21.6}, ${CX}, ${CY})`);
        updateTextPositions(yearTexts, pct * 3.6);
        updateTextPositions(monthTexts, pct * 10.8);
        updateTextPositions(dayTexts, pct * 21.6);

        ticking = false;
    }

    function onScroll(){
        if (!ticking){
            ticking = true;
            requestAnimationFrame(updateOverlay);
        }
    }

    // ── Visibility toggle ──────────────────────────────────────
    let visible = false;
    function checkVisibility(){
        const rect = contentEl.getBoundingClientRect();
        const winH = window.innerHeight || document.documentElement.clientHeight;
        const shouldShow = rect.top <= winH / 2 && rect.bottom > 0;
        if (shouldShow && !visible) {
            visible = true;
            timerBox.classList.add('in-view');
            updateOverlay();
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
        } else if (!shouldShow && visible) {
            visible = false;
            timerBox.classList.remove('in-view');
            if (dimOverlay) dimOverlay.style.clipPath = 'inset(0 0 0 0)';
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    checkVisibility();
})();
