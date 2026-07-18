<template>
  <div class="metrics-display">
    <div v-if="isAnalyzing" class="loading-state">
      <div class="loading-grid">
        <div v-for="i in 6" :key="i" class="metric-skeleton">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line value"></div>
          <div class="skeleton-line desc"></div>
        </div>
      </div>
    </div>
    
    <div v-else class="metrics-grid">
      <div 
        v-for="(item, index) in objectsDelta" 
        :key="index" 
        class="metric-card"
        :class="item.type"
      >
        <div class="metric-header">
          <span class="metric-indicator" :class="item.type"></span>
          <span class="metric-label">{{ item.name }}</span>
        </div>
        
        <div class="metric-value-row">
          <span class="metric-sign" :class="item.type">
            {{ item.type === 'add' ? '+' : '' }}
          </span>
          <span class="metric-value" :class="item.type">
            {{ Math.abs(item.value) }}
          </span>
          <span class="metric-unit">{{ item.unit || '个' }}</span>
        </div>

        <div class="metric-badge" :class="item.type">
          {{ item.type === 'add' ? '空间实体增加' : '空间实体压制/消减' }}
        </div>
        
        <p class="metric-desc">{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  objectsDelta: {
    type: Array,
    default: () => []
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
  padding: 10px;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-skeleton {
  background: rgba(15, 28, 48, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.skeleton-line.title {
  width: 60%;
  height: 12px;
}

.skeleton-line.value {
  width: 40%;
  height: 28px;
}

.skeleton-line.desc {
  width: 90%;
  height: 10px;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-card {
  background: rgba(15, 28, 48, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 18px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-card.add:hover {
  border-color: rgba(74, 222, 128, 0.4);
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.1);
  background: rgba(20, 38, 30, 0.5);
}

.metric-card.remove:hover {
  border-color: rgba(232, 85, 78, 0.4);
  box-shadow: 0 6px 20px rgba(232, 85, 78, 0.1);
  background: rgba(38, 20, 20, 0.5);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.metric-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.metric-indicator.add {
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
}

.metric-indicator.remove {
  background: #e8554e;
  box-shadow: 0 0 6px #e8554e;
}

.metric-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.metric-sign {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.metric-sign.add { color: #4ade80; }
.metric-sign.remove { color: #e8554e; }

.metric-value {
  font-family: 'Syncopate', sans-serif;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

.metric-value.add {
  color: #4ade80;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
}

.metric-value.remove {
  color: #e8554e;
  text-shadow: 0 0 10px rgba(232, 85, 78, 0.3);
}

.metric-unit {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  margin-left: 2px;
}

.metric-badge {
  display: inline-block;
  font-family: 'Outfit', sans-serif;
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-weight: 500;
}

.metric-badge.add {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.2);
}

.metric-badge.remove {
  background: rgba(232, 85, 78, 0.1);
  color: #e8554e;
  border: 1px solid rgba(232, 85, 78, 0.2);
}

.metric-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.45;
}

@media (max-width: 1024px) {
  .metrics-grid, .loading-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .metrics-grid, .loading-grid {
    grid-template-columns: 1fr;
  }
}
</style>
