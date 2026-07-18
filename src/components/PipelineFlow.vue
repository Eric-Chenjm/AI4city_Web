<template>
  <div class="pipeline-flow">
    <div class="pipeline-header">
      <span class="section-tag">{{ $t('method.methodology') }}</span>
      <h2 class="pipeline-title">TECHNICAL PIPELINE</h2>
      <span class="pipeline-subtitle">LLM Perception Scoring · 13,000 Streetscape Images → 6 Implicit Indicators</span>
    </div>

    <div class="pipeline-body">
      <!-- Step 1: Data Collection -->
      <div class="pipeline-step" :class="{ active: activeStep === 0 }" @mouseenter="activeStep = 0" @mouseleave="activeStep = -1">
        <div class="step-node">
          <div class="node-icon data-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <div class="node-pulse"></div>
        </div>
        <div class="step-content">
          <span class="step-index">01</span>
          <h3 class="step-title">DATA COLLECTION</h3>
          <p class="step-desc">13,000 streetscape images sampled across Shanghai central urban area</p>
          <div class="step-tags">
            <span class="tag">13K Images</span>
            <span class="tag">SVI Sampling</span>
            <span class="tag">Central Shanghai</span>
          </div>
        </div>
      </div>

      <div class="pipeline-connector">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none">
          <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(0,91,172,0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
          <polygon points="95,5 100,10 95,15" fill="rgba(0,91,172,0.6)" />
        </svg>
      </div>

      <!-- Step 2: ResNet18 Backbone -->
      <div class="pipeline-step" :class="{ active: activeStep === 1 }" @mouseenter="activeStep = 1" @mouseleave="activeStep = -1">
        <div class="step-node">
          <div class="node-icon backbone-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="6" width="18" height="12" rx="1" />
              <line x1="7" y1="6" x2="7" y2="18" />
              <line x1="12" y1="6" x2="12" y2="18" />
              <line x1="17" y1="6" x2="17" y2="18" />
              <circle cx="7" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="17" cy="14" r="1" fill="currentColor" />
            </svg>
          </div>
          <div class="node-pulse"></div>
        </div>
        <div class="step-content">
          <span class="step-index">02</span>
          <h3 class="step-title">LLM PERCEPTION ENGINE</h3>
          <p class="step-desc">Vision-language model for multi-dimensional streetscape perception scoring</p>
          <div class="step-tags">
            <span class="tag">Vision-Language</span>
            <span class="tag">Multi-modal</span>
            <span class="tag">6D Score Vector</span>
          </div>
        </div>
      </div>

      <div class="pipeline-connector">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none">
          <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(0,91,172,0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
          <polygon points="95,5 100,10 95,15" fill="rgba(0,91,172,0.6)" />
        </svg>
      </div>

      <!-- Step 3: Transfer Learning -->
      <div class="pipeline-step" :class="{ active: activeStep === 2 }" @mouseenter="activeStep = 2" @mouseleave="activeStep = -1">
        <div class="step-node">
          <div class="node-icon transfer-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17" opacity="0.4" />
              <path d="M12 3l3 4h-6l3-4zM12 21l-3-4h6l-3 4zM3 12l4-3v6l-4-3zM21 12l-4 3v-6l4 3z" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div class="node-pulse"></div>
        </div>
        <div class="step-content">
          <span class="step-index">03</span>
          <h3 class="step-title">MULTI-DIMENSIONAL SCORING</h3>
          <p class="step-desc">6 perception dimensions scored for each streetscape image</p>
          <div class="step-tags">
            <span class="tag accent">6 Dimensions</span>
            <span class="tag">LLM Scoring</span>
            <span class="tag">Quality Control</span>
          </div>
        </div>
      </div>

      <div class="pipeline-connector">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none">
          <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(0,91,172,0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
          <polygon points="95,5 100,10 95,15" fill="rgba(0,91,172,0.6)" />
        </svg>
      </div>

      <!-- Step 4: 6 Implicit Indicators -->
      <div class="pipeline-step" :class="{ active: activeStep === 3 }" @mouseenter="activeStep = 3" @mouseleave="activeStep = -1">
        <div class="step-node">
          <div class="node-icon indicator-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <rect x="14" y="14" width="6" height="6" rx="1" />
              <circle cx="7" cy="7" r="1.5" fill="currentColor" />
              <circle cx="17" cy="7" r="1.5" fill="currentColor" />
              <circle cx="7" cy="17" r="1.5" fill="currentColor" />
              <circle cx="17" cy="17" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div class="node-pulse"></div>
        </div>
        <div class="step-content">
          <span class="step-index">04</span>
          <h3 class="step-title">6 IMPLICIT INDICATORS</h3>
          <p class="step-desc">Predicted perception dimensions per image sample</p>
          <div class="step-tags">
            <span class="tag">Identity</span>
            <span class="tag">Innovation Atmos.</span>
            <span class="tag">+4 more</span>
          </div>
        </div>
      </div>

      <div class="pipeline-connector">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none">
          <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(0,91,172,0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
          <polygon points="95,5 100,10 95,15" fill="rgba(0,91,172,0.6)" />
        </svg>
      </div>

      <!-- Step 5: Spatial Interpolation -->
      <div class="pipeline-step" :class="{ active: activeStep === 4 }" @mouseenter="activeStep = 4" @mouseleave="activeStep = -1">
        <div class="step-node">
          <div class="node-icon spatial-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
            </svg>
          </div>
          <div class="node-pulse"></div>
        </div>
        <div class="step-content">
          <span class="step-index">05</span>
          <h3 class="step-title">SPATIAL VISUALIZATION</h3>
          <p class="step-desc">Interpolated to 500m grid and rendered on Shanghai central area map</p>
          <div class="step-tags">
            <span class="tag">500m Grid</span>
            <span class="tag">EPSG:4549</span>
            <span class="tag">Heat Map</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom stats bar -->
    <div class="pipeline-stats">
      <div class="stat-item">
        <span class="stat-value">13,000</span>
        <span class="stat-label">SAMPLE IMAGES</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">LLM</span>
        <span class="stat-label">MODEL ARCHITECTURE</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">6</span>
        <span class="stat-label">IMPLICIT INDICATORS</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">500m</span>
        <span class="stat-label">SPATIAL RESOLUTION</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activeStep = ref(-1)
</script>

<style scoped>
.pipeline-flow {
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.pipeline-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.section-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #005BAC;
  background: rgba(0, 91, 172, 0.1);
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 1px;
}

.pipeline-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin: 0;
}

.pipeline-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.5px;
}

.pipeline-body {
  display: flex;
  align-items: stretch;
  gap: 0;
  overflow-x: auto;
  padding-bottom: 4px;
}

.pipeline-step {
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
  cursor: default;
}

.pipeline-step.active {
  background: rgba(0, 91, 172, 0.05);
}

.step-node {
  position: relative;
  width: 56px;
  height: 56px;
  margin-bottom: 12px;
}

.node-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  background: rgba(20, 35, 58, 0.8);
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.pipeline-step.active .node-icon {
  border-color: #005BAC;
  color: #005BAC;
  background: rgba(0, 91, 172, 0.1);
  box-shadow: 0 0 20px rgba(0, 91, 172, 0.3);
}

.node-pulse {
  position: absolute;
  top: 0;
  left: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 91, 172, 0.4);
  opacity: 0;
  animation: pulse 2.5s ease-out infinite;
}

.pipeline-step.active .node-pulse {
  opacity: 1;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.5); opacity: 0; }
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-index {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 1px;
}

