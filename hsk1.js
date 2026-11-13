// HSK 2.0 Level 1: 150 unique headwords. Not the HSK 3.0 syllabus.
// Scope: https://www.chinesetest.cn/HSK/1?type=2
// Headword cross-check: https://hskgames.io/libraries/hsk1
// Vietnamese glosses and examples authored/adapted for this app.
(function () {
const lessons = [
  {
    "id": "hsk1_v2_01",
    "name": "HSK1 2.0 · Bài 01 · Tự giới thiệu",
    "cards": [
      {
        "hanzi": "我",
        "pinyin": "wǒ",
        "meaning": "tôi, tớ",
        "example": "我是学生。",
        "examplePinyin": "wǒ shì xué shēng 。",
        "exampleMeaning": "Tôi là học sinh."
      },
      {
        "hanzi": "你",
        "pinyin": "nǐ",
        "meaning": "bạn",
        "example": "你好吗?",
        "examplePinyin": "nǐ hǎo ma ?",
        "exampleMeaning": "Bạn có khỏe không?"
      },
      {
        "hanzi": "他",
        "pinyin": "tā",
        "meaning": "anh ấy",
        "example": "他是我的朋友。",
        "examplePinyin": "tā shì wǒ de péng yǒu 。",
        "exampleMeaning": "Anh ấy là bạn của tôi."
      },
      {
        "hanzi": "她",
        "pinyin": "tā",
        "meaning": "cô ấy",
        "example": "她很漂亮。",
        "examplePinyin": "tā hěn piào liang 。",
        "exampleMeaning": "Cô ấy rất xinh."
      },
      {
        "hanzi": "我们",
        "pinyin": "wǒ men",
        "meaning": "chúng tôi",
        "example": "我们是朋友。",
        "examplePinyin": "wǒ men shì péng yǒu 。",
        "exampleMeaning": "Chúng ta là bạn."
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
        "hanzi": "名字",
        "pinyin": "míng zi",
        "meaning": "tên",
        "example": "我的名字叫小红。",
        "examplePinyin": "wǒ de míng zì jiào xiǎo hóng 。",
        "exampleMeaning": "Tôi tên Tiểu Hồng."
      },
      {
        "hanzi": "叫",
        "pinyin": "jiào",
        "meaning": "gọi; tên là",
        "example": "你叫什么名字？",
        "examplePinyin": "nǐ jiào shén me míng zi",
        "exampleMeaning": "Bạn tên là gì?"
      },
      {
        "hanzi": "是",
        "pinyin": "shì",
        "meaning": "là (động từ to be)",
        "example": "我是越南人。",
        "examplePinyin": "wǒ shì yuè nán rén 。",
        "exampleMeaning": "Tôi là người Việt Nam."
      },
      {
        "hanzi": "不",
        "pinyin": "bù",
        "meaning": "không (phủ định)",
        "example": "我不喜欢咖啡。",
        "examplePinyin": "wǒ bù xǐ huan kā fēi 。",
        "exampleMeaning": "Tôi không thích cà phê."
      },
      {
        "hanzi": "吗",
        "pinyin": "ma",
        "meaning": "trợ từ nghi vấn",
        "example": "你忙吗?",
        "examplePinyin": "nǐ máng ma ?",
        "exampleMeaning": "Bạn có bận không?"
      },
      {
        "hanzi": "呢",
        "pinyin": "ne",
        "meaning": "trợ từ hỏi tiếp hoặc chỉ tiếp diễn",
        "example": "我很好，你呢？",
        "examplePinyin": "wǒ hěn hǎo nǐ ne",
        "exampleMeaning": "Tôi khỏe, còn bạn?"
      },
      {
        "hanzi": "谁",
        "pinyin": "shéi",
        "meaning": "ai",
        "example": "他是谁？",
        "examplePinyin": "tā shì shéi",
        "exampleMeaning": "Anh ấy là ai?"
      },
      {
        "hanzi": "什么",
        "pinyin": "shén me",
        "meaning": "cái gì",
        "example": "你叫什么名字?",
        "examplePinyin": "nǐ jiào shén me míng zì ?",
        "exampleMeaning": "Bạn tên gì?"
      },
      {
        "hanzi": "认识",
        "pinyin": "rèn shi",
        "meaning": "quen biết",
        "example": "很高兴认识你。",
        "examplePinyin": "hěn gāo xìng rèn shi nǐ 。",
        "exampleMeaning": "Rất vui được làm quen với bạn."
      }
    ]
  },
  {
    "id": "hsk1_v2_02",
    "name": "HSK1 2.0 · Bài 02 · Gia đình & trường học",
    "cards": [
      {
        "hanzi": "爸爸",
        "pinyin": "bà ba",
        "meaning": "bố",
        "example": "我爱爸爸妈妈。",
        "examplePinyin": "wǒ ài bà ba mā ma 。",
        "exampleMeaning": "Tôi yêu bố mẹ."
      },
      {
        "hanzi": "妈妈",
        "pinyin": "mā ma",
        "meaning": "mẹ",
        "example": "妈妈在家吗?",
        "examplePinyin": "mā ma zài jiā ma ?",
        "exampleMeaning": "Mẹ có ở nhà không?"
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
        "meaning": "nhà, gia đình",
        "example": "我的家在越南。",
        "examplePinyin": "wǒ de jiā zài yuè nán 。",
        "exampleMeaning": "Nhà tôi ở Việt Nam."
      },
      {
        "hanzi": "朋友",
        "pinyin": "péng you",
        "meaning": "bạn bè",
        "example": "他是我最好的朋友。",
        "examplePinyin": "tā shì wǒ zuì hǎo de péng yǒu 。",
        "exampleMeaning": "Anh ấy là bạn thân nhất của tôi."
      },
      {
        "hanzi": "同学",
        "pinyin": "tóng xué",
        "meaning": "bạn học",
        "example": "她是我的同学。",
        "examplePinyin": "tā shì wǒ de tóng xué",
        "exampleMeaning": "Cô ấy là bạn học của tôi."
      },
      {
        "hanzi": "老师",
        "pinyin": "lǎo shī",
        "meaning": "giáo viên",
        "example": "王老师很好。",
        "examplePinyin": "wáng lǎo shī hěn hǎo 。",
        "exampleMeaning": "Thầy/cô Vương rất tốt."
      },
      {
        "hanzi": "学生",
        "pinyin": "xué sheng",
        "meaning": "học sinh",
        "example": "我是大学生。",
        "examplePinyin": "wǒ shì dà xué shēng 。",
        "exampleMeaning": "Tôi là sinh viên đại học."
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
        "hanzi": "小姐",
        "pinyin": "xiǎo jie",
        "meaning": "cô (cách xưng hô)",
        "example": "王小姐是老师。",
        "examplePinyin": "wáng xiǎo jie shì lǎo shī",
        "exampleMeaning": "Cô Vương là giáo viên."
      },
      {
        "hanzi": "中国",
        "pinyin": "Zhōng guó",
        "meaning": "Trung Quốc",
        "example": "我喜欢中国。",
        "examplePinyin": "wǒ xǐ huan zhōng guó 。",
        "exampleMeaning": "Tôi thích Trung Quốc."
      },
      {
        "hanzi": "北京",
        "pinyin": "Běi jīng",
        "meaning": "Bắc Kinh",
        "example": "我住在北京。",
        "examplePinyin": "wǒ zhù zài běi jīng",
        "exampleMeaning": "Tôi sống ở Bắc Kinh."
      },
      {
        "hanzi": "汉语",
        "pinyin": "Hàn yǔ",
        "meaning": "tiếng Hán",
        "example": "我学习汉语。",
        "examplePinyin": "wǒ xué xí hàn yǔ",
        "exampleMeaning": "Tôi học tiếng Hán."
      },
      {
        "hanzi": "学校",
        "pinyin": "xué xiào",
        "meaning": "trường học",
        "example": "我去学校学中文。",
        "examplePinyin": "wǒ qù xué xiào xué zhōng wén 。",
        "exampleMeaning": "Tôi đến trường học tiếng Trung."
      }
    ]
  },
  {
    "id": "hsk1_v2_03",
    "name": "HSK1 2.0 · Bài 03 · Số đếm & lượng từ",
    "cards": [
      {
        "hanzi": "一",
        "pinyin": "yī",
        "meaning": "một (1)",
        "example": "我有一个弟弟。",
        "examplePinyin": "wǒ yǒu yí gè dì di 。",
        "exampleMeaning": "Tôi có một em trai."
      },
      {
        "hanzi": "二",
        "pinyin": "èr",
        "meaning": "hai (2)",
        "example": "二楼",
        "examplePinyin": "èr lóu",
        "exampleMeaning": "Tầng hai."
      },
      {
        "hanzi": "三",
        "pinyin": "sān",
        "meaning": "ba (3)",
        "example": "三个人",
        "examplePinyin": "sān gè rén",
        "exampleMeaning": "Ba người."
      },
      {
        "hanzi": "四",
        "pinyin": "sì",
        "meaning": "bốn (4)",
        "example": "四月",
        "examplePinyin": "sì yuè",
        "exampleMeaning": "Tháng tư."
      },
      {
        "hanzi": "五",
        "pinyin": "wǔ",
        "meaning": "năm (5)",
        "example": "五本书",
        "examplePinyin": "wǔ běn shū",
        "exampleMeaning": "Năm quyển sách."
      },
      {
        "hanzi": "六",
        "pinyin": "liù",
        "meaning": "sáu (6)",
        "example": "六点",
        "examplePinyin": "liù diǎn",
        "exampleMeaning": "Sáu giờ."
      },
      {
        "hanzi": "七",
        "pinyin": "qī",
        "meaning": "bảy (7)",
        "example": "七天",
        "examplePinyin": "qī tiān",
        "exampleMeaning": "Bảy ngày."
      },
      {
        "hanzi": "八",
        "pinyin": "bā",
        "meaning": "tám (8)",
        "example": "八月",
        "examplePinyin": "bā yuè",
        "exampleMeaning": "Tháng tám."
      },
      {
        "hanzi": "九",
        "pinyin": "jiǔ",
        "meaning": "chín (9)",
        "example": "九岁",
        "examplePinyin": "jiǔ suì",
        "exampleMeaning": "Chín tuổi."
      },
      {
        "hanzi": "十",
        "pinyin": "shí",
        "meaning": "mười (10)",
        "example": "十分钟",
        "examplePinyin": "shí fēn zhōng",
        "exampleMeaning": "Mười phút."
      },
      {
        "hanzi": "零",
        "pinyin": "líng",
        "meaning": "số không",
        "example": "今天零度。",
        "examplePinyin": "jīn tiān líng dù",
        "exampleMeaning": "Hôm nay không độ."
      },
      {
        "hanzi": "个",
        "pinyin": "gè",
        "meaning": "lượng từ thông dụng",
        "example": "我有三个苹果。",
        "examplePinyin": "wǒ yǒu sān ge píng guǒ",
        "exampleMeaning": "Tôi có ba quả táo."
      },
      {
        "hanzi": "本",
        "pinyin": "běn",
        "meaning": "lượng từ (sách)",
        "example": "我有三本书。",
        "examplePinyin": "wǒ yǒu sān běn shū 。",
        "exampleMeaning": "Tôi có ba quyển sách."
      },
      {
        "hanzi": "些",
        "pinyin": "xiē",
        "meaning": "một ít; một số",
        "example": "我买了一些水果。",
        "examplePinyin": "wǒ mǎi le yì xiē shuǐ guǒ",
        "exampleMeaning": "Tôi đã mua một ít trái cây."
      },
      {
        "hanzi": "岁",
        "pinyin": "suì",
        "meaning": "tuổi",
        "example": "我女儿六岁。",
        "examplePinyin": "wǒ nǚ ér liù suì",
        "exampleMeaning": "Con gái tôi sáu tuổi."
      }
    ]
  },
  {
    "id": "hsk1_v2_04",
    "name": "HSK1 2.0 · Bài 04 · Ngày giờ",
    "cards": [
      {
        "hanzi": "年",
        "pinyin": "nián",
        "meaning": "năm",
        "example": "今年是2026年。",
        "examplePinyin": "jīn nián shì èr líng èr liù nián。",
        "exampleMeaning": "Năm nay là năm 2026."
      },
      {
        "hanzi": "月",
        "pinyin": "yuè",
        "meaning": "tháng; mặt trăng",
        "example": "现在是五月。",
        "examplePinyin": "xiàn zài shì wǔ yuè",
        "exampleMeaning": "Bây giờ là tháng năm."
      },
      {
        "hanzi": "日",
        "pinyin": "rì",
        "meaning": "ngày (trong ngày tháng)",
        "example": "今天是三月一日。",
        "examplePinyin": "jīn tiān shì sān yuè yī rì",
        "exampleMeaning": "Hôm nay là ngày một tháng ba."
      },
      {
        "hanzi": "星期",
        "pinyin": "xīng qī",
        "meaning": "tuần",
        "example": "这个星期",
        "examplePinyin": "zhè ge xīng qī",
        "exampleMeaning": "Tuần này."
      },
      {
        "hanzi": "今天",
        "pinyin": "jīn tiān",
        "meaning": "hôm nay",
        "example": "今天星期几?",
        "examplePinyin": "jīn tiān xīng qī jǐ ?",
        "exampleMeaning": "Hôm nay là thứ mấy?"
      },
      {
        "hanzi": "明天",
        "pinyin": "míng tiān",
        "meaning": "ngày mai",
        "example": "明天见!",
        "examplePinyin": "míng tiān jiàn !",
        "exampleMeaning": "Hẹn gặp ngày mai!"
      },
      {
        "hanzi": "昨天",
        "pinyin": "zuó tiān",
        "meaning": "hôm qua",
        "example": "昨天我很忙。",
        "examplePinyin": "zuó tiān wǒ hěn máng 。",
        "exampleMeaning": "Hôm qua tôi rất bận."
      },
      {
        "hanzi": "上午",
        "pinyin": "shàng wǔ",
        "meaning": "buổi sáng",
        "example": "我上午去学校。",
        "examplePinyin": "wǒ shàng wǔ qù xué xiào",
        "exampleMeaning": "Tôi đi học vào buổi sáng."
      },
      {
        "hanzi": "中午",
        "pinyin": "zhōng wǔ",
        "meaning": "buổi trưa",
        "example": "我们中午吃米饭。",
        "examplePinyin": "wǒ men zhōng wǔ chī mǐ fàn",
        "exampleMeaning": "Chúng tôi ăn cơm vào buổi trưa."
      },
      {
        "hanzi": "下午",
        "pinyin": "xià wǔ",
        "meaning": "buổi chiều",
        "example": "我下午去医院。",
        "examplePinyin": "wǒ xià wǔ qù yī yuàn",
        "exampleMeaning": "Tôi đi bệnh viện vào buổi chiều."
      },
      {
        "hanzi": "现在",
        "pinyin": "xiàn zài",
        "meaning": "bây giờ",
        "example": "现在几点?",
        "examplePinyin": "xiàn zài jǐ diǎn ?",
        "exampleMeaning": "Bây giờ là mấy giờ?"
      },
      {
        "hanzi": "点",
        "pinyin": "diǎn",
        "meaning": "giờ; điểm",
        "example": "现在三点。",
        "examplePinyin": "xiàn zài sān diǎn",
        "exampleMeaning": "Bây giờ là ba giờ."
      },
      {
        "hanzi": "分钟",
        "pinyin": "fēn zhōng",
        "meaning": "phút",
        "example": "请等五分钟。",
        "examplePinyin": "qǐng děng wǔ fēn zhōng",
        "exampleMeaning": "Xin đợi năm phút."
      },
      {
        "hanzi": "时候",
        "pinyin": "shí hou",
        "meaning": "lúc; thời điểm",
        "example": "你什么时候来？",
        "examplePinyin": "nǐ shén me shí hou lái",
        "exampleMeaning": "Khi nào bạn đến?"
      },
      {
        "hanzi": "几",
        "pinyin": "jǐ",
        "meaning": "mấy; bao nhiêu",
        "example": "你女儿几岁？",
        "examplePinyin": "nǐ nǚ ér jǐ suì",
        "exampleMeaning": "Con gái bạn mấy tuổi?"
      }
    ]
  },
  {
    "id": "hsk1_v2_05",
    "name": "HSK1 2.0 · Bài 05 · Mong muốn & tính chất",
    "cards": [
      {
        "hanzi": "爱",
        "pinyin": "ài",
        "meaning": "yêu",
        "example": "我爱我的家人。",
        "examplePinyin": "wǒ ài wǒ de jiā rén 。",
        "exampleMeaning": "Tôi yêu gia đình mình."
      },
      {
        "hanzi": "喜欢",
        "pinyin": "xǐ huan",
        "meaning": "thích",
        "example": "我喜欢你。",
        "examplePinyin": "wǒ xǐ huan nǐ 。",
        "exampleMeaning": "Tôi thích bạn."
      },
      {
        "hanzi": "想",
        "pinyin": "xiǎng",
        "meaning": "muốn, nhớ",
        "example": "我想家。",
        "examplePinyin": "wǒ xiǎng jiā 。",
        "exampleMeaning": "Tôi nhớ nhà."
      },
      {
        "hanzi": "会",
        "pinyin": "huì",
        "meaning": "biết (kỹ năng)",
        "example": "我会说中文。",
        "examplePinyin": "wǒ huì shuō zhōng wén 。",
        "exampleMeaning": "Tôi biết nói tiếng Trung."
      },
      {
        "hanzi": "能",
        "pinyin": "néng",
        "meaning": "có thể",
        "example": "你能帮我吗?",
        "examplePinyin": "nǐ néng bāng wǒ ma ?",
        "exampleMeaning": "Bạn có thể giúp tôi không?"
      },
      {
        "hanzi": "有",
        "pinyin": "yǒu",
        "meaning": "có",
        "example": "我有一本书。",
        "examplePinyin": "wǒ yǒu yì běn shū 。",
        "exampleMeaning": "Tôi có một quyển sách."
      },
      {
        "hanzi": "没",
        "pinyin": "méi",
        "meaning": "không; chưa",
        "example": "我没有钱。",
        "examplePinyin": "wǒ méi yǒu qián",
        "exampleMeaning": "Tôi không có tiền."
      },
      {
        "hanzi": "都",
        "pinyin": "dōu",
        "meaning": "đều",
        "example": "我们都是学生。",
        "examplePinyin": "wǒ men dōu shì xué sheng",
        "exampleMeaning": "Chúng tôi đều là học sinh."
      },
      {
        "hanzi": "和",
        "pinyin": "hé",
        "meaning": "và; cùng với",
        "example": "我和妈妈去商店。",
        "examplePinyin": "wǒ hé mā ma qù shāng diàn",
        "exampleMeaning": "Tôi và mẹ đi cửa hàng."
      },
      {
        "hanzi": "很",
        "pinyin": "hěn",
        "meaning": "rất",
        "example": "她很高兴。",
        "examplePinyin": "tā hěn gāo xìng",
        "exampleMeaning": "Cô ấy rất vui."
      },
      {
        "hanzi": "太",
        "pinyin": "tài",
        "meaning": "quá; rất",
        "example": "今天太热了。",
        "examplePinyin": "jīn tiān tài rè le",
        "exampleMeaning": "Hôm nay nóng quá."
      },
      {
        "hanzi": "多",
        "pinyin": "duō",
        "meaning": "nhiều",
        "example": "这里人很多。",
        "examplePinyin": "zhè lǐ rén hěn duō",
        "exampleMeaning": "Ở đây có rất nhiều người."
      },
      {
        "hanzi": "少",
        "pinyin": "shǎo",
        "meaning": "ít",
        "example": "这里人很少。",
        "examplePinyin": "zhè lǐ rén hěn shǎo",
        "exampleMeaning": "Ở đây có rất ít người."
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
  },
  {
    "id": "hsk1_v2_06",
    "name": "HSK1 2.0 · Bài 06 · Cảm nhận & ăn uống",
    "cards": [
      {
        "hanzi": "好",
        "pinyin": "hǎo",
        "meaning": "tốt, hay",
        "example": "这本书很好。",
        "examplePinyin": "zhè běn shū hěn hǎo 。",
        "exampleMeaning": "Quyển sách này rất hay."
      },
      {
        "hanzi": "高兴",
        "pinyin": "gāo xìng",
        "meaning": "vui, mừng",
        "example": "我很高兴见到你。",
        "examplePinyin": "wǒ hěn gāo xìng jiàn dào nǐ 。",
        "exampleMeaning": "Tôi rất vui được gặp bạn."
      },
      {
        "hanzi": "漂亮",
        "pinyin": "piào liang",
        "meaning": "đẹp",
        "example": "你今天很漂亮。",
        "examplePinyin": "nǐ jīn tiān hěn piào liang 。",
        "exampleMeaning": "Hôm nay bạn rất xinh."
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
        "hanzi": "天气",
        "pinyin": "tiān qì",
        "meaning": "thời tiết",
        "example": "今天天气很好。",
        "examplePinyin": "jīn tiān tiān qì hěn hǎo",
        "exampleMeaning": "Hôm nay thời tiết rất đẹp."
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
        "hanzi": "水",
        "pinyin": "shuǐ",
        "meaning": "nước",
        "example": "喝一杯水。",
        "examplePinyin": "hē yì bēi shuǐ 。",
        "exampleMeaning": "Uống một cốc nước."
      },
      {
        "hanzi": "茶",
        "pinyin": "chá",
        "meaning": "trà",
        "example": "中国茶",
        "examplePinyin": "zhōng guó chá",
        "exampleMeaning": "Trà Trung Quốc."
      },
      {
        "hanzi": "米饭",
        "pinyin": "mǐ fàn",
        "meaning": "cơm",
        "example": "我喜欢吃米饭。",
        "examplePinyin": "wǒ xǐ huan chī mǐ fàn 。",
        "exampleMeaning": "Tôi thích ăn cơm."
      },
      {
        "hanzi": "菜",
        "pinyin": "cài",
        "meaning": "món ăn; rau",
        "example": "这个菜很好吃。",
        "examplePinyin": "zhè ge cài hěn hǎo chī",
        "exampleMeaning": "Món này rất ngon."
      },
      {
        "hanzi": "水果",
        "pinyin": "shuǐ guǒ",
        "meaning": "hoa quả",
        "example": "水果很甜。",
        "examplePinyin": "shuǐ guǒ hěn tián 。",
        "exampleMeaning": "Trái cây rất ngọt."
      },
      {
        "hanzi": "苹果",
        "pinyin": "píng guǒ",
        "meaning": "táo",
        "example": "一个苹果",
        "examplePinyin": "yí gè píng guǒ",
        "exampleMeaning": "Một quả táo."
      },
      {
        "hanzi": "吃",
        "pinyin": "chī",
        "meaning": "ăn",
        "example": "我吃米饭。",
        "examplePinyin": "wǒ chī mǐ fàn 。",
        "exampleMeaning": "Tôi ăn cơm."
      },
      {
        "hanzi": "喝",
        "pinyin": "hē",
        "meaning": "uống",
        "example": "我喝水。",
        "examplePinyin": "wǒ hē shuǐ 。",
        "exampleMeaning": "Tôi uống nước."
      }
    ]
  },
  {
    "id": "hsk1_v2_07",
    "name": "HSK1 2.0 · Bài 07 · Mua sắm & hỏi đáp",
    "cards": [
      {
        "hanzi": "杯子",
        "pinyin": "bēi zi",
        "meaning": "cốc; ly",
        "example": "这是我的杯子。",
        "examplePinyin": "zhè shì wǒ de bēi zi",
        "exampleMeaning": "Đây là cốc của tôi."
      },
      {
        "hanzi": "饭馆",
        "pinyin": "fàn guǎn",
        "meaning": "quán ăn; nhà hàng",
        "example": "饭馆在前面。",
        "examplePinyin": "fàn guǎn zài qián miàn",
        "exampleMeaning": "Quán ăn ở phía trước."
      },
      {
        "hanzi": "商店",
        "pinyin": "shāng diàn",
        "meaning": "cửa hàng",
        "example": "我去商店买东西。",
        "examplePinyin": "wǒ qù shāng diàn mǎi dōng xī 。",
        "exampleMeaning": "Tôi đến cửa hàng mua đồ."
      },
      {
        "hanzi": "买",
        "pinyin": "mǎi",
        "meaning": "mua",
        "example": "我买一本书。",
        "examplePinyin": "wǒ mǎi yì běn shū 。",
        "exampleMeaning": "Tôi mua một quyển sách."
      },
      {
        "hanzi": "钱",
        "pinyin": "qián",
        "meaning": "tiền",
        "example": "这个多少钱?",
        "examplePinyin": "zhè ge duō shǎo qián ?",
        "exampleMeaning": "Cái này bao nhiêu tiền?"
      },
      {
        "hanzi": "块",
        "pinyin": "kuài",
        "meaning": "đồng (tiền)",
        "example": "一百块钱。",
        "examplePinyin": "yì bǎi kuài qián 。",
        "exampleMeaning": "Một trăm tệ."
      },
      {
        "hanzi": "多少",
        "pinyin": "duō shao",
        "meaning": "bao nhiêu",
        "example": "这个多少钱?",
        "examplePinyin": "zhè ge duō shǎo qián ?",
        "exampleMeaning": "Cái này bao nhiêu tiền?"
      },
      {
        "hanzi": "这",
        "pinyin": "zhè",
        "meaning": "này",
        "example": "这是什么?",
        "examplePinyin": "zhè shì shén me ?",
        "exampleMeaning": "Đây là cái gì?"
      },
      {
        "hanzi": "那",
        "pinyin": "nà",
        "meaning": "kia, đó",
        "example": "那是我的朋友。",
        "examplePinyin": "nà shì wǒ de péng yǒu 。",
        "exampleMeaning": "Kia là bạn của tôi."
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
        "hanzi": "怎么",
        "pinyin": "zěn me",
        "meaning": "thế nào; bằng cách nào",
        "example": "这个字怎么读？",
        "examplePinyin": "zhè ge zì zěn me dú",
        "exampleMeaning": "Chữ này đọc thế nào?"
      },
      {
        "hanzi": "怎么样",
        "pinyin": "zěn me yàng",
        "meaning": "thế nào, ra sao",
        "example": "你今天怎么样?",
        "examplePinyin": "nǐ jīn tiān zěn me yàng ?",
        "exampleMeaning": "Hôm nay bạn thế nào?"
      },
      {
        "hanzi": "请",
        "pinyin": "qǐng",
        "meaning": "xin, mời",
        "example": "请坐这里。",
        "examplePinyin": "qǐng zuò zhè lǐ 。",
        "exampleMeaning": "Mời ngồi ở đây."
      },
      {
        "hanzi": "谢谢",
        "pinyin": "xiè xie",
        "meaning": "cảm ơn",
        "example": "谢谢你的帮助。",
        "examplePinyin": "xiè xiè nǐ de bāng zhù 。",
        "exampleMeaning": "Cảm ơn sự giúp đỡ của bạn."
      },
      {
        "hanzi": "不客气",
        "pinyin": "bù kè qì",
        "meaning": "không có gì",
        "example": "谢谢! 不客气。",
        "examplePinyin": "xiè xiè !   bú kè qì 。",
        "exampleMeaning": "Cảm ơn! Không có gì."
      }
    ]
  },
  {
    "id": "hsk1_v2_08",
    "name": "HSK1 2.0 · Bài 08 · Giao tiếp & di chuyển",
    "cards": [
      {
        "hanzi": "对不起",
        "pinyin": "duì bù qǐ",
        "meaning": "xin lỗi",
        "example": "对不起, 我迟到了。",
        "examplePinyin": "duì bù qǐ ,   wǒ chí dào le 。",
        "exampleMeaning": "Xin lỗi, tôi đến muộn."
      },
      {
        "hanzi": "没关系",
        "pinyin": "méi guān xi",
        "meaning": "không sao",
        "example": "没关系, 没事的。",
        "examplePinyin": "méi guān xì ,   méi shì de 。",
        "exampleMeaning": "Không sao, không có chuyện gì đâu."
      },
      {
        "hanzi": "再见",
        "pinyin": "zài jiàn",
        "meaning": "tạm biệt",
        "example": "明天见, 再见!",
        "examplePinyin": "míng tiān jiàn ,   zài jiàn !",
        "exampleMeaning": "Hẹn gặp ngày mai, tạm biệt!"
      },
      {
        "hanzi": "喂",
        "pinyin": "wèi",
        "meaning": "a lô (nghe điện thoại)",
        "example": "喂，你好！",
        "examplePinyin": "wèi nǐ hǎo",
        "exampleMeaning": "A lô, xin chào!"
      },
      {
        "hanzi": "打电话",
        "pinyin": "dǎ diàn huà",
        "meaning": "gọi điện thoại",
        "example": "我给妈妈打电话。",
        "examplePinyin": "wǒ gěi mā ma dǎ diàn huà",
        "exampleMeaning": "Tôi gọi điện cho mẹ."
      },
      {
        "hanzi": "说话",
        "pinyin": "shuō huà",
        "meaning": "nói chuyện",
        "example": "他们在说话。",
        "examplePinyin": "tā men zài shuō huà",
        "exampleMeaning": "Họ đang nói chuyện."
      },
      {
        "hanzi": "听",
        "pinyin": "tīng",
        "meaning": "nghe",
        "example": "我听音乐。",
        "examplePinyin": "wǒ tīng yīn yuè 。",
        "exampleMeaning": "Tôi nghe nhạc."
      },
      {
        "hanzi": "来",
        "pinyin": "lái",
        "meaning": "đến",
        "example": "请来我家。",
        "examplePinyin": "qǐng lái wǒ jiā 。",
        "exampleMeaning": "Mời bạn đến nhà tôi."
      },
      {
        "hanzi": "去",
        "pinyin": "qù",
        "meaning": "đi",
        "example": "我去学校。",
        "examplePinyin": "wǒ qù xué xiào 。",
        "exampleMeaning": "Tôi đi đến trường."
      },
      {
        "hanzi": "回",
        "pinyin": "huí",
        "meaning": "trở về",
        "example": "我下午回家。",
        "examplePinyin": "wǒ xià wǔ huí jiā",
        "exampleMeaning": "Tôi về nhà vào buổi chiều."
      },
      {
        "hanzi": "住",
        "pinyin": "zhù",
        "meaning": "sống; ở",
        "example": "你住在哪儿？",
        "examplePinyin": "nǐ zhù zài nǎr",
        "exampleMeaning": "Bạn sống ở đâu?"
      },
      {
        "hanzi": "在",
        "pinyin": "zài",
        "meaning": "ở; đang",
        "example": "我在家。",
        "examplePinyin": "wǒ zài jiā",
        "exampleMeaning": "Tôi ở nhà."
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
      },
      {
        "hanzi": "里",
        "pinyin": "lǐ",
        "meaning": "bên trong",
        "example": "他在学校里。",
        "examplePinyin": "tā zài xué xiào lǐ",
        "exampleMeaning": "Anh ấy ở trong trường."
      }
    ]
  },
  {
    "id": "hsk1_v2_09",
    "name": "HSK1 2.0 · Bài 09 · Vị trí & học tập",
    "cards": [
      {
        "hanzi": "上",
        "pinyin": "shàng",
        "meaning": "trên; lên",
        "example": "书在桌子上。",
        "examplePinyin": "shū zài zhuō zi shàng",
        "exampleMeaning": "Sách ở trên bàn."
      },
      {
        "hanzi": "下",
        "pinyin": "xià",
        "meaning": "dưới; xuống",
        "example": "猫在桌子下。",
        "examplePinyin": "māo zài zhuō zi xià",
        "exampleMeaning": "Mèo ở dưới bàn."
      },
      {
        "hanzi": "坐",
        "pinyin": "zuò",
        "meaning": "ngồi",
        "example": "请坐。",
        "examplePinyin": "qǐng zuò 。",
        "exampleMeaning": "Mời ngồi."
      },
      {
        "hanzi": "出租车",
        "pinyin": "chū zū chē",
        "meaning": "xe taxi",
        "example": "我们坐出租车去。",
        "examplePinyin": "wǒ men zuò chū zū chē qù",
        "exampleMeaning": "Chúng tôi đi bằng taxi."
      },
      {
        "hanzi": "飞机",
        "pinyin": "fēi jī",
        "meaning": "máy bay",
        "example": "我坐飞机去北京。",
        "examplePinyin": "wǒ zuò fēi jī qù běi jīng",
        "exampleMeaning": "Tôi đi máy bay đến Bắc Kinh."
      },
      {
        "hanzi": "火车站",
        "pinyin": "huǒ chē zhàn",
        "meaning": "ga tàu hỏa",
        "example": "火车站在哪儿？",
        "examplePinyin": "huǒ chē zhàn zài nǎr",
        "exampleMeaning": "Ga tàu hỏa ở đâu?"
      },
      {
        "hanzi": "书",
        "pinyin": "shū",
        "meaning": "sách",
        "example": "这本书很好。",
        "examplePinyin": "zhè běn shū hěn hǎo 。",
        "exampleMeaning": "Quyển sách này rất hay."
      },
      {
        "hanzi": "字",
        "pinyin": "zì",
        "meaning": "chữ",
        "example": "我会写这个字。",
        "examplePinyin": "wǒ huì xiě zhè ge zì",
        "exampleMeaning": "Tôi biết viết chữ này."
      },
      {
        "hanzi": "读",
        "pinyin": "dú",
        "meaning": "đọc",
        "example": "我读书。",
        "examplePinyin": "wǒ dú shū 。",
        "exampleMeaning": "Tôi đọc sách."
      },
      {
        "hanzi": "写",
        "pinyin": "xiě",
        "meaning": "viết",
        "example": "写汉字很难。",
        "examplePinyin": "xiě hàn zì hěn nán 。",
        "exampleMeaning": "Viết chữ Hán rất khó."
      },
      {
        "hanzi": "学习",
        "pinyin": "xué xí",
        "meaning": "học; học tập",
        "example": "我们学习汉语。",
        "examplePinyin": "wǒ men xué xí hàn yǔ",
        "exampleMeaning": "Chúng tôi học tiếng Hán."
      },
      {
        "hanzi": "看",
        "pinyin": "kàn",
        "meaning": "xem, nhìn",
        "example": "我看电影。",
        "examplePinyin": "wǒ kàn diàn yǐng 。",
        "exampleMeaning": "Tôi xem phim."
      },
      {
        "hanzi": "看见",
        "pinyin": "kàn jiàn",
        "meaning": "nhìn thấy",
        "example": "我看见老师了。",
        "examplePinyin": "wǒ kàn jiàn lǎo shī le",
        "exampleMeaning": "Tôi nhìn thấy thầy giáo rồi."
      },
      {
        "hanzi": "电视",
        "pinyin": "diàn shì",
        "meaning": "TV",
        "example": "我们一起看电视。",
        "examplePinyin": "wǒ men yì qǐ kàn diàn shì 。",
        "exampleMeaning": "Chúng ta cùng xem tivi."
      },
      {
        "hanzi": "电影",
        "pinyin": "diàn yǐng",
        "meaning": "phim",
        "example": "这个电影很好看。",
        "examplePinyin": "zhè ge diàn yǐng hěn hǎo kàn 。",
        "exampleMeaning": "Bộ phim này rất hay."
      }
    ]
  },
  {
    "id": "hsk1_v2_10",
    "name": "HSK1 2.0 · Bài 10 · Sinh hoạt & trợ từ",
    "cards": [
      {
        "hanzi": "电脑",
        "pinyin": "diàn nǎo",
        "meaning": "máy tính",
        "example": "我用电脑工作。",
        "examplePinyin": "wǒ yòng diàn nǎo gōng zuò 。",
        "exampleMeaning": "Tôi dùng máy tính để làm việc."
      },
      {
        "hanzi": "工作",
        "pinyin": "gōng zuò",
        "meaning": "làm việc",
        "example": "我在公司工作。",
        "examplePinyin": "wǒ zài gōng sī gōng zuò 。",
        "exampleMeaning": "Tôi làm việc ở công ty."
      },
      {
        "hanzi": "做",
        "pinyin": "zuò",
        "meaning": "làm",
        "example": "你在做什么？",
        "examplePinyin": "nǐ zài zuò shén me",
        "exampleMeaning": "Bạn đang làm gì?"
      },
      {
        "hanzi": "开",
        "pinyin": "kāi",
        "meaning": "mở; lái",
        "example": "请开门。",
        "examplePinyin": "qǐng kāi mén",
        "exampleMeaning": "Xin mở cửa."
      },
      {
        "hanzi": "东西",
        "pinyin": "dōng xi",
        "meaning": "đồ vật",
        "example": "我买了很多东西。",
        "examplePinyin": "wǒ mǎi le hěn duō dōng xī 。",
        "exampleMeaning": "Tôi đã mua rất nhiều đồ."
      },
      {
        "hanzi": "桌子",
        "pinyin": "zhuō zi",
        "meaning": "bàn",
        "example": "桌子上有一本书。",
        "examplePinyin": "zhuō zi shàng yǒu yì běn shū 。",
        "exampleMeaning": "Trên bàn có một quyển sách."
      },
      {
        "hanzi": "椅子",
        "pinyin": "yǐ zi",
        "meaning": "ghế",
        "example": "请坐椅子。",
        "examplePinyin": "qǐng zuò yǐ zi 。",
        "exampleMeaning": "Mời ngồi lên ghế."
      },
      {
        "hanzi": "衣服",
        "pinyin": "yī fu",
        "meaning": "quần áo",
        "example": "这件衣服很漂亮。",
        "examplePinyin": "zhè jiàn yī fu hěn piào liang 。",
        "exampleMeaning": "Bộ quần áo này rất đẹp."
      },
      {
        "hanzi": "猫",
        "pinyin": "māo",
        "meaning": "con mèo",
        "example": "我的猫在家。",
        "examplePinyin": "wǒ de māo zài jiā",
        "exampleMeaning": "Mèo của tôi ở nhà."
      },
      {
        "hanzi": "狗",
        "pinyin": "gǒu",
        "meaning": "con chó",
        "example": "这只狗很小。",
        "examplePinyin": "zhè zhī gǒu hěn xiǎo",
        "exampleMeaning": "Con chó này rất nhỏ."
      },
      {
        "hanzi": "医生",
        "pinyin": "yī shēng",
        "meaning": "bác sĩ",
        "example": "我爸爸是医生。",
        "examplePinyin": "wǒ bà ba shì yī shēng",
        "exampleMeaning": "Bố tôi là bác sĩ."
      },
      {
        "hanzi": "医院",
        "pinyin": "yī yuàn",
        "meaning": "bệnh viện",
        "example": "医院在学校后面。",
        "examplePinyin": "yī yuàn zài xué xiào hòu miàn",
        "exampleMeaning": "Bệnh viện ở phía sau trường học."
      },
      {
        "hanzi": "睡觉",
        "pinyin": "shuì jiào",
        "meaning": "ngủ",
        "example": "我十点睡觉。",
        "examplePinyin": "wǒ shí diǎn shuì jiào 。",
        "exampleMeaning": "Tôi đi ngủ lúc mười giờ."
      },
      {
        "hanzi": "的",
        "pinyin": "de",
        "meaning": "trợ từ chỉ sở hữu",
        "example": "这是我的书。",
        "examplePinyin": "zhè shì wǒ de shū",
        "exampleMeaning": "Đây là sách của tôi."
      },
      {
        "hanzi": "了",
        "pinyin": "le",
        "meaning": "trợ từ chỉ hoàn thành hoặc thay đổi",
        "example": "我吃饭了。",
        "examplePinyin": "wǒ chī fàn le",
        "exampleMeaning": "Tôi ăn cơm rồi."
      }
    ]
  }
];
for (const {id, ...deck} of lessons) DECKS[id] = deck;
const words = new Set(lessons.flatMap(d => d.cards.map(c => c.hanzi)));
window.HSK1 = {
  lessons,
  progress(state, readRecord) {
    const reviewed = new Set(), passed = new Set();
    // Match headwords across old and new decks; variants of pinyin don't double count.
    for (const map of Object.values(state.srs || {})) for (const [key, s] of Object.entries(map || {})) {
      const word = key.split('|')[0];
      if (words.has(word) && s?.nextReviewAt > 0) reviewed.add(word);
    }
    const ids = new Set([...Object.keys(DECKS), ...Object.keys(state.importedDecks || {}), 'my_custom']);
    for (const id of ids) {
      let record;
      try { record = readRecord('mastery_exam_v1:' + id) || {}; } catch { continue; }
      for (const [key, ok] of Object.entries(record)) {
        if (ok !== true) continue;
        try { const word = JSON.parse(key)[0]; if (words.has(word)) passed.add(word); } catch {}
      }
    }
    return {total: words.size, reviewed: reviewed.size, passed: passed.size};
  }
};
})();
