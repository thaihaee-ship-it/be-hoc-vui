// ============================================
// BÉ HỌC VUI
// ============================================

const APP = {
    db: null,
    settings: { rounds: 5, options: 3, rate: 0.9, guide: true, flowers: 0 },
    topics: [],
    topic: null,
    learn: { index: 0 },
    play: null
};

// ============================================
// INDEXED DB
// ============================================

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('BeHocVuiDB', 2);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
            if (!db.objectStoreNames.contains('topics')) db.createObjectStore('topics', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('items')) db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
            if (!db.objectStoreNames.contains('voices')) db.createObjectStore('voices', { keyPath: 'text' });
        };
        req.onsuccess = () => { APP.db = req.result; resolve(); };
        req.onerror = () => reject(req.error);
    });
}

function dbRequest(store, mode, action) {
    return new Promise((resolve, reject) => {
        const req = action(APP.db.transaction(store, mode).objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

const dbGetAll = (store) => dbRequest(store, 'readonly', s => s.getAll());
const dbGet = (store, key) => dbRequest(store, 'readonly', s => s.get(key));
const dbPut = (store, data) => dbRequest(store, 'readwrite', s => s.put(data));
const dbDelete = (store, key) => dbRequest(store, 'readwrite', s => s.delete(key));
const dbClear = (store) => dbRequest(store, 'readwrite', s => s.clear());

async function loadSettings() {
    const saved = await dbGet('settings', 'app');
    if (saved) Object.assign(APP.settings, saved.value);
}

function saveSettings() {
    return dbPut('settings', { key: 'app', value: APP.settings });
}

// ============================================
// CHỦ ĐỀ VÀ HÌNH (có sẵn + bố mẹ thêm)
// ============================================

async function loadTopics() {
    const customTopics = await dbGetAll('topics');
    const customItems = await dbGetAll('items');

    const topics = BUILTIN_TOPICS.map(t => ({ ...t, items: [...t.items] }));
    customTopics.forEach(t => topics.push({ ...t, builtin: false, items: [] }));

    customItems.forEach(item => {
        const topic = topics.find(t => t.id === item.topicId);
        if (topic) topic.items.push({ ...item, custom: true });
    });

    APP.topics = topics;
}

// ============================================
// GIỌNG ĐỌC VÀ ÂM THANH
// ============================================

const Voice = {
    voice: null,
    // Dùng chung một thẻ audio: iPhone/iPad chỉ cho phát tiếp trên thẻ đã được mở khóa bằng lần chạm đầu.
    audio: new Audio(),
    overrides: new Map(),
    token: 0,

    init() {
        if (!('speechSynthesis' in window)) return;
        const pick = () => {
            const voices = speechSynthesis.getVoices();
            const vi = voices.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('vi'));
            this.voice = vi.find(v => /google/i.test(v.name)) || vi[0] || null;
            document.dispatchEvent(new Event('voicechange'));
        };
        pick();
        speechSynthesis.addEventListener('voiceschanged', pick);
    },

    stop() {
        this.token++;
        if ('speechSynthesis' in window) speechSynthesis.cancel();
        this.audio.pause();
    },

    speak(text) {
        const own = this.overrides.get(text);
        if (own) return this.playClip(own);
        const clip = typeof VOICE_CLIPS !== 'undefined' && VOICE_CLIPS[text];
        if (clip) return this.playClip(clip, APP.settings.rate / 0.9);
        return new Promise(resolve => {
            if (!text || !('speechSynthesis' in window)) { resolve(); return; }
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'vi-VN';
            if (this.voice) u.voice = this.voice;
            u.rate = APP.settings.rate;
            u.pitch = 1.1;

            let finished = false;
            const finish = () => {
                if (finished) return;
                finished = true;
                clearTimeout(guard);
                resolve();
            };
            u.onend = finish;
            u.onerror = finish;
            const guard = setTimeout(finish, 1200 + text.length * 85 / APP.settings.rate);
            speechSynthesis.speak(u);
        });
    },

    unlock() {
        this.audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
        this.audio.play().catch(() => {});
    },

    // Safari không phát được audio do service worker trả về khi offline, nên đọc file thành blob trước.
    blobUrls: new Map(),
    async clipUrl(src) {
        if (src.startsWith('data:')) return src;
        if (!this.blobUrls.has(src)) {
            const res = await fetch(src);
            this.blobUrls.set(src, URL.createObjectURL(await res.blob()));
        }
        return this.blobUrls.get(src);
    },

    async playClip(src, rate = 1) {
        if (this.pending) this.pending();
        const token = this.token;
        let url;
        try {
            url = await this.clipUrl(src);
        } catch (e) {
            return;
        }
        if (token !== this.token) return;
        return new Promise(resolve => {
            const audio = this.audio;
            const done = () => {
                if (this.pending === done) this.pending = null;
                resolve();
            };
            this.pending = done;
            audio.src = url;
            audio.defaultPlaybackRate = rate;
            audio.playbackRate = rate;
            audio.onended = done;
            audio.onerror = done;
            audio.onpause = done;
            audio.play().catch(done);
        });
    }
};

async function say(text) {
    Voice.stop();
    await Voice.speak(text);
}

async function sayItem(item, full) {
    Voice.stop();
    if (item.audio) return Voice.playClip(item.audio);
    return Voice.speak(full ? (item.say || item.name) : item.name);
}

async function sayPrompt(item) {
    Voice.stop();
    const token = Voice.token;
    if (item.audio) {
        if (APP.settings.guide) await Voice.speak(LINES.touch);
        if (token === Voice.token) await Voice.playClip(item.audio);
        return;
    }
    await Voice.speak(APP.settings.guide ? promptLine(item) : item.name);
}

const Sfx = {
    ctx: null,

    unlock() {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        if (!this.ctx) this.ctx = new Ctx();
        if (this.ctx.state === 'suspended') this.ctx.resume();
    },

    tone(freq, start, duration, type = 'sine', volume = 0.25) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime + start;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + duration + 0.05);
    },

    correct() {
        [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.09, 0.35, 'triangle', 0.3));
        this.tone(1568, 0.38, 0.5, 'sine', 0.12);
    },

    wrong() {
        this.tone(330, 0, 0.18, 'sine', 0.2);
        this.tone(262, 0.16, 0.3, 'sine', 0.2);
    },

    pop() {
        this.tone(880, 0, 0.08, 'sine', 0.15);
    },

    fanfare() {
        [523, 659, 784, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.13, 0.3, 'triangle', 0.28));
    }
};

