// Dữ liệu các bộ thẻ. Có thể bổ sung thêm bộ mới ở đây.
const DECKS = {
  hsk1_basic: {
    name: "HSK1 · Cơ bản",
    cards: [
      { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "xin chào", example: "你好! 我是小明。" },
      { hanzi: "谢谢", pinyin: "xiè xie", meaning: "cảm ơn", example: "谢谢你的帮助。" },
      { hanzi: "再见", pinyin: "zài jiàn", meaning: "tạm biệt", example: "明天见, 再见!" },
      { hanzi: "我", pinyin: "wǒ", meaning: "tôi, tớ", example: "我是学生。" },
      { hanzi: "你", pinyin: "nǐ", meaning: "bạn", example: "你好吗?" },
      { hanzi: "他", pinyin: "tā", meaning: "anh ấy", example: "他是我的朋友。" },
      { hanzi: "她", pinyin: "tā", meaning: "cô ấy", example: "她很漂亮。" },
      { hanzi: "是", pinyin: "shì", meaning: "là (động từ to be)", example: "我是越南人。" },
      { hanzi: "不", pinyin: "bù", meaning: "không (phủ định)", example: "我不喜欢咖啡。" },
      { hanzi: "有", pinyin: "yǒu", meaning: "có", example: "我有一本书。" },
      { hanzi: "好", pinyin: "hǎo", meaning: "tốt, hay", example: "这本书很好。" },
      { hanzi: "吗", pinyin: "ma", meaning: "trợ từ nghi vấn", example: "你忙吗?" },
      { hanzi: "什么", pinyin: "shén me", meaning: "cái gì", example: "你叫什么名字?" },
      { hanzi: "名字", pinyin: "míng zi", meaning: "tên", example: "我的名字叫小红。" },
      { hanzi: "朋友", pinyin: "péng you", meaning: "bạn bè", example: "他是我最好的朋友。" },
      { hanzi: "老师", pinyin: "lǎo shī", meaning: "giáo viên", example: "王老师很好。" },
      { hanzi: "学生", pinyin: "xué sheng", meaning: "học sinh", example: "我是大学生。" },
      { hanzi: "中国", pinyin: "Zhōng guó", meaning: "Trung Quốc", example: "我喜欢中国。" },
      { hanzi: "越南", pinyin: "Yuè nán", meaning: "Việt Nam", example: "我来自越南。" },
      { hanzi: "爱", pinyin: "ài", meaning: "yêu", example: "我爱我的家人。" },
    ],
  },

  numbers_time: {
    name: "Số đếm & Thời gian",
    cards: [
      { hanzi: "一", pinyin: "yī", meaning: "một (1)", example: "我有一个弟弟。" },
      { hanzi: "二", pinyin: "èr", meaning: "hai (2)", example: "二楼" },
      { hanzi: "三", pinyin: "sān", meaning: "ba (3)", example: "三个人" },
      { hanzi: "四", pinyin: "sì", meaning: "bốn (4)", example: "四月" },
      { hanzi: "五", pinyin: "wǔ", meaning: "năm (5)", example: "五本书" },
      { hanzi: "六", pinyin: "liù", meaning: "sáu (6)", example: "六点" },
      { hanzi: "七", pinyin: "qī", meaning: "bảy (7)", example: "七天" },
      { hanzi: "八", pinyin: "bā", meaning: "tám (8)", example: "八月" },
      { hanzi: "九", pinyin: "jiǔ", meaning: "chín (9)", example: "九岁" },
      { hanzi: "十", pinyin: "shí", meaning: "mười (10)", example: "十分钟" },
      { hanzi: "百", pinyin: "bǎi", meaning: "trăm", example: "一百块钱" },
      { hanzi: "千", pinyin: "qiān", meaning: "nghìn", example: "三千米" },
      { hanzi: "今天", pinyin: "jīn tiān", meaning: "hôm nay", example: "今天星期几?" },
      { hanzi: "明天", pinyin: "míng tiān", meaning: "ngày mai", example: "明天见!" },
      { hanzi: "昨天", pinyin: "zuó tiān", meaning: "hôm qua", example: "昨天我很忙。" },
      { hanzi: "现在", pinyin: "xiàn zài", meaning: "bây giờ", example: "现在几点?" },
      { hanzi: "早上", pinyin: "zǎo shang", meaning: "buổi sáng", example: "早上好!" },
      { hanzi: "晚上", pinyin: "wǎn shang", meaning: "buổi tối", example: "晚上九点" },
      { hanzi: "星期", pinyin: "xīng qī", meaning: "tuần", example: "这个星期" },
      { hanzi: "年", pinyin: "nián", meaning: "năm", example: "今年是2026年。" },
    ],
  },

  daily_verbs: {
    name: "Động từ hằng ngày",
    cards: [
      { hanzi: "吃", pinyin: "chī", meaning: "ăn", example: "我吃米饭。" },
      { hanzi: "喝", pinyin: "hē", meaning: "uống", example: "我喝水。" },
      { hanzi: "去", pinyin: "qù", meaning: "đi", example: "我去学校。" },
      { hanzi: "来", pinyin: "lái", meaning: "đến", example: "请来我家。" },
      { hanzi: "看", pinyin: "kàn", meaning: "xem, nhìn", example: "我看电影。" },
      { hanzi: "听", pinyin: "tīng", meaning: "nghe", example: "我听音乐。" },
      { hanzi: "说", pinyin: "shuō", meaning: "nói", example: "他说中文。" },
      { hanzi: "读", pinyin: "dú", meaning: "đọc", example: "我读书。" },
      { hanzi: "写", pinyin: "xiě", meaning: "viết", example: "写汉字很难。" },
      { hanzi: "学", pinyin: "xué", meaning: "học", example: "我学中文。" },
      { hanzi: "工作", pinyin: "gōng zuò", meaning: "làm việc", example: "我在公司工作。" },
      { hanzi: "睡觉", pinyin: "shuì jiào", meaning: "ngủ", example: "我十点睡觉。" },
      { hanzi: "起床", pinyin: "qǐ chuáng", meaning: "ngủ dậy", example: "我六点起床。" },
      { hanzi: "买", pinyin: "mǎi", meaning: "mua", example: "我买一本书。" },
      { hanzi: "卖", pinyin: "mài", meaning: "bán", example: "他卖水果。" },
      { hanzi: "喜欢", pinyin: "xǐ huan", meaning: "thích", example: "我喜欢你。" },
      { hanzi: "想", pinyin: "xiǎng", meaning: "muốn, nhớ", example: "我想家。" },
      { hanzi: "要", pinyin: "yào", meaning: "muốn, cần", example: "我要一杯咖啡。" },
      { hanzi: "能", pinyin: "néng", meaning: "có thể", example: "你能帮我吗?" },
      { hanzi: "会", pinyin: "huì", meaning: "biết (kỹ năng)", example: "我会说中文。" },
    ],
  },

  greetings_phrases: {
    name: "Chào hỏi & Giao tiếp",
    cards: [
      { hanzi: "对不起", pinyin: "duì bù qǐ", meaning: "xin lỗi", example: "对不起, 我迟到了。" },
      { hanzi: "没关系", pinyin: "méi guān xi", meaning: "không sao", example: "没关系, 没事的。" },
      { hanzi: "不客气", pinyin: "bù kè qì", meaning: "không có gì", example: "谢谢! 不客气。" },
      { hanzi: "请问", pinyin: "qǐng wèn", meaning: "xin hỏi", example: "请问你叫什么名字?" },
      { hanzi: "怎么样", pinyin: "zěn me yàng", meaning: "thế nào, ra sao", example: "你今天怎么样?" },
      { hanzi: "可以", pinyin: "kě yǐ", meaning: "có thể", example: "我可以去你家吗?" },
      { hanzi: "知道", pinyin: "zhī dào", meaning: "biết (thông tin)", example: "我不知道他是谁。" },
      { hanzi: "认识", pinyin: "rèn shi", meaning: "quen biết", example: "很高兴认识你。" },
      { hanzi: "高兴", pinyin: "gāo xìng", meaning: "vui, mừng", example: "我很高兴见到你。" },
      { hanzi: "请", pinyin: "qǐng", meaning: "xin, mời", example: "请坐这里。" },
      { hanzi: "坐", pinyin: "zuò", meaning: "ngồi", example: "请坐。" },
      { hanzi: "走", pinyin: "zǒu", meaning: "đi, rời đi", example: "我们走吧!" },
      { hanzi: "到", pinyin: "dào", meaning: "đến", example: "我到家了。" },
      { hanzi: "家", pinyin: "jiā", meaning: "nhà, gia đình", example: "我的家在越南。" },
      { hanzi: "妈妈", pinyin: "mā ma", meaning: "mẹ", example: "妈妈在家吗?" },
      { hanzi: "爸爸", pinyin: "bà ba", meaning: "bố", example: "我爱爸爸妈妈。" },
      { hanzi: "哥哥", pinyin: "gē ge", meaning: "anh trai", example: "我有一个哥哥。" },
      { hanzi: "弟弟", pinyin: "dì di", meaning: "em trai", example: "弟弟在学校。" },
      { hanzi: "姐姐", pinyin: "jiě jie", meaning: "chị gái", example: "姐姐是老师。" },
      { hanzi: "妹妹", pinyin: "mèi mei", meaning: "em gái", example: "妹妹很可爱。" },
      { hanzi: "家人", pinyin: "jiā rén", meaning: "người nhà", example: "我爱我的家人。" },
      { hanzi: "你们", pinyin: "nǐ men", meaning: "các bạn", example: "你们好!" },
      { hanzi: "我们", pinyin: "wǒ men", meaning: "chúng tôi", example: "我们是朋友。" },
      { hanzi: "他们", pinyin: "tā men", meaning: "họ", example: "他们在工作。" },
    ],
  },

  daily_objects: {
    name: "Đồ vật & Sinh hoạt",
    cards: [
      { hanzi: "书", pinyin: "shū", meaning: "sách", example: "这本书很好。" },
      { hanzi: "本", pinyin: "běn", meaning: "lượng từ (sách)", example: "我有三本书。" },
      { hanzi: "车", pinyin: "chē", meaning: "xe", example: "我的车很小。" },
      { hanzi: "电脑", pinyin: "diàn nǎo", meaning: "máy tính", example: "我用电脑工作。" },
      { hanzi: "手机", pinyin: "shǒu jī", meaning: "điện thoại di động", example: "这是我的手机。" },
      { hanzi: "电视", pinyin: "diàn shì", meaning: "TV", example: "我们一起看电视。" },
      { hanzi: "电影", pinyin: "diàn yǐng", meaning: "phim", example: "这个电影很好看。" },
      { hanzi: "音乐", pinyin: "yīn yuè", meaning: "âm nhạc", example: "我喜欢听中国音乐。" },
      { hanzi: "衣服", pinyin: "yī fu", meaning: "quần áo", example: "这件衣服很漂亮。" },
      { hanzi: "桌子", pinyin: "zhuō zi", meaning: "bàn", example: "桌子上有一本书。" },
      { hanzi: "椅子", pinyin: "yǐ zi", meaning: "ghế", example: "请坐椅子。" },
      { hanzi: "门", pinyin: "mén", meaning: "cửa", example: "请关门。" },
      { hanzi: "钱", pinyin: "qián", meaning: "tiền", example: "这个多少钱?" },
      { hanzi: "块", pinyin: "kuài", meaning: "đồng (tiền)", example: "一百块钱。" },
      { hanzi: "学校", pinyin: "xué xiào", meaning: "trường học", example: "我去学校学中文。" },
      { hanzi: "商店", pinyin: "shāng diàn", meaning: "cửa hàng", example: "我去商店买东西。" },
      { hanzi: "东西", pinyin: "dōng xi", meaning: "đồ vật", example: "我买了很多东西。" },
      { hanzi: "朋友", pinyin: "péng you", meaning: "bạn (đồ vật deck)", example: "他是我的好朋友。" },
      { hanzi: "可爱", pinyin: "kě ài", meaning: "đáng yêu", example: "妹妹很可爱。" },
      { hanzi: "漂亮", pinyin: "piào liang", meaning: "đẹp", example: "你今天很漂亮。" },
      { hanzi: "多少", pinyin: "duō shao", meaning: "bao nhiêu", example: "这个多少钱?" },
      { hanzi: "一起", pinyin: "yì qǐ", meaning: "cùng nhau", example: "我们一起去。" },
      { hanzi: "这", pinyin: "zhè", meaning: "này", example: "这是什么?" },
      { hanzi: "那", pinyin: "nà", meaning: "kia, đó", example: "那是我的朋友。" },
    ],
  },

  food: {
    name: "Đồ ăn & Thức uống",
    cards: [
      { hanzi: "米饭", pinyin: "mǐ fàn", meaning: "cơm", example: "我喜欢吃米饭。" },
      { hanzi: "面条", pinyin: "miàn tiáo", meaning: "mì sợi", example: "这家的面条很好吃。" },
      { hanzi: "饺子", pinyin: "jiǎo zi", meaning: "sủi cảo", example: "我会包饺子。" },
      { hanzi: "包子", pinyin: "bāo zi", meaning: "bánh bao", example: "早上吃包子。" },
      { hanzi: "鸡蛋", pinyin: "jī dàn", meaning: "trứng gà", example: "一个鸡蛋" },
      { hanzi: "牛肉", pinyin: "niú ròu", meaning: "thịt bò", example: "牛肉面" },
      { hanzi: "鸡肉", pinyin: "jī ròu", meaning: "thịt gà", example: "鸡肉汤" },
      { hanzi: "鱼", pinyin: "yú", meaning: "cá", example: "我喜欢吃鱼。" },
      { hanzi: "蔬菜", pinyin: "shū cài", meaning: "rau củ", example: "多吃蔬菜。" },
      { hanzi: "水果", pinyin: "shuǐ guǒ", meaning: "hoa quả", example: "水果很甜。" },
      { hanzi: "苹果", pinyin: "píng guǒ", meaning: "táo", example: "一个苹果" },
      { hanzi: "香蕉", pinyin: "xiāng jiāo", meaning: "chuối", example: "香蕉很甜。" },
      { hanzi: "水", pinyin: "shuǐ", meaning: "nước", example: "喝一杯水。" },
      { hanzi: "茶", pinyin: "chá", meaning: "trà", example: "中国茶" },
      { hanzi: "咖啡", pinyin: "kā fēi", meaning: "cà phê", example: "越南咖啡很有名。" },
      { hanzi: "牛奶", pinyin: "niú nǎi", meaning: "sữa bò", example: "一盒牛奶" },
      { hanzi: "啤酒", pinyin: "pí jiǔ", meaning: "bia", example: "喝啤酒" },
      { hanzi: "好吃", pinyin: "hǎo chī", meaning: "ngon (đồ ăn)", example: "这个菜很好吃!" },
      { hanzi: "好喝", pinyin: "hǎo hē", meaning: "ngon (đồ uống)", example: "这杯茶好喝。" },
      { hanzi: "饿", pinyin: "è", meaning: "đói", example: "我饿了。" },
    ],
  },

  // ---------------------------------------------------------------------------
  // Bộ CÂU HỘI THOẠI: mỗi thẻ là một câu hoàn chỉnh.
  // Trường `words` dùng cho chế độ "🧩 Ghép câu" (xếp từ thành câu đúng).
  // Khi so sánh, dấu câu được bỏ qua nên `words` chỉ cần chứa chữ Hán.
  // ---------------------------------------------------------------------------
  conversations_basic: {
    name: "💬 Hội thoại & Đặt câu",
    cards: [
      { hanzi: "你好，我叫小明。", pinyin: "nǐ hǎo, wǒ jiào Xiǎo Míng", meaning: "Xin chào, tôi tên là Tiểu Minh.", words: ["你好", "我", "叫", "小明"], example: "A: 你好！你叫什么名字？ B: 你好，我叫小明。" },
      { hanzi: "你叫什么名字？", pinyin: "nǐ jiào shén me míng zi", meaning: "Bạn tên là gì?", words: ["你", "叫", "什么", "名字"], example: "A: 你叫什么名字？ B: 我叫小红。" },
      { hanzi: "很高兴认识你。", pinyin: "hěn gāo xìng rèn shi nǐ", meaning: "Rất vui được biết bạn.", words: ["很", "高兴", "认识", "你"], example: "A: 他是我朋友。 B: 很高兴认识你。" },
      { hanzi: "我是越南人。", pinyin: "wǒ shì Yuè nán rén", meaning: "Tôi là người Việt Nam.", words: ["我", "是", "越南", "人"], example: "A: 你是哪国人？ B: 我是越南人。" },
      { hanzi: "你会说中文吗？", pinyin: "nǐ huì shuō Zhōng wén ma", meaning: "Bạn biết nói tiếng Trung không?", words: ["你", "会", "说", "中文", "吗"], example: "A: 你会说中文吗？ B: 我会说一点儿。" },
      { hanzi: "我会说一点儿。", pinyin: "wǒ huì shuō yì diǎnr", meaning: "Tôi biết nói một chút.", words: ["我", "会", "说", "一点儿"], example: "A: 你会说中文吗？ B: 我会说一点儿。" },
      { hanzi: "请问，洗手间在哪里？", pinyin: "qǐng wèn, xǐ shǒu jiān zài nǎ lǐ", meaning: "Xin hỏi, nhà vệ sinh ở đâu?", words: ["请问", "洗手间", "在", "哪里"], example: "A: 请问，洗手间在哪里？ B: 在二楼。" },
      { hanzi: "这个多少钱？", pinyin: "zhè ge duō shao qián", meaning: "Cái này bao nhiêu tiền?", words: ["这个", "多少", "钱"], example: "A: 这个多少钱？ B: 二十块。" },
      { hanzi: "太贵了，便宜一点儿吧。", pinyin: "tài guì le, pián yi yì diǎnr ba", meaning: "Đắt quá, rẻ hơn một chút đi.", words: ["太", "贵", "了", "便宜", "一点儿", "吧"], example: "A: 一百块。 B: 太贵了，便宜一点儿吧。" },
      { hanzi: "我要一杯咖啡。", pinyin: "wǒ yào yì bēi kā fēi", meaning: "Tôi muốn một ly cà phê.", words: ["我", "要", "一杯", "咖啡"], example: "A: 你喝什么？ B: 我要一杯咖啡。" },
      { hanzi: "今天天气很好。", pinyin: "jīn tiān tiān qì hěn hǎo", meaning: "Hôm nay thời tiết rất đẹp.", words: ["今天", "天气", "很", "好"], example: "A: 今天天气怎么样？ B: 今天天气很好。" },
      { hanzi: "你吃饭了吗？", pinyin: "nǐ chī fàn le ma", meaning: "Bạn ăn cơm chưa?", words: ["你", "吃", "饭", "了", "吗"], example: "A: 你吃饭了吗？ B: 还没呢。" },
      { hanzi: "我们一起去吧。", pinyin: "wǒ men yì qǐ qù ba", meaning: "Chúng ta cùng đi nhé.", words: ["我们", "一起", "去", "吧"], example: "A: 我想去看电影。 B: 我们一起去吧。" },
      { hanzi: "对不起，我迟到了。", pinyin: "duì bù qǐ, wǒ chí dào le", meaning: "Xin lỗi, tôi đến muộn.", words: ["对不起", "我", "迟到", "了"], example: "A: 对不起，我迟到了。 B: 没关系。" },
      { hanzi: "没关系，请坐。", pinyin: "méi guān xi, qǐng zuò", meaning: "Không sao, mời ngồi.", words: ["没关系", "请", "坐"], example: "A: 对不起，我来晚了。 B: 没关系，请坐。" },
      { hanzi: "明天见！", pinyin: "míng tiān jiàn", meaning: "Mai gặp lại!", words: ["明天", "见"], example: "A: 再见！ B: 明天见！" },
    ],
  },

  conversations_travel: {
    name: "🧳 Hội thoại du lịch",
    cards: [
      { hanzi: "请问，火车站在哪儿？", pinyin: "qǐng wèn, huǒ chē zhàn zài nǎr", meaning: "Xin hỏi, ga tàu ở đâu?", words: ["请问", "火车站", "在", "哪儿"], example: "A: 请问，火车站在哪儿？ B: 在前边。" },
      { hanzi: "我要买一张票。", pinyin: "wǒ yào mǎi yì zhāng piào", meaning: "Tôi muốn mua một vé.", words: ["我", "要", "买", "一张", "票"], example: "A: 你要什么？ B: 我要买一张票。" },
      { hanzi: "去北京的火车几点开？", pinyin: "qù Běi jīng de huǒ chē jǐ diǎn kāi", meaning: "Tàu đi Bắc Kinh mấy giờ khởi hành?", words: ["去", "北京", "的", "火车", "几点", "开"], example: "A: 去北京的火车几点开？ B: 八点开。" },
      { hanzi: "这个酒店在市中心。", pinyin: "zhè ge jiǔ diàn zài shì zhōng xīn", meaning: "Khách sạn này ở trung tâm thành phố.", words: ["这个", "酒店", "在", "市中心"], example: "A: 这个酒店在哪儿？ B: 这个酒店在市中心。" },
      { hanzi: "我想订一个房间。", pinyin: "wǒ xiǎng dìng yí ge fáng jiān", meaning: "Tôi muốn đặt một phòng.", words: ["我", "想", "订", "一个", "房间"], example: "A: 你好，我想订一个房间。 B: 好的。" },
      { hanzi: "请问附近有餐厅吗？", pinyin: "qǐng wèn fù jìn yǒu cān tīng ma", meaning: "Xin hỏi gần đây có nhà hàng không?", words: ["请问", "附近", "有", "餐厅", "吗"], example: "A: 请问附近有餐厅吗？ B: 有，前边就有一家。" },
      { hanzi: "从这里怎么走？", pinyin: "cóng zhè lǐ zěn me zǒu", meaning: "Đi từ đây thế nào?", words: ["从", "这里", "怎么", "走"], example: "A: 从这里怎么走？ B: 一直走就到了。" },
      { hanzi: "一直走就到了。", pinyin: "yì zhí zǒu jiù dào le", meaning: "Cứ đi thẳng là tới.", words: ["一直走", "就", "到", "了"], example: "A: 从这里怎么走？ B: 一直走就到了。" },
      { hanzi: "我听不懂，请再说一遍。", pinyin: "wǒ tīng bù dǒng, qǐng zài shuō yí biàn", meaning: "Tôi không hiểu, xin nói lại một lần.", words: ["我", "听不懂", "请", "再", "说", "一遍"], example: "A: 你听得懂吗？ B: 我听不懂，请再说一遍。" },
      { hanzi: "你能帮我吗？", pinyin: "nǐ néng bāng wǒ ma", meaning: "Bạn có thể giúp tôi không?", words: ["你", "能", "帮", "我", "吗"], example: "A: 你能帮我吗？ B: 当然可以。" },
      { hanzi: "你的中文说得很好！", pinyin: "nǐ de Zhōng wén shuō de hěn hǎo", meaning: "Tiếng Trung của bạn nói rất tốt!", words: ["你", "的", "中文", "说", "得", "很", "好"], example: "A: 你的中文说得很好！ B: 谢谢！" },
      { hanzi: "谢谢你的帮助。", pinyin: "xiè xie nǐ de bāng zhù", meaning: "Cảm ơn sự giúp đỡ của bạn.", words: ["谢谢", "你的", "帮助"], example: "A: 谢谢你的帮助。 B: 不客气。" },
    ],
  },

  conversations_shopping: {
    name: "🛍 Hội thoại mua sắm",
    cards: [
      { hanzi: "这个多少钱？", pinyin: "zhè ge duō shao qián", meaning: "Cái này bao nhiêu tiền?", words: ["这个", "多少", "钱"], example: "A: 这个多少钱？ B: 二十块。" },
      { hanzi: "有没有大一点的？", pinyin: "yǒu méi yǒu dà yì diǎn de", meaning: "Có cỡ lớn hơn không?", words: ["有", "没有", "大", "一点", "的"], example: "A: 有没有大一点的？ B: 有，我拿给你。" },
      { hanzi: "我只要这个。", pinyin: "wǒ zhǐ yào zhè ge", meaning: "Tôi chỉ cần cái này.", words: ["我", "只", "要", "这个"], example: "A: 你还要别的吗？ B: 我只要这个。" },
      { hanzi: "可以便宜一点吗？", pinyin: "kě yǐ pián yi yì diǎn ma", meaning: "Có thể rẻ hơn chút không?", words: ["可以", "便宜", "一点", "吗"], example: "A: 可以便宜一点吗？ B: 好的，便宜五块。" },
      { hanzi: "我要买这个。", pinyin: "wǒ yào mǎi zhè ge", meaning: "Tôi muốn mua cái này.", words: ["我", "要", "买", "这个"], example: "A: 你要哪个？ B: 我要买这个。" },
      { hanzi: "一共多少钱？", pinyin: "yí gòng duō shao qián", meaning: "Tổng cộng bao nhiêu tiền?", words: ["一共", "多少", "钱"], example: "A: 一共多少钱？ B: 一共五十块。" },
      { hanzi: "请给我一个袋子。", pinyin: "qǐng gěi wǒ yí ge dài zi", meaning: "Xin cho tôi một cái túi.", words: ["请", "给", "我", "一个", "袋子"], example: "A: 请给我一个袋子。 B: 好的。" },
      { hanzi: "这个有红色的吗？", pinyin: "zhè ge yǒu hóng sè de ma", meaning: "Cái này có màu đỏ không?", words: ["这个", "有", "红色", "的", "吗"], example: "A: 这个有红色的吗？ B: 有红色的。" },
      { hanzi: "我试试可以吗？", pinyin: "wǒ shì shi kě yǐ ma", meaning: "Tôi thử được không?", words: ["我", "试试", "可以", "吗"], example: "A: 我试试可以吗？ B: 当然可以。" },
      { hanzi: "我买两个。", pinyin: "wǒ mǎi liǎng ge", meaning: "Tôi mua hai cái.", words: ["我", "买", "两个"], example: "A: 你要几个？ B: 我买两个。" },
    ],
  },

  conversations_restaurant: {
    name: "🍜 Hội thoại nhà hàng",
    cards: [
      { hanzi: "请给我菜单。", pinyin: "qǐng gěi wǒ cài dān", meaning: "Xin cho tôi thực đơn.", words: ["请", "给", "我", "菜单"], example: "A: 请给我菜单。 B: 好的，请稍等。" },
      { hanzi: "我要点菜。", pinyin: "wǒ yào diǎn cài", meaning: "Tôi muốn gọi món.", words: ["我", "要", "点菜"], example: "A: 可以点菜了吗？ B: 我要点菜。" },
      { hanzi: "你们有什么推荐？", pinyin: "nǐ men yǒu shén me tuī jiàn", meaning: "Các bạn có món gì gợi ý?", words: ["你们", "有", "什么", "推荐"], example: "A: 你们有什么推荐？ B: 招牌菜很好吃。" },
      { hanzi: "我不吃辣。", pinyin: "wǒ bù chī là", meaning: "Tôi không ăn cay.", words: ["我", "不", "吃", "辣"], example: "A: 你要辣的吗？ B: 我不吃辣。" },
      { hanzi: "请来两碗米饭。", pinyin: "qǐng lái liǎng wǎn mǐ fàn", meaning: "Xin mang hai bát cơm.", words: ["请", "来", "两碗", "米饭"], example: "A: 请来两碗米饭。 B: 马上来。" },
      { hanzi: "这个菜很好吃。", pinyin: "zhè ge cài hěn hǎo chī", meaning: "Món này rất ngon.", words: ["这个", "菜", "很", "好吃"], example: "A: 味道怎么样？ B: 这个菜很好吃。" },
      { hanzi: "请帮我买单。", pinyin: "qǐng bāng wǒ mǎi dān", meaning: "Xin tính tiền giúp tôi.", words: ["请", "帮", "我", "买单"], example: "A: 服务员，请帮我买单。 B: 好的。" },
      { hanzi: "我要一杯茶。", pinyin: "wǒ yào yì bēi chá", meaning: "Tôi muốn một ly trà.", words: ["我", "要", "一杯", "茶"], example: "A: 你想喝什么？ B: 我要一杯茶。" },
      { hanzi: "有没有素的？", pinyin: "yǒu méi yǒu sù de", meaning: "Có món chay không?", words: ["有", "没有", "素", "的"], example: "A: 有没有素的？ B: 有蔬菜。" },
      { hanzi: "打包带走。", pinyin: "dǎ bāo dài zǒu", meaning: "Gói mang đi.", words: ["打包", "带走"], example: "A: 在这里吃还是带走？ B: 打包带走。" },
    ],
  },

  conversations_family: {
    name: "🏡 Hội thoại gia đình & bạn bè",
    cards: [
      { hanzi: "这是我的妈妈。", pinyin: "zhè shì wǒ de mā ma", meaning: "Đây là mẹ tôi.", words: ["这", "是", "我的", "妈妈"], example: "A: 这是谁？ B: 这是我的妈妈。" },
      { hanzi: "你有兄弟姐妹吗？", pinyin: "nǐ yǒu xiōng dì jiě mèi ma", meaning: "Bạn có anh chị em không?", words: ["你", "有", "兄弟姐妹", "吗"], example: "A: 你有兄弟姐妹吗？ B: 我有一个哥哥。" },
      { hanzi: "我家有四口人。", pinyin: "wǒ jiā yǒu sì kǒu rén", meaning: "Nhà tôi có bốn người.", words: ["我家", "有", "四口", "人"], example: "A: 你家有几口人？ B: 我家有四口人。" },
      { hanzi: "他是我最好的朋友。", pinyin: "tā shì wǒ zuì hǎo de péng you", meaning: "Anh ấy là bạn thân nhất của tôi.", words: ["他", "是", "我", "最好的", "朋友"], example: "A: 他是谁？ B: 他是我最好的朋友。" },
      { hanzi: "我们经常一起玩。", pinyin: "wǒ men jīng cháng yì qǐ wán", meaning: "Chúng tôi thường chơi cùng nhau.", words: ["我们", "经常", "一起", "玩"], example: "A: 你们常常见面吗？ B: 我们经常一起玩。" },
      { hanzi: "我爸爸是医生。", pinyin: "wǒ bà ba shì yī shēng", meaning: "Bố tôi là bác sĩ.", words: ["我", "爸爸", "是", "医生"], example: "A: 你爸爸做什么工作？ B: 我爸爸是医生。" },
      { hanzi: "你们认识多久了？", pinyin: "nǐ men rèn shi duō jiǔ le", meaning: "Các bạn quen nhau bao lâu rồi?", words: ["你们", "认识", "多久", "了"], example: "A: 你们认识多久了？ B: 三年了。" },
      { hanzi: "我和妹妹住在一起。", pinyin: "wǒ hé mèi mei zhù zài yì qǐ", meaning: "Tôi ở cùng em gái.", words: ["我", "和", "妹妹", "住", "在一起"], example: "A: 你和谁住？ B: 我和妹妹住在一起。" },
      { hanzi: "周末你做什么？", pinyin: "zhōu mò nǐ zuò shén me", meaning: "Cuối tuần bạn làm gì?", words: ["周末", "你", "做", "什么"], example: "A: 周末你做什么？ B: 我在家休息。" },
      { hanzi: "我们去看电影吧。", pinyin: "wǒ men qù kàn diàn yǐng ba", meaning: "Chúng ta đi xem phim nhé.", words: ["我们", "去", "看", "电影", "吧"], example: "A: 我们去看电影吧。 B: 好主意！" },
    ],
  },

  conversations_health: {
    name: "🏥 Hội thoại sức khỏe",
    cards: [
      { hanzi: "我感冒了。", pinyin: "wǒ gǎn mào le", meaning: "Tôi bị cảm.", words: ["我", "感冒", "了"], example: "A: 你怎么了？ B: 我感冒了。" },
      { hanzi: "我头疼。", pinyin: "wǒ tóu téng", meaning: "Tôi đau đầu.", words: ["我", "头", "疼"], example: "A: 你哪里不舒服？ B: 我头疼。" },
      { hanzi: "你哪里不舒服？", pinyin: "nǐ nǎ lǐ bù shū fu", meaning: "Bạn thấy khó chịu ở đâu?", words: ["你", "哪里", "不", "舒服"], example: "A: 你哪里不舒服？ B: 我肚子疼。" },
      { hanzi: "我要看医生。", pinyin: "wǒ yào kàn yī shēng", meaning: "Tôi cần gặp bác sĩ.", words: ["我", "要", "看", "医生"], example: "A: 你不舒服吗？ B: 我要看医生。" },
      { hanzi: "多喝水，多休息。", pinyin: "duō hē shuǐ, duō xiū xi", meaning: "Uống nhiều nước, nghỉ ngơi nhiều.", words: ["多", "喝水", "多", "休息"], example: "A: 我该怎么办？ B: 多喝水，多休息。" },
      { hanzi: "你吃药了吗？", pinyin: "nǐ chī yào le ma", meaning: "Bạn uống thuốc chưa?", words: ["你", "吃", "药", "了", "吗"], example: "A: 你吃药了吗？ B: 还没。" },
      { hanzi: "我感觉好多了。", pinyin: "wǒ gǎn jué hǎo duō le", meaning: "Tôi cảm thấy đỡ nhiều rồi.", words: ["我", "感觉", "好多", "了"], example: "A: 你现在怎么样？ B: 我感觉好多了。" },
      { hanzi: "这里疼吗？", pinyin: "zhè lǐ téng ma", meaning: "Chỗ này đau không?", words: ["这里", "疼", "吗"], example: "A: 这里疼吗？ B: 有一点疼。" },
      { hanzi: "去医院看看吧。", pinyin: "qù yī yuàn kàn kan ba", meaning: "Đi bệnh viện khám nhé.", words: ["去", "医院", "看看", "吧"], example: "A: 你还是不舒服吗？ B: 去医院看看吧。" },
      { hanzi: "祝早日康复！", pinyin: "zhù zǎo rì kāng fù", meaning: "Chúc sớm khỏi bệnh!", words: ["祝", "早日", "康复"], example: "A: 我要休息了。 B: 祝早日康复！" },
    ],
  },

  conversations_transport: {
    name: "🚕 Hội thoại đi lại",
    cards: [
      { hanzi: "我们去机场。", pinyin: "wǒ men qù jī chǎng", meaning: "Chúng tôi đi sân bay.", words: ["我们", "去", "机场"], example: "A: 你们去哪儿？ B: 我们去机场。" },
      { hanzi: "打车要多少钱？", pinyin: "dǎ chē yào duō shao qián", meaning: "Đi taxi hết bao nhiêu tiền?", words: ["打车", "要", "多少", "钱"], example: "A: 打车要多少钱？ B: 大概三十块。" },
      { hanzi: "去火车站怎么走？", pinyin: "qù huǒ chē zhàn zěn me zǒu", meaning: "Đến ga tàu đi thế nào?", words: ["去", "火车站", "怎么", "走"], example: "A: 去火车站怎么走？ B: 坐地铁二号线。" },
      { hanzi: "请送我去这里。", pinyin: "qǐng sòng wǒ qù zhè lǐ", meaning: "Xin đưa tôi đến đây.", words: ["请", "送", "我", "去", "这里"], example: "A: 您去哪儿？ B: 请送我去这里。" },
      { hanzi: "车票多少钱一张？", pinyin: "chē piào duō shao qián yì zhāng", meaning: "Vé bao nhiêu tiền một tấm?", words: ["车票", "多少", "钱", "一张"], example: "A: 车票多少钱一张？ B: 两块钱。" },
      { hanzi: "我坐地铁去。", pinyin: "wǒ zuò dì tiě qù", meaning: "Tôi đi tàu điện ngầm.", words: ["我", "坐", "地铁", "去"], example: "A: 你怎么去？ B: 我坐地铁去。" },
      { hanzi: "在哪儿下车？", pinyin: "zài nǎr xià chē", meaning: "Xuống xe ở đâu?", words: ["在", "哪儿", "下车"], example: "A: 在哪儿下车？ B: 在下一站下车。" },
      { hanzi: "下一站到了。", pinyin: "xià yí zhàn dào le", meaning: "Đến trạm tiếp theo rồi.", words: ["下一站", "到", "了"], example: "A: 快到了吗？ B: 下一站到了。" },
      { hanzi: "请问还有多远？", pinyin: "qǐng wèn hái yǒu duō yuǎn", meaning: "Xin hỏi còn bao xa?", words: ["请问", "还有", "多远"], example: "A: 请问还有多远？ B: 不远，五分钟。" },
      { hanzi: "我迟到了。", pinyin: "wǒ chí dào le", meaning: "Tôi đến muộn.", words: ["我", "迟到", "了"], example: "A: 你到了吗？ B: 对不起，我迟到了。" },
    ],
  },
};

