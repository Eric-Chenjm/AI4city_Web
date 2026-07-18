<template>
  <div class="metrics-display">
    <div v-if="isAnalyzing" class="loading-state">
      <div class="loading-grid">
        <div v-for="i in 6" :key="i" class="metric-skeleton"></div>
      </div>
    </div>
    <div v-else class="metrics-grid">
      <div 
        v-for="(metric, key) in metrics" 
        :key="key" 
        class="metric-card"
      >
        <div class="metric-header">
          <span class="metric-dot" :style="{ background: metric.color }"></span>
          <span class="metric-label">{{ metric.label }}</span>
        </div>
        <div class="metric-value-row">
          <span class="metric-value" :style="{ color: metric.color }">
            {{ metric.value }}
          </span>
          <span class="metric-unit">{{ metric.unit }}</span>
        </div>
        <div class="metric-bar">
          <div 
            class="metric-bar-fill" 
            :style="{ 
              width: metric.unit === '%' ? `${metric.value}%` : `${(metric.value / 100) * 100}%`,
              background: metric.color 
            }"
          ></div>
        </div>
        <p class="metric-desc">{{ metric.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  metrics: {
    type: Object,
    default: () => ({})
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.metrics-display {
  width: 100%;
}

.loading-state {
  padding: 16px;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-skeleton {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-card {
  background: rgba(15, 28, 48, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s ease;
}

.metric-card:hover {
  border-color: rgba(0, 91, 172, 0.3);
  background: rgba(20, 35, 58, 0.6);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.metric-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.metric-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.metric-value {
  font-family: 'Syncopate', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
}

.metric-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.metric-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.metric-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s ease-out;
}

.metric-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .loading-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .loading-grid {
    grid-template-columns: 1fr;
  }
}
</style>
