# Brief triển khai cho DeepSeek-4-Pro · Flashcard Tiếng Trung

Bạn phụ trách UX và frontend của ứng dụng đang chạy ở http://127.0.0.1:8000/. Hãy mở thư mục mã nguồn hiện tại, đọc hướng dẫn chạy và sửa trực tiếp trong dự án. Mục tiêu phiên bản đầu là giúp người Việt chưa biết tiếng Trung hoàn thành một bài chào hỏi, nghe được câu mẫu và thử nhớ lại chữ. Bàn giao một luồng chạy được từ đầu đến cuối trên điện thoại và desktop.

## 1. Khảo sát trước khi sửa

Giao diện desktop hiện có bộ chọn bộ thẻ, ba chế độ Học/Lướt/Luyện tập, sáu ô thống kê, thẻ chữ lớn trên nền kem, nút phát âm, luyện viết, bốn mức tự đánh giá, thẻ liên quan và phân tích bộ thủ. Trang còn có lịch hoạt động, nhập PDF/ảnh/PPTX và thêm thẻ thủ công. Dữ liệu học được trang mô tả là lưu trong localStorage. Đây là quan sát giao diện. Hãy xác nhận cấu trúc thực tế trong repo trước khi chọn cách triển khai.

- Tìm nơi dựng màn học, nguồn thẻ, hàm phát âm, trình luyện viết, bộ lập lịch ôn và lớp đọc/ghi tiến độ. Ghi tên file và cách chạy thực tế trong phần bàn giao.
- Ghi nhận luồng cũ bằng hồ sơ trình duyệt thử nghiệm có bộ thẻ tự tạo, lịch ôn và lịch sử. Dùng cùng hồ sơ để kiểm tra sau khi nâng cấp.
- Ưu tiên tái sử dụng công nghệ và thành phần sẵn có. Phạm vi bản đầu gồm một bài mẫu hoàn chỉnh và lối vào các chức năng hiện có. Nội dung những bài tiếp theo có thể bổ sung sau khi thử bài mẫu với người mới.

## 2. Tổ chức giao diện

| Khu vực | Nội dung và hành vi |
|---|---|
| Hôm nay | Với người mới, hiển thị “Chào hỏi lần đầu”, mục tiêu “Học cách chào một người bạn bằng tiếng Trung”, thời lượng dự kiến 3 phút và nút “Bắt đầu học”. Khi đang học dở, nút đổi thành “Học tiếp”. Người đã có thẻ đến hạn nhìn thấy “Ôn N thẻ đến hạn” ngay trên màn hình này. |
| Bài học | Header có “Về Hôm nay”, tên bài, thanh tiến độ và số bước. Giữa màn hình là một nhiệm vụ. Chân thẻ chứa thao tác chính. Rời bài rồi quay lại tiếp tục đúng bước. |
| Bộ thẻ | Chọn bộ, học/lướt/luyện tập tự do, thêm thẻ và nhập tài liệu. Bảo toàn các bộ người dùng tự tạo, quy tắc sửa thẻ và đường vào chế độ cũ. |
| Tiến độ | Gom sáu chỉ số và lịch hoạt động 90 ngày. Tách nhãn “Thẻ đến hạn” với “Lượt đã ôn hôm nay” để người học hiểu hai con số. |
| Cài đặt | Chọn và thử giọng đọc, trợ giúp phím tắt. Khi học, người dùng vẫn có thể nghe lại ngay cạnh từ. |

## 3. Kịch bản bài mẫu và nội dung cần hiển thị

