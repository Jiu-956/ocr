import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // 假设后端运行在5000端口
  timeout: 10000
})

export default {
  uploadFile(formData) {
    return api.post('/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}