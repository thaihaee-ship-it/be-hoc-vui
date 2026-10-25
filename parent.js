// ============================================
// KHU BỐ MẸ
// ============================================

const TOPIC_COLORS = ['#FF8A65', '#BA68C8', '#4DB6AC', '#64B5F6', '#81C784', '#FFB74D', '#F48FB1', '#7986CB', '#A1887F', '#4FC3F7'];

const Editor = { editingId: null, image: null, audio: null, recorder: null, stopTimer: null };

// ---------- Cổng bố mẹ ----------

function openGate() {
    const a = 2 + Math.floor(Math.random() * 6);
    const b = 2 + Math.floor(Math.random() * 6);
    const right = a + b;
    const choices = new Set([right]);
    while (choices.size < 3) choices.add(right + Math.floor(Math.random() * 7) - 3);

    document.getElementById('gate-question').textContent = a + ' + ' + b + ' = ?';
    const box = document.getElementById('gate-answers');
    box.innerHTML = '';
    shuffle([...choices]).forEach(n => {
        const btn = document.createElement('button');
        btn.textContent = n;
        btn.dataset.testid = 'btn-gate-' + n;
        btn.addEventListener('click', () => {
            document.getElementById('modal-gate').hidden = true;
            if (n === right) openParent();
            else toast('Chưa đúng, khu này dành cho bố mẹ nhé!');
        });
        box.appendChild(btn);
    });
    document.getElementById('modal-gate').hidden = false;
}

function openParent() {
    fillSettings();
    renderVoiceStatus();
    renderCustomList();
    show('parent');
}

// ---------- Cài đặt ----------

function fillSettings() {
    const s = APP.settings;
    document.getElementById('set-rounds').value = String(s.rounds);
    document.getElementById('set-options').value = String(s.options);
    document.getElementById('set-rate').value = String(s.rate);
    document.getElementById('set-guide').checked = s.guide;
}

function bindSettings() {
    const bind = (id, key, parse) => {
        document.getElementById(id).addEventListener('change', e => {
            APP.settings[key] = parse(e.target);
            saveSettings();
            toast('Đã lưu');
        });
    };
    bind('set-rounds', 'rounds', el => Number(el.value));
    bind('set-options', 'options', el => Number(el.value));
    bind('set-rate', 'rate', el => Number(el.value));
    bind('set-guide', 'guide', el => el.checked);
}

function renderVoiceStatus() {
    const el = document.getElementById('voice-status');
    const base = 'Bài có sẵn dùng giọng nam Nam Minh. Hình bố mẹ thêm: nếu có ghi âm thì phát giọng bố mẹ, nếu không thì dùng giọng máy của điện thoại. ';
    if (!('speechSynthesis' in window)) {
        el.textContent = base + 'Máy này không có giọng máy, bố mẹ nhớ ghi âm cho hình mới nhé.';
    } else if (Voice.voice) {
        el.textContent = base + '✅ Giọng máy tiếng Việt: ' + Voice.voice.name;
    } else {
        el.textContent = base + '⚠️ Chưa thấy giọng máy tiếng Việt. Android: Cài đặt → Hệ thống → Ngôn ngữ → Chuyển văn bản thành giọng nói → tải "Tiếng Việt". iPhone/iPad: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt.';
    }
}

// ---------- Danh sách hình của bố mẹ ----------

