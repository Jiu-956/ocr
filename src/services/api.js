// src/services/api.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

// ✅ 命名导出 uploadFile
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient.post('/predict/', formData)
}

export default { uploadFile }  // 默认导出一个对象，包含 uploadFile
