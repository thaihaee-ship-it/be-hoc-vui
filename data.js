// Mỗi hình: name, say (đọc khi học), call (gọi trong câu hỏi) + emoji | color | shape | count | letter.

const BUILTIN_TOPICS = [
    {
        id: 'con-vat', name: 'Con vật', icon: '🐶', color: '#FF8A65',
        items: [
            { id: 'cho', name: 'Con chó', emoji: '🐶', say: 'Con chó. Gâu gâu!' },
            { id: 'meo', name: 'Con mèo', emoji: '🐱', say: 'Con mèo. Meo meo!' },
            { id: 'ga', name: 'Con gà', emoji: '🐔', say: 'Con gà. Ò ó o!' },
            { id: 'vit', name: 'Con vịt', emoji: '🦆', say: 'Con vịt. Cạp cạp!' },
            { id: 'bo', name: 'Con bò', emoji: '🐄', say: 'Con bò. Ùm bò!' },
            { id: 'lon', name: 'Con lợn', emoji: '🐷', say: 'Con lợn. Ụt ịt!' },
            { id: 'de', name: 'Con dê', emoji: '🐐', say: 'Con dê. Be be!' },
            { id: 'ngua', name: 'Con ngựa', emoji: '🐴', say: 'Con ngựa. Hí hí!' },
            { id: 'voi', name: 'Con voi', emoji: '🐘', say: 'Con voi. Voi có cái vòi thật dài.' },
            { id: 'khi', name: 'Con khỉ', emoji: '🐵', say: 'Con khỉ. Khỉ thích ăn chuối.' },
            { id: 'ho', name: 'Con hổ', emoji: '🐯', say: 'Con hổ. Gừ gừ!' },
            { id: 'su-tu', name: 'Con sư tử', emoji: '🦁', say: 'Con sư tử. Gầm gừ!' },
            { id: 'tho', name: 'Con thỏ', emoji: '🐰', say: 'Con thỏ. Thỏ có đôi tai dài.' },
            { id: 'gau', name: 'Con gấu', emoji: '🐻', say: 'Con gấu.' },
            { id: 'ca', name: 'Con cá', emoji: '🐟', say: 'Con cá. Cá bơi dưới nước.' },
            { id: 'chim', name: 'Con chim', emoji: '🐦', say: 'Con chim. Chim hót líu lo.' },
            { id: 'ech', name: 'Con ếch', emoji: '🐸', say: 'Con ếch. Ộp ộp!' },
            { id: 'rua', name: 'Con rùa', emoji: '🐢', say: 'Con rùa. Rùa bò thật chậm.' },
            { id: 'buom', name: 'Con bướm', emoji: '🦋', say: 'Con bướm.' },
            { id: 'ong', name: 'Con ong', emoji: '🐝', say: 'Con ong. Vo ve vo ve!' },
            { id: 'chuot', name: 'Con chuột', emoji: '🐭', say: 'Con chuột. Chít chít!' },
            { id: 'cuu', name: 'Con cừu', emoji: '🐑', say: 'Con cừu. Bông cừu trắng và mềm.' },
            { id: 'huou', name: 'Con hươu cao cổ', emoji: '🦒', say: 'Con hươu cao cổ. Hươu có cái cổ rất dài.' },
            { id: 'ngua-van', name: 'Con ngựa vằn', emoji: '🦓', say: 'Con ngựa vằn. Ngựa vằn có sọc đen trắng.' },
            { id: 'gau-truc', name: 'Con gấu trúc', emoji: '🐼', say: 'Con gấu trúc. Gấu trúc thích ăn tre.' },
            { id: 'chim-canh-cut', name: 'Con chim cánh cụt', emoji: '🐧', say: 'Con chim cánh cụt. Chim cánh cụt sống ở xứ lạnh.' },
            { id: 'cu-meo', name: 'Con cú mèo', emoji: '🦉', say: 'Con cú mèo. Cú cú!' },
            { id: 'ca-voi', name: 'Con cá voi', emoji: '🐳', say: 'Con cá voi. Cá voi to nhất dưới biển.' },
            { id: 'ca-heo', name: 'Con cá heo', emoji: '🐬', say: 'Con cá heo. Cá heo bơi rất giỏi.' },
            { id: 'cua', name: 'Con cua', emoji: '🦀', say: 'Con cua. Cua bò ngang.' },
            { id: 'bach-tuoc', name: 'Con bạch tuộc', emoji: '🐙', say: 'Con bạch tuộc. Bạch tuộc có tám cái chân.' },
            { id: 'ran', name: 'Con rắn', emoji: '🐍', say: 'Con rắn. Xì xì!' },
            { id: 'ca-sau', name: 'Con cá sấu', emoji: '🐊', say: 'Con cá sấu. Cá sấu có hàm răng sắc.' },
            { id: 'kien', name: 'Con kiến', emoji: '🐜', say: 'Con kiến. Kiến rất chăm chỉ.' },
            { id: 'oc-sen', name: 'Con ốc sên', emoji: '🐌', say: 'Con ốc sên. Ốc sên mang nhà trên lưng.' }
        ]
    },
    {
        id: 'mau-sac', name: 'Màu sắc', icon: '🎨', color: '#BA68C8',
        items: [
            { id: 'do', name: 'Màu đỏ', color: '#E53935' },
            { id: 'vang', name: 'Màu vàng', color: '#FDD835' },
            { id: 'xanh-la', name: 'Màu xanh lá cây', color: '#43A047' },
            { id: 'xanh-duong', name: 'Màu xanh da trời', color: '#1E88E5' },
            { id: 'cam', name: 'Màu cam', color: '#FB8C00' },
            { id: 'tim', name: 'Màu tím', color: '#8E24AA' },
            { id: 'hong', name: 'Màu hồng', color: '#F06292' },
            { id: 'nau', name: 'Màu nâu', color: '#795548' },
            { id: 'den', name: 'Màu đen', color: '#212121' },
            { id: 'trang', name: 'Màu trắng', color: '#FFFFFF' },
            { id: 'xam', name: 'Màu xám', color: '#9E9E9E' },
            { id: 'xanh-ngoc', name: 'Màu xanh ngọc', color: '#26C6DA' }
        ]
    },
    {
        id: 'hinh-khoi', name: 'Hình khối', icon: '🔺', color: '#4DB6AC',
        items: [
            { id: 'tron', name: 'Hình tròn', shape: 'circle' },
            { id: 'vuong', name: 'Hình vuông', shape: 'square' },
            { id: 'tam-giac', name: 'Hình tam giác', shape: 'triangle' },
            { id: 'chu-nhat', name: 'Hình chữ nhật', shape: 'rectangle' },
            { id: 'ngoi-sao', name: 'Hình ngôi sao', shape: 'star' },
            { id: 'trai-tim', name: 'Hình trái tim', shape: 'heart' },
            { id: 'thoi', name: 'Hình thoi', shape: 'diamond' },
            { id: 'bau-duc', name: 'Hình bầu dục', shape: 'oval' },
            { id: 'luc-giac', name: 'Hình lục giác', shape: 'hexagon', say: 'Hình lục giác. Hình lục giác có sáu cạnh.' },
            { id: 'ngu-giac', name: 'Hình ngũ giác', shape: 'pentagon', say: 'Hình ngũ giác. Hình ngũ giác có năm cạnh.' },
            { id: 'ban-nguyet', name: 'Hình bán nguyệt', shape: 'semicircle', say: 'Hình bán nguyệt. Giống nửa cái bánh tròn.' },
            { id: 'trang-khuyet', name: 'Hình trăng khuyết', shape: 'crescent', say: 'Hình trăng khuyết. Giống ông trăng ban đêm.' },
            { id: 'chu-thap', name: 'Hình chữ thập', shape: 'cross', say: 'Hình chữ thập. Giống dấu cộng.' }
        ]
    },
    {
        id: 'so-dem', name: 'Số đếm', icon: '🔢', color: '#64B5F6',
        items: [
            { id: 's0', name: 'Số 0', emoji: '🍽️', call: 'cái đĩa không có quả táo nào', say: 'Số không. Cái đĩa trống, không có quả táo nào.' },
            { id: 's1', name: 'Số 1', count: 1, call: 'nhóm có một quả táo', say: 'Số một. Một quả táo.' },
            { id: 's2', name: 'Số 2', count: 2, call: 'nhóm có hai quả táo', say: 'Số hai. Một, hai. Hai quả táo.' },
            { id: 's3', name: 'Số 3', count: 3, call: 'nhóm có ba quả táo', say: 'Số ba. Một, hai, ba. Ba quả táo.' },
            { id: 's4', name: 'Số 4', count: 4, call: 'nhóm có bốn quả táo', say: 'Số bốn. Một, hai, ba, bốn. Bốn quả táo.' },
            { id: 's5', name: 'Số 5', count: 5, call: 'nhóm có năm quả táo', say: 'Số năm. Một, hai, ba, bốn, năm. Năm quả táo.' },
            { id: 's6', name: 'Số 6', count: 6, call: 'nhóm có sáu quả táo', say: 'Số sáu. Sáu quả táo.' },
            { id: 's7', name: 'Số 7', count: 7, call: 'nhóm có bảy quả táo', say: 'Số bảy. Bảy quả táo.' },
            { id: 's8', name: 'Số 8', count: 8, call: 'nhóm có tám quả táo', say: 'Số tám. Tám quả táo.' },
            { id: 's9', name: 'Số 9', count: 9, call: 'nhóm có chín quả táo', say: 'Số chín. Chín quả táo.' },
            { id: 's10', name: 'Số 10', count: 10, call: 'nhóm có mười quả táo', say: 'Số mười. Mười quả táo.' }
        ]
    },
    {
        id: 'hoa-qua', name: 'Rau củ quả', icon: '🍎', color: '#81C784',
        items: [
            { id: 'tao', name: 'Quả táo', emoji: '🍎' },
            { id: 'chuoi', name: 'Quả chuối', emoji: '🍌' },
            { id: 'cam', name: 'Quả cam', emoji: '🍊' },
            { id: 'nho', name: 'Quả nho', emoji: '🍇' },
            { id: 'dua-hau', name: 'Quả dưa hấu', emoji: '🍉' },
            { id: 'dua', name: 'Quả dứa', emoji: '🍍' },
            { id: 'xoai', name: 'Quả xoài', emoji: '🥭' },
            { id: 'dau-tay', name: 'Quả dâu tây', emoji: '🍓' },
            { id: 'le', name: 'Quả lê', emoji: '🍐' },
            { id: 'dao', name: 'Quả đào', emoji: '🍑' },
            { id: 'chanh', name: 'Quả chanh', emoji: '🍋' },
            { id: 'dua-xiem', name: 'Quả dừa', emoji: '🥥' },
            { id: 'bo', name: 'Quả bơ', emoji: '🥑' },
            { id: 'ca-chua', name: 'Quả cà chua', emoji: '🍅' },
            { id: 'anh-dao', name: 'Quả anh đào', emoji: '🍒' },
            { id: 'kiwi', name: 'Quả kiwi', emoji: '🥝' },
            { id: 'dua-luoi', name: 'Quả dưa lưới', emoji: '🍈' },
            { id: 'ca-rot', name: 'Củ cà rốt', emoji: '🥕', say: 'Củ cà rốt. Thỏ rất thích ăn cà rốt.' },
            { id: 'khoai-tay', name: 'Củ khoai tây', emoji: '🥔' },
            { id: 'ngo', name: 'Bắp ngô', emoji: '🌽' },
            { id: 'ca-tim', name: 'Quả cà tím', emoji: '🍆' },
            { id: 'dua-chuot', name: 'Quả dưa chuột', emoji: '🥒' },
            { id: 'sup-lo', name: 'Súp lơ xanh', emoji: '🥦' },
            { id: 'ot', name: 'Quả ớt', emoji: '🌶️', say: 'Quả ớt. Ớt cay lắm!' },
            { id: 'nam', name: 'Cây nấm', emoji: '🍄' }
        ]
    },
    {
        id: 'xe-co', name: 'Xe cộ', icon: '🚗', color: '#FFB74D',
        items: [
            { id: 'o-to', name: 'Xe ô tô', emoji: '🚗', say: 'Xe ô tô. Bim bim!' },
            { id: 'xe-may', name: 'Xe máy', emoji: '🛵', say: 'Xe máy. Brừm brừm!' },
            { id: 'xe-dap', name: 'Xe đạp', emoji: '🚲', say: 'Xe đạp. Kính coong!' },
            { id: 'xe-buyt', name: 'Xe buýt', emoji: '🚌' },
            { id: 'xe-tai', name: 'Xe tải', emoji: '🚚' },
            { id: 'tau-hoa', name: 'Tàu hỏa', emoji: '🚂', say: 'Tàu hỏa. Xình xịch xình xịch, tu tu!' },
            { id: 'may-bay', name: 'Máy bay', emoji: '✈️', say: 'Máy bay. Máy bay bay trên trời.' },
            { id: 'truc-thang', name: 'Máy bay trực thăng', emoji: '🚁' },
            { id: 'tau-thuy', name: 'Tàu thủy', emoji: '🚢', say: 'Tàu thủy. Tàu thủy đi trên biển.' },
            { id: 'thuyen', name: 'Thuyền buồm', emoji: '⛵' },
            { id: 'cuu-thuong', name: 'Xe cứu thương', emoji: '🚑', say: 'Xe cứu thương. Bíp bo bíp bo!' },
            { id: 'cuu-hoa', name: 'Xe cứu hỏa', emoji: '🚒', say: 'Xe cứu hỏa. Xe cứu hỏa đi dập lửa.' },
            { id: 'canh-sat', name: 'Xe cảnh sát', emoji: '🚓', say: 'Xe cảnh sát. Ò e ò e!' },
            { id: 'taxi', name: 'Xe taxi', emoji: '🚕' },
            { id: 'may-keo', name: 'Máy kéo', emoji: '🚜', say: 'Máy kéo. Máy kéo giúp bác nông dân cày ruộng.' },
            { id: 'xe-dua', name: 'Xe đua', emoji: '🏎️', say: 'Xe đua. Xe đua chạy rất nhanh. Vèo vèo!' },
            { id: 'xe-truot', name: 'Xe trượt', emoji: '🛴' },
            { id: 'ca-no', name: 'Ca nô', emoji: '🚤' },
            { id: 'ten-lua', name: 'Tên lửa', emoji: '🚀', say: 'Tên lửa. Tên lửa bay lên vũ trụ.' },
            { id: 'cap-treo', name: 'Cáp treo', emoji: '🚡' }
        ]
    },
    {
        id: 'co-the', name: 'Cơ thể bé', icon: '👶', color: '#F48FB1',
        items: [
            { id: 'mat', name: 'Đôi mắt', emoji: '👀', say: 'Đôi mắt. Mắt để nhìn.' },
            { id: 'mui', name: 'Cái mũi', emoji: '👃', say: 'Cái mũi. Mũi để ngửi.' },
            { id: 'tai', name: 'Cái tai', emoji: '👂', say: 'Cái tai. Tai để nghe.' },
            { id: 'mieng', name: 'Cái miệng', emoji: '👄', say: 'Cái miệng. Miệng để ăn và nói.' },
            { id: 'rang', name: 'Cái răng', emoji: '🦷', say: 'Cái răng. Bé nhớ đánh răng mỗi ngày nhé.' },
            { id: 'tay', name: 'Bàn tay', emoji: '✋', say: 'Bàn tay. Tay để cầm đồ.' },
            { id: 'chan', name: 'Bàn chân', emoji: '🦶', say: 'Bàn chân. Chân để đi.' },
            { id: 'luoi', name: 'Cái lưỡi', emoji: '👅', say: 'Cái lưỡi. Lưỡi giúp con nếm vị ngọt, vị chua.' },
            { id: 'khuon-mat', name: 'Khuôn mặt', emoji: '😊', say: 'Khuôn mặt. Khuôn mặt đang cười thật tươi.' },
            { id: 'canh-tay', name: 'Cánh tay', emoji: '💪', say: 'Cánh tay. Cánh tay để ôm bố mẹ thật chặt.' },
            { id: 'ngon-tay', name: 'Ngón tay', emoji: '☝️', say: 'Ngón tay. Một bàn tay có năm ngón tay.' },
            { id: 'cai-chan', name: 'Cái chân', emoji: '🦵', say: 'Cái chân. Chân để chạy và nhảy.' },
            { id: 'bo-nao', name: 'Bộ não', emoji: '🧠', say: 'Bộ não. Bộ não giúp con suy nghĩ.' },
            { id: 'xuong', name: 'Khúc xương', emoji: '🦴', say: 'Khúc xương. Uống sữa giúp xương chắc khỏe.' }
        ]
    },
    {
        id: 'chu-cai', name: 'Chữ cái', icon: '🔤', color: '#7986CB',
        items: [
            { id: 'a', name: 'A', letter: 'A', sound: 'a', word: 'Áo', emoji: '👕' },
            { id: 'aw', name: 'Ă', letter: 'Ă', sound: 'á', word: 'Ăn', emoji: '🍚' },
            { id: 'aa', name: 'Â', letter: 'Â', sound: 'ớ', word: 'Ấm', emoji: '🫖' },
            { id: 'b', name: 'B', letter: 'B', sound: 'bờ', word: 'Bò', emoji: '🐄' },
            { id: 'c', name: 'C', letter: 'C', sound: 'cờ', word: 'Cá', emoji: '🐟' },
            { id: 'd', name: 'D', letter: 'D', sound: 'dờ', word: 'Dê', emoji: '🐐' },
            { id: 'dd', name: 'Đ', letter: 'Đ', sound: 'đờ', word: 'Đèn', emoji: '💡' },
            { id: 'e', name: 'E', letter: 'E', sound: 'e', word: 'Em bé', emoji: '👶' },
            { id: 'ee', name: 'Ê', letter: 'Ê', sound: 'ê', word: 'Ếch', emoji: '🐸' },
            { id: 'g', name: 'G', letter: 'G', sound: 'gờ', word: 'Gà', emoji: '🐔' },
            { id: 'h', name: 'H', letter: 'H', sound: 'hờ', word: 'Hoa', emoji: '🌸' },
            { id: 'i', name: 'I', letter: 'I', sound: 'i', word: 'Ỉn', emoji: '🐷' },
            { id: 'k', name: 'K', letter: 'K', sound: 'ca', word: 'Kẹo', emoji: '🍬' },
            { id: 'l', name: 'L', letter: 'L', sound: 'lờ', word: 'Lá', emoji: '🍃' },
            { id: 'm', name: 'M', letter: 'M', sound: 'mờ', word: 'Mèo', emoji: '🐱' },
            { id: 'n', name: 'N', letter: 'N', sound: 'nờ', word: 'Nho', emoji: '🍇' },
            { id: 'o', name: 'O', letter: 'O', sound: 'o', word: 'Ong', emoji: '🐝' },
            { id: 'oo', name: 'Ô', letter: 'Ô', sound: 'ô', word: 'Ô tô', emoji: '🚗' },
            { id: 'ow', name: 'Ơ', letter: 'Ơ', sound: 'ơ', word: 'Ớt', emoji: '🌶️' },
            { id: 'p', name: 'P', letter: 'P', sound: 'pờ', word: 'Pin', emoji: '🔋' },
            { id: 'q', name: 'Q', letter: 'Q', sound: 'quờ', word: 'Quà', emoji: '🎁' },
            { id: 'r', name: 'R', letter: 'R', sound: 'rờ', word: 'Rùa', emoji: '🐢' },
            { id: 's', name: 'S', letter: 'S', sound: 'sờ', word: 'Sao', emoji: '⭐' },
            { id: 't', name: 'T', letter: 'T', sound: 'tờ', word: 'Táo', emoji: '🍎' },
            { id: 'u', name: 'U', letter: 'U', sound: 'u', word: 'Ủng', emoji: '🥾' },
            { id: 'uw', name: 'Ư', letter: 'Ư', sound: 'ư', word: 'Ướt', emoji: '💦' },
            { id: 'v', name: 'V', letter: 'V', sound: 'vờ', word: 'Voi', emoji: '🐘' },
            { id: 'x', name: 'X', letter: 'X', sound: 'xờ', word: 'Xe', emoji: '🚌' },
            { id: 'y', name: 'Y', letter: 'Y', sound: 'i dài', word: 'Yêu', emoji: '❤️' }
        ]
    }
];

