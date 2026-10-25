// Tiếng Việt lớp 1 (bộ Kết nối tri thức) - phần âm và dấu thanh, Bài 1-30.
// Từ ví dụ do app soạn, chỉ dùng chữ và dấu bé đã học tới bài đó.

const LOP1_LESSONS = [
    { so: 1, ten: 'A a', doc: 'Bài một. Chữ a.', moi: ['a'], tu: ['a'] },
    { so: 2, ten: 'B b, dấu huyền', doc: 'Bài hai. Chữ bờ và dấu huyền.', moi: ['b'], dau: ['huyền'], tu: ['ba', 'bà', 'à'] },
    { so: 3, ten: 'C c, dấu sắc', doc: 'Bài ba. Chữ cờ và dấu sắc.', moi: ['c'], dau: ['sắc'], tu: ['ca', 'cá', 'cà', 'bá', 'á'] },
    { so: 4, ten: 'E e, Ê ê', doc: 'Bài bốn. Chữ e và chữ ê.', moi: ['e', 'ê'], tu: ['be', 'bé', 'bè', 'bê', 'bế', 'bề'] },
    { so: 5, ten: 'Ôn tập', doc: 'Bài năm. Ôn tập.', on: [2, 3, 4] },
    { so: 6, ten: 'O o, dấu hỏi', doc: 'Bài sáu. Chữ o và dấu hỏi.', moi: ['o'], dau: ['hỏi'], tu: ['bò', 'cỏ', 'cò', 'có', 'bó', 'bỏ', 'cả', 'bể'] },
    { so: 7, ten: 'Ô ô, dấu nặng', doc: 'Bài bảy. Chữ ô và dấu nặng.', moi: ['ô'], dau: ['nặng'], tu: ['bố', 'cô', 'cổ', 'bộ', 'cọ', 'bệ'] },
    { so: 8, ten: 'D d, Đ đ', doc: 'Bài tám. Chữ dờ và chữ đờ.', moi: ['d', 'đ'], tu: ['da', 'dê', 'dế', 'đá', 'đỏ', 'đồ', 'đò', 'đế'] },
    { so: 9, ten: 'Ơ ơ, dấu ngã', doc: 'Bài chín. Chữ ơ và dấu ngã.', moi: ['ơ'], dau: ['ngã'], tu: ['bơ', 'cờ', 'bờ', 'đỗ', 'dỗ', 'cỗ'] },
    { so: 10, ten: 'Ôn tập', doc: 'Bài mười. Ôn tập.', on: [6, 7, 8, 9] },
    { so: 11, ten: 'I i, K k', doc: 'Bài mười một. Chữ i và chữ ca.', moi: ['i', 'k'], tu: ['bi', 'bí', 'đi', 'dì', 'kẻ', 'kê', 'kì', 'kể'] },
    { so: 12, ten: 'H h, L l', doc: 'Bài mười hai. Chữ hờ và chữ lờ.', moi: ['h', 'l'], tu: ['hổ', 'hồ', 'hè', 'lá', 'lê', 'lọ', 'lò'] },
    { so: 13, ten: 'U u, Ư ư', doc: 'Bài mười ba. Chữ u và chữ ư.', moi: ['u', 'ư'], tu: ['củ', 'bú', 'hũ', 'cũ', 'dữ', 'cử', 'đu đủ'] },
    { so: 14, ten: 'Ch ch, Kh kh', doc: 'Bài mười bốn. Chữ chờ và chữ khờ.', moi: ['ch', 'kh'], tu: ['chó', 'chè', 'chợ', 'chú', 'khế', 'khỉ', 'kho', 'khô'] },
    { so: 15, ten: 'Ôn tập', doc: 'Bài mười lăm. Ôn tập.', on: [11, 12, 13, 14] },
    { so: 16, ten: 'M m, N n', doc: 'Bài mười sáu. Chữ mờ và chữ nờ.', moi: ['m', 'n'], tu: ['mẹ', 'mũ', 'mè', 'me', 'mì', 'nơ', 'na', 'nụ'] },
    { so: 17, ten: 'G g, Gi gi', doc: 'Bài mười bảy. Chữ gờ và chữ di.', moi: ['g', 'gi'], tu: ['gà', 'gỗ', 'gõ', 'giỏ', 'giá', 'gió'] },
    { so: 18, ten: 'Gh gh, Nh nh', doc: 'Bài mười tám. Chữ gờ kép và chữ nhờ.', moi: ['gh', 'nh'], tu: ['ghế', 'ghẹ', 'ghi', 'nhà', 'nho', 'nhỏ', 'nhớ'] },
    { so: 19, ten: 'Ng ng, Ngh ngh', doc: 'Bài mười chín. Chữ ngờ và chữ ngờ kép.', moi: ['ng', 'ngh'], tu: ['ngô', 'ngủ', 'ngõ', 'ngã', 'nghé', 'nghe', 'nghỉ'] },
    { so: 20, ten: 'Ôn tập', doc: 'Bài hai mươi. Ôn tập.', on: [16, 17, 18, 19] },
    { so: 21, ten: 'R r, S s', doc: 'Bài hai mươi mốt. Chữ rờ và chữ sờ.', moi: ['r', 's'], tu: ['rổ', 'rễ', 'rá', 'rẽ', 'sò', 'sẻ', 'số', 'sư'] },
    { so: 22, ten: 'T t, Tr tr', doc: 'Bài hai mươi hai. Chữ tờ và chữ trờ.', moi: ['t', 'tr'], tu: ['tô', 'tủ', 'tơ', 'tre', 'trà', 'trê', 'trẻ'] },
    { so: 23, ten: 'Th th, ia', doc: 'Bài hai mươi ba. Chữ thờ và vần ia.', moi: ['th', 'ia'], tu: ['thỏ', 'thư', 'thợ', 'mía', 'tía', 'kìa', 'chia'] },
    { so: 24, ten: 'ua, ưa', doc: 'Bài hai mươi bốn. Vần ua và vần ưa.', moi: ['ua', 'ưa'], tu: ['cua', 'rùa', 'mua', 'dưa', 'mưa', 'ngựa', 'sữa', 'cửa'] },
    { so: 25, ten: 'Ôn tập', doc: 'Bài hai mươi lăm. Ôn tập.', on: [21, 22, 23, 24] },
    { so: 26, ten: 'Ph ph, Qu qu', doc: 'Bài hai mươi sáu. Chữ phờ và chữ quờ.', moi: ['ph', 'qu'], tu: ['phở', 'phố', 'pha', 'quả', 'quê', 'quạ'] },
    { so: 27, ten: 'V v, X x', doc: 'Bài hai mươi bảy. Chữ vờ và chữ xờ.', moi: ['v', 'x'], tu: ['vở', 'vẽ', 'vé', 'ví', 'xe', 'xô', 'xa', 'vua'] },
    { so: 28, ten: 'Y y', doc: 'Bài hai mươi tám. Chữ i dài.', moi: ['y'], tu: ['ý', 'quý', 'ly', 'kỳ', 'y tá'] },
    { so: 29, ten: 'Luyện tập chính tả', doc: 'Bài hai mươi chín. Luyện tập chính tả: cờ và ca, gờ và gờ kép, ngờ và ngờ kép.', tu: ['cá', 'kẻ', 'cỏ', 'kê', 'gà', 'ghế', 'gỗ', 'ghi', 'ngô', 'nghé', 'ngõ', 'nghỉ'] },
    { so: 30, ten: 'Ôn tập', doc: 'Bài ba mươi. Ôn tập.', on: [26, 27, 28] }
];

