<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div class="modal-body">
          <div class="modal-image-section">
            <img :src="sample.image" :alt="sample.location" class="modal-image" />
            <div class="modal-location">
              <span class="location-icon">📍</span>
              {{ sample.location }}
            </div>
          </div>
          <div class="modal-chart-section">
            <h3 class="chart-title">INNOVATION DIMENSIONS</h3>
            <div ref="radarChart" class="radar-container"></div>
            <div class="score-bars">
              <div v-for="(value, key) in sample.scores" :key="key" class="score-bar-item">
                <span class="score-label">{{ key }}</span>
                <div class="score-bar-track">
                  <div class="score-bar-fill" :style="{ width: value + '%' }"></div>
                </div>
                <span class="score-value">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  visible: { type: Boolean, default: false },
  sample: {
    type: Object,
    default: () => ({
      image: '',
      location: '',
      scores: { Creativity: 0, Interaction: 0, Integration: 0, Ecology: 0, Culture: 0, Future: 0 }
    })
  }
})

const emit = defineEmits(['close'])

const radarChart = ref(null)
let chartInstance = null

const close = () => {
  emit('close')
}

const initRadar = () => {
  if (!radarChart.value) return
  if (chartInstance) chartInstance.dispose()
  
  chartInstance = echarts.init(radarChart.value)
  
  const dimensions = Object.keys(props.sample.scores)
  const values = Object.values(props.sample.scores)
  
  const option = {
    backgroundColor: 'transparent',
    radar: {
      indicator: dimensions.map(name => ({ name, max: 100 })),
      center: ['50%', '50%'],
      radius: '65%',
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace'
      },
      splitLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      splitArea: {
        areaStyle: { color: ['rgba(232, 85, 78, 0.03)', 'rgba(232, 85, 78, 0.06)', 'rgba(232, 85, 78, 0.09)', 'rgba(232, 85, 78, 0.12)'] }
      },
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.2)' }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: 'Innovation Profile',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#e8554e',
          width: 2
        },
        areaStyle: {
          color: 'rgba(232, 85, 78, 0.3)'
        },
        itemStyle: {
          color: '#e8554e',
          borderColor: '#ffffff',
          borderWidth: 2
        }
      }]
    }]
  }
  
  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

watch(() => props.visible, (val) => {
  if (val) {
    nextTick(() => initRadar())
  }
})

watch(() => props.sample, () => {
  if (props.visible) {
    nextTick(() => initRadar())
  }
}, { deep: true })

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: rgba(10, 22, 40, 0.98);
  border: 1px solid rgba(232, 85, 78, 0.3);
  border-radius: 16px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(232, 85, 78, 0.2);
  border-color: rgba(232, 85, 78, 0.4);
  color: #e8554e;
}

.modal-close svg {
  width: 18px;
  height: 18px;
}

.modal-body {
  display: grid;
  grid-template-columns: 45% 55%;
  gap: 0;
}

.modal-image-section {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-location {
  position: relative;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #ffffff;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-icon {
  font-size: 14px;
}

.modal-chart-section {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin: 0;
}

.radar-container {
  width: 100%;
  height: 260px;
}

.score-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.score-bar-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  width: 80px;
  flex-shrink: 0;
}

.score-bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #e8554e, #ff9966);
  border-radius: 3px;
  transition: width 0.3s ease-out;
}

.score-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #e8554e;
  font-weight: 600;
  width: 30px;
  text-align: right;
}

@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
  }
  
  .modal-image-section {
    height: 250px;
  }
  
  .radar-container {
    height: 220px;
  }
}
</style>