// Các nhóm từ cơ bản bổ sung, kèm câu và bản dịch đầy đủ.
DECKS.hsk1_family = {
  "name": "HSK1 · Gia đình & con người",
  "cards": [
    {
      "hanzi": "爸爸",
      "pinyin": "bà ba",
      "meaning": "bố",
      "example": "我爸爸是老师。",
      "examplePinyin": "wǒ bà ba shì lǎo shī",
      "exampleMeaning": "Bố tôi là giáo viên."
    },
    {
      "hanzi": "妈妈",
      "pinyin": "mā ma",
      "meaning": "mẹ",
      "example": "我妈妈在家。",
      "examplePinyin": "wǒ mā ma zài jiā",
      "exampleMeaning": "Mẹ tôi ở nhà."
    },
    {
      "hanzi": "儿子",
      "pinyin": "ér zi",
      "meaning": "con trai",
      "example": "他是我儿子。",
      "examplePinyin": "tā shì wǒ ér zi",
      "exampleMeaning": "Cậu ấy là con trai tôi."
    },
    {
      "hanzi": "女儿",
      "pinyin": "nǚ ér",
      "meaning": "con gái",
      "example": "我女儿三岁。",
      "examplePinyin": "wǒ nǚ ér sān suì",
      "exampleMeaning": "Con gái tôi ba tuổi."
    },
    {
      "hanzi": "家",
      "pinyin": "jiā",
      "meaning": "nhà; gia đình",
      "example": "我家有三个人。",
      "examplePinyin": "wǒ jiā yǒu sān ge rén",
      "exampleMeaning": "Nhà tôi có ba người."
    },
    {
      "hanzi": "人",
      "pinyin": "rén",
      "meaning": "người",
      "example": "他是中国人。",
      "examplePinyin": "tā shì zhōng guó rén",
      "exampleMeaning": "Anh ấy là người Trung Quốc."
    },
    {
      "hanzi": "先生",
      "pinyin": "xiān sheng",
      "meaning": "ông; ngài",
      "example": "王先生在这儿。",
      "examplePinyin": "wáng xiān sheng zài zhèr",
      "exampleMeaning": "Ông Vương ở đây."
    },
    {
      "hanzi": "同学",
      "pinyin": "tóng xué",
      "meaning": "bạn học",
      "example": "她是我的同学。",
      "examplePinyin": "tā shì wǒ de tóng xué",
      "exampleMeaning": "Cô ấy là bạn học của tôi."
    }
  ]
};
DECKS.hsk1_questions = {
  "name": "HSK1 · Hỏi & chỉ vị trí",
  "cards": [
    {
      "hanzi": "谁",
      "pinyin": "shéi",
      "meaning": "ai",
      "example": "他是谁？",
      "examplePinyin": "tā shì shéi",
      "exampleMeaning": "Anh ấy là ai?"
    },
    {
      "hanzi": "哪",
      "pinyin": "nǎ",
      "meaning": "nào",
      "example": "你是哪国人？",
      "examplePinyin": "nǐ shì nǎ guó rén",
      "exampleMeaning": "Bạn là người nước nào?"
    },
    {
      "hanzi": "哪儿",
      "pinyin": "nǎr",
      "meaning": "ở đâu",
      "example": "你去哪儿？",
      "examplePinyin": "nǐ qù nǎr",
      "exampleMeaning": "Bạn đi đâu?"
    },
    {
      "hanzi": "这",
      "pinyin": "zhè",
      "meaning": "đây; này",
      "example": "这是我的书。",
      "examplePinyin": "zhè shì wǒ de shū",
      "exampleMeaning": "Đây là sách của tôi."
    },
    {
      "hanzi": "那",
      "pinyin": "nà",
      "meaning": "kia; đó",
      "example": "那是我妈妈。",
      "examplePinyin": "nà shì wǒ mā ma",
      "exampleMeaning": "Đó là mẹ tôi."
    },
    {
      "hanzi": "里",
      "pinyin": "lǐ",
      "meaning": "bên trong",
      "example": "他在学校里。",
      "examplePinyin": "tā zài xué xiào lǐ",
      "exampleMeaning": "Anh ấy ở trong trường."
    },
    {
      "hanzi": "前面",
      "pinyin": "qián miàn",
      "meaning": "phía trước",
      "example": "学校在前面。",
      "examplePinyin": "xué xiào zài qián miàn",
      "exampleMeaning": "Trường học ở phía trước."
    },
    {
      "hanzi": "后面",
      "pinyin": "hòu miàn",
      "meaning": "phía sau",
      "example": "他在我后面。",
      "examplePinyin": "tā zài wǒ hòu miàn",
      "exampleMeaning": "Anh ấy ở phía sau tôi."
    }
  ]
};
DECKS.hsk1_weather = {
  "name": "HSK1 · Thời tiết & cảm nhận",
  "cards": [
    {
      "hanzi": "天气",
      "pinyin": "tiān qì",
      "meaning": "thời tiết",
      "example": "今天天气很好。",
      "examplePinyin": "jīn tiān tiān qì hěn hǎo",
      "exampleMeaning": "Hôm nay thời tiết rất đẹp."
    },
    {
      "hanzi": "冷",
      "pinyin": "lěng",
      "meaning": "lạnh",
      "example": "今天很冷。",
      "examplePinyin": "jīn tiān hěn lěng",
      "exampleMeaning": "Hôm nay rất lạnh."
    },
    {
      "hanzi": "热",
      "pinyin": "rè",
      "meaning": "nóng",
      "example": "今天太热了。",
      "examplePinyin": "jīn tiān tài rè le",
      "exampleMeaning": "Hôm nay nóng quá."
    },
    {
      "hanzi": "下雨",
      "pinyin": "xià yǔ",
      "meaning": "mưa",
      "example": "明天下雨吗？",
      "examplePinyin": "míng tiān xià yǔ ma",
      "exampleMeaning": "Ngày mai có mưa không?"
    },
    {
      "hanzi": "高兴",
      "pinyin": "gāo xìng",
      "meaning": "vui",
      "example": "我很高兴。",
      "examplePinyin": "wǒ hěn gāo xìng",
      "exampleMeaning": "Tôi rất vui."
    },
    {
      "hanzi": "漂亮",
      "pinyin": "piào liang",
      "meaning": "xinh đẹp",
      "example": "她很漂亮。",
      "examplePinyin": "tā hěn piào liang",
      "exampleMeaning": "Cô ấy rất xinh đẹp."
    },
    {
      "hanzi": "大",
      "pinyin": "dà",
      "meaning": "to; lớn",
      "example": "这个苹果很大。",
      "examplePinyin": "zhè ge píng guǒ hěn dà",
      "exampleMeaning": "Quả táo này rất to."
    },
    {
      "hanzi": "小",
      "pinyin": "xiǎo",
      "meaning": "nhỏ; bé",
      "example": "这只猫很小。",
      "examplePinyin": "zhè zhī māo hěn xiǎo",
      "exampleMeaning": "Con mèo này rất nhỏ."
    }
  ]
};