| Bước | Nội dung | Tương tác và điều kiện chuyển |
|---|---|---|
| 1/5 · Gặp chữ 你 | Hiện chữ lớn, dưới là “nǐ · bạn”. | “Nghe phát âm” đọc riêng 你. Cho phép nghe lại. Nút “Học chữ tiếp theo” luôn dùng được, kể cả khi thiết bị tắt tiếng. |
| 2/5 · Gặp chữ 好 | “hǎo · tốt”. Liên kết nhỏ “Nhìn kỹ chữ 好” mở phần trái 女 và phần phải 子, kèm mẫu chữ đầy đủ. | Đóng phần giải thích trở về đúng vị trí. “Thử chào một người bạn” dẫn sang bước ghép. |
| 3/5 · Ghép lời chào | “Bạn gặp một người bạn mới. Hãy ghép lời chào.” Hiện hai ô trống và hai nút 好, 你 theo thứ tự này. | Chạm hoặc dùng bàn phím để chọn từng chữ. Chạm chữ đã chọn để lấy ra. Với 好你, nhắc “Hãy bắt đầu bằng chữ 你 (bạn)” và cho làm lại. Với 你好, hiện “nǐ hǎo · xin chào” và nút nghe đọc cả cụm. |
| 4/5 · Nhớ nghĩa | Chỉ hiện 你 và câu “Chữ này nghĩa là gì?”. Ẩn pinyin, nghĩa và thẻ liên quan trong lượt nhớ. | “Xem đáp án” hiện “nǐ · bạn”, sau đó mới hiện “Mình nhớ” và “Ôn lại”. Lưu lựa chọn theo thẻ. |
| 5/5 · Nhớ mặt chữ | “Chữ nào có nghĩa là tốt?” Cho chọn 你 hoặc 好. | Trả lời đúng thì hiện 好 và phát âm theo yêu cầu. Nếu sai, giải thích “你 là bạn. 好 là tốt.” Ghi nhận cần ôn 好. |
| Kết quả | Hiện “Bạn đã ghép được 你好” cùng từ cần xem lại theo kết quả thật. | “Ôn lại N chữ” chỉ hiện khi N lớn hơn 0. Ôn từng chữ đã đánh dấu, xem đáp án, tự đánh giá lại. Có nút “Hoàn tất” và có thể học lại bài sau. |

### Luyện viết tùy chọn

Tại bước học 好 hoặc sau khi ôn sai, cho chọn “Thử viết từ trí nhớ”. Cho xem mẫu, chỉ rõ 女 bên trái và 子 bên phải. Khi bấm “Tự viết”, ẩn cả mẫu lẫn chữ trong tiêu đề rồi mở vùng viết hiện có. “Gợi ý” hé một thành phần. “So với mẫu” đặt bài viết cạnh 好, cho chọn “Viết lại” hoặc “Quay lại bài”. Hỗ trợ ngón tay và chuột. Nếu chức năng hiện có chỉ hỗ trợ đồ theo nét, bổ sung vùng tự viết tối thiểu. Việc tự so mẫu không được tính là kết quả chấm tự động.

## 4. Quy cách trình bày và tiếp cận

- Giữ chữ Hán lớn, nền thẻ kem và chữ màu mực đậm. Dùng một màu nhấn nhất quán cho hành động tiếp theo. Nút nghe có biểu tượng loa và nhãn tiếng Việt. Khi báo sai, dùng cả văn bản và màu.
- Desktop dùng một cột bài học rộng khoảng 600–720 px. Mobile dùng lề 16 px, chữ Hán khoảng 80–112 px, nội dung tiếng Việt từ 16 px và vùng chạm ít nhất 44 × 44 px. Điều chỉnh khi phóng to chữ để không che nút hoặc cắt dấu thanh.
- Trong một lượt học, dành vùng nhìn đầu tiên cho câu hỏi, chữ và thao tác. Chuyển bảng số liệu, danh sách câu dài và thao tác nhập file về khu vực tương ứng. Chỉ hiện phím tắt ở nơi dùng được.
- Thứ tự Tab khớp thứ tự đọc. Enter/Space kích hoạt nút đang focus. Khi chuyển bước, chuyển focus về tiêu đề câu hỏi. Gắn ngôn ngữ zh-CN cho chữ Hán và vi cho giao diện. Thông báo phản hồi đúng/sai cho trình đọc màn hình.

## 5. Dữ liệu, chuyển trạng thái và lỗi

Dùng ID thẻ hiện có nếu phù hợp. Lưu nội dung bài riêng với trạng thái người học. Trạng thái tối thiểu gồm ID và phiên bản bài, bước hiện tại, đáp án đã xác nhận, các thẻ cần ôn lại và trạng thái hoàn tất. Ghi sau từng thao tác đã xác nhận. Tải lại sau khi trả lời vẫn phải hiển thị đúng kết quả và cho đi tiếp.

