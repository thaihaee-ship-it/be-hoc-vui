// In ra (JSON) mọi câu app sẽ đọc với dữ liệu có sẵn trong data.js và lop1-data.js.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const read = (name) => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const code = read('data.js') + '\n' + read('lop1-data.js') +
    '\n;({ BUILTIN_TOPICS, PRAISES, RETRY_LINES, LINES, promptLine, lop1AllPhrases })';
const d = vm.runInNewContext(code);

const texts = new Set([d.LINES.greeting, d.LINES.touch, d.LINES.voiceTest, ...d.PRAISES, ...d.RETRY_LINES]);
for (let n = 0; n <= 10; n++) texts.add(d.LINES.result(n));

d.BUILTIN_TOPICS.forEach(topic => {
    texts.add(d.LINES.topicAsk(topic));
    topic.items.forEach(item => {
        texts.add(item.name);
        texts.add(item.say || item.name);
        texts.add(d.promptLine(item));
    });
});

d.lop1AllPhrases().forEach(t => texts.add(t));

if (process.argv[2] === '--lop1') {
    process.stdout.write(d.lop1AllPhrases().join('\n'));
} else {
    process.stdout.write(JSON.stringify([...texts]));
}
