<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <router-link to="/" class="logo-link">
            <h1>OCR智能平台</h1>
          </router-link>
        </div>
        <nav class="nav-menu">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/pdf-splitter" class="nav-item">PDF切割</router-link>
          <router-link to="/about" class="nav-item">关于我们</router-link>
        </nav>
      </div>
    </header>

    <!-- 主体内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部栏 -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>OCR智能平台</h3>
          <p>高效、准确的文字识别解决方案</p>
        </div>
        <div class="footer-section">
          <h4>功能特色</h4>
          <ul>
            <li>图片文字识别</li>
            <li>PDF文档处理</li>
            <li>多语言支持</li>
            <li>批量处理</li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>联系我们</h4>
          <p>Email: support@ocr-platform.com</p>
          <p>技术支持: 400-123-4567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 OCR智能平台. 保留所有权利。</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏样式 */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-logo .logo-link {
  text-decoration: none;
  color: white;
}

.nav-logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

/* 主体内容区域 */
.main-content {
  flex: 1;
  background: #f8f9fa;
  min-height: calc(100vh - 70px - 200px);
}

/* 底部栏样式 */
.footer {
  background: #2c3e50;
  color: white;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  color: #3498db;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.footer-section h4 {
  color: #ecf0f1;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p {
  line-height: 1.6;
  color: #bdc3c7;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  padding: 0.3rem 0;
  color: #bdc3c7;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding: 1rem 2rem;
  text-align: center;
  color: #95a5a6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }
  
  .nav-menu {
    margin-top: 1rem;
  }
  
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>