Tách hoàn thành bài khỏi thuộc từ. Xem mẫu, nghe loa hoặc ghép đúng chưa đủ để tự động đánh dấu thuộc. Nếu có ánh xạ rõ từ đánh giá trong bài sang bộ lập lịch ôn hiện tại, dùng hàm sẵn có và ghi một lần cho mỗi lượt đánh giá. Nếu quy tắc cũ yêu cầu bốn mức, giữ hai lựa chọn của bài mẫu ở phạm vi bài học và tiếp tục dùng bốn mức trong chế độ ôn cũ. Ghi rõ quyết định trong bàn giao.

Dùng khóa lưu mới cho trạng thái bài mẫu. Xử lý dữ liệu cũ thiếu trường, tải lại giữa bước và nhấn nhanh hai lần. Khi trình duyệt chặn ghi dữ liệu, vẫn cho học trong phiên và báo “Tiến độ chỉ được giữ trong lần mở này”. Khi phát âm thất bại, hiện “Chưa phát được âm thanh” và nút thử lại. Khi rời bài hoặc bấm nghe lại, dừng âm đang phát để tránh đọc chồng.

## 6. Thứ tự thực hiện

1. Khảo sát repo và chạy bản hiện tại. Xác định nơi tích hợp, tạo dữ liệu mẫu để kiểm tra tương thích.
2. Dựng màn Hôm nay, khung bài học và dữ liệu bài Chào hỏi. Nối trọn năm bước tới kết quả trước khi trau chuốt giao diện.
3. Tích hợp phát âm, tự viết, lưu/học tiếp và ôn lại. Đưa các chức năng cũ về vị trí đã mô tả. Dùng chung dữ liệu nguồn khi cùng một thẻ xuất hiện ở nhiều màn.
4. Hoàn thiện responsive, bàn phím, trạng thái lỗi và kiểm tra hồi quy. Chạy các lệnh build/test đang có. Bổ sung test tập trung vào lưu tiến độ hoặc ghi kết quả trùng nếu bộ test hiện tại chưa bao phủ.

## 7. Checklist nghiệm thu và bàn giao

| Tình huống kiểm tra | Kết quả mong đợi |
|---|---|
| Hồ sơ mới, mở trên màn hình rộng 375 px | Thấy ngay mục tiêu và nút bắt đầu. Hoàn tất cả bài bằng thao tác chạm, không cuộn ngang. |
| Ghép sai, sửa lại rồi ghép đúng | Có gợi ý cụ thể. Tiến độ chỉ tăng một bước sau khi hoàn thành. |
| Chọn ôn lại 你 và chọn sai 好 | Kết quả liệt kê đúng hai chữ. Nếu đã trả lời đúng hết, không hiện nút ôn 0 chữ. |
| Tải lại sau khi ghép đúng, về Hôm nay rồi học tiếp | Giữ đúng bước và kết quả. Không cộng hai lần. |
| Ẩn mẫu chữ 好, viết và so lại | Có thể viết bằng chuột/chạm, mở gợi ý rồi so với mẫu, quay về đúng bước. |
| Chế độ cũ với bộ tự tạo và thẻ đến hạn | Thẻ, lịch ôn và lịch sử trước nâng cấp còn đúng. Import, sửa thẻ và đánh giá bốn mức vẫn dùng được. |
| Loa lỗi hoặc bộ nhớ bị chặn | Có phản hồi rõ và vẫn hoàn thành được bài. |
| Dùng bàn phím từ đầu đến cuối, kiểm tra desktop và mobile | Mọi thao tác ghép/ôn có focus nhìn thấy. Nội dung, nút và phản hồi không đè nhau. |

Bàn giao danh sách file thay đổi, cách chạy theo repo, kết quả thực tế của từng mục nghiệm thu và ảnh màn hình Hôm nay, bài học, kết quả ở desktop/mobile. Đánh dấu rõ nội dung chưa kiểm chứng trên thiết bị thật. Để đánh giá thiết kế sau triển khai, cho một người chưa biết tiếng Trung bắt đầu bài mà không hướng dẫn cách bấm. Ghi nhận họ vướng ở đâu và có nhớ nghĩa của 你 khi đáp án bị ẩn hay không.

## 8. Mở rộng sau bài mẫu · 50 câu giao tiếp

