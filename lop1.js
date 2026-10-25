// ============================================
// TIẾNG VIỆT LỚP 1: HỌC ÂM, DẤU, ĐÁNH VẦN
// ============================================

const TONE_PATHS = {
    ngang: '<path d="M22 50 H78" stroke-dasharray="6 8" opacity="0.45"/>',
    'huyền': '<path d="M32 22 L68 78"/>',
    'sắc': '<path d="M32 78 L68 22"/>',
    'hỏi': '<path d="M34 34 C34 14 66 12 66 32 C66 46 50 46 50 62"/>',
    'ngã': '<path d="M14 58 C26 30 42 34 50 50 C58 66 74 70 86 42"/>',
    'nặng': '<circle cx="50" cy="50" r="13" fill="currentColor" stroke="none"/>'
};

function toneIcon(tone) {
    return '<svg class="tone-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">' + TONE_PATHS[tone] + '</svg>';
}

const Lop1 = {
    lesson: null,
    cards: [],
    index: 0,
    done: {},

    async init() {
        const saved = await dbGet('settings', 'lop1');
        if (saved) this.done = saved.value.done || {};
        this.bindEvents();
    },

    saveProgress() {
        return dbPut('settings', { key: 'lop1', value: { done: this.done } });
    },

    // ---------- Trang chủ và danh sách bài ----------

    homeCard(grid) {
        const card = document.createElement('button');
        card.className = 'topic-card';
        card.style.background = '#26A69A';
        card.dataset.testid = 'card-topic-lop1';
        card.innerHTML = '<span class="topic-icon">✏️</span><span class="topic-name">Lớp 1: Tiếng Việt</span><span class="topic-count"></span>';
        card.querySelector('.topic-count').textContent = LOP1_LESSONS.length + ' bài';
        card.addEventListener('click', () => { Sfx.pop(); this.openList(); });
        grid.appendChild(card);
    },

    openList() {
        const list = document.getElementById('l1-lesson-list');
        list.innerHTML = '';
        LOP1_LESSONS.forEach(lesson => {
            const btn = document.createElement('button');
            btn.className = 'l1-lesson' + (lesson.on ? ' is-review' : '') + (this.done[lesson.so] ? ' is-done' : '');
            btn.dataset.testid = 'btn-l1-lesson-' + lesson.so;
            btn.innerHTML = '<span class="l1-lesson-no"></span><span class="l1-lesson-name"></span><span class="l1-lesson-mark"></span>';
            btn.querySelector('.l1-lesson-no').textContent = 'Bài ' + lesson.so;
            btn.querySelector('.l1-lesson-name').textContent = lesson.ten;
            btn.querySelector('.l1-lesson-mark').textContent = this.done[lesson.so] ? '🌸' : '';
            btn.addEventListener('click', () => this.openLesson(lesson));
            list.appendChild(btn);
        });
        show('l1-lessons');
        say(LOP1_LINES.list);
    },

    openLesson(lesson) {
        Sfx.pop();
        this.lesson = lesson;
        const letters = lop1LessonLetters(lesson);
        APP.topic = { lop1: true, name: 'Bài ' + lesson.so + ': ' + lesson.ten };
        document.getElementById('topic-title').textContent = APP.topic.name;
        document.getElementById('topic-big-icon').textContent = lesson.on ? '📖' : (letters.length ? this.letterPair(letters[0]) : '✍️');
        document.querySelector('[data-testid="btn-topic-back"]').dataset.back = 'l1-lessons';
        show('topic');
        say(lesson.doc + ' ' + LOP1_LINES.askOrPlay);
    },

    letterPair(letter) {
        if (letter.length > 2 || ['ia', 'ua', 'ưa'].includes(letter)) return letter;
        return letter.charAt(0).toUpperCase() + letter.slice(1) + ' ' + letter;
    },

    // ---------- Học ----------

    buildCards(lesson) {
        const cards = [];
        lop1LessonLetters(lesson).forEach(l => cards.push({ type: 'chu', letter: l }));
        lop1LessonTones(lesson).forEach(t => cards.push({ type: 'dau', tone: t }));
        lop1LessonWords(lesson).forEach(w => cards.push({ type: 'tu', word: w }));
        return cards;
    },

    learn() {
        this.cards = this.buildCards(this.lesson);
        this.index = 0;
        show('l1-learn');
        this.renderCard();
    },

    move(step) {
        const next = this.index + step;
        if (next < 0 || next >= this.cards.length) return;
        this.index = next;
        Sfx.pop();
        this.renderCard();
    },

    renderCard() {
        const card = this.cards[this.index];
        document.getElementById('l1-pos').textContent = this.index + 1;
        document.getElementById('l1-total').textContent = this.cards.length;
        document.getElementById('btn-l1-prev').disabled = this.index === 0;
        document.getElementById('btn-l1-next').disabled = this.index === this.cards.length - 1;

        const pic = document.getElementById('l1-pic');
        const steps = document.getElementById('l1-steps');
        const big = document.getElementById('l1-big');
        const sub = document.getElementById('l1-sub');
        pic.textContent = '';
        steps.innerHTML = '';
        big.className = 'l1-big';
        sub.textContent = '';

        if (card.type === 'chu') {
            big.textContent = this.letterPair(card.letter);
            big.classList.add('is-letter');
            sub.textContent = 'đọc là: ' + LOP1_SOUNDS[card.letter];
        } else if (card.type === 'dau') {
            big.innerHTML = toneIcon(card.tone);
            big.classList.add('is-tone');
            sub.textContent = 'dấu ' + card.tone;
        } else {
            pic.textContent = LOP1_PICS[card.word] || '';
            big.textContent = card.word;
            this.renderSteps(steps, lop1WordSteps(card.word));
        }

        const el = document.getElementById('l1-card');
        el.classList.remove('flip');
        void el.offsetWidth;
        el.classList.add('flip');
        this.speakCard();
    },

    renderSteps(box, steps) {
        steps.forEach((st, i) => {
            if (i > 0) {
                const prev = steps[i - 1];
                const sep = document.createElement('span');
                sep.className = 'l1-sep';
                if (st.kind === 'am' && prev.kind !== 'am') sep.className += ' is-gap';
                else sep.textContent = (st.kind === 'ghep' || st.kind === 'tieng') ? '→' : '+';
                box.appendChild(sep);
            }
            const chip = document.createElement('span');
            chip.className = 'l1-chip kind-' + st.kind;
            if (st.kind === 'dau') {
                chip.innerHTML = toneIcon(st.say) + '<small></small>';
                chip.querySelector('small').textContent = st.say;
            } else {
                chip.textContent = st.show;
            }
            box.appendChild(chip);
        });
    },

    speakCard() {
        const card = this.cards[this.index];
        if (card.type === 'chu') return say(LOP1_SOUNDS[card.letter]);
        if (card.type === 'dau') return say(lop1ToneName(card.tone));
        return this.speakSpelling(card.word);
    },

    // Đọc đánh vần và sáng lần lượt từng bước theo giọng đọc.
    async speakSpelling(word) {
        const text = lop1SpellText(word);
        const steps = lop1WordSteps(word);
        const chips = [...document.querySelectorAll('#l1-steps .l1-chip')];
        const weights = steps.map(st => st.say.length + 3);
        const total = weights.reduce((a, b) => a + b, 0);
        const bounds = [];
        weights.reduce((acc, w) => { bounds.push((acc + w) / total); return acc + w; }, 0);

        Voice.stop();
        const token = Voice.token;
        const hasClip = !!(Voice.overrides.get(text) || (typeof VOICE_CLIPS !== 'undefined' && VOICE_CLIPS[text]));
        const started = performance.now();
        const estimate = 900 + text.length * 85;
        let finished = false;

        const paint = () => {
            if (token !== Voice.token) return;
            let frac;
            if (finished) frac = 1;
            else if (hasClip) {
                const a = Voice.audio;
                frac = (!a.paused && a.duration) ? a.currentTime / a.duration : -1;
            } else {
                frac = (performance.now() - started) / estimate;
            }
            const current = frac < 0 ? -1 : bounds.findIndex(b => frac < b);
            chips.forEach((chip, i) => {
                chip.classList.toggle('lit', frac >= 1 || (current >= 0 && i < current));
                chip.classList.toggle('now', current === i);
            });
            if (!finished) requestAnimationFrame(paint);
        };
        requestAnimationFrame(paint);
        await Voice.speak(text);
        finished = true;
        paint();
    },

    // ---------- Chơi ----------

    learnedUpTo(so) {
        const lessons = LOP1_LESSONS.filter(l => l.so <= so);
        return {
            words: [...new Set(lessons.flatMap(l => l.on ? [] : l.tu))],
            letters: [...new Set(lessons.flatMap(l => l.moi || []))],
            tones: ['ngang', ...new Set(lessons.flatMap(l => l.dau || []))]
        };
    },

    buildQuestions() {
        const lesson = this.lesson;
        const learned = this.learnedUpTo(lesson.so);
        const words = lop1LessonWords(lesson);
        const groups = {
            nghe: shuffle(words).map(w => ({ kind: 'nghe', word: w })),
            van: shuffle(words).map(w => ({ kind: 'van', word: w })),
            chu: shuffle(lop1LessonLetters(lesson)).map(l => ({ kind: 'chu', letter: l })),
            dau: learned.tones.length > 1 ? shuffle(words.filter(w => !w.includes(' '))).map(w => ({ kind: 'dau', word: w })) : []
        };
        const order = shuffle(Object.keys(groups).filter(k => groups[k].length));
        const out = [];
        const rounds = APP.settings.rounds;
        let k = 0;
        while (out.length < rounds) {
            const g = groups[order[k % order.length]];
            const q = g.shift();
            if (q) { out.push(q); g.push(q); }
            k++;
        }
        return out;
    },

    similarity(a, b) {
        const x = lop1Syllable(a.split(' ').pop());
        const y = lop1Syllable(b.split(' ').pop());
        return (x.base === y.base ? 3 : 0) + (x.onset === y.onset ? 1 : 0) + (x.rhyme === y.rhyme ? 1 : 0) + (x.tone === y.tone ? 0.5 : 0);
    },

    pickWords(target, count) {
        const learned = this.learnedUpTo(this.lesson.so).words.filter(w => w !== target);
        const filler = ['o', 'e', 'ô', 'ơ', 'i', 'u', 'ư'].filter(w => w !== target && !learned.includes(w));
        const ranked = shuffle(learned).sort((a, b) => this.similarity(target, b) - this.similarity(target, a));
        const picked = shuffle(ranked.slice(0, count + 2)).slice(0, count);
        return picked.concat(filler.slice(0, count - picked.length));
    },

    makeOptions(q) {
        const n = APP.settings.options;
        if (q.kind === 'chu') {
            const learned = this.learnedUpTo(this.lesson.so).letters.filter(l => l !== q.letter);
            const others = shuffle(learned.length >= n - 1 ? learned : Object.keys(LOP1_SOUNDS).filter(l => l !== q.letter)).slice(0, n - 1);
            return [q.letter, ...others].map(v => ({ kind: 'chu', value: v }));
        }
        if (q.kind === 'dau') {
            const target = lop1Syllable(q.word).tone;
            const learned = this.learnedUpTo(this.lesson.so).tones.filter(t => t !== target);
            const extra = Object.keys(LOP1_TONE_SAMPLE).filter(t => t !== target && !learned.includes(t));
            const others = [...shuffle(learned), ...shuffle(extra)].slice(0, n - 1);
            return [target, ...others].map(v => ({ kind: 'dau', value: v }));
        }
        return [q.word, ...this.pickWords(q.word, n - 1)].map(v => ({ kind: 'tu', value: v }));
    },

    play() {
        APP.play = {
            queue: this.buildQuestions(), index: 0, earned: 0, locked: false, alive: true,
            sayPrompt: () => this.sayPrompt(),
            next: () => this.showQuestion(),
            onFinish: () => {
                this.done[this.lesson.so] = true;
                this.saveProgress();
            }
        };
        APP.replay = () => this.play();
        show('play');
        renderProgress();
        this.showQuestion();
    },

    showQuestion() {
        const p = APP.play;
        const q = p.queue[p.index];
        const options = this.makeOptions(q);
        const target = options[0];
        p.question = q;
        p.target = target;
        p.locked = false;

        const labels = { nghe: 'Nghe và chọn tiếng đúng', van: 'Nghe đánh vần, chọn tiếng đúng', chu: 'Nghe và chọn chữ đúng', dau: 'Tiếng này có dấu gì?' };
        document.getElementById('play-prompt-text').textContent = labels[q.kind];

        const grid = document.getElementById('play-options');
        const shown = shuffle(options);
        grid.className = 'play-options n' + shown.length;
        grid.innerHTML = '';
        shown.forEach((item, i) => {
            const btn = document.createElement('button');
            btn.className = 'option option-l1';
            btn.dataset.testid = 'btn-option-' + i;
            btn.setAttribute('aria-label', item.value);
            if (item.kind === 'dau') {
                btn.innerHTML = '<span class="l1-opt-tone">' + toneIcon(item.value) + '</span><span class="l1-opt-label"></span>';
                btn.querySelector('.l1-opt-label').textContent = item.value === 'ngang' ? 'không dấu' : item.value;
            } else {
                const span = document.createElement('span');
                span.className = 'l1-opt-text' + (item.value.length > 4 ? ' is-long' : '');
                span.textContent = item.value;
                btn.appendChild(span);
            }
            btn.addEventListener('click', () => answer(btn, item));
            grid.appendChild(btn);
        });
        speakPrompt();
    },

    async sayPrompt() {
        const q = APP.play.question;
        Voice.stop();
        const token = Voice.token;
        if (q.kind === 'nghe') return Voice.speak(lop1TouchLine(q.word));
        if (q.kind === 'chu') return Voice.speak(lop1LetterLine(q.letter));
        if (q.kind === 'dau') return Voice.speak(lop1ToneLine(q.word));
        await Voice.speak(lop1SpellText(q.word));
        if (token === Voice.token) await Voice.speak(LOP1_LINES.guess);
    },

    // ---------- Khu bố mẹ: nghe thử và ghi âm thay giọng ----------

    recorder: null,

    phrasesOf(lesson) {
        const rows = [{ text: lesson.doc + ' ' + LOP1_LINES.askOrPlay, label: 'Lời giới thiệu bài' }];
        lop1LessonLetters(lesson).forEach(l => rows.push({ text: LOP1_SOUNDS[l], label: 'Âm ' + l }));
        lop1LessonTones(lesson).forEach(t => rows.push({ text: lop1ToneName(t), label: 'Dấu ' + t }));
        lop1LessonWords(lesson).forEach(w => {
            rows.push({ text: w, label: 'Tiếng: ' + w });
            rows.push({ text: lop1SpellText(w), label: 'Đánh vần: ' + w });
        });
        return rows;
    },

    renderVoicePanel() {
        const select = document.getElementById('l1-voice-lesson');
        if (!select.options.length) {
            LOP1_LESSONS.forEach(l => {
                const opt = document.createElement('option');
                opt.value = l.so;
                opt.textContent = 'Bài ' + l.so + ': ' + l.ten;
                select.appendChild(opt);
            });
        }
        const lesson = LOP1_LESSONS.find(l => l.so === Number(select.value)) || LOP1_LESSONS[0];
        const list = document.getElementById('l1-voice-list');
        list.innerHTML = '';
        this.phrasesOf(lesson).forEach((row, i) => {
            const own = Voice.overrides.has(row.text);
            const el = document.createElement('div');
            el.className = 'l1-voice-row';
            el.dataset.testid = 'row-l1-voice-' + i;
            el.innerHTML = '<div class="custom-info"><div class="custom-name"></div><div class="custom-sub"></div></div><div class="custom-actions"></div>';
            el.querySelector('.custom-name').textContent = row.label;
            el.querySelector('.custom-sub').textContent = (own ? '🎙️ Giọng bố mẹ · ' : '🤖 Giọng AI · ') + row.text;

            const actions = el.querySelector('.custom-actions');
            const play = document.createElement('button');
            play.textContent = '▶';
            play.setAttribute('aria-label', 'Nghe');
            play.dataset.testid = 'btn-l1-voice-play-' + i;
            play.addEventListener('click', () => { Sfx.unlock(); say(row.text); });

            const rec = document.createElement('button');
            rec.textContent = '🎙️';
            rec.setAttribute('aria-label', 'Ghi âm thay');
            rec.dataset.testid = 'btn-l1-voice-record-' + i;
            rec.addEventListener('click', () => this.toggleRecord(rec, row.text));

            actions.append(play, rec);
            if (own) {
                const reset = document.createElement('button');
                reset.textContent = '↺';
                reset.setAttribute('aria-label', 'Về giọng AI');
                reset.dataset.testid = 'btn-l1-voice-reset-' + i;
                reset.addEventListener('click', async () => {
                    await dbDelete('voices', row.text);
                    Voice.overrides.delete(row.text);
                    this.renderVoicePanel();
                    toast('Đã trả về giọng AI');
                });
                actions.appendChild(reset);
            }
            list.appendChild(el);
        });
    },

    async toggleRecord(btn, text) {
        if (this.recorder) {
            if (this.recorder.state !== 'inactive') this.recorder.stop();
            return;
        }
        if (!navigator.mediaDevices || !window.MediaRecorder) { toast('Máy này không ghi âm được'); return; }
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
            toast('Cần cho phép dùng micro để ghi âm');
            return;
        }
        Voice.stop();
        const chunks = [];
        const recorder = new MediaRecorder(stream);
        this.recorder = recorder;
        recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
        recorder.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            clearTimeout(this.stopTimer);
            this.recorder = null;
            const reader = new FileReader();
            reader.onload = async () => {
                await dbPut('voices', { text, audio: reader.result, updatedAt: Date.now() });
                Voice.overrides.set(text, reader.result);
                this.renderVoicePanel();
                toast('Đã lưu giọng bố mẹ. Bấm ▶ để nghe lại.');
            };
            reader.readAsDataURL(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
        };
        recorder.start();
        btn.textContent = '⏹';
        btn.classList.add('recording');
        this.stopTimer = setTimeout(() => recorder.state !== 'inactive' && recorder.stop(), 15000);
        toast('Đang ghi âm… đọc xong bấm ⏹ (tối đa 15 giây)');
    },

    // ---------- Sự kiện ----------

    bindEvents() {
        document.getElementById('btn-l1-prev').addEventListener('click', () => this.move(-1));
        document.getElementById('btn-l1-next').addEventListener('click', () => this.move(1));
        document.getElementById('l1-card').addEventListener('click', () => this.speakCard());
        document.getElementById('btn-l1-speak').addEventListener('click', () => this.speakCard());

        let touchX = null;
        const area = document.querySelector('#screen-l1-learn .learn-area');
        area.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
        area.addEventListener('touchend', e => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            touchX = null;
            if (Math.abs(dx) > 60) this.move(dx < 0 ? 1 : -1);
        });

        document.getElementById('l1-voice-lesson').addEventListener('change', () => this.renderVoicePanel());
        document.getElementById('btn-parent').addEventListener('click', () => this.renderVoicePanel());
    }
};