// ============================================
// VẼ HÌNH
// ============================================

const SHAPE_COLORS = {
    circle: '#FF6B6B', square: '#4D96FF', triangle: '#6BCB77', rectangle: '#FFB443',
    star: '#FFD93D', heart: '#FF6FB5', diamond: '#9B72F2', oval: '#2EC4B6',
    hexagon: '#F4845F', pentagon: '#5BC0EB', semicircle: '#9BC53D', crescent: '#FDCA40', cross: '#E55381'
};

function polygonPoints(sides, radius, cy = 50) {
    const pts = [];
    for (let i = 0; i < sides; i++) {
        const a = 2 * Math.PI / sides * i - Math.PI / 2;
        pts.push((50 + radius * Math.cos(a)).toFixed(1) + ',' + (cy + radius * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
}

function starPoints() {
    const pts = [];
    for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 46 : 19;
        const a = Math.PI / 5 * i - Math.PI / 2;
        pts.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (54 + r * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
}

function shapeSVG(shape) {
    const fill = SHAPE_COLORS[shape] || '#FF9F43';
    const body = {
        circle: '<circle cx="50" cy="50" r="44"/>',
        square: '<rect x="8" y="8" width="84" height="84" rx="6"/>',
        triangle: '<polygon points="50,6 96,90 4,90" stroke-linejoin="round"/>',
        rectangle: '<rect x="2" y="24" width="96" height="52" rx="5"/>',
        star: '<polygon points="' + starPoints() + '" stroke-linejoin="round"/>',
        heart: '<path d="M50 90 C 18 66 3 49 3 30 C 3 15 15 5 28 5 C 38 5 46 11 50 20 C 54 11 62 5 72 5 C 85 5 97 15 97 30 C 97 49 82 66 50 90 Z"/>',
        diamond: '<polygon points="50,3 88,50 50,97 12,50"/>',
        oval: '<ellipse cx="50" cy="50" rx="46" ry="30"/>',
        hexagon: '<polygon points="' + polygonPoints(6, 46) + '" stroke-linejoin="round"/>',
        pentagon: '<polygon points="' + polygonPoints(5, 46, 54) + '" stroke-linejoin="round"/>',
        semicircle: '<path d="M4 70 A46 46 0 0 1 96 70 Z"/>',
        crescent: '<path d="M51 6 A44 44 0 1 0 87.9 72.4 A38 38 0 1 1 51 6 Z"/>',
        cross: '<polygon points="36,6 64,6 64,36 94,36 94,64 64,64 64,94 36,94 36,64 6,64 6,36 36,36" stroke-linejoin="round"/>'
    }[shape] || '';
    return '<svg class="visual-shape" viewBox="0 0 100 100" fill="' + fill + '" stroke="rgba(0,0,0,0.12)" stroke-width="2">' + body + '</svg>';
}

function renderVisual(item, mode) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'width:100%;height:100%;display:grid;place-items:center';

    if (item.image) {
        const img = document.createElement('img');
        img.className = 'visual-img';
        img.src = item.image;
        img.alt = item.name;
        wrap.appendChild(img);
    } else if (item.color) {
        const dot = document.createElement('div');
        dot.className = 'visual-color' + (item.color.toUpperCase() === '#FFFFFF' ? ' is-white' : '');
        dot.style.background = item.color;
        wrap.appendChild(dot);
    } else if (item.shape) {
        wrap.innerHTML = shapeSVG(item.shape);
    } else if (item.count) {
        const box = document.createElement('div');
        box.className = 'visual-count';
        box.textContent = '🍎'.repeat(item.count);
        wrap.appendChild(box);
    } else if (item.letter) {
        if (mode === 'learn') {
            const lw = document.createElement('div');
            lw.className = 'letter-wrap';
            const letter = document.createElement('span');
            letter.className = 'visual-letter';
            letter.textContent = item.letter + item.letter.toLowerCase();
            const ex = document.createElement('span');
            ex.className = 'letter-example';
            ex.textContent = item.emoji + ' ' + item.word;
            lw.append(letter, ex);
            wrap.appendChild(lw);
        } else {
            const letter = document.createElement('span');
            letter.className = 'visual-letter';
            letter.textContent = item.letter;
            wrap.appendChild(letter);
        }
    } else {
        const em = document.createElement('span');
        em.className = 'visual-emoji';
        em.textContent = item.emoji || '❓';
        wrap.appendChild(em);
    }
    return wrap;
}

// ============================================
// ĐIỀU HƯỚNG
// ============================================

function show(name) {
    if (name !== 'learn' && name !== 'play') Voice.stop();
    if (APP.play && name !== 'play') APP.play.alive = false;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + name).classList.add('active');
}

function toast(message) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
}

function askConfirm(text) {
    return new Promise(resolve => {
        const modal = document.getElementById('modal-confirm');
        document.getElementById('confirm-text').textContent = text;
        modal.hidden = false;
        const done = (answer) => {
            modal.hidden = true;
            document.getElementById('btn-confirm-yes').onclick = null;
            document.getElementById('btn-confirm-no').onclick = null;
            resolve(answer);
        };
        document.getElementById('btn-confirm-yes').onclick = () => done(true);
        document.getElementById('btn-confirm-no').onclick = () => done(false);
    });
}

function shuffle(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const pickOne = (list) => list[Math.floor(Math.random() * list.length)];

// ============================================
// TRANG CHỦ
// ============================================

function renderFlowers(bump) {
    document.getElementById('flower-count').textContent = APP.settings.flowers;
    if (bump) {
        const badge = document.querySelector('.flower-badge');
        badge.classList.remove('bump');
        void badge.offsetWidth;
        badge.classList.add('bump');
    }
}

function renderTopics() {
    const grid = document.getElementById('topic-grid');
    grid.innerHTML = '';
    APP.topics.forEach(topic => {
        const card = document.createElement('button');
        card.className = 'topic-card';
        card.style.background = topic.color;
        card.dataset.testid = 'card-topic-' + topic.id;
        card.innerHTML = '<span class="topic-icon"></span><span class="topic-name"></span><span class="topic-count"></span>';
        card.querySelector('.topic-icon').textContent = topic.icon;
        card.querySelector('.topic-name').textContent = topic.name;
        card.querySelector('.topic-count').textContent = topic.items.length + ' hình';
        card.addEventListener('click', () => openTopic(topic));
        grid.appendChild(card);
    });
    if (typeof Lop1 !== 'undefined') Lop1.homeCard(grid);
}

function openTopic(topic) {
    if (!topic.items.length) {
        toast('Chủ đề này chưa có hình nào. Bố mẹ thêm hình trong Khu bố mẹ nhé!');
        return;
    }
    Sfx.pop();
    APP.topic = topic;
    document.querySelector('[data-testid="btn-topic-back"]').dataset.back = 'home';
    document.getElementById('topic-title').textContent = topic.name;
    document.getElementById('topic-big-icon').textContent = topic.icon;
    show('topic');
    say(LINES.topicAsk(topic));
}

// ============================================
// CHẾ ĐỘ HỌC
// ============================================

function startLearn() {
    APP.learn.index = 0;
    show('learn');
    renderLearn();
}

function renderLearn() {
    const items = APP.topic.items;
    const i = APP.learn.index;
    const item = items[i];

    document.getElementById('learn-pos').textContent = i + 1;
    document.getElementById('learn-total').textContent = items.length;
    document.getElementById('btn-learn-prev').disabled = i === 0;
    document.getElementById('btn-learn-next').disabled = i === items.length - 1;

    const visual = document.getElementById('learn-visual');
    visual.innerHTML = '';
    visual.appendChild(renderVisual(item, 'learn'));
    document.getElementById('learn-name').textContent = item.name;

    const card = document.getElementById('learn-card');
    card.classList.remove('flip');
    void card.offsetWidth;
    card.classList.add('flip');

    sayItem(item, true);
}

function moveLearn(step) {
    const next = APP.learn.index + step;
    if (next < 0 || next >= APP.topic.items.length) return;
    APP.learn.index = next;
    Sfx.pop();
    renderLearn();
}

// ============================================
// CHẾ ĐỘ CHƠI
// ============================================

function startPlay() {
    const items = APP.topic.items;
    if (items.length < 2) {
        toast('Cần ít nhất 2 hình để chơi');
        return;
    }
    const rounds = APP.settings.rounds;
    let queue = [];
    while (queue.length < rounds) queue = queue.concat(shuffle(items));
    queue = queue.slice(0, rounds);

    APP.play = { queue, index: 0, earned: 0, locked: false, alive: true };
    APP.replay = startPlay;
    show('play');
    renderProgress();
    showQuestion();
}

function renderProgress() {
    const p = APP.play;
    const box = document.getElementById('play-progress');
    box.innerHTML = '';
    p.queue.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i < p.index ? ' done' : i === p.index ? ' current' : '');
        dot.textContent = i < p.index ? '🌸' : '⚪';
        box.appendChild(dot);
    });
}

