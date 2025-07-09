# HerbalAI - AI-Powered Medicinal Plant Search Application

*Penerapan AI Speech-to-Text pada Aplikasi Pencarian Tanaman Obat*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/muhamadafghans-projects/v0-modern-tanaman-obat-website)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

## 📋 Deskripsi Proyek

HerbalAI adalah aplikasi web inovatif yang menggunakan teknologi AI Speech-to-Text untuk membantu pengguna mencari informasi tanaman obat tradisional Indonesia. Aplikasi ini memungkinkan pengguna untuk mencari tanaman obat melalui tiga metode: pencarian suara (voice search), upload gambar, dan pencarian teks tradisional.

### 🎯 Tujuan Utama
- Meningkatkan aksesibilitas informasi tanaman obat tradisional
- Memudahkan identifikasi tanaman obat menggunakan teknologi AI
- Menyediakan informasi lengkap tentang khasiat, penggunaan, dan dosis tanaman obat
- Mendukung pelestarian pengetahuan pengobatan tradisional Indonesia

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4 (React-based)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Speech Recognition**: Web Speech API

### Backend
- **Runtime**: Node.js
- **API Framework**: Next.js API Routes
- **AI Service**: Google Gemini 1.5 Flash API
- **Image Processing**: Built-in Buffer API

### Deployment & Tools
- **Deployment**: Vercel
- **Environment**: Development dengan hot-reload
- **Package Manager**: npm
- **Version Control**: Git

## ✨ Fitur Utama

### 🎙️ AI Speech-to-Text
- **Voice Search**: Pengguna dapat berbicara untuk mencari tanaman obat
- **Real-time Processing**: Konversi suara ke teks secara real-time
- **Bahasa Indonesia**: Dukungan penuh untuk bahasa Indonesia
- **Auto-redirect**: Otomatis mengarahkan ke halaman hasil pencarian

### 📸 Image Recognition
- **Upload Gambar**: Identifikasi tanaman melalui foto
- **AI Vision**: Menggunakan Google Gemini untuk analisis gambar
- **Format Support**: Mendukung berbagai format gambar (JPG, PNG, dll.)
- **Instant Analysis**: Hasil identifikasi langsung tersedia

### 🔍 Text Search
- **Pencarian Teks**: Metode pencarian tradisional dengan keyword
- **Smart Search**: AI memahami konteks dan memberikan hasil yang relevan
- **Quick Symptoms**: Tombol cepat untuk gejala umum
- **Auto-complete**: Saran pencarian otomatis

### 📊 Comprehensive Plant Information
- **Nama Ilmiah**: Nama latin tanaman
- **Deskripsi Lengkap**: Informasi detail tentang tanaman dan khasiatnya
- **Cara Penggunaan**: Petunjuk praktis penggunaan
- **Dosis**: Takaran yang disarankan
- **Peringatan**: Kontraindikasi dan efek samping
- **Gejala yang Diobati**: Daftar keluhan yang bisa diatasi

### 🌐 User Experience
- **Responsive Design**: Kompatibel dengan semua perangkat
- **Modern UI**: Antarmuka yang bersih dan intuitif
- **Fast Loading**: Optimasi performa untuk akses cepat
- **Accessibility**: Mendukung pengguna dengan kebutuhan khusus

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Google Gemini API Key

### Langkah Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/your-username/medicinal-plants-search.git
cd medicinal-plants-search
```

2. **Install Dependencies**
```bash
npm install
# atau
yarn install
```

3. **Setup Environment Variables**
Buat file `.env` di root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

4. **Dapatkan Google Gemini API Key**
- Kunjungi [Google AI Studio](https://ai.google.dev/)
- Buat akun dan dapatkan API key
- Masukkan API key ke file `.env`

5. **Jalankan Development Server**
```bash
npm run dev
# atau
yarn dev
```

6. **Akses Aplikasi**
Buka browser dan kunjungi `http://localhost:3000`

## 📖 Cara Penggunaan

### 1. Voice Search (Pencarian Suara)
1. Klik tombol **"Mulai Voice Search"** di halaman utama
2. Klik ikon microphone atau tombol **"Mulai Rekaman"**
3. Ceritakan keluhan atau gejala Anda dengan jelas
4. AI akan mengkonversi suara menjadi teks dan mencari tanaman obat yang sesuai
5. Hasil akan ditampilkan dengan informasi lengkap

### 2. Upload Gambar
1. Pilih menu **"Upload Gambar"** atau klik tombol kamera
2. Upload foto tanaman yang ingin diidentifikasi
3. Pastikan gambar jelas dan menunjukkan detail tanaman
4. AI akan menganalisis gambar dan memberikan informasi tanaman

### 3. Text Search (Pencarian Teks)
1. Gunakan search bar di halaman utama
2. Ketik nama tanaman atau gejala yang ingin dicari
3. Tekan Enter atau klik tombol **"Cari"**
4. Browse hasil pencarian yang relevan

### 4. Quick Symptoms
- Gunakan tombol quick symptoms untuk gejala umum
- Klik langsung pada gejala yang sesuai
- Sistem akan langsung mencari tanaman obat yang relevan

