<template>
  <div class="generate-page">
    <div class="bg-grid"></div>
    <div class="bg-glow"></div>

    <header class="page-header">
      <div class="header-line"></div>
      <h1 class="page-title">AIGC Urban Design Analyzer</h1>
      <p class="page-subtitle">三场景 EGTR 与 OvSGTR 空间性能推演与 AIGC 优化闭环展示平台</p>
      <div class="header-line"></div>
    </header>

    <div class="main-layout">
      <!-- 左侧控制面板 (Control Panel) -->
      <aside class="control-panel">
        <!-- 1. 模式选择与预设场景 -->
        <div class="panel-section">
          <div class="section-header">
            <span class="section-index">01</span>
            <h2 class="section-title">PRESET EXPERIMENT SCENARIOS</h2>
          </div>
          
          <div class="scenario-selector">
            <button 
              v-for="scenario in experimentScenarios" 
              :key="scenario.id"
              class="btn-scenario" 
              :class="{ active: activeScenarioId === scenario.id }"
              @click="selectPresetScenario(scenario.id)"
            >
              <div class="scenario-btn-title">{{ scenario.name }}</div>
              <div class="scenario-btn-meta">人工评级: {{ scenario.manualGrade }} 级</div>
            </button>
          </div>
        </div>

        <!-- 2. 算法模型切换 -->
        <div class="panel-section">
          <div class="section-header">
            <span class="section-index">02</span>
            <h2 class="section-title">INFERENCE ALGORITHM</h2>
          </div>
          <div class="model-tabs">
            <button 
              class="tab-btn" 
              :class="{ active: activeModelName === 'EGTR' }"
              @click="activeModelName = 'EGTR'"
            >
              EGTR 模型
              <span class="tab-sub">场景拓扑交互</span>
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeModelName === 'OvSGTR' }"
              @click="activeModelName = 'OvSGTR'"
            >
              OvSGTR 模型
              <span class="tab-sub">开放语义拓扑</span>
            </button>
          </div>
          <div class="model-description">
            <p v-if="activeModelName === 'EGTR'">
              <strong>EGTR (Explicit Graph Topology Recovery)</strong>：侧重于明确提取街景中的物理结构边界、人行道连续性及宏观三元环路网模式，对硬质铺装及人车冲突敏感。
            </p>
            <p v-else>
              <strong>OvSGTR (Open-vocabulary Scene Graph Topology Recovery)</strong>：利用开放词汇语义进行细粒度物体提取（如座椅、遮阳伞、动物），对微观街道家具及慢行社交品质评估更为敏感。
            </p>
          </div>
        </div>

        <!-- 3. 当前场景描述 -->
        <div class="panel-section current-info-panel">
          <div class="section-header">
            <span class="section-index">03</span>
            <h2 class="section-title">SCENARIO DIAGNOSIS</h2>
          </div>
          <div class="info-content">
            <div class="info-item">
              <span class="info-label">街区品质诊断:</span>
              <p class="info-text">{{ currentScenario.desc }}</p>
            </div>
            <div class="info-item" v-if="currentModelData">
              <span class="info-label">优化成果评估:</span>
              <p class="info-text" :class="currentModelData.status">
                {{ currentModelData.status === 'success' ? '✔ AI 局部设计优化成功' : '⚠ 局部优化分歧或未成功' }}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧结果展示中心 (Result Panel) -->
      <main class="result-panel">
        <!-- 核心加载中 -->
        <div v-if="isAnalyzing" class="tech-analyzing-card">
          <div class="hex-loader">
            <div class="loading-ring"></div>
          </div>
          <h3 class="loader-title">RUNNING SPATIAL GRAPH INFERENCE...</h3>
          <div class="loader-steps">
            <div class="loader-step active">1. 提取图像空间拓扑 Scene Graph (EGTR/OvSGTR)</div>
            <div class="loader-step active">2. gSpan 匹配并提取空间子图频繁模式</div>
            <div class="loader-step">3. 运行 XGBoost + SHAP 局部解释性计算</div>
            <div class="loader-step">4. 融合 Delta SHAP 权重对比出图</div>
          </div>
        </div>

        <!-- 结果展示区 -->
        <template v-else>
          <!-- 评分概览大盘 (Score Overview Dashboard) -->
          <div class="score-dashboard-card" v-if="currentModelData">
            <div class="score-meta">
              <span class="score-model-tag">{{ activeModelName }} EVALUATIVE SCORE</span>
              <span class="score-scen-tag">{{ currentScenario.name }}</span>
            </div>
            <div class="score-flex">
              <div class="score-block before">
                <div class="score-num-label">原图得分 (Before)</div>
                <div class="score-num-val">{{ scoreComparison.beforeScore.toFixed(2) }}</div>
              </div>
              <div class="score-trend-arrow" :class="{ down: scoreComparison.afterScore < scoreComparison.beforeScore }">
                {{ scoreComparison.afterScore >= scoreComparison.beforeScore ? '→' : '→' }}
              </div>
              <div class="score-block after">
                <div class="score-num-label">AI 优化图 (After)</div>
                <div class="score-num-val" :class="{ down: scoreComparison.afterScore < scoreComparison.beforeScore }">
                  {{ scoreComparison.afterScore.toFixed(2) }}
                </div>
              </div>
              <div class="score-diff-block" :class="{ down: scoreComparison.afterScore < scoreComparison.beforeScore }">
                <div class="diff-title">得分变化 (Delta)</div>
                <div class="diff-val">
                  {{ scoreComparison.afterScore >= scoreComparison.beforeScore ? '+' : '' }}{{ (scoreComparison.afterScore - scoreComparison.beforeScore).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>

          <!-- A. 场景拓扑图与图片比对 -->
          <div class="dashboard-row border-card">
            <div class="row-header">
              <span class="row-index">A</span>
              <h2 class="row-title">Scene Graph Topology Overlay Comparison (空间图拓扑对比)</h2>
            </div>
            <ImageComparison 
              :originalImage="imagePaths.before" 
              :structureImage="imagePaths.after"
              :isAnalyzing="isAnalyzing"
              :sceneGraph="sceneGraph"
            />
          </div>

          <!-- Grid 双列排版列 (B 与 C 并排) -->
          <div class="dashboard-grid-row">
            <!-- B. AIGC 提示词看板 -->
            <div class="dashboard-row border-card prompt-card-row" v-if="currentScenario.prompts">
              <div class="row-header">
                <span class="row-index">B</span>
                <h2 class="row-title">AIGC Local Design Update Prompts (局部设计优化提示词看板)</h2>
              </div>
              <div class="prompt-grid">
                <div class="prompt-item positive-box">
                  <div class="prompt-item-header">
                    <span class="dot green"></span>
                    正向优化目标提示词 (Positive AIGC Prompt)
                    <button class="btn-copy" @click="copyText(currentScenario.prompts.positive)">复制提示词</button>
                  </div>
                  <div class="prompt-text-content">
                    {{ currentScenario.prompts.positive }}
                  </div>
                </div>
                <div class="prompt-sub-grid">
                  <div class="prompt-item negative-box">
                    <div class="prompt-item-header">
                      <span class="dot red"></span>
                      负向限制提示词 (Negative Prompt)
                    </div>
                    <div class="prompt-text-content">
                      {{ currentScenario.prompts.negative }}
                    </div>
                  </div>
                  <div class="prompt-item retain-box">
                    <div class="prompt-item-header">
                      <span class="dot yellow"></span>
                      强制保留实体 (Retained Elements)
                    </div>
                    <div class="prompt-text-content monospace">
                      {{ currentScenario.prompts.retain }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="prompt-footer-source">
                <span>提示词来源配置文件: <code>{{ currentScenario.prompts.source }}</code></span>
              </div>
            </div>

            <!-- C. 空间实体增减分析 -->
            <div class="dashboard-row border-card">
              <div class="row-header">
                <span class="row-index">C</span>
                <h2 class="row-title">Extracted Object Delta Analytics (空间实体增减变化看板)</h2>
              </div>
              <MetricsDisplay 
                :objectsDelta="objectsDelta"
                :isAnalyzing="isAnalyzing"
              />
            </div>
          </div>

          <!-- D. ECharts 统计分析 -->
          <div class="dashboard-row border-card">
            <div class="row-header">
              <span class="row-index">D</span>
              <h2 class="row-title">SHAP Explanations & Quality Matrix (模式贡献度可解释性大盘)</h2>
            </div>
            <ChartAnalysis 
              :shapData="shapData"
              :scoreData="scoreComparison"
              :modelName="activeModelName"
              :metrics="extractedMetrics"
              :isAnalyzing="isAnalyzing"
            />
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { experimentScenarios } from '../data/experimentData'
import ImageComparison from '../components/ImageComparison.vue'
import MetricsDisplay from '../components/MetricsDisplay.vue'
import ChartAnalysis from '../components/ChartAnalysis.vue'

// 预设实验场景状态
const activeScenarioId = ref('scenario_06')
const activeModelName = ref('EGTR')
const isAnalyzing = ref(false)

// 计算当前激活的场景
const currentScenario = computed(() => {
  return experimentScenarios.find(s => s.id === activeScenarioId.value) || experimentScenarios[0]
})

// 计算当前激活的模型数据
const currentModelData = computed(() => {
  if (!currentScenario.value) return null
  return currentScenario.value.models[activeModelName.value]
})

// 分数对比
const scoreComparison = computed(() => {
  if (!currentModelData.value) return { beforeScore: 0, afterScore: 0 }
  return {
    beforeScore: currentModelData.value.beforeScore,
    afterScore: currentModelData.value.afterScore
  }
})

// 实体增减 Delta
const objectsDelta = computed(() => {
  return currentScenario.value ? currentScenario.value.objectsDelta : []
})

// SHAP 数据
const shapData = computed(() => {
  return currentModelData.value ? currentModelData.value.shapData : []
})

// 场景图拓扑
const sceneGraph = computed(() => {
  return currentModelData.value ? currentModelData.value.sceneGraph : null
})

// 图片映射 (预设场景下使用优雅的相对路径)
const imagePaths = computed(() => {
  return {
    before: `/images/${activeScenarioId.value}_before.jpg`,
    after: `/images/${activeScenarioId.value}_after.jpg`
  }
})

// 用于雷达图对比的多维空值占位（与老组件的结构兼容，老指标在雷达图背景展示）
const extractedMetrics = computed(() => {
  const deltaSum = objectsDelta.value.reduce((acc, cur) => acc + Math.abs(cur.value), 0)
  return {
    buildingDensity: { label: 'Building Density', value: Math.min(80, 35 + deltaSum * 2), color: '#e8554e' },
    greenCoverage: { label: 'Green Coverage', value: Math.min(85, 20 + deltaSum * 3), color: '#4ade80' },
    openness: { label: 'Open Space', value: Math.min(90, 45 + deltaSum * 1.5), color: '#60a5fa' },
    heightVariance: { label: 'Height Variance', value: Math.min(60, 15 + deltaSum * 1.2), color: '#a78bfa' },
    streetConnectivity: { label: 'Connectivity', value: Math.min(95, 55 + deltaSum * 2.2), color: '#fb923c' },
    facadeDiversity: { label: 'Facade Diversity', value: Math.min(85, 40 + deltaSum * 1.8), color: '#f472b6' }
  }
})

// 场景选择
const selectPresetScenario = (id) => {
  activeScenarioId.value = id
}

// 复制文本工具
const copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('提示词已复制到剪贴板！')
  }).catch(() => {
    alert('复制失败，请手动选择复制。')
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@300;400;500;600;700&display=swap');

.generate-page {
  --bg-primary: #0a1628;
  --bg-card: rgba(15, 28, 48, 0.6);
  --bg-card-hover: rgba(20, 35, 58, 0.7);
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
    linear-gradient(rgba(232, 85, 78, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232, 85, 78, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.bg-glow {
  position: fixed;
  top: 15%;
  right: -5%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(232, 85, 78, 0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.page-header {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 40px;
}

.header-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--crimson-dim), transparent);
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
  text-shadow: 0 0 10px rgba(232, 85, 78, 0.2);
}

.page-subtitle {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: 1px;
  margin-top: 8px;
}

.main-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 32% 68%;
  gap: 24px;
  max-width: 1700px;
  margin: 0 auto;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  height: fit-content;
}

.result-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-grid-row {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
}

@media (max-width: 1200px) {
  .dashboard-grid-row {
    grid-template-columns: 1fr;
  }
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s;
}

.disabled-section {
  opacity: 0.35;
  pointer-events: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.section-index {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--crimson);
  background: rgba(232, 85, 78, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--text-primary);
  margin: 0;
}

.section-tip {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.4;
  margin: 0;
}

/* 预设场景切换列表 */
.scenario-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-scenario {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-scenario:hover {
  background: rgba(232, 85, 78, 0.06);
  border-color: rgba(232, 85, 78, 0.25);
}

.btn-scenario.active {
  background: rgba(232, 85, 78, 0.12);
  border-color: var(--crimson);
  box-shadow: inset 0 0 10px rgba(232, 85, 78, 0.15);
}

.scenario-btn-title {
  font-family: var(--font-body);
  font-size: 12.5px;
  font-weight: 600;
  margin-bottom: 4px;
}

.scenario-btn-meta {
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.btn-scenario.active .scenario-btn-meta {
  color: rgba(255, 255, 255, 0.7);
}

.mode-switch-row {
  margin-top: 6px;
}

.btn-mode-switch {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-mode-switch:hover, .btn-mode-switch.active {
  border-color: var(--crimson);
  color: var(--crimson);
  background: rgba(232, 85, 78, 0.04);
}

/* 算法模型选择 */
.model-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px;
  border-radius: 8px;
}

.tab-btn {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 8px 4px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  background: rgba(232, 85, 78, 0.18);
  color: var(--crimson);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.tab-sub {
  font-size: 8px;
  font-family: var(--font-mono);
  font-weight: normal;
  opacity: 0.7;
  margin-top: 2px;
}

.model-description {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 12px;
}

.model-description p {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
  margin: 0;
}

/* 诊断大盘 */
.current-info-panel .info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 12px;
}

.info-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--crimson);
  letter-spacing: 1px;
  display: block;
  margin-bottom: 6px;
  font-weight: 700;
}

.info-text {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.45;
  margin: 0;
}

.info-text.success {
  color: #4ade80;
  font-weight: 600;
}

.info-text.fail {
  color: #fb923c;
  font-weight: 600;
}

/* 得分大盘卡片 */
.score-dashboard-card {
  background: linear-gradient(135deg, rgba(232, 85, 78, 0.12) 0%, rgba(15, 28, 48, 0.8) 100%);
  border: 1px solid var(--border-active);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
}

.score-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
}

.score-model-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--crimson);
  letter-spacing: 2px;
  font-weight: 700;
}

.score-scen-tag {
  font-family: var(--font-body);
  font-size: 11px;
  color: rgba(255,255,255,0.4);
}

.score-flex {
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
}

.score-block {
  flex: 1;
}

.score-num-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 6px;
  text-transform: uppercase;
}

