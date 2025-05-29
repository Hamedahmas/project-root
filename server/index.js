const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, "../client"))); // سرو فایل‌های HTML

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("❌ فایلی ارسال نشده است.");

    const { buffer, originalname } = req.file;
    const notes = req.body.notes || "screenshot";
    const base64Image = Buffer.from(buffer).toString("base64");
    const today = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `screenshot-${today}.png`;

    const repo = "GameOX";
    const owner = "Hamedahmas";
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(500).send("❌ GitHub Token در فایل .env تنظیم نشده است.");
    }

    const githubResponse = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/screenshots/${filename}`,
      {
        message: `📝 ${notes}`,
        content: base64Image,
        branch: "main" // در صورت نیاز، به شاخه‌ی دلخواه تغییر بده
      },
      {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "screenshot-uploader"
        }
      }
    );

    res.send("✅ اسکرین‌شات با موفقیت در GitHub ذخیره شد.");
  } catch (error) {
    console.error("❌ GitHub API error:", error.response?.data || error.message);
    res.status(500).send("❌ خطا در آپلود اسکرین‌شات به GitHub.");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});