const LOP1_PICS = {
    'cá': '🐟', 'cà': '🍆', 'bé': '👶', 'bò': '🐄', 'cỏ': '🌿', 'bố': '👨', 'cô': '👩', 'dê': '🐐', 'dế': '🦗',
    'bơ': '🥑', 'cờ': '🚩', 'bí': '🎃', 'hổ': '🐯', 'lá': '🍃', 'lê': '🍐', 'chó': '🐶', 'khỉ': '🐵', 'mẹ': '👩',
    'mũ': '🧢', 'nơ': '🎀', 'mì': '🍜', 'gà': '🐔', 'gió': '🌬️', 'giỏ': '🧺', 'ghế': '🪑', 'nhà': '🏠', 'nho': '🍇',
    'ngô': '🌽', 'ngủ': '😴', 'trà': '🍵', 'thỏ': '🐰', 'thư': '✉️', 'cua': '🦀', 'rùa': '🐢', 'dưa': '🍉', 'mưa': '🌧️',
    'ngựa': '🐴', 'sữa': '🥛', 'phở': '🍜', 'vở': '📒', 'vẽ': '🎨', 'xe': '🚗', 'vua': '👑', 'bà': '👵', 'ly': '🥛'
};

const LOP1_SOUNDS = {
    a: 'a', b: 'bờ', c: 'cờ', ch: 'chờ', d: 'dờ', 'đ': 'đờ', e: 'e', 'ê': 'ê', g: 'gờ', gh: 'gờ kép', gi: 'di',
    h: 'hờ', i: 'i', k: 'ca', kh: 'khờ', l: 'lờ', m: 'mờ', n: 'nờ', ng: 'ngờ', ngh: 'ngờ kép', nh: 'nhờ',
    o: 'o', 'ô': 'ô', 'ơ': 'ơ', p: 'pờ', ph: 'phờ', qu: 'quờ', r: 'rờ', s: 'sờ', t: 'tờ', th: 'thờ', tr: 'trờ',
    u: 'u', 'ư': 'ư', v: 'vờ', x: 'xờ', y: 'i dài', ia: 'ia', ua: 'ua', 'ưa': 'ưa'
};

// Âm vần khi đánh vần (y đứng làm vần đọc là "i").
const LOP1_RHYME_SOUNDS = { ...LOP1_SOUNDS, y: 'i' };

