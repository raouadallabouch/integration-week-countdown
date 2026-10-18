/**
 * 1337 TÉTOUAN — PROMO 2026
 * Pure Minimalist Monolith Countdown
 * Upper-left 1337/2026 tumbler morphing + Centered monolithic countdown
 */

(() => {
    'use strict';

    // --- 1337 Vector Glyphs (Updated Grid: viewBox ~120.67 199.37) ---
    const DIGIT_DATA = {
        0: { viewBox: '0 0 120.66 199.37', body: '<path d="M0,0v199.37h120.66V0H0ZM92.42,176.06H28.24V23.3s64.19,0,64.19,0v152.76Z"/>' },
        1: { viewBox: '0 0 118.11 199.36', body: '<path id="path-1" d="M28.24,176.06h30.81V23.3H23.11v31.07H0V0h87.3v176.06h30.81v23.3H28.24v-23.3Z"/>' },
        2: { viewBox: '0 0 120.68 199.36', body: '<polygon points="120.68 0 120.68 108.75 28.25 108.75 28.25 176.06 120.68 176.06 120.68 199.36 0 199.36 0 85.44 92.43 85.44 92.43 23.3 0 23.3 0 0 120.68 0"/>' },
        3: { viewBox: '0 0 120.67 199.36', body: '<path id="path-3" d="M0,176.06h92.43v-67.32H7.7v-23.3h84.73V23.3H0V0h120.67v199.36H0v-23.3Z"/>' },
        4: { viewBox: '0 0 120.67 199.37', body: '<polygon points="120.67 0 120.67 199.37 92.43 199.37 92.43 108.75 0 108.75 0 0 28.24 0 28.24 85.44 92.43 85.44 92.43 0 120.67 0"/>' },
        5: { viewBox: '0 0 120.68 199.36', body: '<polygon points="0 0 0 108.75 92.43 108.75 92.43 176.06 0 176.06 0 199.36 120.68 199.36 120.68 85.44 28.25 85.44 28.25 23.3 120.68 23.3 120.68 0 0 0"/>' },
        6: { viewBox: '0 0 120.67 199.37', body: '<path d="M120.67,23.3V0H0v199.37h120.67v-113.92H28.24V23.3h92.43ZM92.43,108.75v67.32H28.24v-67.32h64.19Z"/>' },
        7: { viewBox: '0 0 125.81 199.36', body: '<path id="path-4" d="M100.13,23.3H23.11v49.19H0V0h125.81v199.36h-25.68V23.3Z"/>' },
        8: { viewBox: '0 0 120.66 199.37', body: '<path d="M0,0v199.37h120.66V0H0ZM92.42,176.06H28.24v-67.32h64.18v67.32ZM92.43,85.44H28.23V23.3h64.19v62.14Z"/>' },
        9: { viewBox: '0 0 120.67 199.37', body: '<path d="M0,0v108.75h92.43v67.32H0v23.3h120.67V0H0ZM92.43,85.44H28.24V23.3h64.19v62.14Z"/>' }
    };

    function createDigitSvg(digit) {
        const template = document.getElementById('svg-1337-' + digit);
        if (template) {
            const clone = template.cloneNode(true);
            clone.removeAttribute('id');
            clone.style.display = 'block';
            return clone;
        }
        const item = DIGIT_DATA[digit] || DIGIT_DATA[0];
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', item.viewBox);
        try {
            svg.innerHTML = item.body;
        } catch (e) {
            try {
                const doc = new DOMParser().parseFromString(
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + item.viewBox + '">' + item.body + '</svg>',
                    'image/svg+xml'
                );
                return doc.documentElement;
            } catch (err) {}
        }
        return svg;
    }

    // --- App Config & State ---
    const STORAGE_KEY = '1337_integration_target_date_monolith';
    const DEFAULT_TARGET = '2026-11-02T09:00:00';

    let targetTimestamp = getStoredTarget();
    let currentCountdownDigits = {
        d0: null, d1: null,
        h0: null, h1: null,
        m0: null, m1: null,
        s0: null, s1: null
    };

    function getStoredTarget() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = new Date(stored).getTime();
            if (!isNaN(parsed)) return parsed;
        }
        return new Date(DEFAULT_TARGET).getTime();
    }

    function saveTarget(isoString) {
        localStorage.setItem(STORAGE_KEY, isoString);
        targetTimestamp = new Date(isoString).getTime();
        updateTargetDisplay();
    }

    // --- DOM Elements ---
    const countdownCells = {
        d0: document.getElementById('d0'),
        d1: document.getElementById('d1'),
        h0: document.getElementById('h0'),
        h1: document.getElementById('h1'),
        m0: document.getElementById('m0'),
        m1: document.getElementById('m1'),
        s0: document.getElementById('s0'),
        s1: document.getElementById('s1')
    };

    const morphSlots = [
        document.getElementById('slot0'),
        document.getElementById('slot1'),
        document.getElementById('slot2'),
        document.getElementById('slot3')
    ];

    const targetDisplay = document.getElementById('targetDateDisplay');
    const configBtn = document.getElementById('configToggleBtn');
    const settingsModal = document.getElementById('settingsModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const targetInput = document.getElementById('targetDateTimeInput');
    const saveDateBtn = document.getElementById('saveDateBtn');
    const resetDateBtn = document.getElementById('resetDateBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const chipBtns = document.querySelectorAll('.chip-btn');

    // --- Target Date Formatter ---
    function updateTargetDisplay() {
        if (!targetDisplay) return;
        const d = new Date(targetTimestamp);
        const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        targetDisplay.textContent = `${d.toLocaleDateString('en-US', options).toUpperCase()} // 1337`;
    }

    // ==========================================================================
    // 1. UPPER-LEFT 1337 MORPHING LOGO
    // Cycles every 5 seconds: 1337 <--> 2026
    // Each column picks 'up' or 'down' and tumbles through random numbers
    // ==========================================================================
    const LOGO_STATES = {
        A: ['1', '3', '3', '7'],
        B: ['2', '0', '2', '6']
    };

    let currentLogoTarget = 'B'; // Next target will be 2026
    let currentLogoDigits = [...LOGO_STATES.A];
    let isMorphing = false;

    // Initialize initial static 1337
    function initMorphLogo() {
        morphSlots.forEach((slot, idx) => {
            if (!slot) return;
            slot.innerHTML = '';
            const digitWrap = document.createElement('div');
            digitWrap.className = 'morph-digit current';
            digitWrap.appendChild(createDigitSvg(currentLogoDigits[idx]));
            slot.appendChild(digitWrap);
        });

        // Trigger morph every 5 seconds
        setInterval(triggerLogoMorph, 5000);
    }

    function triggerLogoMorph() {
        if (isMorphing) return;
        isMorphing = true;

        const targetDigits = currentLogoTarget === 'B' ? LOGO_STATES.B : LOGO_STATES.A;

        morphSlots.forEach((slot, colIdx) => {
            if (!slot) return;

            // Randomize direction: 'up' or 'down'
            const direction = Math.random() > 0.5 ? 'up' : 'down';
            
            // Number of tumbling spins before settling (4 to 7 spins)
            const spinsCount = 4 + colIdx;
            let currentSpin = 0;

            function runSpin() {
                currentSpin++;
                const isFinal = currentSpin >= spinsCount;
                const nextDigit = isFinal ? targetDigits[colIdx] : String(Math.floor(Math.random() * 10));

                const currentEl = slot.querySelector('.morph-digit.current');
                
                // Create incoming element
                const incomingEl = document.createElement('div');
                incomingEl.className = `morph-digit ${direction === 'up' ? 'enter-up' : 'enter-down'}`;
                incomingEl.appendChild(createDigitSvg(nextDigit));
                slot.appendChild(incomingEl);

                // Force reflow
                void incomingEl.offsetWidth;

                // Animate out current
                if (currentEl) {
                    currentEl.className = `morph-digit ${direction === 'up' ? 'exit-up' : 'exit-down'}`;
                    setTimeout(() => currentEl.remove(), 260);
                }

                // Animate in incoming
                incomingEl.className = 'morph-digit current';

                if (!isFinal) {
                    // Quick tumbler step delay (approx 90ms - 130ms)
                    setTimeout(runSpin, 85 + Math.random() * 40);
                } else {
                    currentLogoDigits[colIdx] = targetDigits[colIdx];
                    if (colIdx === morphSlots.length - 1) {
                        isMorphing = false;
                        currentLogoTarget = currentLogoTarget === 'B' ? 'A' : 'B';
                    }
                }
            }

            // Slight stagger between columns for split-flap / cipher reel feel
            setTimeout(runSpin, colIdx * 75);
        });
    }

    // ==========================================================================
    // 2. CENTER SUSPENSEFUL COUNTDOWN ENGINE
    // Smooth vertical sliding transitions on digit change
    // ==========================================================================
    function updateDigitCell(cellKey, newDigit) {
        const cell = countdownCells[cellKey];
        if (!cell) return;

        const oldDigit = currentCountdownDigits[cellKey];
        if (oldDigit === newDigit && cell.children.length > 0) return;

        currentCountdownDigits[cellKey] = newDigit;

        const currentWrap = cell.querySelector('.digit-slide-wrap.active');

        // Initial populate without slide animation
        if (oldDigit === null || !currentWrap) {
            cell.innerHTML = '';
            const newWrap = document.createElement('div');
            newWrap.className = 'digit-slide-wrap active';
            newWrap.appendChild(createDigitSvg(newDigit));
            cell.appendChild(newWrap);
            return;
        }

        // Sliding transition: old goes up, new comes from bottom
        const incomingWrap = document.createElement('div');
        incomingWrap.className = 'digit-slide-wrap entering';
        incomingWrap.appendChild(createDigitSvg(newDigit));
        cell.appendChild(incomingWrap);

        // Force reflow
        void incomingWrap.offsetWidth;

        currentWrap.className = 'digit-slide-wrap leaving';
        incomingWrap.className = 'digit-slide-wrap active';

        setTimeout(() => {
            currentWrap.remove();
        }, 260);
    }

    function tickCountdown() {
        const now = Date.now();
        const diff = Math.max(0, targetTimestamp - now);

        const totalSecs = Math.floor(diff / 1000);
        const days = Math.floor(totalSecs / (3600 * 24));
        const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = Math.floor(totalSecs % 60);

        const daysStr = String(days).padStart(2, '0');
        const hoursStr = String(hours).padStart(2, '0');
        const minsStr = String(minutes).padStart(2, '0');
        const secsStr = String(seconds).padStart(2, '0');

        updateDigitCell('d0', daysStr[0]);
        updateDigitCell('d1', daysStr[1]);

        updateDigitCell('h0', hoursStr[0]);
        updateDigitCell('h1', hoursStr[1]);

        updateDigitCell('m0', minsStr[0]);
        updateDigitCell('m1', minsStr[1]);

        updateDigitCell('s0', secsStr[0]);
        updateDigitCell('s1', secsStr[1]);
    }

    // ==========================================================================
    // 3. SETTINGS MODAL & ACTIONS
    // ==========================================================================
    function setupModal() {
        if (!configBtn || !settingsModal) return;

        const openModal = () => {
            const d = new Date(targetTimestamp);
            const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            if (targetInput) targetInput.value = localIso;

            settingsModal.classList.add('active');
            if (modalBackdrop) modalBackdrop.classList.add('active');
        };

        const closeModal = () => {
            settingsModal.classList.remove('active');
            if (modalBackdrop) modalBackdrop.classList.remove('active');
        };

        configBtn.addEventListener('click', openModal);
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

        if (chipBtns) {
            chipBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const days = btn.getAttribute('data-days');
                    const preset = btn.getAttribute('data-preset');
                    let target;
                    if (preset === 'nov2026') {
                        target = new Date(DEFAULT_TARGET);
                    } else if (days) {
                        target = new Date();
                        target.setDate(target.getDate() + parseInt(days, 10));
                        target.setHours(9, 0, 0, 0);
                    }
                    if (target && targetInput) {
                        const localIso = new Date(target.getTime() - target.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                        targetInput.value = localIso;
                    }
                });
            });
        }

        if (saveDateBtn) {
            saveDateBtn.addEventListener('click', () => {
                if (targetInput && targetInput.value) {
                    saveTarget(targetInput.value);
                    tickCountdown();
                }
                closeModal();
            });
        }

        if (resetDateBtn) {
            resetDateBtn.addEventListener('click', () => {
                localStorage.removeItem(STORAGE_KEY);
                targetTimestamp = new Date(DEFAULT_TARGET).getTime();
                updateTargetDisplay();
                tickCountdown();
                closeModal();
            });
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen().catch(() => {});
                }
            });
        }
    }

    // ==========================================================================
    // 4. FALLING BINARY STREAM ANIMATION (RED #df2635 ON WHITE)
    // ==========================================================================
    class BinaryRain {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.fontSize = 17;
            this.columns = [];
            this.dpr = window.devicePixelRatio || 1;

            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }

        resize() {
            this.dpr = window.devicePixelRatio || 1;
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width * this.dpr;
            this.canvas.height = this.height * this.dpr;
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(this.dpr, this.dpr);

            const colWidth = 22;
            const totalCols = Math.floor(this.width / colWidth);
            this.columns = [];

            for (let i = 0; i < totalCols; i++) {
                this.columns.push(this.createColumn(i * colWidth, true));
            }
        }

        createColumn(x, isInitial = false) {
            const length = Math.floor(Math.random() * 12) + 8;
            const chars = [];
            for (let j = 0; j < length; j++) {
                chars.push(Math.random() > 0.5 ? '1' : '0');
            }
            // If page just loaded/refreshed, scatter streams across the entire screen
            const initialY = isInitial
                ? Math.random() * (this.height + 200)
                : -20 - Math.random() * 100;

            return {
                x,
                y: initialY,
                speed: 1.4 + Math.random() * 2.2,
                length,
                chars,
                opacity: 0.08 + Math.random() * 0.14,
                isRed: Math.random() < 0.2
            };
        }

        animate() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.font = `600 ${this.fontSize}px 'JetBrains Mono', monospace`;
            this.ctx.textAlign = 'center';

            const rowHeight = this.fontSize * 1.35;

            for (let i = 0; i < this.columns.length; i++) {
                const col = this.columns[i];
                col.y += col.speed;

                // Random bit flip in the falling stream
                if (Math.random() > 0.85) {
                    const randIdx = Math.floor(Math.random() * col.chars.length);
                    col.chars[randIdx] = Math.random() > 0.5 ? '1' : '0';
                }

                // Render characters in the trail
                for (let j = 0; j < col.length; j++) {
                    const charY = col.y - (j * rowHeight);
                    if (charY > -rowHeight && charY < this.height + rowHeight) {
                        const progress = j / col.length;

                        if (j === 0) {
                            if (col.isRed) {
                                this.ctx.fillStyle = 'rgba(223, 38, 53, 0.95)';
                                this.ctx.shadowColor = 'rgba(223, 38, 53, 0.8)';
                                this.ctx.shadowBlur = 6;
                            } else {
                                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
                                this.ctx.shadowBlur = 4;
                            }
                        } else {
                            const alpha = (1 - progress) * col.opacity;
                            if (col.isRed) {
                                this.ctx.fillStyle = 'rgba(223, 38, 53, ' + (alpha * 1.8).toFixed(3) + ')';
                            } else {
                                this.ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(3) + ')';
                            }
                            this.ctx.shadowBlur = 0;
                        }

                        this.ctx.fillText(col.chars[j], col.x + 11, charY);
                    }
                }
                this.ctx.shadowBlur = 0;

                // Reset column when it reaches past bottom
                if (col.y - (col.length * rowHeight) > this.height) {
                    this.columns[i] = this.createColumn(col.x, false);
                }
            }

            requestAnimationFrame(() => this.animate());
        }
    }

    // ==========================================================================
    // 5. INACTIVITY DETECTOR (AUTOHIDE CONTROLS & CURSOR AFTER 2 SECONDS)
    // ==========================================================================
    function setupIdleDetector() {
        let idleTimer = null;
        const IDLE_TIMEOUT_MS = 2000;

        function resetIdleTimer() {
            if (settingsModal && settingsModal.classList.contains('active')) {
                document.body.classList.remove('user-idle');
                return;
            }

            document.body.classList.remove('user-idle');
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if (!settingsModal || !settingsModal.classList.contains('active')) {
                    document.body.classList.add('user-idle');
                }
            }, IDLE_TIMEOUT_MS);
        }

        const events = ['mousemove', 'mousedown', 'pointermove', 'pointerdown', 'touchstart', 'keydown', 'wheel'];
        events.forEach(evt => {
            window.addEventListener(evt, resetIdleTimer, { passive: true });
        });

        resetIdleTimer();
    }

    // --- Init ---
    
    // ==========================================================================
    // 6. CYBER TERMINAL GLITCH SYSTEM
    // Triggers authentic digital interference bursts periodically (every 7-14s)
    // ==========================================================================
    function setupGlitchSystem() {
        let isGlitching = false;

        function triggerGlitch(duration = 260) {
            if (isGlitching) return;
            isGlitching = true;
            document.body.classList.add('is-glitching');

            setTimeout(() => {
                document.body.classList.remove('is-glitching');
                isGlitching = false;
            }, duration);
        }

        // Periodic suspense glitch (every 8 to 15 seconds)
        function queueNextGlitch() {
            const nextDelay = 8000 + Math.random() * 7000;
            setTimeout(() => {
                triggerGlitch(200 + Math.random() * 120);
                queueNextGlitch();
            }, nextDelay);
        }

        queueNextGlitch();

        // Also trigger on click/tap on background as an interactive easter egg
        window.addEventListener('click', (e) => {
            if (e.target.closest('#settingsModal') || e.target.closest('.bottom-bar')) return;
            triggerGlitch(280);
        }, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateTargetDisplay();
        initMorphLogo();
        setupModal();
        setupIdleDetector();
        setupGlitchSystem();

        // Initialize Falling Binary Background Animation
        const binaryCanvas = document.getElementById('binaryCanvas');
        if (binaryCanvas) {
            new BinaryRain(binaryCanvas);
        }

        tickCountdown();
        setInterval(tickCountdown, 250); // Checks 4x per second to guarantee exact zero-latency second alignment
    });

})();
