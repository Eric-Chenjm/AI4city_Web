<template>
  <div class="generate-page">
    <!-- Section Nav -->
    <nav class="section-nav">
      <div class="nav-brand">
        <span class="brand-tag">{{ t('genNavBrand') }}</span>
      </div>
      <div class="nav-dots">
        <button
          v-for="(section, i) in sections"
          :key="i"
          class="nav-dot"
          :class="{ active: activeSection === i }"
          @click="scrollToSection(i)"
        >
          <span class="dot-marker"></span>
          <span class="dot-label">{{ section.label }}</span>
        </button>
      </div>
      <div class="nav-progress-bar">
        <div class="nav-progress-fill" :style="{ width: scrollProgress + '%' }"></div>
      </div>
    </nav>

    <div class="bg-grid"></div>
    <div class="bg-glow"></div>

    <header class="page-header" ref="sectionOverview">
      <div class="header-line"></div>
      <h1 class="page-title section-title">{{ t('sceneGeneratorTitle') }}</h1>
      <h1 class="page-title">{{ t('pageTitle') }}</h1>
      <p class="page-subtitle">{{ t('pageSubtitle') }}</p>
      <div class="header-line"></div>
    </header>

    <!-- 顶层全局提示与缺失文件警报 -->
    <div v-if="missingFilesManifest.length > 0" class="missing-warning-banner">
      <span class="warning-title">⚠️ {{ t('integrityAlert') }}</span>
      <div class="warning-scroll-box">
        <span v-for="(msg, i) in missingFilesManifest" :key="i" class="warning-item">
          {{ msg }}
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="global-loading">
      <div class="loader-hex"></div>
      <span class="loading-lbl">{{ t('initializingDocker') }}</span>
    </div>

    <div v-else class="dashboard-main-layout">
      <!-- 第一部分: 模型训练结果总览 -->
      <ModelTrainingOverview
        ref="sectionTraining"
        :activePattern="activePattern"
        @select-pattern="handleSelectPattern"
      />

      <!-- 第二部分: GPS 案例分类检索 -->
      <GpsCaseSelector
        ref="sectionGps"
        :cases="casesList"
        :activeCaseId="activeCaseId"
        @select-case="handleSelectCase"
      />

      <!-- 第三部分: 单图优化证据链 -->
      <SingleCaseEvidenceChain
        v-if="activeCaseId"
        ref="sectionEvidence"
        :caseId="activeCaseId"
        :activePattern="activePattern"
        @select-node="handleSelectNode"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ModelTrainingOverview from '../components/ModelTrainingOverview.vue'
import GpsCaseSelector from '../components/GpsCaseSelector.vue'
import SingleCaseEvidenceChain from '../components/SingleCaseEvidenceChain.vue'
import { useLang } from '../composables/useLang.js'

const { t } = useLang()

// ── Section Nav ──
const sectionOverview = ref(null)
const sectionTraining = ref(null)
const sectionGps = ref(null)
const sectionEvidence = ref(null)
const activeSection = ref(0)
const scrollProgress = ref(0)

const sections = computed(() => [
  { label: t('genNavOverview') },
  { label: t('genNavTraining') },
  { label: t('genNavGps') },
  { label: t('genNavEvidence') }
])

const scrollToSection = (index) => {
  const refs = [sectionOverview, sectionTraining, sectionGps, sectionEvidence]
  const target = refs[index]?.value
  if (!target) return
  const el = target.$el || target
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const handlePageScroll = () => {
  const scrollTop = window.scrollY
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0

  const sectionRefs = [sectionOverview, sectionTraining, sectionGps, sectionEvidence]
  for (let i = sectionRefs.length - 1; i >= 0; i--) {
    const target = sectionRefs[i].value
    const el = target?.$el || target
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect && rect.top <= 160) {
      activeSection.value = i
      break
    }
  }
}

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
  window.addEventListener('scroll', handlePageScroll)

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

onUnmounted(() => {
  window.removeEventListener('scroll', handlePageScroll)
})
</script>

<style scoped>
.generate-page {
  --bg-primary: #050811;
  --bg-card: rgba(15, 28, 48, 0.6);
  --crimson: #005BAC;
  --crimson-light: #004A8C;
  --crimson-dim: rgba(0, 91, 172, 0.15);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --border: rgba(0, 91, 172, 0.15);
  --border-active: rgba(0, 91, 172, 0.5);
  --font-display: 'Syncopate', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Outfit', sans-serif;

  min-height: 100vh;
  padding: 96px 32px 40px;
  position: relative;
  overflow-x: hidden;
  font-family: var(--font-body);
  color: var(--text-primary);
  background: var(--bg-primary);
}

/* Section Nav */
.section-nav {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  background: rgba(10, 22, 40, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.section-nav .nav-brand {
  display: flex;
  align-items: center;
}

.section-nav .brand-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--crimson);
  background: rgba(0, 91, 172, 0.1);
  border: 1px solid var(--crimson-dim);
  padding: 4px 12px;
  border-radius: 3px;
  letter-spacing: 2px;
}

.section-nav .nav-dots {
  display: flex;
  gap: 8px;
}

.section-nav .nav-dot {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.section-nav .nav-dot:hover {
  background: rgba(255, 255, 255, 0.05);
}

.section-nav .dot-marker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transition: all 0.3s ease;
}

.section-nav .nav-dot.active .dot-marker {
  background: var(--crimson);
  box-shadow: 0 0 10px var(--crimson-dim);
  transform: scale(1.3);
}

.section-nav .dot-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.section-nav .nav-dot.active .dot-label {
  color: var(--crimson);
}

.section-nav .nav-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
}

.section-nav .nav-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--crimson), var(--crimson-light));
  transition: width 0.3s ease;
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

.section-title {
  font-size: 32px;
  margin-bottom: 16px;
  letter-spacing: 3px;
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

/* Section Nav */
.section-nav {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  background: rgba(10, 22, 40, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 91, 172, 0.15);
}

.section-nav .nav-brand {
  display: flex;
  align-items: center;
}

.section-nav .brand-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: #005BAC;
  background: rgba(0, 91, 172, 0.1);
  border: 1px solid rgba(0, 91, 172, 0.3);
  padding: 4px 12px;
  border-radius: 3px;
  letter-spacing: 2px;
}

.section-nav .nav-dots {
  display: flex;
  gap: 8px;
}

.section-nav .nav-dot {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.section-nav .nav-dot:hover {
  background: rgba(255, 255, 255, 0.05);
}

.section-nav .dot-marker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transition: all 0.3s ease;
}

.section-nav .nav-dot.active .dot-marker {
  background: #005BAC;
  box-shadow: 0 0 10px rgba(0, 91, 172, 0.3);
  transform: scale(1.3);
}

.section-nav .dot-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.section-nav .nav-dot.active .dot-label {
  color: #005BAC;
}

.section-nav .nav-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
}

.section-nav .nav-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #005BAC, #004A8C);
  transition: width 0.3s ease;
}

/* 锚点防遮挡 */
.page-header,
.dashboard-main-layout > * {
  scroll-margin-top: 140px;
}
</style>