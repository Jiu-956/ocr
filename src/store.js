import { createStore } from 'vuex'
import api from './services/api'   // ✅ 现在 api.uploadFile 可用了

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
    async uploadFile({ commit }, file) {   // ✅ 注意参数名，这里直接接收 File 对象
      commit('resetState')
      commit('setUploadStatus', 'uploading')

      try {
        const response = await api.uploadFile(file)  // ✅ 直接传 file 即可

        let result
        if (typeof response.data === 'object') {
          result = response.data
        } else if (typeof response.data === 'string') {
          try {
            result = JSON.parse(response.data)
          } catch {
            result = response.data
          }
        } else {
          result = String(response.data)
        }

        commit('setOcrResults', result)
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
