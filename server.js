// ===============================
// 🌤️ APLIKASI BERITA & CUACA
// Whenny Zenica - UTS Pemrograman Jaringan
// ===============================
const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

// ====== KONFIGURASI PORT ======
const PORT = process.env.PORT || 3000;

// ====== KONFIGURASI FILE STATIS ======
app.use(express.static(path.join(__dirname, "public")));

// ====== ROUTES HALAMAN ======
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get("/tentang", (req, res) => {
  res.sendFile(path.join(__dirname, "views/tentang.html"));
});

app.get("/bantuan", (req, res) => {
  res.sendFile(path.join(__dirname, "views/bantuan.html"));
});

app.get("/berita", (req, res) => {
  res.sendFile(path.join(__dirname, "views/berita.html"));
});

// ====== ROUTE API CUACA ======
app.get("/cuaca/:kota", async (req, res) => {
  const apiKey = "b243e822361cd0a023a258f6790926c4"; // ✅ API Key OpenWeatherMap
  const kota = req.params.kota;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    kota
  )}&appid=${apiKey}&units=metric&lang=id`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error Cuaca:", error.response?.data || error.message);
    res.status(500).json({
      message: "Gagal mengambil data cuaca. Pastikan nama kota benar dan API key aktif.",
      error: error.response?.data || error.message,
    });
  }
});

// ====== ROUTE API BERITA (Mediastack) ======
app.get("/api/berita", async (req, res) => {
  const apiKey = "c12dce76598bed265f0096af73c7166b"; // API Key Mediastack
  const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&countries=id&limit=5&sort=published_desc`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.data && response.data.data.length > 0) {
      res.json(response.data.data);
    } else {
      res.status(404).json({ message: "Tidak ada berita ditemukan dari API Mediastack." });
    }
  } catch (error) {
    console.error("❌ Error API Berita:", error.response ? error.response.data : error.message);
    res.status(500).json({
      message: "Gagal memuat berita. Periksa API key atau koneksi internet.",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// ====== EKSPOR APP UNTUK VERCEL ======
module.exports = app;

// ====== JALANKAN SERVER (LOKAL) ======
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}