const LOP1_TONES = {
    '̀': 'huyền', '́': 'sắc', '̉': 'hỏi', '̃': 'ngã', '̣': 'nặng'
};
const LOP1_TONE_SAMPLE = { ngang: 'a', 'huyền': 'à', 'sắc': 'á', 'hỏi': 'ả', 'ngã': 'ã', 'nặng': 'ạ' };

const LOP1_ONSETS = ['ngh', 'ng', 'nh', 'ch', 'kh', 'gh', 'gi', 'ph', 'qu', 'th', 'tr',
    'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x'];

const LOP1_LINES = {
    list: 'Tiếng Việt lớp một. Con chọn bài nhé.',
    guess: 'Đố con, đó là tiếng nào?',
    askOrPlay: 'Con muốn học hay chơi?'
};

function lop1Syllable(text) {
    const word = text.normalize('NFC').toLowerCase();
    let tone = 'ngang';
    let toneMark = '';
    const nfd = word.normalize('NFD');
    for (const ch of nfd) if (LOP1_TONES[ch]) { tone = LOP1_TONES[ch]; toneMark = ch; }
    const base = (toneMark ? nfd.replace(toneMark, '') : nfd).normalize('NFC');

    let onset = LOP1_ONSETS.find(o => base.startsWith(o) && base.length > o.length) || '';
    if (!onset && base === 'gi') onset = 'gi';
    let rhyme = base.slice(onset.length);
    if (onset === 'gi' && !rhyme) rhyme = 'i';
    return { word, base, onset, rhyme, tone };
}

// Các bước đánh vần một tiếng: [{ show, say }].
function lop1SpellSteps(text) {
    const s = lop1Syllable(text);
    const steps = [];
    if (s.onset) steps.push({ show: s.onset, say: LOP1_SOUNDS[s.onset], kind: 'am' });
    steps.push({ show: s.rhyme, say: LOP1_RHYME_SOUNDS[s.rhyme] || s.rhyme, kind: 'am' });
    if (s.onset) steps.push({ show: s.base, say: s.base, kind: 'ghep' });
    if (s.tone !== 'ngang') {
        steps.push({ show: LOP1_TONE_SAMPLE[s.tone], say: s.tone, kind: 'dau' });
        steps.push({ show: s.word, say: s.word, kind: 'tieng' });
    }
    return steps;
}

function lop1WordSteps(word) {
    const syllables = word.split(' ');
    const steps = [];
    syllables.forEach(syl => lop1SpellSteps(syl).forEach(st => steps.push(st)));
    if (syllables.length > 1) steps.push({ show: word, say: word, kind: 'tieng' });
    return steps;
}

function lop1SpellText(word) {
    const syllables = word.split(' ');
    const parts = syllables.map(syl => lop1SpellSteps(syl).map(st => st.say).join(', '));
    if (syllables.length > 1) parts.push(word);
    return parts.join('. ') + '.';
}

function lop1TouchLine(word) {
    return 'Con hãy chạm vào ' + (word.includes(' ') ? 'từ ' : 'tiếng ') + word;
}

function lop1ToneLine(word) {
    return 'Tiếng ' + word + ' có dấu gì?';
}

function lop1LetterLine(letter) {
    return 'Con hãy chạm vào chữ ' + LOP1_SOUNDS[letter];
}

function lop1ToneName(tone) {
    return tone === 'ngang' ? 'không dấu' : 'dấu ' + tone;
}

// Mọi tiếng của một bài (bài ôn tập gom từ các bài được ôn).
function lop1LessonWords(lesson) {
    if (lesson.on) return lesson.on.flatMap(so => LOP1_LESSONS.find(l => l.so === so).tu);
    return lesson.tu;
}

function lop1LessonLetters(lesson) {
    if (lesson.on) return lesson.on.flatMap(so => LOP1_LESSONS.find(l => l.so === so).moi || []);
    return lesson.moi || [];
}

function lop1LessonTones(lesson) {
    if (lesson.on) return lesson.on.flatMap(so => LOP1_LESSONS.find(l => l.so === so).dau || []);
    return lesson.dau || [];
}

// Mọi câu đọc của phần lớp 1, để tạo sẵn giọng.
function lop1AllPhrases() {
    const out = new Set([LOP1_LINES.list, LOP1_LINES.guess]);
    Object.keys(LOP1_TONE_SAMPLE).forEach(t => out.add(lop1ToneName(t)));
    LOP1_LESSONS.forEach(lesson => {
        out.add(lesson.doc + ' ' + LOP1_LINES.askOrPlay);
        lop1LessonLetters(lesson).forEach(l => { out.add(LOP1_SOUNDS[l]); out.add(lop1LetterLine(l)); });
        lop1LessonWords(lesson).forEach(w => {
            out.add(w);
            out.add(lop1SpellText(w));
            out.add(lop1TouchLine(w));
            out.add(lop1ToneLine(w));
        });
    });
    return [...out];
}
