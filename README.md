# 🌿 Nông Y AI - Trợ Lý Nông Nghiệp Thông Minh

<div align="center">

  <img src="/public/icon.png" alt="Nông Y AI Icon" width="128" height="128" style="border-radius: 32px; margin-bottom: 20px;" />

  [![GitHub Actions](https://img.shields.io/github/actions/workflow/status/tramdk/agi-ai/android-build.yml?branch=main&label=Build%20APK&style=for-the-badge&logo=github)](https://github.com/tramdk/agi-ai/actions)
  [![Capacitor](https://img.shields.io/badge/Powered%20By-Capacitor-blue?style=for-the-badge&logo=capacitor)](https://capacitorjs.com/)
  [![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-orange?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
  [![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
</div>

---

## 🌟 Tổng Quan Dự Án

**Nông Y AI** là ứng dụng di động hiện đại được thiết kế để hỗ trợ bà con nông dân chẩn đoán sâu bệnh trên cây trồng một cách nhanh chóng và chính xác. Bằng cách kết hợp sức mạnh của trí tuệ nhân tạo (AI) Gemini, công nghệ nhận diện hình ảnh, giọng nói và tổng hợp tiếng nói, ứng dụng giúp tối ưu hóa quy trình bảo vệ thực vật, giảm thiểu rủi ro và tăng năng suất nông sản.

---

## ✨ Tính Năng Nổi Bật

### 📸 Chẩn Đoán Qua Hình Ảnh
- Chụp ảnh trực tiếp bằng camera hoặc tải ảnh từ thư viện.
- AI phân tích và trả về **tên bệnh, tình trạng, triệu chứng** và **giải pháp điều trị** chi tiết (hóa học, sinh học, canh tác).
- Hỗ trợ cung cấp thêm tên cây để tăng độ chính xác khi chẩn đoán.

### 💬 Nhắn Tin Với Chuyên Gia AI
- Chat trực tiếp với chuyên gia Nông Y AI dạng tin nhắn.
- Hỗ trợ **đính kèm hình ảnh** trong cuộc trò chuyện để AI phân tích.
- Tích hợp **Speech-to-Text** (nhập tin nhắn bằng giọng nói - hỗ trợ tiếng Việt).
- Tích hợp **Text-to-Speech** (AI tự đọc câu trả lời). Có nút bật/tắt âm thanh.
- Lưu lịch sử đoạn hội thoại trong phiên làm việc để AI trả lời ngày càng chuyên sâu hơn.

### 📞 Gọi Thoại Trực Tiếp Với AI *(Tính năng mới)*
- Giao diện giả lập cuộc gọi điện thoại toàn màn hình, tối màu, chuyên nghiệp.
- **Hoàn toàn rảnh tay (Hands-free):** Sau khi AI nói xong, Micro tự động bật để nghe câu hỏi tiếp theo — không cần bấm nút.
- **Đính kèm ảnh trong khi gọi:** Gửi ảnh cây bị bệnh ngay trong cuộc gọi để AI phân tích kết hợp với giọng nói.
- Hiệu ứng sóng âm động (pulsing animation) thể hiện các trạng thái: *Đang kết nối, Đang nghe, AI đang suy nghĩ, AI đang nói*.
- Nút Tắt tiếng (Mute) và nút Cúp máy (End Call) như ứng dụng điện thoại thật.

### 📖 Cẩm Nang Kỹ Thuật
- Thư viện cẩm nang canh tác và bảo vệ thực vật tích hợp sẵn trong ứng dụng.

### 🌤️ Thời Tiết Thực Tế
- Hiển thị thời tiết hiện tại theo vị trí GPS của bà con để tư vấn phù hợp.

### 💾 Lịch Sử Chẩn Đoán
- Ghi nhớ và quản lý tất cả các lần chẩn đoán trước đó. Xem lại và xóa từng mục.

### 📱 Trải Nghiệm Premium
- Giao diện mượt mà, trực quan, tối ưu cho thiết bị di động Android.
- Hỗ trợ Safe Area cho màn hình có notch, Dynamic Island và thanh điều hướng.

---

## 🛠️ Công Nghệ Sử Dụng

| Hạng mục | Công nghệ |
|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS v4 |
| **AI Model** | Google Gemini 3.1 Pro (`gemini-3.1-pro-preview`) |
| **AI SDK** | `@google/genai` v1.29+ |
| **Mobile Shell** | Capacitor v8 (Android) |
| **Giọng nói (STT)** | `@capacitor-community/speech-recognition` + Web Speech API (fallback) |
| **Đọc văn bản (TTS)** | `@capacitor-community/text-to-speech` |
| **Camera** | `@capacitor/camera` |
| **Vị trí** | `@capacitor/geolocation` |
| **Animations** | Framer Motion (motion/react) |
| **Icons** | Lucide React |
| **CI/CD** | GitHub Actions |

---

## 📦 Hướng Dẫn Cài Đặt

### Chạy Local (Web/Browser)

1. **Clone repository**:
   ```bash
   git clone https://github.com/tramdk/agi-ai.git
   cd agi-ai
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Cấu hình API Key**:
   Tạo file `.env.local` và thêm:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   *Hoặc cấu hình trực tiếp trong phần Cài đặt ⚙️ của ứng dụng sau khi khởi chạy.*

4. **Chạy ứng dụng**:
   ```bash
   npm run dev
   ```
   > Ứng dụng chạy tại `http://localhost:3000`. Tính năng STT/TTS hoạt động tốt trên Chrome.

### Xây Dựng Bản APK Cho Android

```bash
# Build web project
npm run build

# Đồng bộ với Android project
npx cap sync android

# Mở Android Studio để build APK
npx cap open android
```

Hoặc dùng script tích hợp:
```bash
npm run build:android
```

---

## 🚀 CI/CD & Tự Động Build

Ứng dụng được thiết lập **GitHub Actions** để tự động hóa:
- ✅ Kiểm tra lỗi TypeScript (Type check).
- ✅ Tự động build file **APK Debug** mỗi khi có code mới push lên nhánh `main`.
- 📥 **Tải xuống APK**: Truy cập tab [Actions](https://github.com/tramdk/agi-ai/actions) → Chọn workflow build mới nhất → Tải file trong mục **Artifacts**.

---

## 🗂️ Cấu Trúc Dự Án

```
agi-ai/
├── src/
│   ├── components/
│   │   ├── LandingView.tsx       # Màn hình trang chủ
│   │   ├── PreviewView.tsx       # Xem trước ảnh trước khi phân tích
│   │   ├── AnalyzingView.tsx     # Màn hình đang phân tích
│   │   ├── ResultView.tsx        # Hiển thị kết quả chẩn đoán
│   │   ├── ExpertChatView.tsx    # Chat text + giọng nói với AI
│   │   ├── CallExpertView.tsx    # Gọi thoại rảnh tay với AI ⭐ Mới
│   │   ├── HistoryListView.tsx   # Danh sách lịch sử chẩn đoán
│   │   ├── HandbookView.tsx      # Cẩm nang kỹ thuật
│   │   ├── Header.tsx            # Thanh tiêu đề
│   │   ├── SettingsModal.tsx     # Cài đặt API Key
│   │   └── OfflineNotice.tsx     # Thông báo mất kết nối
│   ├── services/
│   │   ├── gemini.ts             # Tích hợp Google Gemini API
│   │   ├── history.ts            # Quản lý lịch sử chẩn đoán
│   │   └── weather.ts            # API thời tiết
│   └── App.tsx                   # Điều phối toàn bộ trạng thái ứng dụng
├── android/                      # Capacitor Android project
├── public/                       # Assets tĩnh (icon, splash)
├── capacitor.config.ts           # Cấu hình Capacitor
└── vite.config.ts                # Cấu hình Vite
```

---

## 📄 Giấy Phép

Dự án này được phát hành dưới giấy phép [Apache-2.0](LICENSE).

---
<div align="center">
  <p>Phát triển bởi <b>Nông Y AI Team</b> với ❤️ dành cho nông nghiệp Việt Nam.</p>
</div>
