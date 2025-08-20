import { createStore } from 'vuex'
import api from './services/api'

export default createStore({
  state: {
    uploadStatus: '',   // uploading / success / failed
    ocrResults: null,
    error: null
  },
  mutations: {
    setUploadStatus(state, status) {
      state.uploadStatus = status
    },
    setOcrResults(state, results) {
      state.ocrResults = results
    },
    setError(state, error) {
      state.error = error
    },
    resetState(state) {
      state.uploadStatus = ''
      state.ocrResults = null
      state.error = null
    }
  },
  actions: {
    async uploadFile({ commit }, file) {
      commit('resetState')
      commit('setUploadStatus', 'uploading')

      try {
        const response = await api.uploadFile(file)

        let result
        if (typeof response.data === 'object') {
          result = response.data
        } else if (typeof response.data === 'string') {
          try {
            result = JSON.parse(response.data)
          } catch {
            result = { text: response.data }
          }
        } else {
          result = { text: String(response.data) }
        }

        console.log("后端返回的数据:", result)  // ✅ 调试用，方便确认返回字段

        commit('setOcrResults', {
          text: result.text || result.content || '',   // 👈 兼容 text / content
          pages: result.pages || [],
          image: result.image || result.image_bytes || ''
        })

        commit('setUploadStatus', 'success')
      } catch (error) {
        console.error('Upload failed:', error)

        let errMsg = 'An error occurred!'
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            errMsg = error.response.data
          } else if (error.response.data.message) {
            errMsg = error.response.data.message
          }
        } else if (error.message) {
          errMsg = error.message
        }

        commit('setError', errMsg)
        commit('setUploadStatus', 'failed')
      }
    }
  }
})
