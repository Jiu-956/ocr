// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const FormData = require("form-data");  // 👈 必须引入
const axios = require("axios");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.post("/api/ocr-txt", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    // 发给 Nougat /predict
    const response = await axios.post("http://127.0.0.1:8503/predict", formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
    });

    fs.unlinkSync(req.file.path); // 删除临时文件

    // 这里直接返回 txt 文件给前端下载
    res.setHeader("Content-Disposition", "attachment; filename=ocr_result.txt");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(response.data); // 因为返回是纯文本
  } catch (error) {
    console.error(error);
    res.status(500).send("OCR failed");
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
