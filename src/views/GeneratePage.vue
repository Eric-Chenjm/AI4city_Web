<template>
  <div class="generate-page">
    <div class="bg-grid"></div>
    <div class="bg-glow"></div>

    <header class="page-header">
      <div class="header-line"></div>
      <h1 class="page-title">INNOVATION STRUCTURE ANALYZER</h1>
      <p class="page-subtitle">Upload original image and extracted structure diagram — analyze innovation metrics and visualize indicators</p>
      <div class="header-line"></div>
    </header>

    <div class="main-layout">
      <aside class="control-panel">
        <div class="panel-section">
          <div class="section-header">
            <span class="section-index">01</span>
            <h2 class="section-title">SOURCE INPUT</h2>
          </div>
          <UploadZone 
            :originalImage="originalImage"
            :structureImage="structureImage"
            @upload:original="handleOriginalUpload"
            @upload:structure="handleStructureUpload"
            @clear="clearAll"
          />
        </div>

        <div class="panel-section action-section">
          <button
            class="btn-analyze"
            :class="{ disabled: !originalImage || !structureImage || isAnalyzing }"
            :disabled="!originalImage || !structureImage || isAnalyzing"
            @click="analyze"
          >
            <span v-if="isAnalyzing" class="btn-loader"></span>
            <span v-else class="btn-text">{{ isAnalyzing ? 'ANALYZING' : 'START ANALYSIS' }}</span>
          </button>
          <button class="btn-reset" @click="clearAll">RESET ALL</button>
        </div>
      </aside>

      <main class="result-panel">
        <div v-if="!originalImage && !structureImage" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p class="empty-title">AWAITING INPUT</p>
          <p class="empty-desc">Upload original image and structure diagram to begin analysis</p>
        </div>

        <template v-else>
          <div class="comparison-section">
            <div class="section-header">
              <span class="section-index">A</span>
              <h2 class="section-title">VISUAL COMPARISON</h2>
            </div>
            <ImageComparison 
              :originalImage="originalImage" 
              :structureImage="structureImage"
              :isAnalyzing="isAnalyzing"
            />
          </div>

          <div class="metrics-section">
            <div class="section-header">
              <span class="section-index">B</span>
              <h2 class="section-title">EXTRACTED INDICATORS</h2>
            </div>
            <MetricsDisplay 
              :metrics="extractedMetrics"
              :isAnalyzing="isAnalyzing"
            />
          </div>

          <div class="chart-section">
            <div class="section-header">
              <span class="section-index">C</span>
              <h2 class="section-title">INDICATOR ANALYSIS</h2>
            </div>
            <ChartAnalysis 
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
import { ref, reactive } from 'vue'
import UploadZone from '../components/UploadZone.vue'
import ImageComparison from '../components/ImageComparison.vue'
import MetricsDisplay from '../components/MetricsDisplay.vue'
import ChartAnalysis from '../components/ChartAnalysis.vue'

const originalImage = ref(null)
const structureImage = ref(null)
const isAnalyzing = ref(false)

const extractedMetrics = reactive({
  buildingDensity: { label: 'Building Density', value: 0, unit: '%', color: '#005BAC', desc: 'Ratio of building area to total area' },
  greenCoverage: { label: 'Green Coverage', value: 0, unit: '%', color: '#4ade80', desc: 'Percentage of vegetation and green space' },
  openness: { label: 'Open Space Ratio', value: 0, unit: '%', color: '#60a5fa', desc: 'Proportion of accessible public space' },
  heightVariance: { label: 'Height Variance', value: 0, unit: 'm', color: '#a78bfa', desc: 'Standard deviation of building heights' },
  streetConnectivity: { label: 'Street Connectivity', value: 0, unit: 'index', color: '#fb923c', desc: 'Graph connectivity index of street network' },
  facadeDiversity: { label: 'Facade Diversity', value: 0, unit: '%', color: '#f472b6', desc: 'Visual diversity of building facades' }
})

const handleOriginalUpload = (imageData) => {
  originalImage.value = imageData
}

const handleStructureUpload = (imageData) => {
  structureImage.value = imageData
}

const clearAll = () => {
  originalImage.value = null
  structureImage.value = null
  Object.keys(extractedMetrics).forEach(key => {
    extractedMetrics[key].value = 0
  })
}

const analyze = async () => {
  if (!originalImage.value || !structureImage.value || isAnalyzing.value) return
  
  isAnalyzing.value = true

  await new Promise(resolve => setTimeout(resolve, 2000))

  extractedMetrics.buildingDensity.value = Math.round(35 + Math.random() * 30)
  extractedMetrics.greenCoverage.value = Math.round(15 + Math.random() * 25)
  extractedMetrics.openness.value = Math.round(20 + Math.random() * 25)
  extractedMetrics.heightVariance.value = Math.round(15 + Math.random() * 25)
  extractedMetrics.streetConnectivity.value = Math.round(60 + Math.random() * 30)
  extractedMetrics.facadeDiversity.value = Math.round(40 + Math.random() * 35)

  isAnalyzing.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@300;400;500;600;700&display=swap');

.generate-page {
  --bg-primary: #0a1628;
  --bg-card: rgba(15, 28, 48, 0.6);
  --bg-card-hover: rgba(20, 35, 58, 0.7);
  --gold: #005BAC;
  --gold-light: #004A8C;
  --gold-dim: rgba(0, 91, 172, 0.3);
  --crimson: #005BAC;
  --crimson-light: #004A8C;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.35);
  --border: rgba(0, 91, 172, 0.15);
  --border-active: rgba(0, 91, 172, 0.5);
  --font-display: 'Syncopate', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Outfit', sans-serif;

  min-height: 100vh;
  padding: 40px 32px;
  position: relative;
  overflow-x: hidden;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.bg-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 91, 172, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 91, 172, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.bg-glow {
  position: fixed;
  top: 20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 91, 172, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  animation: glowDrift 20s ease-in-out infinite;
}

@keyframes glowDrift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-50px, 30px); }
}

.page-header {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 48px;
  padding: 0 20px;
}

.header-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
  margin: 16px auto;
  max-width: 400px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 6px;
  color: var(--text-primary);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.page-subtitle {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: 1px;
  max-width: 600px;
  margin: 0 auto;
}

.main-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 35% 65%;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.control-panel,
.result-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  background: rgba(0, 91, 172, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-primary);
  margin: 0;
}

.action-section {
  margin-top: auto;
  flex-direction: column;
  gap: 12px;
}

.btn-analyze {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, var(--crimson), var(--crimson-light));
  border: none;
  border-radius: 8px;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-analyze:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 91, 172, 0.3);
}

.btn-analyze.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-reset {
  width: 100%;
  padding: 12px 24px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  border-color: rgba(0, 91, 172, 0.5);
  color: var(--crimson);
}

.result-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.2);
}

.empty-icon svg {
  width: 40px;
  height: 40px;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.empty-desc {
  font-family: var(--font-mono);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
}

.comparison-section,
.metrics-section,
.chart-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  .control-panel {
    order: 2;
  }
  .result-panel {
    order: 1;
  }
}

@media (max-width: 768px) {
  .generate-page {
    padding: 24px 16px;
  }
  .page-title {
    font-size: 24px;
    letter-spacing: 4px;
  }
}
</style>