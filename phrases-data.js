// phrases-data.js — 50 câu giao tiếp (mục 8) + cụm nghĩa để "chạm hiểu câu" (mục 9).
// Mỗi câu: { n: STT, h: chữ Hán, p: pinyin, m: nghĩa, c: [[cụm, pinyin, nghĩa], ...] }
window.PHRASE_THEMES = [
  {
    id: "greet", name: "Chào hỏi và tạm biệt", items: [
      { n: 1, h: "早上好！", p: "Zǎoshang hǎo!", m: "Chào buổi sáng!", c: [["早上", "zǎoshang", "buổi sáng"], ["好", "hǎo", "tốt, khỏe"]] },
      { n: 2, h: "好久不见！", p: "Hǎojiǔ bú jiàn!", m: "Lâu rồi không gặp!", c: [["好久", "hǎojiǔ", "lâu rồi"], ["不见", "bú jiàn", "không gặp"]] },
      { n: 3, h: "你最近好吗？", p: "Nǐ zuìjìn hǎo ma?", m: "Dạo này bạn khỏe không?", c: [["你", "nǐ", "bạn"], ["最近", "zuìjìn", "gần đây"], ["好", "hǎo", "khỏe"], ["吗", "ma", "trợ từ nghi vấn"]] },
      { n: 4, h: "我很好，谢谢。", p: "Wǒ hěn hǎo, xièxie.", m: "Mình khỏe, cảm ơn bạn.", c: [["我", "wǒ", "tôi"], ["很好", "hěn hǎo", "rất khỏe"], ["谢谢", "xièxie", "cảm ơn"]] },
      { n: 5, h: "明天见！", p: "Míngtiān jiàn!", m: "Hẹn mai gặp lại!", c: [["明天", "míngtiān", "ngày mai"], ["见", "jiàn", "gặp"]] },
    ],
  },
  {
    id: "intro", name: "Làm quen", items: [
      { n: 6, h: "请问，您怎么称呼？", p: "Qǐngwèn, nín zěnme chēnghu?", m: "Xin hỏi, tôi nên gọi anh/chị thế nào?", c: [["请问", "qǐngwèn", "xin hỏi"], ["您", "nín", "ngài"], ["怎么", "zěnme", "thế nào"], ["称呼", "chēnghu", "xưng hô"]] },
      { n: 7, h: "我姓陈。", p: "Wǒ xìng Chén.", m: "Tôi họ Trần.", c: [["我", "wǒ", "tôi"], ["姓", "xìng", "họ"], ["陈", "Chén", "họ Trần"]] },
      { n: 8, h: "你是哪国人？", p: "Nǐ shì nǎ guó rén?", m: "Bạn là người nước nào?", c: [["你", "nǐ", "bạn"], ["是", "shì", "là"], ["哪", "nǎ", "nào"], ["国", "guó", "nước"], ["人", "rén", "người"]] },
      { n: 9, h: "我是越南人。", p: "Wǒ shì Yuènán rén.", m: "Tôi là người Việt Nam.", c: [["我", "wǒ", "tôi"], ["是", "shì", "là"], ["越南", "Yuènán", "Việt Nam"], ["人", "rén", "người"]] },
      { n: 10, h: "你呢？", p: "Nǐ ne?", m: "Còn bạn thì sao?", c: [["你", "nǐ", "bạn"], ["呢", "ne", "còn...thì sao"]] },
    ],
  },
  {
    id: "family", name: "Gia đình", items: [
      { n: 11, h: "你家有几口人？", p: "Nǐ jiā yǒu jǐ kǒu rén?", m: "Nhà bạn có mấy người?", c: [["你", "nǐ", "bạn"], ["家", "jiā", "nhà"], ["有", "yǒu", "có"], ["几", "jǐ", "mấy"], ["口", "kǒu", "lượng từ người"], ["人", "rén", "người"]] },
      { n: 12, h: "我家有三口人。", p: "Wǒ jiā yǒu sān kǒu rén.", m: "Nhà mình có ba người.", c: [["我", "wǒ", "tôi"], ["家", "jiā", "nhà"], ["有", "yǒu", "có"], ["三", "sān", "ba"], ["口", "kǒu", "lượng từ người"], ["人", "rén", "người"]] },
      { n: 13, h: "这是谁？", p: "Zhè shì shéi?", m: "Đây là ai?", c: [["这", "zhè", "đây"], ["是", "shì", "là"], ["谁", "shéi", "ai"]] },
      { n: 14, h: "这是我女儿。", p: "Zhè shì wǒ nǚ'ér.", m: "Đây là con gái mình.", c: [["这", "zhè", "đây"], ["是", "shì", "là"], ["我", "wǒ", "tôi"], ["女儿", "nǚ'ér", "con gái"]] },
      { n: 15, h: "她今年七岁。", p: "Tā jīnnián qī suì.", m: "Năm nay bé bảy tuổi.", c: [["她", "tā", "cô ấy"], ["今年", "jīnnián", "năm nay"], ["七", "qī", "bảy"], ["岁", "suì", "tuổi"]] },
    ],
  },

  {
    id: "drink", name: "Gọi đồ uống", items: [
      { n: 16, h: "你想喝什么？", p: "Nǐ xiǎng hē shénme?", m: "Bạn muốn uống gì?", c: [["你", "nǐ", "bạn"], ["想", "xiǎng", "muốn"], ["喝", "hē", "uống"], ["什么", "shénme", "gì"]] },
      { n: 17, h: "我想喝茶。", p: "Wǒ xiǎng hē chá.", m: "Mình muốn uống trà.", c: [["我", "wǒ", "tôi"], ["想", "xiǎng", "muốn"], ["喝", "hē", "uống"], ["茶", "chá", "trà"]] },
      { n: 18, h: "请给我一杯水。", p: "Qǐng gěi wǒ yì bēi shuǐ.", m: "Cho mình một cốc nước nhé.", c: [["请", "qǐng", "xin"], ["给", "gěi", "cho"], ["我", "wǒ", "tôi"], ["一杯", "yì bēi", "một cốc"], ["水", "shuǐ", "nước"]] },
      { n: 19, h: "要加糖吗？", p: "Yào jiā táng ma?", m: "Bạn có muốn thêm đường không?", c: [["要", "yào", "muốn"], ["加", "jiā", "thêm"], ["糖", "táng", "đường"], ["吗", "ma", "không"]] },
      { n: 20, h: "不用，谢谢。", p: "Bú yòng, xièxie.", m: "Không cần đâu, cảm ơn.", c: [["不用", "bú yòng", "không cần"], ["谢谢", "xièxie", "cảm ơn"]] },
    ],
  },
  {
    id: "order", name: "Gọi món", items: [
      { n: 21, h: "有菜单吗？", p: "Yǒu càidān ma?", m: "Cho mình xem thực đơn được không?", c: [["有", "yǒu", "có"], ["菜单", "càidān", "thực đơn"], ["吗", "ma", "không"]] },
      { n: 22, h: "我要一碗面。", p: "Wǒ yào yì wǎn miàn.", m: "Cho mình một bát mì.", c: [["我", "wǒ", "tôi"], ["要", "yào", "muốn"], ["一碗", "yì wǎn", "một bát"], ["面", "miàn", "mì"]] },
      { n: 23, h: "这个辣吗？", p: "Zhège là ma?", m: "Món này có cay không?", c: [["这个", "zhège", "cái này"], ["辣", "là", "cay"], ["吗", "ma", "không"]] },
      { n: 24, h: "我不吃辣。", p: "Wǒ bù chī là.", m: "Mình không ăn cay.", c: [["我", "wǒ", "tôi"], ["不", "bù", "không"], ["吃", "chī", "ăn"], ["辣", "là", "cay"]] },
      { n: 25, h: "可以打包吗？", p: "Kěyǐ dǎbāo ma?", m: "Có thể gói mang về không?", c: [["可以", "kěyǐ", "có thể"], ["打包", "dǎbāo", "gói mang về"], ["吗", "ma", "không"]] },
    ],
  },
  {
    id: "shop", name: "Mua sắm", items: [
      { n: 26, h: "这个多少钱？", p: "Zhège duōshao qián?", m: "Cái này bao nhiêu tiền?", c: [["这个", "zhège", "cái này"], ["多少", "duōshao", "bao nhiêu"], ["钱", "qián", "tiền"]] },
      { n: 27, h: "十五块。", p: "Shíwǔ kuài.", m: "Mười lăm tệ.", c: [["十五", "shíwǔ", "mười lăm"], ["块", "kuài", "tệ (đồng)"]] },
      { n: 28, h: "有小一点的吗？", p: "Yǒu xiǎo yìdiǎn de ma?", m: "Có cái nào nhỏ hơn một chút không?", c: [["有", "yǒu", "có"], ["小", "xiǎo", "nhỏ"], ["一点", "yìdiǎn", "một chút"], ["的", "de", "trợ từ"], ["吗", "ma", "không"]] },
      { n: 29, h: "我买这个。", p: "Wǒ mǎi zhège.", m: "Mình lấy cái này.", c: [["我", "wǒ", "tôi"], ["买", "mǎi", "mua"], ["这个", "zhège", "cái này"]] },
      { n: 30, h: "可以刷卡吗？", p: "Kěyǐ shuākǎ ma?", m: "Mình thanh toán bằng thẻ được không?", c: [["可以", "kěyǐ", "có thể"], ["刷卡", "shuākǎ", "quẹt thẻ"], ["吗", "ma", "không"]] },
    ],
  },

  {
    id: "direction", name: "Hỏi đường", items: [
      { n: 31, h: "请问，地铁站在哪儿？", p: "Qǐngwèn, dìtiězhàn zài nǎr?", m: "Xin hỏi, ga tàu điện ngầm ở đâu?", c: [["请问", "qǐngwèn", "xin hỏi"], ["地铁站", "dìtiězhàn", "ga tàu điện ngầm"], ["在", "zài", "ở"], ["哪儿", "nǎr", "đâu"]] },
      { n: 32, h: "一直往前走。", p: "Yìzhí wǎng qián zǒu.", m: "Cứ đi thẳng về phía trước.", c: [["一直", "yìzhí", "cứ, liên tục"], ["往", "wǎng", "về phía"], ["前", "qián", "trước"], ["走", "zǒu", "đi"]] },
      { n: 33, h: "在路口左转。", p: "Zài lùkǒu zuǒzhuǎn.", m: "Đến giao lộ thì rẽ trái.", c: [["在", "zài", "ở"], ["路口", "lùkǒu", "giao lộ"], ["左转", "zuǒzhuǎn", "rẽ trái"]] },
      { n: 34, h: "离这儿远吗？", p: "Lí zhèr yuǎn ma?", m: "Có xa đây không?", c: [["离", "lí", "cách"], ["这儿", "zhèr", "đây"], ["远", "yuǎn", "xa"], ["吗", "ma", "không"]] },
      { n: 35, h: "走路五分钟就到。", p: "Zǒulù wǔ fēnzhōng jiù dào.", m: "Đi bộ năm phút là tới.", c: [["走路", "zǒulù", "đi bộ"], ["五分钟", "wǔ fēnzhōng", "năm phút"], ["就", "jiù", "liền"], ["到", "dào", "tới"]] },
    ],
  },
  {
    id: "meet", name: "Hẹn gặp", items: [
      { n: 36, h: "你今天有空吗？", p: "Nǐ jīntiān yǒu kòng ma?", m: "Hôm nay bạn có rảnh không?", c: [["你", "nǐ", "bạn"], ["今天", "jīntiān", "hôm nay"], ["有", "yǒu", "có"], ["空", "kòng", "rảnh"], ["吗", "ma", "không"]] },
      { n: 37, h: "我下午有空。", p: "Wǒ xiàwǔ yǒu kòng.", m: "Chiều nay mình rảnh.", c: [["我", "wǒ", "tôi"], ["下午", "xiàwǔ", "chiều"], ["有", "yǒu", "có"], ["空", "kòng", "rảnh"]] },
      { n: 38, h: "我们几点见？", p: "Wǒmen jǐ diǎn jiàn?", m: "Mấy giờ mình gặp nhau?", c: [["我们", "wǒmen", "chúng ta"], ["几点", "jǐ diǎn", "mấy giờ"], ["见", "jiàn", "gặp"]] },
      { n: 39, h: "三点半见吧。", p: "Sān diǎn bàn jiàn ba.", m: "Mình gặp lúc ba giờ rưỡi nhé.", c: [["三点半", "sān diǎn bàn", "ba giờ rưỡi"], ["见", "jiàn", "gặp"], ["吧", "ba", "nhé"]] },
      { n: 40, h: "在哪儿见？", p: "Zài nǎr jiàn?", m: "Mình gặp ở đâu?", c: [["在", "zài", "ở"], ["哪儿", "nǎr", "đâu"], ["见", "jiàn", "gặp"]] },
    ],
  },
  {
    id: "unclear", name: "Khi chưa hiểu", items: [
      { n: 41, h: "我听不懂。", p: "Wǒ tīng bu dǒng.", m: "Mình nghe không hiểu.", c: [["我", "wǒ", "tôi"], ["听不懂", "tīng bu dǒng", "nghe không hiểu"]] },
      { n: 42, h: "请说慢一点。", p: "Qǐng shuō màn yìdiǎn.", m: "Bạn nói chậm lại một chút nhé.", c: [["请", "qǐng", "xin"], ["说", "shuō", "nói"], ["慢", "màn", "chậm"], ["一点", "yìdiǎn", "một chút"]] },
      { n: 43, h: "请再说一遍。", p: "Qǐng zài shuō yí biàn.", m: "Bạn nói lại một lần nữa nhé.", c: [["请", "qǐng", "xin"], ["再", "zài", "lại"], ["说", "shuō", "nói"], ["一遍", "yí biàn", "một lần"]] },
      { n: 44, h: "这个字怎么读？", p: "Zhège zì zěnme dú?", m: "Chữ này đọc thế nào?", c: [["这个", "zhège", "cái này"], ["字", "zì", "chữ"], ["怎么", "zěnme", "thế nào"], ["读", "dú", "đọc"]] },
      { n: 45, h: "你能写下来吗？", p: "Nǐ néng xiě xiàlai ma?", m: "Bạn viết ra giúp mình được không?", c: [["你", "nǐ", "bạn"], ["能", "néng", "có thể"], ["写", "xiě", "viết"], ["下来", "xiàlai", "ra"], ["吗", "ma", "không"]] },
    ],
  },
  {
    id: "hobby", name: "Sở thích", items: [
      { n: 46, h: "你喜欢做什么？", p: "Nǐ xǐhuan zuò shénme?", m: "Bạn thích làm gì?", c: [["你", "nǐ", "bạn"], ["喜欢", "xǐhuan", "thích"], ["做", "zuò", "làm"], ["什么", "shénme", "gì"]] },
      { n: 47, h: "我喜欢看书。", p: "Wǒ xǐhuan kàn shū.", m: "Mình thích đọc sách.", c: [["我", "wǒ", "tôi"], ["喜欢", "xǐhuan", "thích"], ["看", "kàn", "đọc, xem"], ["书", "shū", "sách"]] },
      { n: 48, h: "你喜欢运动吗？", p: "Nǐ xǐhuan yùndòng ma?", m: "Bạn có thích tập thể thao không?", c: [["你", "nǐ", "bạn"], ["喜欢", "xǐhuan", "thích"], ["运动", "yùndòng", "thể thao"], ["吗", "ma", "không"]] },
      { n: 49, h: "我每天都散步。", p: "Wǒ měitiān dōu sànbù.", m: "Ngày nào mình cũng đi dạo.", c: [["我", "wǒ", "tôi"], ["每天", "měitiān", "mỗi ngày"], ["都", "dōu", "đều"], ["散步", "sànbù", "đi dạo"]] },
      { n: 50, h: "我们一起去吧！", p: "Wǒmen yìqǐ qù ba!", m: "Mình cùng đi nhé!", c: [["我们", "wǒmen", "chúng ta"], ["一起", "yìqǐ", "cùng nhau"], ["去", "qù", "đi"], ["吧", "ba", "nhé"]] },
    ],
  },
];
