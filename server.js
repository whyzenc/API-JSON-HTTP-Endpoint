const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

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

app.get("/cuaca/:kota", async (req, res) => {
  const apiKey = "5c622c4d562d46f3f75b350f5e76461c";
  const kota = req.params.kota;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${apiKey}&units=metric&lang=id`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data cuaca",
      error: error.response?.data || error.message
    });
  }
});

app.get("/api/berita", async (req, res) => {
  const apiKey = "5c622c4d562d46f3f75b350f5e76461c";
  const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&countries=id&limit=5&sort=published_desc`;
  try {
    const response = await axios.get(url);
    res.json(response.data.data || []);
  } catch (error) {
    res.status(500).json({
      message: "Gagal memuat berita",
      error: error.response?.data || error.message
    });
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
}
