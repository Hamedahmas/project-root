const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, "../client"))); // سِرو فایل‌های HTML

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const notes = req.body.notes || "screenshot";
    const base64Image = buffer.toString("base64");
    const today = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `screenshot-${today}.png`;

    const repo = "GameOX";
    const owner = "Hamedahmas";
    const token = process.env.GITHUB_TOKEN;

    const githubResponse = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/screenshots/${filename}`,
      {
        message: notes,
        content: base64Image
      },
      {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "screenshot-uploader"
        }
      }
    );

    res.send("✅ اسکرین‌شات با موفقیت به GitHub ارسال شد!");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("❌ خطا در آپلود به GitHub");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