function showQuestion() {
    const p = APP.play;
    const target = p.queue[p.index];
    const all = APP.topic.items;
    const optionCount = Math.min(APP.settings.options, all.length);
    const others = shuffle(all.filter(it => it !== target)).slice(0, optionCount - 1);
    const options = shuffle([target, ...others]);

    p.target = target;
    p.locked = false;
    p.tries = 0;

    document.getElementById('play-prompt-text').textContent = 'Chạm vào: ' + target.name;

    const grid = document.getElementById('play-options');
    grid.className = 'play-options n' + options.length;
    grid.innerHTML = '';
    options.forEach((item, i) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.dataset.testid = 'btn-option-' + i;
        btn.setAttribute('aria-label', item.name);
        btn.appendChild(renderVisual(item, 'play'));
        btn.addEventListener('click', () => answer(btn, item));
        grid.appendChild(btn);
    });

    speakPrompt();
}

async function speakPrompt() {
    const btn = document.getElementById('play-prompt');
    btn.classList.add('speaking');
    await (APP.play.sayPrompt ? APP.play.sayPrompt() : sayPrompt(APP.play.target));
    btn.classList.remove('speaking');
}

async function answer(btn, item) {
    const p = APP.play;
    if (p.locked || btn.classList.contains('faded')) return;

    if (item === p.target) {
        p.locked = true;
        btn.classList.add('correct');
        document.querySelectorAll('.option').forEach(o => { if (o !== btn) o.classList.add('faded'); });
        p.earned++;
        APP.settings.flowers++;
        saveSettings();
        renderFlowers(true);

        Sfx.correct();
        const praise = pickOne(PRAISES);
        showReward(praise);
        const waitMin = new Promise(r => setTimeout(r, 1700));
        await Promise.all([say(praise), waitMin]);
        if (!p.alive) return;

        p.index++;
        renderProgress();
        if (p.index >= p.queue.length) finishPlay();
        else (p.next || showQuestion)();
    } else {
        p.tries++;
        btn.classList.remove('wrong');
        void btn.offsetWidth;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.add('faded'), 450);
        Sfx.wrong();

        p.locked = true;
        await say(pickOne(RETRY_LINES));
        if (!p.alive) return;
        p.locked = false;
        speakPrompt();
    }
}

