<template>
  <div class="results">
    <h2>OCR Results</h2>
    
    <div v-if="ocrResults" class="results-container">
      <div class="result-section" v-if="ocrResults.text">
        <h3>Extracted Text:</h3>
        <pre class="extracted-text">{{ ocrResults.text }}</pre>
      </div>
      
      <div v-if="ocrResults.pages && ocrResults.pages.length" class="result-section">
        <h3>Page Details:</h3>
        <div v-for="(page, index) in ocrResults.pages" :key="index" class="page-details">
          <h4>Page {{ index + 1 }}</h4>
          <p v-if="page.confidence">Confidence: {{ page.confidence.toFixed(2) }}%</p>
          <pre v-if="page.text">{{ page.text }}</pre>
        </div>
      </div>
      
      <div v-if="ocrResults.image" class="result-section">
        <h3>Processed Image:</h3>
        <img :src="`data:image/jpeg;base64,${ocrResults.image}`" alt="Processed document" class="processed-image">
      </div>
    </div>
    
    <div v-else class="no-results">
      <p>No results to display.</p>
    </div>
    
    <button @click="goBack" class="back-button">Process Another File</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OcrResults',
  computed: {
    ...mapState(['ocrResults'])
  },
  methods: {
    goBack() {
      this.$store.commit('resetState')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.results-container {
  text-align: left;
  margin: 2rem 0;
}

.result-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.extracted-text {
  white-space: pre-wrap;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.page-details {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.processed-image {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.no-results {
  margin: 2rem 0;
  color: #666;
}

.back-button {
  margin-top: 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.back-button:hover {
  background-color: #3aa876;
}
</style>
