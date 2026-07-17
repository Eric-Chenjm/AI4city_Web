<template>
  <div class="stat-list">
    <div class="panel-header">
      <span class="section-tag">STATISTICS</span>
      <h3 class="panel-title">INDICATOR ANALYSIS</h3>
    </div>
    
    <div v-if="currentIndicator" class="indicator-header">
      <div class="indicator-icon" :class="currentIndicator.type">
        {{ currentIndicator.type === 'explicit' ? '◈' : '◉' }}
      </div>
      <div class="indicator-info">
        <h4 class="indicator-name">{{ currentIndicator.name }}</h4>
        <span class="indicator-desc">{{ currentIndicator.desc }}</span>
      </div>
    </div>

    <div class="stats-content">
      <div
        v-for="(stat, i) in statistics"
        :key="stat.label"
        class="stat-item"
        :style="{ animationDelay: (i * 0.1) + 's' }"
      >
        <div class="stat-header">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-icon" v-html="stat.icon"></span>
        </div>
        <div class="stat-value-group">
          <span class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</span>
          <span v-if="stat.unit" class="stat-unit">{{ stat.unit }}</span>
        </div>
        <span v-if="stat.desc" class="stat-desc">{{ stat.desc }}</span>
        <div class="stat-bar">
          <div 
            class="stat-bar-fill" 
            :style="{ width: getBarWidth(stat) + '%', background: stat.color }"
          ></div>
        </div>
      </div>
    </div>

    <div class="stats-summary">
      <div class="summary-row">
        <span class="summary-label">DATA POINTS</span>
        <span class="summary-value">900+ grids</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">STUDY AREA</span>
        <span class="summary-value">Central Shanghai</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">RESOLUTION</span>
        <span class="summary-value">500m × 500m</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  statistics: {
    type: Array,
    default: () => []
  },
  currentIndicator: {
    type: Object,
    default: null
  }
})

const getBarWidth = (stat) => {
  const val = parseFloat(stat.value)
  if (isNaN(val)) return 0
  if (stat.label.includes('MEAN')) return Math.min(100, val * 10)
  if (stat.label.includes('STD')) return Math.min(100, val * 20)
  return Math.min(100, val)
}
</script>

<style scoped>
.stat-list {
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.section-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #e8554e;
  background: rgba(232, 85, 78, 0.1);
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 1px;
}

.panel-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin: 0;
}

.indicator-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.indicator-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 18px;
}

.indicator-icon.explicit {
  background: rgba(232, 85, 78, 0.15);
  color: #e8554e;
}

.indicator-icon.implicit {
  background: rgba(74, 158, 218, 0.15);
  color: #4a9eda;
}

.indicator-info {
  flex: 1;
}

.indicator-name {
  font-family: 'Syncopate', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 1px;
}

.indicator-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 12px;
  animation: fadeInUp 0.3s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.4);
}

.stat-value-group {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.stat-value {
  font-family: 'Syncopate', sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
}

.stat-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.stat-desc {
  display: block;
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
}

.stat-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease-out;
  opacity: 0.6;
}

.stats-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

.summary-value {
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}
</style>