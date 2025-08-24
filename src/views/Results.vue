<template>
  <div class="results">
    <h2>OCR Results</h2>

    <div class="results-container">
      <!-- 左边 PDF 渲染 -->
      <div class="pdf-viewer">
        <iframe
          v-if="pdfUrl"
          :src="`${pdfUrl}#page=${currentPage}`"
          class="pdf-iframe"
          frameborder="0"
          @load="onPdfLoad"
        ></iframe>
        <div v-else class="pdf-placeholder">
          <p>请上传PDF文件</p>
        </div>
      </div>

      <!-- 右边 Nougat LaTeX 输出 -->
      <div class="latex-viewer">
        <div class="latex-header">
          <h3>Nougat LaTeX 输出</h3>
        </div>
        <div class="latex-lines">
          <div
            v-for="(line, index) in latexLines"
            :key="index"
            class="latex-line"
            :class="{ 'highlighted': hoveredLine === index }"
            @mouseenter="handleLineHover(index)"
            @mouseleave="handleLineLeave"
          >
            <span class="line-number">{{ index + 1 }}</span>
            <span class="line-content">{{ line }}</span>
          </div>

          <div v-if="latexLines.length === 0" class="latex-empty">
            ⚠️ 没有可显示的 LaTeX 内容
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "OcrResults",
  setup() {
    const store = useStore();

    const pdfUrl = computed(() => store.state.ocrResults?.pdfUrl || "");

    const latexText = computed(() => {
      const raw = store.state.ocrResults?.text;
      if (typeof raw === "string") return raw;
      if (raw == null) return "";
      try {
        return JSON.stringify(raw, null, 2);
      } catch {
        return String(raw);
      }
    });

    const currentPage = ref(1);
    const totalPages = ref(0);
    const hoveredLine = ref(null);

    const latexLines = computed(() => {
      if (!latexText.value) return [];
      const lines = latexText.value.includes("\n")
        ? latexText.value.split("\n")
        : [latexText.value];
      return lines.filter(line => line.trim() !== "");
    });

    const handleLineHover = (lineIndex) => {
      hoveredLine.value = lineIndex;
      scrollToCorrespondingPage(lineIndex);
    };

    const handleLineLeave = () => {
      hoveredLine.value = null;
    };

    const scrollToCorrespondingPage = (lineIndex) => {
      const targetPage = Math.floor(lineIndex / 10) + 1;
      if (targetPage >= 1 && (totalPages.value === 0 || targetPage <= totalPages.value)) {
        currentPage.value = targetPage;
      }
    };

    const onPdfLoad = () => {
      totalPages.value = Math.max(totalPages.value, 5);
    };

    onMounted(() => {
      console.log("pdfUrl:", pdfUrl.value);
      console.log("latexText length:", latexText.value?.length || 0);
    });

    return {
      pdfUrl,
      latexLines,
      currentPage,
      totalPages,
      hoveredLine,
      handleLineHover,
      handleLineLeave,
      onPdfLoad
    };
  }
};
</script>

<style scoped>
.results {
  padding: 20px;
}

.results-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
}

.pdf-viewer {
  flex: 1;
  border: 1px solid #ddd;
  background: #f9f9f9;
  overflow: hidden;
  position: relative;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.pdf-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
}

.latex-viewer {
  flex: 1;
  border: 1px solid #ddd;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.latex-header {
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.latex-header h3 {
  margin: 0;
  font-size: 16px;
}

.latex-lines {
  flex: 1;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.latex-line {
  padding: 4px 12px;
  display: flex;
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: 3px solid transparent;
}

.latex-line:hover {
  background-color: #f8f9fa;
}

.latex-line.highlighted {
  background-color: #e3f2fd;
  border-left-color: #2196f3;
}

.latex-empty {
  padding: 12px;
  color: #999;
}

.line-number {
  min-width: 40px;
  color: #7f8c8d;
  font-size: 11px;
  user-select: none;
}

.line-content {
  flex: 1;
  white-space: pre-wrap;
  word-break: break-all;
}

@media (max-width: 768px) {
  .results-container {
    flex-direction: column;
    height: auto;
  }
  
  .pdf-viewer, .latex-viewer {
    height: 400px;
  }
}
</style>
