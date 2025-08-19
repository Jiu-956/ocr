// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createWorker } = require('tesseract.js');
const PDFParser = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// 模拟OCR处理函数
async function processOCR(filePath, fileType) {
  if (fileType === 'pdf') {
    // PDF处理
    const dataBuffer = fs.readFileSync(filePath);
    const data = await PDFParser(dataBuffer);
    return {
      text: data.text,
      pages: [{ text: data.text, confidence: 95 }],
      type: 'pdf'
    };
  } else {
    // 图片处理
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data } = await worker.recognize(filePath);
    await worker.terminate();
    
    // 读取处理后的图像（模拟）
    const processedImage = fs.readFileSync(filePath).toString('base64');
    
    return {
      text: data.text,
      pages: data.blocks.map(block => ({
        text: block.text,
        confidence: block.confidence
      })),
      image: processedImage,
      type: 'image'
    };
  }
}

app.post('/api/ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image';
    
    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = await processOCR(filePath, fileType);
    
    // 清理上传的文件
    fs.unlinkSync(filePath);
    
    res.json(results);
  } catch (error) {
    console.error('OCR Processing Error:', error);
    res.status(500).json({ message: 'OCR processing failed', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});