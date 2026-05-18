# 🖐️ Deteksi Gestur 5 Jari AI — Backpropagation from Scratch

Aplikasi web interaktif berbasis Artificial Intelligence (AI) untuk mendeteksi gestur 5 jari secara *real-time* menggunakan kamera. Proyek ini dibangun murni menggunakan algoritma **Neural Network Backpropagation dari nol (tanpa framework ML seperti TensorFlow/PyTorch)** untuk proses *training*-nya, lalu di-porting ke ekosistem Web modern.

🌐 **Live Demo:** [GANTI_DENGAN_LINK_VERCEL_KAMU](https://deteksi-jari-ai.vercel.app)

---

## 🚀 Fitur Utama
* **Custom Neural Network:** Otak AI dilatih menggunakan algoritma Backpropagation murni (NumPy) dengan *custom dataset* sebanyak 3.700+ baris data.
* **Real-time Tracking:** Ekstraksi 21 titik koordinat (*landmarks*) tangan secara instan menggunakan **MediaPipe Hands**.
* **Cross-Platform Web App:** Responsif dan bisa diakses langsung melalui *browser* laptop maupun HP (Android & iOS).
* **Modern UI/UX:** Tampilan antarmuka yang futuristik dan bersih menggunakan **React.js** dan **Tailwind CSS**.

---

## 🛠️ Tech Stack

### Machine Learning & Data Engineering (Python)
* Python 3
* NumPy (Matriks & Aljabar Linear)
* Pandas (Manajemen Dataset)
* Matplotlib (Visualisasi Loss Curve)

### Web Deployment (JavaScript)
* React.js (Vite)
* Tailwind CSS
* MediaPipe Hands SDK (Web Version)
* Vercel (Cloud Hosting)

---

## 📊 Proses Pengembangan Model

1. **Pengumpulan Data:** Memanen koordinat $X$ dan $Y$ dari 21 titik jari tangan melalui kamera laptop menjadi file `dataset_tangan.csv`.
2. **Retraining & Optimization:** Mengacak dataset (*shuffling*) dan melatih model jaringan saraf tiruan hingga mencapai *Loss Sweet Spot* sebesar **0.0829** (Akurasi ~91%).
3. **Export JSON:** Mengonversi matriks bobot (*weights*) dan bias dari format `.npy` menjadi `.json` agar bisa dibaca oleh JavaScript secara *native*.

---

## 💻 Cara Menjalankan Proyek di Lokal

### 1. Kloning Repositori
```bash
git clone [https://github.com/USERNAME_KAMU/deteksi-jari-web.git](https://github.com/USERNAME_KAMU/deteksi-jari-web.git)
cd deteksi-jari-web

npm install

npm run dev

Buka http://localhost:5173 di browser kamu untuk mencoba!
