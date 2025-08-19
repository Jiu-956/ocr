<template>
  <div class="home-container">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>智能OCR文字识别平台</h1>
        <p>高效、准确的图片和PDF文字识别解决方案</p>
        <div class="features">
          <div class="feature-item">
            <span class="icon">🖼️</span>
            <span>图片识别</span>
          </div>
          <div class="feature-item">
            <span class="icon">📄</span>
            <span>PDF处理</span>
          </div>
          <div class="feature-item">
            <span class="icon">⚡</span>
            <span>快速处理</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要功能区域 -->
    <section class="main-section">
      <div class="container">
        <div class="content-grid">
          <!-- 文件上传区域 -->
          <div class="upload-area">
            <div class="section-card">
              <h2>📤 上传文件</h2>
              <p>支持JPG、PNG、PDF等格式</p>
              <FileUpload />
            </div>
          </div>

          <!-- 最近记录区域 -->
          <div class="recent-area">
            <div class="section-card">
              <h2>📋 最近处理</h2>
              <div class="recent-files" v-if="recentFiles.length > 0">
                <div 
                  v-for="(file, index) in recentFiles" 
                  :key="index"
                  class="recent-file-item"
                >
                  <div class="file-info">
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-time">{{ formatTime(file.time) }}</span>
                  </div>
                  <div class="file-status" :class="file.status">
                    {{ getStatusText(file.status) }}
                  </div>
                </div>
              </div>
              <div v-else class="no-files">
                <p>暂无处理记录</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 推荐区域 -->
        <div class="recommendations">
          <div class="section-card">
            <h2>💡 推荐功能</h2>
            <div class="recommendation-grid">
              <div class="recommendation-item">
                <div class="rec-icon">🔧</div>
                <h3>PDF切割工具</h3>
                <p>轻松分割PDF文档，提取需要的页面</p>
                <router-link to="/pdf-splitter" class="rec-button">
                  立即使用
                </router-link>
              </div>
              <div class="recommendation-item">
                <div class="rec-icon">🎯</div>
                <h3>批量处理</h3>
                <p>一次性处理多个文件，提高工作效率</p>
                <button class="rec-button" disabled>
                  即将上线
                </button>
              </div>
              <div class="recommendation-item">
                <div class="rec-icon">🌍</div>
                <h3>多语言识别</h3>
                <p>支持中文、英文、日文等多种语言识别</p>
                <button class="rec-button" disabled>
                  即将上线
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload.vue'
import { mapState } from 'vuex'

export default {
  name: 'OcrHome',
  components: {
    FileUpload
  },
  data() {
    return {
      recentFiles: []
    }
  },
  computed: {
    ...mapState(['ocrResults', 'uploadStatus'])
  },
  mounted() {
    this.loadRecentFiles()
  },
  watch: {
    uploadStatus(newStatus) {
      if (newStatus === 'success') {
        this.addToRecentFiles()
      }
    }
  },
  methods: {
    loadRecentFiles() {
      const stored = localStorage.getItem('recentOcrFiles')
      if (stored) {
        this.recentFiles = JSON.parse(stored)
      }
    },
    addToRecentFiles() {
      const newFile = {
        name: '处理完成的文件',
        time: new Date().toISOString(),
        status: 'success'
      }
      this.recentFiles.unshift(newFile)
      if (this.recentFiles.length > 5) {
        this.recentFiles.pop()
      }
      localStorage.setItem('recentOcrFiles', JSON.stringify(this.recentFiles))
    },
    formatTime(timeString) {
      const date = new Date(timeString)
      return date.toLocaleString('zh-CN')
    },
    getStatusText(status) {
      const statusMap = {
        'success': '✅ 成功',
        'failed': '❌ 失败',
        'processing': '⏳ 处理中'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style scoped>
.home-container {
  background: white;
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.features {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.feature-item .icon {
  font-size: 2rem;
}

.feature-item span:last-child {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 主要功能区域 */
.main-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.section-card:hover {
  transform: translateY(-5px);
}

.section-card h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.section-card p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

/* 最近记录区域 */
.recent-files {
  max-height: 300px;
  overflow-y: auto;
}

.recent-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  transition: background-color 0.3s ease;
}

.recent-file-item:hover {
  background-color: #f8f9fa;
}

.file-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.file-name {
  font-weight: 600;
  color: #2c3e50;
}

.file-time {
  font-size: 0.8rem;
  color: #95a5a6;
}

.file-status {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.file-status.success {
  background: #d4edda;
  color: #155724;
}

.file-status.failed {
  background: #f8d7da;
  color: #721c24;
}

.no-files {
  text-align: center;
  color: #95a5a6;
  padding: 2rem;
}

/* 推荐区域 */
.recommendations {
  margin-top: 2rem;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.recommendation-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.recommendation-item:hover {
  background: #e9ecef;
  transform: translateY(-3px);
}

.rec-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.recommendation-item h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.recommendation-item p {
  color: #7f8c8d;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.rec-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
  transition: all 0.3s ease;
}

.rec-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.rec-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .features {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendation-grid {
    grid-template-columns: 1fr;
  }
}
</style>