Triển khai đủ 10 chủ đề dưới đây trong mục Bài học. Mỗi chủ đề có 5 câu. Khi người học chọn chủ đề, chỉ hiển thị một câu mỗi lượt. Cho nghe câu bằng chữ Hán, hiện pinyin và nghĩa ở lượt học mới. Ở lượt ôn, cho nghe hoặc đọc trước rồi mới mở nghĩa. Dùng số thứ tự làm ID nội dung ổn định và tái sử dụng thẻ tương ứng nếu bộ cũ đã có cùng câu. Kiểm tra đủ 50 mục sau khi tải lại.

### Chào hỏi và tạm biệt

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 1 | 早上好！ | Zǎoshang hǎo! | Chào buổi sáng! |
| 2 | 好久不见！ | Hǎojiǔ bú jiàn! | Lâu rồi không gặp! |
| 3 | 你最近好吗？ | Nǐ zuìjìn hǎo ma? | Dạo này bạn khỏe không? |
| 4 | 我很好，谢谢。 | Wǒ hěn hǎo, xièxie. | Mình khỏe, cảm ơn bạn. |
| 5 | 明天见！ | Míngtiān jiàn! | Hẹn mai gặp lại! |

### Làm quen

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 6 | 请问，您怎么称呼？ | Qǐngwèn, nín zěnme chēnghu? | Xin hỏi, tôi nên gọi anh/chị thế nào? |
| 7 | 我姓陈。 | Wǒ xìng Chén. | Tôi họ Trần. |
| 8 | 你是哪国人？ | Nǐ shì nǎ guó rén? | Bạn là người nước nào? |
| 9 | 我是越南人。 | Wǒ shì Yuènán rén. | Tôi là người Việt Nam. |
| 10 | 你呢？ | Nǐ ne? | Còn bạn thì sao? |

### Gia đình

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 11 | 你家有几口人？ | Nǐ jiā yǒu jǐ kǒu rén? | Nhà bạn có mấy người? |
| 12 | 我家有三口人。 | Wǒ jiā yǒu sān kǒu rén. | Nhà mình có ba người. |
| 13 | 这是谁？ | Zhè shì shéi? | Đây là ai? |
| 14 | 这是我女儿。 | Zhè shì wǒ nǚ’ér. | Đây là con gái mình. |
| 15 | 她今年七岁。 | Tā jīnnián qī suì. | Năm nay bé bảy tuổi. |

### Gọi đồ uống

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 16 | 你想喝什么？ | Nǐ xiǎng hē shénme? | Bạn muốn uống gì? |
| 17 | 我想喝茶。 | Wǒ xiǎng hē chá. | Mình muốn uống trà. |
| 18 | 请给我一杯水。 | Qǐng gěi wǒ yì bēi shuǐ. | Cho mình một cốc nước nhé. |
| 19 | 要加糖吗？ | Yào jiā táng ma? | Bạn có muốn thêm đường không? |
| 20 | 不用，谢谢。 | Bú yòng, xièxie. | Không cần đâu, cảm ơn. |

### Gọi món

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 21 | 有菜单吗？ | Yǒu càidān ma? | Cho mình xem thực đơn được không? |
| 22 | 我要一碗面。 | Wǒ yào yì wǎn miàn. | Cho mình một bát mì. |
| 23 | 这个辣吗？ | Zhège là ma? | Món này có cay không? |
| 24 | 我不吃辣。 | Wǒ bù chī là. | Mình không ăn cay. |
| 25 | 可以打包吗？ | Kěyǐ dǎbāo ma? | Có thể gói mang về không? |

### Mua sắm

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 26 | 这个多少钱？ | Zhège duōshao qián? | Cái này bao nhiêu tiền? |
| 27 | 十五块。 | Shíwǔ kuài. | Mười lăm tệ. |
| 28 | 有小一点的吗？ | Yǒu xiǎo yìdiǎn de ma? | Có cái nào nhỏ hơn một chút không? |
| 29 | 我买这个。 | Wǒ mǎi zhège. | Mình lấy cái này. |
| 30 | 可以刷卡吗？ | Kěyǐ shuākǎ ma? | Mình thanh toán bằng thẻ được không? |

