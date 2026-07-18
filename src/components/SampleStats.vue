<template>
  <div class="sample-stats" :class="{ 'no-border': !bordered }">
    <div class="section-header" v-if="bordered">
      <div class="section-title-group">
        <span class="section-tag">REGION STATISTICS</span>
        <h2 class="section-title">QUADRANT ANALYSIS</h2>
      </div>
    </div>
    <div class="stats-body">
      <!-- Radar Chart -->
      <div class="radar-section">
        <div class="sub-label">EXPLICIT × IMPLICIT MEDIANS</div>
        <div ref="radarChart" class="radar-chart"></div>
      </div>

      <!-- Quadrant Stats -->
      <div class="quadrant-stats-section">
        <div class="sub-label">REGION BREAKDOWN</div>
        <div class="quadrant-stats-list">
          <div
            v-for="item in regionQuadrantStats"
            :key="item.code"
            class="quadrant-stat-card"
            :class="{ active: activeQuadrant === item.code }"
            @click="$emit('quadrant-click', item.code)"
          >
            <div class="qs-header">
              <div class="qs-color" :style="{ backgroundColor: item.color }"></div>
              <span class="qs-code">{{ item.code }}</span>
              <span class="qs-label">{{ item.label }}</span>
            </div>
            <div class="qs-metrics">
              <div class="qs-metric">
                <span class="qs-metric-label">GRID COUNT</span>
                <span class="qs-metric-value">{{ item.gridCount }}</span>
              </div>
              <div class="qs-metric">
                <span class="qs-metric-label">AREA (km²)</span>
                <span class="qs-metric-value">{{ item.area.toFixed(2) }}</span>
              </div>
              <div class="qs-metric">
                <span class="qs-metric-label">EXPLICIT MEDIAN</span>
                <span class="qs-metric-value">{{ item.explicitMedian.toFixed(4) }}</span>
              </div>
              <div class="qs-metric">
                <span class="qs-metric-label">IMPLICIT MEDIAN</span>
                <span class="qs-metric-value">{{ item.implicitMedian.toFixed(4) }}</span>
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
  regionData: { type: Object, default: null },
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

const regionQuadrantStats = computed(() => {
  const codes = ['HH', 'HL', 'LH', 'LL']
  if (!props.regionData || !props.regionData.features) {
    return codes.map(code => ({
      code,
      label: quadrantLabels[code],
      color: quadrantColors[code],
      gridCount: 0,
      area: 0,
      explicitMedian: 0,
      implicitMedian: 0,
      avgScores: scoreDimensions.reduce((acc, dim) => ({ ...acc, [dim]: 0 }), {})
    }))
  }
  return codes.map(code => {
    const feature = props.regionData.features.find(f => f.properties.quadrant_code === code)
    const qsamples = props.samples.filter(s => s.region === code)
    const avgScores = {}
    scoreDimensions.forEach(dim => {
      avgScores[dim] = calcAvg(qsamples, dim)
    })
    return {
      code,
      label: quadrantLabels[code],
      color: quadrantColors[code],
      gridCount: feature ? feature.properties.grid_count : 0,
      area: feature ? feature.properties.area_km2 : 0,
      explicitMedian: feature ? feature.properties.explicit_median : 0,
      implicitMedian: feature ? feature.properties.implicit_median : 0,
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

  const maxExplicit = Math.max(...regionQuadrantStats.value.map(q => q.explicitMedian), 0.1)
  const maxImplicit = Math.max(...regionQuadrantStats.value.map(q => q.implicitMedian), 0.1)

  const quadrantData = regionQuadrantStats.value.map(q => ({
    value: [q.explicitMedian, q.implicitMedian],
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
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'Outfit, sans-serif' },
      formatter: (params) => {
        const q = regionQuadrantStats.value.find(r => r.code === params.name)
        if (!q) return ''
        return `<strong>${q.label}</strong><br/>
          <span style="opacity:0.7">Grids: ${q.gridCount}</span><br/>
          <span style="opacity:0.7">Area: ${q.area.toFixed(2)} km²</span><br/>
          Explicit Median: ${q.explicitMedian.toFixed(4)}<br/>
          Implicit Median: ${q.implicitMedian.toFixed(4)}`
      }
    },
    legend: {
      bottom: 0,
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
      itemWidth: 12,
      itemHeight: 8,
      data: regionQuadrantStats.value.map(q => q.code)
    },
    radar: {
      indicator: [
        { name: 'EXPLICIT', max: maxExplicit * 1.1 },
        { name: 'IMPLICIT', max: maxImplicit * 1.1 }
      ],
      shape: 'polygon',
      center: ['50%', '48%'],
      radius: '62%',
      axisName: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
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
      symbolSize: 6
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

.qs-label {
  font-family: 'Outfit', sans-serif;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
}

.qs-metrics {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.qs-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qs-metric-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.5px;
}

.qs-metric-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
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
