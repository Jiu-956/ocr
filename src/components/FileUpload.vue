<template>
  <div class="file-upload">
    <form @submit.prevent="handleSubmit" class="upload-form">
      <div class="upload-area" :class="{ 'drag-over': isDragOver }" 
           @dragover.prevent="handleDragOver" 
           @dragleave="handleDragLeave" 
           @drop.prevent="handleDrop">
        <div class="upload-icon">📁</div>
        <h3>拖拽文件到此处或点击选择</h3>
        <p>支持 JPG、PNG、PDF 格式</p>
        <input 
          type="file" 
          id="file" 
          ref="fileInput" 
          @change="handleFileChange" 
          accept="image/*,.pdf"
          required
          class="file-input"
        >
        <label for="file" class="file-label">
          选择文件
        </label>
      </div>
      
      <div v-if="selectedFile" class="selected-file">
        <div class="file-preview">
          <span class="file-icon">📄</span>
          <div class="file-details">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
          <button type="button" @click="clearFile" class="clear-btn">×</button>
        </div>
      </div>
      
      <button type="submit" :disabled="isUploading || !selectedFile" class="submit-btn">
        <span v-if="isUploading" class="loading-spinner">⏳</span>
        {{ isUploading ? '处理中...' : '开始识别' }}
      </button>
      
      <div v-if="uploadStatus" class="status-message" :class="statusClass">
        {{ statusMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FileUpload',
  data() {
    return {
      selectedFile: null,
      isDragOver: false
    }
  },
  computed: {
    ...mapState(['uploadStatus', 'error']),
    isUploading() {
      return this.uploadStatus === 'uploading'
    },
    statusMessage() {
      if (this.uploadStatus === 'uploading') return '正在处理您的文件...'
      if (this.uploadStatus === 'success') return '文件处理成功！'
      if (this.error) return this.error
      return ''
    },
    statusClass() {
      return {
        'status-success': this.uploadStatus === 'success',
        'status-error': this.error
      }
    }
  },
  methods: {
    ...mapActions(['uploadFile']),  // ✅ 使用 Vuex 中的 uploadFile action

    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
      }
      this.$store.commit('resetState')
    },
    handleDragOver(event) {
      event.preventDefault()
      this.isDragOver = true
    },
    handleDragLeave() {
      this.isDragOver = false
    },
    handleDrop(event) {
      event.preventDefault()
      this.isDragOver = false
      const files = event.dataTransfer.files
      if (files.length > 0) {
        this.selectedFile = files[0]
        this.$refs.fileInput.files = files
        this.$store.commit('resetState')
      }
    },
    clearFile() {
      this.selectedFile = null
      this.$refs.fileInput.value = ''
      this.$store.commit('resetState')
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    // ✅ 这里改成调用 Vuex → FastAPI
    async handleSubmit() {
  if (!this.selectedFile) return

  try {
    await this.uploadFile(this.selectedFile)  // ✅ 直接传 file

    if (this.uploadStatus === 'success') {
      this.$router.push('/results')
    }
  } catch (err) {
    console.error('上传失败:', err)
  }
}

  }
}
</script>


<style scoped>
.file-upload {
  width: 100%;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: #fafbfc;
  position: relative;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.upload-area.drag-over {
  border-color: #667eea;
  background: #e0e7ff;
  transform: scale(1.02);
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.upload-area h3 {
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.upload-area p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-label {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
}

.file-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.selected-file {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 2rem;
}

.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.file-name {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.file-size {
  font-size: 0.8rem;
  color: #6b7280;
}

.clear-btn {
  background: #ef4444;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.submit-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.status-message {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.status-success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.status-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-area {
    padding: 2rem 1rem;
  }
  
  .file-preview {
    flex-direction: column;
    text-align: center;
  }
  
  .file-details {
    align-items: center;
  }
}
</style>