function renderCustomList() {
    const list = document.getElementById('custom-list');
    list.innerHTML = '';
    let total = 0;

    APP.topics.forEach(topic => {
        const items = topic.items.filter(it => it.custom);
        if (!items.length && topic.builtin) return;

        const title = document.createElement('div');
        title.className = 'custom-group-title';
        title.textContent = topic.icon + ' ' + topic.name + (topic.builtin ? '' : ' (chủ đề của bố mẹ)');
        list.appendChild(title);

        if (!topic.builtin) {
            const del = document.createElement('button');
            del.className = 'btn-small btn-danger';
            del.textContent = 'Xóa chủ đề này';
            del.dataset.testid = 'btn-delete-topic-' + topic.id;
            del.addEventListener('click', () => deleteTopic(topic));
            list.appendChild(del);
        }

        items.forEach(item => {
            total++;
            const row = document.createElement('div');
            row.className = 'custom-item';
            row.dataset.testid = 'row-custom-item-' + item.id;
            row.innerHTML = '<img class="custom-thumb" alt=""><div class="custom-info"><div class="custom-name"></div><div class="custom-sub"></div></div><div class="custom-actions"></div>';
            row.querySelector('.custom-thumb').src = item.image;
            row.querySelector('.custom-name').textContent = item.name;
            row.querySelector('.custom-sub').textContent = item.audio ? '🎙️ Có giọng bố mẹ' : '🔈 Giọng máy đọc';

            const actions = row.querySelector('.custom-actions');
            const edit = document.createElement('button');
            edit.textContent = '✏️';
            edit.setAttribute('aria-label', 'Sửa');
            edit.dataset.testid = 'btn-edit-item-' + item.id;
            edit.addEventListener('click', () => openItemModal(item));
            const del = document.createElement('button');
            del.textContent = '🗑️';
            del.setAttribute('aria-label', 'Xóa');
            del.dataset.testid = 'btn-delete-item-' + item.id;
            del.addEventListener('click', () => deleteItem(item));
            actions.append(edit, del);
            list.appendChild(row);
        });
    });

    if (!total && !list.children.length) {
        const empty = document.createElement('p');
        empty.className = 'muted';
        empty.textContent = 'Chưa có hình nào. Bấm "Thêm hình mới" để bắt đầu.';
        list.appendChild(empty);
    }
}

async function refreshAll() {
    await loadTopics();
    renderTopics();
    renderCustomList();
}

async function deleteItem(item) {
    if (!(await askConfirm('Xóa hình "' + item.name + '"?'))) return;
    await dbDelete('items', item.id);
    await refreshAll();
    toast('Đã xóa');
}

async function deleteTopic(topic) {
    const n = topic.items.length;
    if (!(await askConfirm('Xóa chủ đề "' + topic.name + '"' + (n ? ' và ' + n + ' hình trong đó' : '') + '?'))) return;
    for (const item of topic.items) await dbDelete('items', item.id);
    await dbDelete('topics', topic.id);
    await refreshAll();
    toast('Đã xóa chủ đề');
}

// ---------- Thêm / sửa hình ----------

function openItemModal(item) {
    Editor.editingId = item ? item.id : null;
    Editor.image = item ? item.image : null;
    Editor.audio = item ? item.audio || null : null;

    document.getElementById('item-modal-title').textContent = item ? 'Sửa hình' : 'Thêm hình mới';

    const select = document.getElementById('item-topic');
    select.innerHTML = '';
    APP.topics.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.icon + ' ' + t.name;
        select.appendChild(opt);
    });
    const newOpt = document.createElement('option');
    newOpt.value = '__new__';
    newOpt.textContent = '➕ Chủ đề mới…';
    select.appendChild(newOpt);
    select.value = item ? item.topicId : APP.topics[0].id;

    document.getElementById('new-topic-name').value = '';
    document.getElementById('new-topic-icon').value = '';
    document.getElementById('new-topic-fields').hidden = true;
    document.getElementById('item-name').value = item ? item.name : '';
    document.getElementById('item-say').value = item ? item.say || '' : '';
    renderPhoto();
    renderRecordState('');
    document.getElementById('modal-item').hidden = false;
}

function closeItemModal() {
    stopRecording();
    Voice.stop();
    document.getElementById('modal-item').hidden = true;
}

function renderPhoto() {
    const box = document.getElementById('item-photo');
    box.innerHTML = '';
    if (Editor.image) {
        const img = document.createElement('img');
        img.src = Editor.image;
        img.alt = '';
        box.appendChild(img);
    } else {
        box.textContent = '📷 Chạm để chụp hoặc chọn ảnh';
    }
}

function processImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const max = 600;
                let { width, height } = img;
                if (width > max || height > max) {
                    const scale = max / Math.max(width, height);
                    width = Math.round(width * scale);
                    height = Math.round(height * scale);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.75));
            };
            img.onerror = () => reject(new Error('Ảnh không đọc được'));
            img.src = reader.result;
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

// ---------- Ghi âm giọng bố mẹ ----------

function renderRecordState(message) {
    const recording = !!Editor.recorder;
    const btn = document.getElementById('btn-record');
    btn.textContent = recording ? '⏹ Dừng' : (Editor.audio ? '🎙️ Ghi lại' : '🎙️ Ghi âm');
    btn.classList.toggle('recording', recording);
    document.getElementById('btn-record-play').disabled = recording || !Editor.audio;
    document.getElementById('btn-record-clear').disabled = recording || !Editor.audio;
    document.getElementById('record-status').textContent = message ||
        (Editor.audio ? 'Đã có giọng bố mẹ, bé sẽ nghe giọng này.' : 'Chưa ghi âm: máy sẽ tự đọc tên.');
}

async function startRecording() {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
        toast('Máy này không ghi âm được');
        return;
    }
    let stream;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
        toast('Cần cho phép dùng micro để ghi âm');
        return;
    }
    const chunks = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        Editor.recorder = null;
        clearTimeout(Editor.stopTimer);
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
            Editor.audio = reader.result;
            renderRecordState('Đã ghi xong! Bấm "Nghe" để nghe lại.');
        };
        reader.readAsDataURL(blob);
    };
    recorder.start();
    Editor.recorder = recorder;
    Editor.stopTimer = setTimeout(stopRecording, 8000);
    renderRecordState('Đang ghi âm… nói tên hình rồi bấm Dừng (tối đa 8 giây)');
}

function stopRecording() {
    if (Editor.recorder && Editor.recorder.state !== 'inactive') Editor.recorder.stop();
}

// ---------- Lưu ----------

async function saveItem() {
    const name = document.getElementById('item-name').value.trim();
    const sayText = document.getElementById('item-say').value.trim();
    let topicId = document.getElementById('item-topic').value;

    if (!Editor.image) { toast('Bố mẹ chọn ảnh trước nhé'); return; }
    if (!name) { toast('Bố mẹ nhập tên cho hình nhé'); return; }

    if (topicId === '__new__') {
        const topicName = document.getElementById('new-topic-name').value.trim();
        if (!topicName) { toast('Nhập tên chủ đề mới'); return; }
        const icon = document.getElementById('new-topic-icon').value.trim() || '⭐';
        const customCount = APP.topics.filter(t => !t.builtin).length;
        topicId = 'cd-' + Date.now();
        await dbPut('topics', { id: topicId, name: topicName, icon, color: TOPIC_COLORS[customCount % TOPIC_COLORS.length], createdAt: Date.now() });
    }

    const record = { topicId, name, say: sayText, image: Editor.image, audio: Editor.audio, updatedAt: Date.now() };
    if (Editor.editingId) {
        const old = await dbGet('items', Editor.editingId);
        record.id = Editor.editingId;
        record.createdAt = old ? old.createdAt : Date.now();
    } else {
        record.createdAt = Date.now();
    }
    await dbPut('items', record);

    closeItemModal();
    await refreshAll();
    toast(Editor.editingId ? 'Đã sửa hình' : 'Đã thêm hình "' + name + '"');
}

// ---------- Sao lưu ----------

