<template>
  <div class="generate-page">
    <div class="bg-grid"></div>
    <div class="bg-glow"></div>

    <header class="page-header">
      <div class="header-line"></div>
      <h1 class="page-title">OvSGTR Spatial Inference & AIGC Refinement</h1>
      <p class="page-subtitle">AIGC 城市设计评估与推演大盘 · 科学回溯证据链演示平台</p>
      <div class="header-line"></div>
    </header>

    <!-- 顶层全局提示与缺失文件警报 -->
    <div v-if="missingFilesManifest.length > 0" class="missing-warning-banner">
      <span class="warning-title">⚠️ 数据完整性校验提示 (Missing Files Checked by sync script):</span>
      <div class="warning-scroll-box">
        <span v-for="(msg, i) in missingFilesManifest" :key="i" class="warning-item">
          {{ msg }}
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="global-loading">
      <div class="loader-hex"></div>
      <span class="loading-lbl">INITIALIZING OVSGTR DOCKER & SYNCING CATALOG...</span>
    </div>

    <div v-else class="dashboard-main-layout">
      <!-- 第一部分: 模型训练结果总览 -->
      <ModelTrainingOverview 
        :activePattern="activePattern"
        @select-pattern="handleSelectPattern"
      />

      <!-- 第二部分: GPS 案例分类检索 -->
      <GpsCaseSelector 
        :cases="casesList"
        :activeCaseId="activeCaseId"
        @select-case="handleSelectCase"
      />

      <!-- 第三部分: 单图优化证据链 -->
      <SingleCaseEvidenceChain 
        v-if="activeCaseId"
        :caseId="activeCaseId"
        :activePattern="activePattern"
        @select-node="handleSelectNode"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModelTrainingOverview from '../components/ModelTrainingOverview.vue'
import GpsCaseSelector from '../components/GpsCaseSelector.vue'
import SingleCaseEvidenceChain from '../components/SingleCaseEvidenceChain.vue'

const isLoading = ref(true)
const casesList = ref([])
const activeCaseId = ref(null)
const activePattern = ref(null)
const missingFilesManifest = ref([])

// 选定案例
const handleSelectCase = (caseId) => {
  activeCaseId.value = caseId
  // 切换案例时，重置 Pattern 联动高亮状态
  activePattern.value = null
}

// 选定高亮子图模式
const handleSelectPattern = (patternName) => {
  activePattern.value = patternName
}

// 反向联动：点击 Cytoscape 节点高亮包含该节点的 Pattern
const handleSelectNode = async (nodeLabel) => {
  if (!nodeLabel || !activeCaseId.value) return
  
  try {
    // 拉取当前案例的 waterfalls 列表，寻找包含该 label 的模式
    const res = await fetch(`/cases_data/cases/${activeCaseId.value}/waterfalls.json`)
    const data = await res.json()
    const waterfallList = data.tables?.before || []
    
    // 寻找 pattern_short 中包含该节点的模式特征
    const matched = waterfallList.find(p => 
      p.pattern_short.toLowerCase().includes(nodeLabel.toLowerCase())
    )
    
    if (matched) {
      activePattern.value = matched.feature_name
      // 自动平滑滚动到第一部分的 Patterns 排行榜，增强交互反馈
      const patEl = document.querySelector('.patterns-section')
      if (patEl) {
        patEl.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      activePattern.value = null
    }
  } catch (e) {
    console.error("Error reverse lookup node to pattern:", e)
  }
}

onMounted(async () => {
  try {
    const response = await fetch('/cases_data/catalog.json')
    const catalog = await response.json()
    casesList.value = catalog.cases || []
    missingFilesManifest.value = catalog.missing_files_manifest || []
    
    if (casesList.value.length > 0) {
      // 默认选择第一个案例进行初始化
      activeCaseId.value = casesList.value[0].case_id
    }
  } catch (e) {
    console.error("Error loading cases catalog:", e)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.generate-page {
  --bg-primary: #050811;
  --bg-card: rgba(15, 28, 48, 0.6);
  --crimson: #e8554e;
  --crimson-light: #c7453f;
  --crimson-dim: rgba(232, 85, 78, 0.15);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --border: rgba(232, 85, 78, 0.15);
  --border-active: rgba(232, 85, 78, 0.5);
  --font-display: 'Syncopate', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Outfit', sans-serif;

  min-height: 100vh;
  padding: 40px 32px;
  position: relative;
  overflow-x: hidden;
  font-family: var(--font-body);
  color: var(--text-primary);
  background: var(--bg-primary);
}

.bg-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(123, 97, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(123, 97, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.bg-glow {
  position: fixed;
  top: 10%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(123, 97, 255, 0.04) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.page-header {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 32px;
}

.header-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(123, 97, 255, 0.2), transparent);
  margin: 12px auto;
  max-width: 400px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 5px;
  color: var(--text-primary);
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 0 10px rgba(123, 97, 255, 0.2);
}

.page-subtitle {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: 1px;
  margin-top: 8px;
}

/* 缺失文件警示横幅 */
.missing-warning-banner {
  background: rgba(232, 85, 78, 0.08);
  border: 1px solid rgba(232, 85, 78, 0.3);
  border-radius: 8px;
  padding: 10px 16px;
  margin: 0 auto 24px auto;
  max-width: 1700px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
  position: relative;
}

.warning-title {
  font-size: 11.5px;
  font-weight: bold;
  color: #e8554e;
  white-space: nowrap;
}

.warning-scroll-box {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  width: 100%;
}

.warning-item {
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

/* 布局 */
.dashboard-main-layout {
  position: relative;
  z-index: 1;
  max-width: 1700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

/* 加载 */
.global-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 180px 20px;
  gap: 20px;
  z-index: 10;
  position: relative;
}

.loader-hex {
  width: 50px;
  height: 50px;
  border: 2px solid rgba(123, 97, 255, 0.1);
  border-top-color: #7b61ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 12px rgba(123, 97, 255, 0.3);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-lbl {
  font-family: var(--font-mono);
  font-size: 11px;
  color: #7b61ff;
  letter-spacing: 2px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>