### Hỏi đường

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 31 | 请问，地铁站在哪儿？ | Qǐngwèn, dìtiězhàn zài nǎr? | Xin hỏi, ga tàu điện ngầm ở đâu? |
| 32 | 一直往前走。 | Yìzhí wǎng qián zǒu. | Cứ đi thẳng về phía trước. |
| 33 | 在路口左转。 | Zài lùkǒu zuǒzhuǎn. | Đến giao lộ thì rẽ trái. |
| 34 | 离这儿远吗？ | Lí zhèr yuǎn ma? | Có xa đây không? |
| 35 | 走路五分钟就到。 | Zǒulù wǔ fēnzhōng jiù dào. | Đi bộ năm phút là tới. |

### Hẹn gặp

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 36 | 你今天有空吗？ | Nǐ jīntiān yǒu kòng ma? | Hôm nay bạn có rảnh không? |
| 37 | 我下午有空。 | Wǒ xiàwǔ yǒu kòng. | Chiều nay mình rảnh. |
| 38 | 我们几点见？ | Wǒmen jǐ diǎn jiàn? | Mấy giờ mình gặp nhau? |
| 39 | 三点半见吧。 | Sān diǎn bàn jiàn ba. | Mình gặp lúc ba giờ rưỡi nhé. |
| 40 | 在哪儿见？ | Zài nǎr jiàn? | Mình gặp ở đâu? |

### Khi chưa hiểu

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 41 | 我听不懂。 | Wǒ tīng bu dǒng. | Mình nghe không hiểu. |
| 42 | 请说慢一点。 | Qǐng shuō màn yìdiǎn. | Bạn nói chậm lại một chút nhé. |
| 43 | 请再说一遍。 | Qǐng zài shuō yí biàn. | Bạn nói lại một lần nữa nhé. |
| 44 | 这个字怎么读？ | Zhège zì zěnme dú? | Chữ này đọc thế nào? |
| 45 | 你能写下来吗？ | Nǐ néng xiě xiàlai ma? | Bạn viết ra giúp mình được không? |

### Sở thích

| STT | Chữ Hán | Pinyin | Nghĩa tiếng Việt |
|---:|---|---|---|
| 46 | 你喜欢做什么？ | Nǐ xǐhuan zuò shénme? | Bạn thích làm gì? |
| 47 | 我喜欢看书。 | Wǒ xǐhuan kàn shū. | Mình thích đọc sách. |
| 48 | 你喜欢运动吗？ | Nǐ xǐhuan yùndòng ma? | Bạn có thích tập thể thao không? |
| 49 | 我每天都散步。 | Wǒ měitiān dōu sànbù. | Ngày nào mình cũng đi dạo. |
| 50 | 我们一起去吧！ | Wǒmen yìqǐ qù ba! | Mình cùng đi nhé! |
## 9. Chạm để hiểu câu và nhớ chữ

Áp dụng cho cả 50 câu ở mục 8. Trên thẻ học mới, trình bày chữ Hán theo cụm có thể chạm hoặc chọn bằng bàn phím. Giữ cách viết liền tự nhiên khi hiển thị. Bấm cụm nào thì mở giải thích tiếng Việt đúng với cụm đó trong câu. Trên điện thoại dùng bảng trượt từ dưới, trên desktop dùng bảng cạnh thẻ. Khi đóng, quay lại đúng câu và vị trí focus.

**Câu mẫu số 14 · 这是我女儿。** Chia cụm 这 / 是 / 我 / 女儿. Dịch tự nhiên “Đây là con gái mình”. Chọn 女儿 (nǚ’ér) hiện “con gái”, nút nghe cả từ và giải thích “Ở đây người nói đang giới thiệu con gái của mình”. Chọn 我 hiện “mình; trong 我女儿, hiểu là con gái của mình”. Mục “Xem từng chữ” cho mở 女 và 儿 riêng. Dùng mục 儿 ở trang PDF 8 (trang in 2) làm điểm tra cứu: ér, âm Hán Việt nhi, nghĩa liên quan đến trẻ nhỏ. Liên hệ 儿子 (érzi, con trai) và 女儿 (nǚ’ér, con gái). Trong câu số 31, 哪儿 phải được tra như cả từ nǎr nghĩa là “đâu”; ghi rõ 儿 ở đây thể hiện âm cuối -r.