function showReward(text) {
    const box = document.getElementById('reward');
    const flower = document.getElementById('reward-flower');
    const label = document.getElementById('reward-text');
    flower.textContent = pickOne(REWARD_FLOWERS);
    label.textContent = text;
    box.hidden = true;
    void box.offsetWidth;
    box.hidden = false;
    [flower, label].forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
    });
    rainPetals(14);
    clearTimeout(showReward.timer);
    showReward.timer = setTimeout(() => { box.hidden = true; }, 1650);
}

function rainPetals(count) {
    const layer = document.getElementById('petals');
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('span');
        petal.className = 'petal';
        petal.textContent = pickOne(REWARD_FLOWERS);
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.fontSize = 24 + Math.random() * 28 + 'px';
        petal.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
        petal.style.animationDelay = Math.random() * 0.5 + 's';
        layer.appendChild(petal);
        setTimeout(() => petal.remove(), 4200);
    }
}

function finishPlay() {
    const earned = APP.play.earned;
    if (APP.play.onFinish) APP.play.onFinish(earned);
    document.getElementById('result-flowers').textContent = earned;
    const garden = document.getElementById('result-garden');
    garden.innerHTML = '';
    for (let i = 0; i < earned; i++) {
        const f = document.createElement('span');
        f.textContent = pickOne(REWARD_FLOWERS);
        f.style.animationDelay = i * 0.12 + 's';
        garden.appendChild(f);
    }
    show('result');
    Sfx.fanfare();
    rainPetals(30);
    say(LINES.result(earned));
}

