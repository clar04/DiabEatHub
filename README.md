# SnapNotes : AI YouTube & Text Converter 

SnapNotes  adalah aplikasi web cerdas yang mengubah konten video YouTube atau teks mentah menjadi catatan terstruktur, ringkasan poin utama, dan kuis interaktif. Dibuat dengan *stack* teknologi modern (React, Tailwind, FastAPI), aplikasi ini berfungsi sebagai asisten belajar pribadi Anda.

Semua proses, mulai dari transkripsi hingga pembuatan file `.pdf` dan `.docx`, ditangani oleh backend FastAPI yang tangguh, memastikan antarmuka yang cepat dan ringan di sisi klien.

-----

## 🚀 Fitur Utama

  * **Input Ganda Fleksibel:**
      * **Link YouTube:** Secara otomatis mengambil transkrip penuh dari video YouTube.
      * **Text Area:** Memungkinkan Anda menempelkan transkrip atau teks mentah apa pun secara langsung.
  * **Beragam Format Output (Didukung AI):**
      * **Catatan Mendetail:** Menghasilkan catatan komprehensif dari materi.
      * **Ringkasan Poin Utama:** Mengekstrak poin-poin penting dan ringkasan singkat.
      * **Pembuat Kuis:** Membuat pertanyaan pilihan ganda berdasarkan teks.
  * **Ekspor Multi-Format (Dibuat di Backend):**
      * Minta backend untuk membuat dan mengunduh file dalam format `.txt`, `.md`, `.pdf`, atau `.docx` berdasarkan hasil teks dari AI.
  * **Pratinjau Instan:**
      * Langsung menampilkan *thumbnail* video YouTube yang Anda masukkan.
  * **Desain API-First:**
      * Semua logika berat (transkripsi, pemrosesan AI, pembuatan file) ditangani oleh FastAPI, sementara React hanya bertugas sebagai antarmuka pengguna.
  * **Desain Modern & Responsif:**
      * Dibangun dengan Tailwind CSS v3 untuk antarmuka yang bersih dan dapat digunakan di semua perangkat.