**Cách biên soạn.** Xử lý PDF theo trang ảnh, lưu số trang PDF và số trang in riêng. OCR chỉ tạo bản nháp. Đối chiếu hình gốc để soát chữ, pinyin, dấu thanh và ranh giới dòng trước khi dùng. Trích toàn bộ mục chữ và từ ghép trên tất cả các trang nội dung của sách theo mục 10. Liên kết các mục đã trích với 50 câu. Với từng cụm trong câu, lưu vị trí, pinyin ở ngữ cảnh đó, nghĩa ngắn, lời giải thích khi cần và liên kết đến mục chữ. Âm Hán Việt, thành phần chữ và mẹo nhớ là các mục tùy chọn. Biên soạn mẹo bằng lời riêng và gọi rõ là “Mẹo nhớ”. Chỉ ghi nguồn sách cho trường đã đối chiếu. Mục chưa có nguồn được duyệt có thể hiển thị nghĩa ngữ cảnh đã biên soạn, bỏ trống phần tham khảo.

**Nghiệm thu.** Mỗi câu có bản dịch tự nhiên và mọi cụm có nghĩa khi chạm. Hai trường hợp 女儿 và 哪儿 cho đúng hai giải thích khác nhau. Nút nghe đọc đúng cụm. Trong lượt tự nhớ, chỉ mở phân tích sau khi người học chọn xem đáp án hoặc chủ động xin gợi ý. Mở/đóng giải thích không đổi bước hoặc cộng lượt ôn. Kiểm tra ở màn hình 375 px và bằng bàn phím.
## 10. Kho tra cứu toàn bộ sách “Hack não 3000 chữ Hán”

Phạm vi bàn giao gồm toàn bộ 275 trang của PDF đã cung cấp. 50 câu ở mục 8 là một lối vào kho tra cứu. Thêm mục “Tra chữ” độc lập để tìm cả những mục chưa xuất hiện trong bài học.

1. Kiểm kê theo trang. Phân loại bìa, hướng dẫn, mục lục, trang nội dung. Với trang nội dung, ghi nhận từng mục chính và các từ/cụm minh họa nằm trong mục đó. Báo riêng số mục chính, chữ duy nhất và từ/cụm ví dụ. Xác định số thực tế từ bản sách, không suy từ con số 3000 trên tên sách.
2. Xây dựng quy trình nhập chạy lại được. OCR theo vùng để giữ đúng quan hệ giữa chữ lớn, pinyin, Hán Việt, nghĩa và dòng ví dụ. Lưu trang PDF, trang in nếu có và vị trí mục. Dùng ID nguồn ổn định để nhập tiếp sau gián đoạn hoặc sửa một trang mà không sinh bản sao. Các cách đọc và nghĩa khác nhau của cùng chữ có thể cùng tồn tại.
3. Soát các trường với trang gốc, đặc biệt dấu thanh, chữ gần hình, giản thể/phồn thể và dòng ghép nhầm. Đưa trường đọc chưa rõ vào danh sách cần soát kèm trang và ảnh cắt trong công cụ biên tập. Viết lời giải thích tiếng Việt ngắn, dễ hiểu và ví dụ bổ sung bằng lời riêng. Phân biệt mẹo nhớ với nguồn gốc lịch sử của chữ.
4. Màn “Tra chữ” hỗ trợ tìm theo chữ, pinyin có/không dấu và nghĩa tiếng Việt. Ví dụ gõ 女儿 hoặc nü’er đều dẫn tới mục con gái. Thẻ chi tiết hiện chữ, nút nghe, pinyin theo nghĩa, âm Hán Việt nếu có, nghĩa tiếng Việt, từ ví dụ có thể chạm, tham chiếu trang và nút lưu ôn. Từ câu đang học mở đúng nghĩa theo ngữ cảnh rồi quay lại đúng bước.
5. Nghiệm thu bằng báo cáo bao phủ: liệt kê tất cả trang và trạng thái, số mục chính/từ ví dụ theo trang, số mục trùng đã liên kết và số trường cần soát. So sánh danh sách mục trên từng trang nội dung với dữ liệu đã nhập. Kiểm tra tìm được mục ở đầu, giữa, cuối sách và mục nằm ngoài 50 câu. Chạy nhập hai lần phải ra cùng số mục, giữ nguyên ID và tiến độ học. Có thể triển khai theo lô nhưng chỉ đánh dấu hoàn thành toàn bộ khi đã đối soát hết trang và giải quyết các mục thiếu.
