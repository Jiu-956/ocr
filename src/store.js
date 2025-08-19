import { createStore } from 'vuex'
import api from './services/api'

export default createStore({
  state: {
    uploadStatus: '',
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
    async uploadFile({ commit }, formData) {
      commit('resetState')
      commit('setUploadStatus', 'uploading')
      
      try {
        const response = await api.uploadFile(formData)
        commit('setOcrResults', response.data)
        commit('setUploadStatus', 'success')
      } catch (error) {
        commit('setError', error.response?.data?.message || 'An error occurred')
        commit('setUploadStatus', 'failed')
      }
    }
  }
})