BUILTIN_TOPICS.forEach(topic => {
    topic.builtin = true;
    topic.items.forEach(item => {
        if (item.letter) {
            item.call = item.call || 'chữ ' + item.sound;
            item.say = item.say || 'Chữ ' + item.sound + '. ' + item.word + '.';
        }
    });
});

const PRAISES = [
    'Giỏi quá!',
    'Làm tốt lắm!',
    'Đúng rồi! Con giỏi quá!',
    'Hoan hô! Con đúng rồi!',
    'Tuyệt vời!',
    'Con thật là giỏi!',
    'Chính xác! Thưởng cho con một bông hoa!'
];

const RETRY_LINES = [
    'Chưa đúng rồi, con thử lại nhé!',
    'Ồ, chưa phải rồi, con chọn lại nhé!',
    'Không sao, con thử lại nào!'
];

const REWARD_FLOWERS = ['🌸', '🌼', '🌻', '🌷', '🌹', '🌺', '💐'];

const LINES = {
    greeting: 'Chào con! Hôm nay con muốn học gì nào?',
    touch: 'Con hãy chạm vào',
    topicAsk: (topic) => topic.name + '. Con muốn học hay chơi?',
    result: (n) => 'Hoan hô! Con đã nhận được ' + n + ' bông hoa. Con giỏi quá!',
    voiceTest: 'Xin chào con! Con mèo kêu meo meo.'
};

function itemCall(item) {
    return item.call || item.name.toLowerCase();
}

function promptLine(item) {
    return LINES.touch + ' ' + itemCall(item);
}
