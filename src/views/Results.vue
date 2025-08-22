<template>
  <div class="results">
    <h2>OCR Results</h2>

    <div class="results-container">
      <!-- 左边 PDF 渲染 -->
      <div ref="pdfContainer" class="pdf-viewer"></div>

      <!-- 右边 Nougat LaTeX 输出 -->
      <div class="latex-viewer">
        <h3>Nougat LaTeX 输出：</h3>
        <pre>
          <div
            v-for="(line, index) in latexLines"
            :key="index"
            class="latex-line"
            @mouseover="scrollPdfTo(index)"
          >
            {{ line }}
          </div>
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import * as pdfjsLib from "pdfjs-dist";

export default {
  name: "OcrResults",
  setup() {
    const store = useStore();
    const pdfContainer = ref(null);
    const pdfDoc = ref(null);

    // 计算属性：LaTeX 按行拆分
    const latexLines = computed(() => {
      return store.state.ocrResults?.text
        ? store.state.ocrResults.text.split("\n")
        : [];
    });

    // 加载 PDF
    onMounted(async () => {
      if (store.state.ocrResults?.pdfUrl) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        const loadingTask = pdfjsLib.getDocument(store.state.ocrResults.pdfUrl);
        pdfDoc.value = await loadingTask.promise;
        renderPage(1); // 默认先渲染第 1 页
      }
    });

    const renderPage = async (num) => {
      if (!pdfDoc.value) return;
      const page = await pdfDoc.value.getPage(num);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = { canvasContext: context, viewport };
      await page.render(renderContext).promise;

      pdfContainer.value.innerHTML = ""; // 清空旧的
      pdfContainer.value.appendChild(canvas);
    };

    // 鼠标悬停时滚动 PDF 对应位置
    const scrollPdfTo = (lineIndex) => {
      if (pdfContainer.value && store.state.ocrResults?.text) {
        const totalLines = store.state.ocrResults.text.split("\n").length;
        const percent = lineIndex / totalLines;
        pdfContainer.value.scrollTop =
          pdfContainer.value.scrollHeight * percent;
      }
    };

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
  padding: 10px;
  font-family: monospace;
  background: #fff;
}

.latex-line {
  padding: 2px 5px;
  cursor: pointer;
}

.latex-line:hover {
  background: #e0f7fa;
}
</style>