## 🔧 API Documentation

### Endpoint Utama

#### POST `/api/search`
Endpoint untuk melakukan pencarian tanaman obat.

**Request Body (FormData):**
```javascript
{
  query: string,        // Query pencarian
  type: string,         // "text" | "image" | "voice"
  image?: File          // File gambar (untuk type "image")
}
```

**Response:**
```javascript
{
  results: [
    {
      name: string,           // Nama tanaman
      scientificName: string, // Nama ilmiah
      description: string,    // Deskripsi lengkap
      usage: string,          // Cara penggunaan
      treats: string[],       // Gejala yang diobati
      warnings: string,       // Peringatan
      dosage: string,         // Dosis
      image: string          // URL gambar
    }
  ]
}
```

**Error Response:**
```javascript
{
  error: string  // Pesan error
}
```

## 📁 Struktur Proyek

```
medicinal-plants-search/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.js          # API endpoint utama
│   ├── results/
│   │   └── page.jsx              # Halaman hasil pencarian
│   ├── upload/
│   │   └── page.jsx              # Halaman upload gambar
│   ├── voice/
│   │   └── page.jsx              # Halaman voice search
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   └── page.jsx                  # Homepage
├── components/
│   └── ui/                       # UI components (shadcn/ui)
├── lib/
│   └── utils.js                  # Utility functions
├── public/                       # Static assets
├── .env                          # Environment variables
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind CSS config
└── README.md                     # Project documentation
```

## 🎨 Komponen UI

### Halaman Utama (`app/page.jsx`)
- Hero section dengan pengenalan fitur
- Quick access buttons untuk ketiga metode pencarian
- Common symptoms untuk pencarian cepat
- Statistik dan fakta tentang tanaman obat

### Voice Search (`app/voice/page.jsx`)
- Interface untuk voice recording
- Real-time speech recognition
- Visual feedback selama recording
- Auto-redirect ke hasil pencarian

### Upload Image (`app/upload/page.jsx`)
- Drag & drop image upload
- Image preview
- AI-powered plant identification
- Comprehensive plant information display

### Results Page (`app/results/page.jsx`)
- Search results display
- Detailed plant information cards
- Filtering and sorting options
- Related plant suggestions

## 🔐 Environment Variables

```env
# Google Gemini API
GEMINI_API_KEY=your_api_key_here 
```

## 📱 Responsive Design

Aplikasi dirancang untuk bekerja optimal di berbagai perangkat:

- **Desktop**: Full featured experience
- **Tablet**: Optimized layout untuk layar medium
- **Mobile**: Touch-friendly interface dengan navigation yang mudah
- **Accessibility**: Support untuk screen readers dan keyboard navigation

## 🧪 Testing

### Manual Testing
1. Test voice recognition di berbagai browser
2. Verify image upload functionality
3. Check responsive design di multiple devices
4. Validate API responses

### Browser Support
- Chrome/Edge: Full support dengan Web Speech API
- Firefox: Limited voice support
- Safari: Partial support
- Mobile browsers: Optimized experience

## 🚀 Deployment

### Vercel Deployment
1. Connect repository ke Vercel
2. Set environment variables di Vercel dashboard
3. Deploy automatically dari main branch

### Manual Deployment
```bash
# Build untuk production
npm run build

# Start production server
npm start
```

## 🔧 Troubleshooting

### Common Issues

1. **Voice Recognition Tidak Bekerja**
   - Pastikan menggunakan HTTPS
   - Check browser support untuk Web Speech API
   - Verify microphone permissions

2. **API Key Error**
   - Pastikan GEMINI_API_KEY sudah diset
   - Verify API key masih valid
   - Check API quota limits

3. **Image Upload Gagal**
   - Check file size (max 10MB)
   - Verify supported formats
   - Ensure stable internet connection

4. **Slow Response**
   - Check network connection
   - Verify API server status
   - Consider image compression

## 📊 Performance Optimization

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting per route
- **API Caching**: Implement caching untuk frequently accessed data
- **Lazy Loading**: Components loaded on demand

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript untuk type safety
- Write meaningful commit messages
- Test thoroughly before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** untuk powerful AI capabilities
- **Next.js Team** untuk excellent framework
- **Vercel** untuk seamless deployment
- **shadcn/ui** untuk beautiful UI components
- **Tailwind CSS** untuk utility-first CSS
- **Traditional Indonesian Medicine** knowledge sources

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Check dokumentasi ini terlebih dahulu
2. Search di existing issues
3. Create new issue dengan detail yang lengkap
4. Contact developer untuk support langsung

## 📈 Analytics & Monitoring

- Track user engagement dengan search methods
- Monitor API response times
- Analyze most searched plants dan symptoms
- User feedback collection system

---

**Disclaimer**: Informasi yang diberikan hanya untuk referensi pendidikan. Selalu konsultasikan dengan dokter atau ahli kesehatan sebelum menggunakan tanaman obat, terutama jika Anda memiliki kondisi medis tertentu atau sedang mengonsumsi obat lain.

**Last Updated**: July 2025