// ============================================
// SỰ KIỆN
// ============================================

function setupEvents() {
    document.getElementById('btn-start').addEventListener('click', () => {
        Sfx.unlock();
        Voice.unlock();
        Sfx.pop();
        show('home');
        say(LINES.greeting);
    });

    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', () => {
            Sfx.pop();
            show(btn.dataset.back);
        });
    });

    document.getElementById('btn-mode-learn').addEventListener('click', () => { Sfx.pop(); APP.topic.lop1 ? Lop1.learn() : startLearn(); });
    document.getElementById('btn-mode-play').addEventListener('click', () => { Sfx.pop(); APP.topic.lop1 ? Lop1.play() : startPlay(); });

    document.getElementById('learn-card').addEventListener('click', () => sayItem(APP.topic.items[APP.learn.index], true));
    document.getElementById('btn-learn-speak').addEventListener('click', () => sayItem(APP.topic.items[APP.learn.index], true));
    document.getElementById('btn-learn-prev').addEventListener('click', () => moveLearn(-1));
    document.getElementById('btn-learn-next').addEventListener('click', () => moveLearn(1));

    let touchX = null;
    const learnArea = document.querySelector('.learn-area');
    learnArea.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    learnArea.addEventListener('touchend', e => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 60) moveLearn(dx < 0 ? 1 : -1);
    });

    document.getElementById('play-prompt').addEventListener('click', () => {
        if (APP.play && !APP.play.locked) speakPrompt();
    });

    document.getElementById('btn-result-again').addEventListener('click', () => { Sfx.pop(); APP.replay(); });
    document.getElementById('btn-result-home').addEventListener('click', () => { Sfx.pop(); show('home'); });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) Voice.stop();
    });
}

async function init() {
    await openDB();
    await loadSettings();
    await loadTopics();
    (await dbGetAll('voices')).forEach(v => Voice.overrides.set(v.text, v.audio));
    if (typeof Lop1 !== 'undefined') await Lop1.init();
    Voice.init();
    renderFlowers();
    renderTopics();
    setupEvents();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}

init();