.score-num-val {
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
}

.score-block.after .score-num-val {
  color: #4ade80;
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.4);
}

.score-block.after .score-num-val.down {
  color: #e8554e;
  text-shadow: 0 0 15px rgba(232, 85, 78, 0.4);
}

.score-trend-arrow {
  font-size: 32px;
  color: #4ade80;
  font-weight: bold;
}

.score-trend-arrow.down {
  color: #e8554e;
}

.score-diff-block {
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 8px;
  padding: 10px 18px;
  min-width: 110px;
}

.score-diff-block.down {
  background: rgba(232, 85, 78, 0.1);
  border-color: rgba(232, 85, 78, 0.2);
}

.diff-title {
  font-family: var(--font-mono);
  font-size: 9px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 4px;
  text-transform: uppercase;
}

.diff-val {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: #4ade80;
}

.score-diff-block.down .diff-val {
  color: #e8554e;
}

/* 城市设计提示词看板 */
.prompt-card-row {
  padding: 24px;
}

.prompt-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.prompt-sub-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prompt-item {
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.prompt-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 12px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.04);
  padding-bottom: 8px;
}

.prompt-item-header .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.prompt-item-header .dot.green { background: #4ade80; }
.prompt-item-header .dot.red { background: #e8554e; }
.prompt-item-header .dot.yellow { background: #fb923c; }

.btn-copy {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 8px;
  font-family: var(--font-body);
  padding: 2px 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: var(--crimson-dim);
  color: var(--crimson);
  border-color: var(--crimson);
}

.prompt-text-content {
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
  word-break: break-all;
}

.prompt-text-content.monospace {
  font-family: var(--font-mono);
  color: #f472b6;
}

.prompt-footer-source {
  margin-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.03);
  padding-top: 10px;
  font-family: var(--font-mono);
  font-size: 8px;
  color: rgba(255, 255, 255, 0.35);
}

/* 模块边框卡片 */
.border-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.row-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 12px;
}

.row-index {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--crimson);
  background: rgba(232, 85, 78, 0.1);
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.row-title {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--text-primary);
  margin: 0;
}

/* 空状态与推理加载 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 100px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
}

.empty-icon {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.2);
}

.empty-icon svg {
  width: 32px;
  height: 32px;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
}

.empty-desc {
  font-family: var(--font-body);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
}

/* 自定义运行模拟大板 */
.btn-analyze {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--crimson), var(--crimson-light));
  border: none;
  border-radius: 8px;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-analyze:hover:not(.disabled) {
  box-shadow: 0 0 15px rgba(232, 85, 78, 0.35);
  transform: translateY(-1px);
}

.btn-analyze.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-loader {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.tech-analyzing-card {
  background: var(--bg-card);
  border: 1px solid var(--border-active);
  border-radius: 16px;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.hex-loader {
  margin-bottom: 24px;
}

.loader-title {
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--crimson);
  margin-bottom: 24px;
  text-shadow: 0 0 8px rgba(232, 85, 78, 0.3);
}

.loader-steps {
  width: 80%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loader-step {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.35);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  border-left: 2px solid transparent;
  transition: all 0.3s;
}

.loader-step.active {
  color: #fff;
  border-left-color: var(--crimson);
  background: rgba(232, 85, 78, 0.05);
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
}
</style>