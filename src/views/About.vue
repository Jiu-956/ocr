<template>
  <div class="about-page">
    <div class="about-container">
      <h2>关于OCR智能平台</h2>
      <p>本平台致力于为用户提供高效、准确的图片和PDF文字识别服务，支持多种文件格式和多语言识别。</p>
      <div class="about-section">
        <h3>平台特色</h3>
        <ul>
          <li>图片、PDF一键识别</li>
          <li>支持多语言文字提取</li>
          <li>PDF切割与页面提取</li>
          <li>批量处理（即将上线）</li>
        </ul>
      </div>
      <div class="about-section">
        <h3>技术栈</h3>
        <ul>
          <li>前端：Vue 3 + Vuex + Vue Router</li>
          <li>后端：Node.js + Express + Tesseract.js + pdf-parse</li>
        </ul>
      </div>
      <div class="about-section">
        <h3>联系我们</h3>
        <p>如有建议或合作意向，欢迎联系：support@ocr-platform.com</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OcrAbout'
}
</script>

<style scoped>
.about-page {
  background: white;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.about-container {
  max-width: 700px;
  margin: 2rem auto;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 2.5rem 2rem;
}
.about-section {
  margin-top: 2rem;
}
.about-section h3 {
  color: #667eea;
  margin-bottom: 0.5rem;
}
ul {
  padding-left: 1.2rem;
}
li {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}
</style>
