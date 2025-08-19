<template>
  <div class="pdf-splitter-page">
    <div class="splitter-container">
      <h2>📄 PDF切割工具</h2>
      <p>上传PDF文件，选择需要保留的页面，导出为新PDF。</p>
      
      <div class="splitter-card">
        <div class="upload-section">
          <h3>📤 上传PDF文件</h3>
          <input 
            type="file" 
            accept="application/pdf" 
            @change="onFileChange"
            class="file-input"
          />
          <div v-if="pdfName" class="pdf-info">
            <span class="file-icon">📄</span>
            <div class="file-details">
              <span class="file-name">{{ pdfName }}</span>
              <span class="file-size">{{ fileSize }}</span>
            </div>
          </div>
        </div>

        <div v-if="pdfFile" class="page-select-section">
          <h3>✂️ 选择页面范围</h3>
          <div class="input-group">
            <label>输入页面范围（用逗号分隔，如：1,3,5-7）：</label>
            <input 
              v-model="pageInput" 
              placeholder="例如：1,2,4-6"
              class="page-input"
            />
          </div>
          <div class="action-buttons">
            <button @click="processPdf" :disabled="processing" class="process-btn">
              <span v-if="processing">⏳ 处理中...</span>
              <span v-else>🔄 开始切割</span>
            </button>
            <button @click="reset" class="reset-btn">🔄 重置</button>
          </div>
        </div>

        <div v-if="errorMsg" class="error-msg">
          ❌ {{ errorMsg }}
        </div>

        <div v-if="successMsg" class="success-msg">
          ✅ {{ successMsg }}
        </div>

        <div class="info-section">
          <h3>💡 使用说明</h3>
          <ul>
            <li>支持标准PDF文件格式</li>
            <li>页面范围格式：1,3,5-7（表示第1页、第3页、第5到7页）</li>
            <li>处理完成后将自动下载新的PDF文件</li>
            <li>目前为演示版本，实际切割功能需要后端支持</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PdfSplitter',
  data() {
    return {
      pdfFile: null,
      pdfName: '',
      fileSize: '',
      pageInput: '',
      processing: false,
      errorMsg: '',
      successMsg: ''
    }
  },
  methods: {
    onFileChange(e) {
      this.clearMessages();
      const file = e.target.files[0];
      if (!file) return;
      
      if (file.type !== 'application/pdf') {
        this.errorMsg = '请选择PDF文件';
        return;
      }
      
      this.pdfFile = file;
      this.pdfName = file.name;
      this.fileSize = this.formatFileSize(file.size);
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    async processPdf() {
      this.clearMessages();
      
      if (!this.pdfFile) {
        this.errorMsg = '请先上传PDF文件';
        return;
      }
      
      if (!this.pageInput.trim()) {
        this.errorMsg = '请输入页面范围';
        return;
      }
      
      this.processing = true;
      
      // 模拟处理过程
      setTimeout(() => {
        this.processing = false;
        this.successMsg = 'PDF切割请求已提交！实际功能需要后端支持，这里仅为演示界面。';
        
        // 模拟文件下载
        setTimeout(() => {
          this.downloadDemo();
        }, 1000);
      }, 2000);
    },
    
    downloadDemo() {
      // 创建一个模拟的下载链接
      const link = document.createElement('a');
      link.href = '#';
      link.download = `split_${this.pdfName}`;
      link.click();
      
      this.successMsg += ' 实际项目中，这里会下载处理后的PDF文件。';
    },
    
    reset() {
      this.pdfFile = null;
      this.pdfName = '';
      this.fileSize = '';
      this.pageInput = '';
      this.clearMessages();
      
      // 清除文件输入
      const fileInput = document.querySelector('.file-input');
      if (fileInput) {
        fileInput.value = '';
      }
    },
    
    clearMessages() {
      this.errorMsg = '';
      this.successMsg = '';
    }
  }
}
</script>

<style scoped>
.pdf-splitter-page {
  background: white;
  min-height: 70vh;
  padding: 2rem 0;
}

.splitter-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.splitter-container h2 {
  text-align: center;
  color: #2c3e50;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.splitter-container > p {
  text-align: center;
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.splitter-card {
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-section, .page-select-section, .info-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.upload-section h3, .page-select-section h3, .info-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.file-input {
  width: 100%;
  padding: 0.8rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.file-input:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.pdf-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e8;
  border-radius: 8px;
}

.file-icon {
  font-size: 2rem;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.file-name {
  font-weight: 600;
  color: #2c3e50;
}

.file-size {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  color: #2c3e50;
  font-weight: 500;
}

.page-input {
  padding: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.page-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.process-btn, .reset-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.process-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex: 1;
}

.process-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.process-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.reset-btn {
  background: #95a5a6;
  color: white;
}

.reset-btn:hover {
  background: #7f8c8d;
  transform: translateY(-2px);
}

.error-msg {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.success-msg {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #a7f3d0;
}

.info-section ul {
  list-style: none;
  padding: 0;
}

.info-section li {
  padding: 0.5rem 0;
  color: #2c3e50;
  border-bottom: 1px solid #ecf0f1;
}

.info-section li:last-child {
  border-bottom: none;
}

.info-section li:before {
  content: "💡 ";
  margin-right: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .splitter-container {
    padding: 0 1rem;
  }
  
  .splitter-card {
    padding: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .splitter-container h2 {
    font-size: 1.8rem;
  }
}
</style>
