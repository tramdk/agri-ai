# 🌿 Nông Y AI - Trợ Lý Nông Nghiệp Thông Minh

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Nông Y AI Banner" width="100%" style="border-radius: 24px; margin-bottom: 20px;" />

  <img src="/public/icon.png" alt="Nông Y AI Icon" width="128" height="128" style="border-radius: 32px; margin-bottom: 20px;" />

  [![GitHub Actions](https://img.shields.io/github/actions/workflow/status/tramdk/agi-ai/android-build.yml?branch=main&label=Build%20APK&style=for-the-badge&logo=github)](https://github.com/tramdk/agi-ai/actions)
  [![Capacitor](https://img.shields.io/badge/Powered%20By-Capacitor-blue?style=for-the-badge&logo=capacitor)](https://capacitorjs.com/)
  [![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-orange?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
  [![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
</div>

---

## 🌟 Tổng Quan Dự Án

**Nông Y AI** là ứng dụng di động hiện đại được thiết kế để hỗ trợ bà con nông dân chẩn đoán sâu bệnh trên cây trồng một cách nhanh chóng và chính xác. Bằng cách kết hợp sức mạnh của trí tuệ nhân tạo (AI) và công nghệ hình ảnh, ứng dụng giúp tối ưu hóa quy trình bảo vệ thực vật, giảm thiểu rủi ro và tăng năng suất nông sản.

## ✨ Tính Năng Nổi Bật

- 📸 **Nhận Diện Qua Hình Ảnh**: Chụp ảnh trực tiếp hoặc tải ảnh từ thư viện để phân tích.
- 🤖 **Phân Tích Bằng Gemini AI**: Sử dụng mô hình AI tiên tiến nhất để nhận diện hàng trăm loại sâu bệnh.
- 📋 **Báo Cáo Chi Tiết**: Cung cấp tên bệnh, tình trạng, triệu chứng và giải pháp điều trị cụ thể.
- 💊 **Tư Vấn Điều Trị**: Gợi ý các phương pháp hóa học, sinh học và canh tác an toàn.
- 💾 **Lịch Sử Chẩn Đoán**: Ghi nhớ các lần chẩn đoán trước đó để theo dõi tiến triển của vườn cây.
- 📱 **Trải Nghiệm Premium**: Giao diện mượt mà, trực quan và tối ưu cho cả thiết bị di động (Android).

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **AI Integration**: Google Generative AI (Gemini 1.5 Pro/Flash)
- **Mobile Foundation**: Capacitor v8
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **CI/CD**: GitHub Actions

## 📦 Hướng Dẫn Cài Đặt

### Chạy Local (Web)

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
   GEMINI_API_KEY=your_api_key_here
   ```
   *Hoặc cấu hình trực tiếp trong phần Cài đặt của ứng dụng.*

4. **Chạy ứng dụng**:
   ```bash
   npm run dev
   ```

### Xây Dựng Bản Cho Android

Dự án đã tích hợp sẵn Capacitor. Để build APK:

```bash
# Build web project
npm run build

# Đồng bộ với Android project
npx cap sync android

# Mở Android Studio để build hoặc dùng CLI
npx cap open android
```

## 🚀 CI/CD & Tự Động Build

Ứng dụng được thiết lập **GitHub Actions** tự động:
- Tự động kiểm tra lỗi (Linting/Type check).
- Tự động build file **APK Debug** mỗi khi có code mới được đẩy lên nhánh `main`.
- **Tải xuống APK**: Truy cập tab [Actions](https://github.com/tramdk/agi-ai/actions) -> Chọn workflow build mới nhất -> Tải file trong mục **Artifacts**.

## 🎨 Giao Diện Ứng Dụng

<div align="center">
  <table>
    <tr>
      <td width="33%"><img src="https://raw.githubusercontent.com/tramdk/agi-ai/main/screenshots/landing.png" alt="Landing" /></td>
      <td width="33%"><img src="https://raw.githubusercontent.com/tramdk/agi-ai/main/screenshots/preview.png" alt="Preview" /></td>
      <td width="33%"><img src="https://raw.githubusercontent.com/tramdk/agi-ai/main/screenshots/result.png" alt="Result" /></td>
    </tr>
  </table>
</div>

## 📄 Giấy Phép

Dự án này được phát hành dưới giấy phép [Apache-2.0](LICENSE).

---
<div align="center">
  <p>Phát triển bởi <b>Nông Y AI Team</b> với ❤️ dành cho nông nghiệp Việt Nam.</p>
</div>