async function exportBackup() {
    const data = {
        app: 'be-hoc-vui',
        version: 1,
        exportedAt: new Date().toISOString(),
        settings: APP.settings,
        topics: await dbGetAll('topics'),
        items: await dbGetAll('items'),
        voices: await dbGetAll('voices')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'be-hoc-vui-sao-luu-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast('Đã xuất ' + data.items.length + ' hình. File nằm trong thư mục Tải xuống.');
}

async function importBackup(file) {
    let data;
    try {
        data = JSON.parse(await file.text());
    } catch (e) {
        toast('File không đúng định dạng');
        return;
    }
    if (data.app !== 'be-hoc-vui' || !Array.isArray(data.items)) {
        toast('Đây không phải file sao lưu của Bé Học Vui');
        return;
    }
    const voiceCount = (data.voices || []).length;
    if (!(await askConfirm('Nhập ' + data.items.length + ' hình' + (voiceCount ? ' và ' + voiceCount + ' câu giọng bố mẹ' : '') + ' từ file sao lưu vào máy này?'))) return;

    const existing = await dbGetAll('items');
    const seen = new Set(existing.map(it => it.topicId + '|' + it.name + '|' + it.createdAt));

    for (const topic of data.topics || []) await dbPut('topics', topic);
    for (const v of data.voices || []) {
        await dbPut('voices', v);
        Voice.overrides.set(v.text, v.audio);
    }
    let added = 0;
    for (const item of data.items) {
        const key = item.topicId + '|' + item.name + '|' + item.createdAt;
        if (seen.has(key)) continue;
        const copy = { ...item };
        delete copy.id;
        await dbPut('items', copy);
        added++;
    }
    if (data.settings && data.settings.flowers > APP.settings.flowers) {
        APP.settings.flowers = data.settings.flowers;
        await saveSettings();
        renderFlowers();
    }
    await refreshAll();
    toast('Đã nhập ' + added + ' hình mới');
}

// ---------- Gắn sự kiện ----------

function setupParentEvents() {
    document.getElementById('btn-parent').addEventListener('click', openGate);
    document.getElementById('btn-gate-cancel').addEventListener('click', () => {
        document.getElementById('modal-gate').hidden = true;
    });

    bindSettings();
    document.addEventListener('voicechange', renderVoiceStatus);
    document.getElementById('btn-voice-test').addEventListener('click', () => {
        Sfx.unlock();
        say(LINES.voiceTest);
    });

    document.getElementById('btn-add-item').addEventListener('click', () => openItemModal(null));
    document.getElementById('btn-item-cancel').addEventListener('click', closeItemModal);
    document.getElementById('btn-item-save').addEventListener('click', saveItem);
    document.getElementById('item-topic').addEventListener('change', e => {
        document.getElementById('new-topic-fields').hidden = e.target.value !== '__new__';
    });

    const photoInput = document.getElementById('item-photo-file');
    document.getElementById('item-photo').addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', async () => {
        const file = photoInput.files[0];
        photoInput.value = '';
        if (!file) return;
        try {
            Editor.image = await processImage(file);
            renderPhoto();
        } catch (e) {
            toast(e.message);
        }
    });

    document.getElementById('btn-record').addEventListener('click', () => {
        if (Editor.recorder) stopRecording();
        else startRecording();
    });
    document.getElementById('btn-record-play').addEventListener('click', () => {
        if (!Editor.audio) return;
        Voice.stop();
        Voice.playClip(Editor.audio);
    });
    document.getElementById('btn-record-clear').addEventListener('click', () => {
        Editor.audio = null;
        renderRecordState('');
    });

    document.getElementById('btn-export').addEventListener('click', exportBackup);
    const importInput = document.getElementById('file-import');
    document.getElementById('btn-import').addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', () => {
        const file = importInput.files[0];
        importInput.value = '';
        if (file) importBackup(file);
    });

    document.getElementById('btn-reset-flowers').addEventListener('click', async () => {
        if (!(await askConfirm('Đặt lại số hoa của bé về 0?'))) return;
        APP.settings.flowers = 0;
        await saveSettings();
        renderFlowers();
        toast('Đã đặt lại số hoa');
    });
}

setupParentEvents();
