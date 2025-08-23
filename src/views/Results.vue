<template>
  <div class="results">
    <h2>OCR Results</h2>

    <div class="results-container">
      <!-- 左边 PDF 渲染 -->
      <div ref="pdfContainer" class="pdf-viewer"></div>

      <!-- 右边 Nougat LaTeX 输出 -->
      <div class="latex-viewer">
        <h3>Nougat LaTeX 输出：</h3>
        <div class="latex-lines">
          <div
            v-for="(line, index) in latexLines"
            :key="index"
            class="latex-line"
            @mouseover="scrollPdfTo(index)"
          >
            {{ line }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import * as pdfjsLib from "pdfjs-dist";

// 使用兼容的方式设置 worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default {
  name: "OcrResults",
  setup() {
    const store = useStore();
    const pdfContainer = ref(null);
    const pdfDoc = ref(null);

    // LaTeX 按行拆分
    const latexLines = computed(() => {
      return store.state.ocrResults?.text
        ? store.state.ocrResults.text.split("\n")
        : [];
    });

    // 渲染 PDF 页
    const renderPage = async (num) => {
      if (!pdfDoc.value) return;
      const page = await pdfDoc.value.getPage(num);
      const viewport = page.getViewport({ scale: 1.2 }); // ✅ 缩小一点，避免太大

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      pdfContainer.value.innerHTML = "";
      pdfContainer.value.appendChild(canvas);
    };

    // 鼠标悬停滚动 PDF
    const scrollPdfTo = (lineIndex) => {
      if (pdfContainer.value && store.state.ocrResults?.text) {
        const totalLines = store.state.ocrResults.text.split("\n").length;
        const percent = lineIndex / totalLines;
        pdfContainer.value.scrollTop =
          pdfContainer.value.scrollHeight * percent;
      }
    };

    // 加载 PDF
    onMounted(async () => {
      const pdfUrl = store.state.ocrResults?.pdfUrl;
      if (!pdfUrl) return console.error("pdfUrl 无效");

      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        pdfDoc.value = await loadingTask.promise;
        renderPage(1); // 默认渲染第 1 页
      } catch (err) {
        console.error("PDF 加载失败:", err);
      }
    });

    return {
      pdfContainer,
      latexLines,
      scrollPdfTo,
    };
  },
};
</script>

<style scoped>
.results-container {
  display: flex;
  gap: 20px;
}

.pdf-viewer {
  flex: 1;
  height: 80vh;
  overflow-y: auto;
  border: 1px solid #ddd;
  background: #f9f9f9;
}

.latex-viewer {
  flex: 1;
  height: 80vh;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 8px; /* ✅ 缩小 padding */
  font-family: monospace;
  background: #fff;
}

.latex-lines {
  font-size: 13px;  /* ✅ 字体更小 */
  line-height: 1.4; /* ✅ 行距更紧凑 */
  margin: 0;
  padding: 0;
}

.latex-line {
  padding: 1px 3px; /* ✅ 缩小缩进 */
  cursor: pointer;
  white-space: pre-wrap; /* ✅ 自动换行 */
}

.latex-line:hover {
  background: #e0f7fa;
}
</style>