.step-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 1px;
  margin: 0;
  transition: color 0.3s ease;
}

.pipeline-step.active .step-title {
  color: #005BAC;
}

.step-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.5;
  margin: 4px 0 6px;
  max-width: 160px;
}

.step-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.3px;
}

.tag.frozen {
  color: rgba(84, 86, 90, 0.8);
  background: rgba(84, 86, 90, 0.08);
}

.tag.accent {
  color: #005BAC;
  background: rgba(0, 91, 172, 0.1);
}

.pipeline-connector {
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  align-self: center;
  margin-top: -40px;
  height: 56px;
}

.pipeline-connector svg {
  width: 100%;
  height: 20px;
}

.pipeline-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 24px;
}

.stat-value {
  font-family: 'Syncopate', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #005BAC;
  letter-spacing: 1px;
}

.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 1px;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.08);
}

@media (max-width: 1100px) {
  .pipeline-body {
    flex-direction: column;
    gap: 8px;
  }

  .pipeline-connector {
    flex: 0 0 24px;
    width: 20px;
    height: 24px;
    margin: -8px 0;
    transform: rotate(90deg);
  }

  .pipeline-step {
    flex-direction: row;
    text-align: left;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
  }

  .step-content {
    align-items: flex-start;
  }

  .step-desc {
    max-width: none;
  }

  .step-tags {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .pipeline-stats {
    flex-wrap: wrap;
    gap: 12px;
  }

  .stat-divider {
    display: none;
  }

  .stat-item {
    padding: 0 8px;
  }
}
</style>
