<template>
  <div class="sample-stats" :class="{ 'no-border': !bordered }">
    <div class="section-header" v-if="bordered">
      <div class="section-title-group">
        <span class="section-tag">STATISTICS</span>
        <h2 class="section-title">SAMPLE STATISTICS</h2>
      </div>
    </div>
    <div class="stats-body">
      <!-- Radar Chart -->
      <div class="radar-section">
        <div class="sub-label">OVERALL SCORE DISTRIBUTION</div>
        <div ref="radarChart" class="radar-chart"></div>
      </div>

      <!-- Quadrant Stats -->
      <div class="quadrant-stats-section">
        <div class="sub-label">QUADRANT BREAKDOWN</div>
        <div class="quadrant-stats-list">
          <div
            v-for="item in quadrantStats"
            :key="item.code"
            class="quadrant-stat-card"
            :class="{ active: activeQuadrant === item.code }"
            @click="$emit('quadrant-click', item.code)"
          >
            <div class="qs-header">
              <div class="qs-color" :style="{ backgroundColor: item.color }"></div>
              <span class="qs-code">{{ item.code }}</span>
              <span class="qs-count">{{ item.count }} samples</span>
            </div>
            <div class="qs-scores">
              <div class="qs-score-item" v-for="dim in scoreDimensions" :key="dim">
                <span class="qs-score-label">{{ dim.slice(0, 4).toUpperCase() }}</span>
                <div class="qs-score-bar">
                  <div class="qs-score-fill" :style="{ width: item.avgScores[dim] + '%', backgroundColor: item.color }"></div>
                </div>
                <span class="qs-score-value">{{ item.avgScores[dim] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hint -->
      <div class="stats-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <span>Click a quadrant on the map to view sample images</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  samples: { type: Array, default: () => [] },
  activeQuadrant: { type: String, default: null },
  bordered: { type: Boolean, default: true }
})

const emit = defineEmits(['quadrant-click'])

const radarChart = ref(null)
let chartInstance = null

const scoreDimensions = ['Creativity', 'Interaction', 'Integration', 'Ecology', 'Culture', 'Future']

const quadrantColors = {
  HH: 'rgba(232, 85, 78, 0.8)',
  HL: 'rgba(232, 140, 100, 0.7)',
  LH: 'rgba(240, 190, 60, 0.8)',
  LL: 'rgba(100, 160, 200, 0.6)'
}

const quadrantLabels = {
  HH: 'High Explicit · High Implicit',
  HL: 'High Explicit · Low Implicit',
  LH: 'Low Explicit · High Implicit',
  LL: 'Low Explicit · Low Implicit'
}

const calcAvg = (samples, dim) => {
  if (!samples.length) return 0
  const sum = samples.reduce((acc, s) => acc + (s.scores[dim] || 0), 0)
  return Math.round(sum / samples.length)
}

const quadrantStats = computed(() => {
  const codes = ['HH', 'HL', 'LH', 'LL']
  return codes.map(code => {
    const qsamples = props.samples.filter(s => s.region === code)
    const avgScores = {}
    scoreDimensions.forEach(dim => {
      avgScores[dim] = calcAvg(qsamples, dim)
    })
    return {
      code,
      label: quadrantLabels[code],
      color: quadrantColors[code],
      count: qsamples.length,
      avgScores
    }
  })
})

const overallAvg = computed(() => {
  const result = {}
  scoreDimensions.forEach(dim => {
    result[dim] = calcAvg(props.samples, dim)
  })
  return result
})

const initRadar = () => {
  if (!radarChart.value) return
  chartInstance = echarts.init(radarChart.value)
  updateRadar()
}

const updateRadar = () => {
  if (!chartInstance) return

  const quadrantData = quadrantStats.value.map(q => ({
    value: scoreDimensions.map(d => q.avgScores[d]),
    name: q.code,
    lineStyle: { color: q.color, width: 1.5 },
    areaStyle: { color: q.color.replace(/[\d.]+\)$/, '0.15)') },
    itemStyle: { color: q.color }
  }))

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(232, 85, 78, 0.3)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'Outfit, sans-serif' }
    },
    legend: {
      bottom: 0,
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
      itemWidth: 12,
      itemHeight: 8,
      data: quadrantStats.value.map(q => q.code)
    },
    radar: {
      indicator: scoreDimensions.map(d => ({
        name: d.slice(0, 4).toUpperCase(),
        max: 100
      })),
      shape: 'polygon',
      center: ['50%', '48%'],
      radius: '62%',
      axisName: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 9,
        fontFamily: 'JetBrains Mono, monospace'
      },
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.08)' }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(255,255,255,0.01)', 'rgba(255,255,255,0.03)']
        }
      },
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.1)' }
      }
    },
    series: [{
      type: 'radar',
      data: quadrantData,
      symbol: 'circle',
      symbolSize: 4
    }]
  }

  chartInstance.setOption(option, true)
}

const handleResize = () => {
  if (chartInstance) chartInstance.resize()
}

watch(() => props.samples, () => {
  if (chartInstance) updateRadar()
}, { deep: true })

onMounted(() => {
  window.addEventListener('resize', handleResize)
  nextTick(() => initRadar())
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.sample-stats {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.stats-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

.radar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
}

.radar-chart {
  width: 100%;
  flex: 1;
  min-height: 180px;
}

.quadrant-stats-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.sub-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 2px;
}

.quadrant-stats-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.quadrant-stat-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.quadrant-stat-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}

.quadrant-stat-card.active {
  background: rgba(232, 85, 78, 0.06);
  border-color: rgba(232, 85, 78, 0.3);
}

.qs-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.qs-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.qs-code {
  font-family: 'Syncopate', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
}

.qs-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
}

.qs-scores {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.qs-score-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.qs-score-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.4);
  width: 32px;
  flex-shrink: 0;
}

.qs-score-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.qs-score-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;
}

.qs-score-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.6);
  width: 24px;
  text-align: right;
  flex-shrink: 0;
}

.stats-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(232, 85, 78, 0.04);
  border: 1px solid rgba(232, 85, 78, 0.12);
  border-radius: 6px;
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.stats-hint svg {
  width: 14px;
  height: 14px;
  color: rgba(232, 85, 78, 0.5);
  flex-shrink: 0;
}

.no-border {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  backdrop-filter: none;
}

@media (max-width: 768px) {
  .quadrant-stats-list {
    grid-template-columns: 1fr;
  }
}
</style>
