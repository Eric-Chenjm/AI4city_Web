<template>
  <div class="chart-analysis">
    <div v-if="isAnalyzing" class="chart-loading">
      <div class="loading-ring"></div>
      <p>Preparing charts...</p>
    </div>
    <div v-else class="chart-grid">
      <div class="chart-item">
        <div class="chart-header">
          <span class="chart-tag">BAR CHART</span>
          <span class="chart-title">Indicator Comparison</span>
        </div>
        <div ref="barChart" class="chart-container"></div>
      </div>
      <div class="chart-item">
        <div class="chart-header">
          <span class="chart-tag">PIE CHART</span>
          <span class="chart-title">Distribution</span>
        </div>
        <div ref="pieChart" class="chart-container"></div>
      </div>
      <div class="chart-item full-width">
        <div class="chart-header">
          <span class="chart-tag">RADAR</span>
          <span class="chart-title">Structure Profile</span>
        </div>
        <div ref="radarChart" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({})
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  }
})

const barChart = ref(null)
const pieChart = ref(null)
const radarChart = ref(null)

let chartBar = null
let chartPie = null
let chartRadar = null

const buildBarOption = () => {
  const keys = Object.keys(props.metrics)
  const labels = keys.map(k => props.metrics[k].label.split(' ')[0])
  const values = keys.map(k => props.metrics[k].value)
  const colors = keys.map(k => props.metrics[k].color)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10, 22, 40, 0.9)',
      borderColor: 'rgba(232, 85, 78, 0.3)',
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'JetBrains Mono' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisLabel: { 
        color: 'rgba(255, 255, 255, 0.5)', 
        fontSize: 10,
        fontFamily: 'JetBrains Mono'
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { 
        color: 'rgba(255, 255, 255, 0.4)', 
        fontSize: 10,
        fontFamily: 'JetBrains Mono'
      },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } }
    },
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({ value: v, itemStyle: { color: colors[i], borderRadius: [4, 4, 0, 0] } })),
      barWidth: '50%',
      emphasis: { itemStyle: { opacity: 0.8 } }
    }]
  }
}

const buildPieOption = () => {
  const keys = Object.keys(props.metrics)
  const data = keys.map(k => ({
    name: props.metrics[k].label.split(' ')[0],
    value: props.metrics[k].value,
    itemStyle: { color: props.metrics[k].color }
  }))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 22, 40, 0.9)',
      borderColor: 'rgba(232, 85, 78, 0.3)',
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'JetBrains Mono' },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#0a1628', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, color: '#fff', fontSize: 12, fontFamily: 'Syncopate' } },
      labelLine: { show: false },
      data: data
    }]
  }
}

const buildRadarOption = () => {
  const keys = Object.keys(props.metrics)
  const indicators = keys.map(k => ({
    name: props.metrics[k].label.split(' ')[0],
    max: props.metrics[k].unit === '%' ? 100 : 50
  }))
  const values = keys.map(k => props.metrics[k].value)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(10, 22, 40, 0.9)',
      borderColor: 'rgba(232, 85, 78, 0.3)',
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'JetBrains Mono' }
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      radius: '55%',
      center: ['50%', '55%'],
      splitNumber: 4,
      axisName: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        fontFamily: 'JetBrains Mono'
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)']
        }
      },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: 'Structure',
        lineStyle: { color: '#e8554e', width: 2 },
        areaStyle: { color: 'rgba(232, 85, 78, 0.25)' },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#e8554e', borderColor: '#0a1628', borderWidth: 2 }
      }]
    }]
  }
}

const initCharts = () => {
  if (props.isAnalyzing) return

  if (barChart.value) {
    if (chartBar) chartBar.dispose()
    chartBar = echarts.init(barChart.value)
    chartBar.setOption(buildBarOption())
  }
  if (pieChart.value) {
    if (chartPie) chartPie.dispose()
    chartPie = echarts.init(pieChart.value)
    chartPie.setOption(buildPieOption())
  }
  if (radarChart.value) {
    if (chartRadar) chartRadar.dispose()
    chartRadar = echarts.init(radarChart.value)
    chartRadar.setOption(buildRadarOption())
  }
}

const handleResize = () => {
  chartBar?.resize()
  chartPie?.resize()
  chartRadar?.resize()
}

watch(() => props.metrics, () => {
  nextTick(() => initCharts())
}, { deep: true })

watch(() => props.isAnalyzing, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  nextTick(() => initCharts())
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartBar?.dispose()
  chartPie?.dispose()
  chartRadar?.dispose()
})
</script>

<style scoped>
.chart-analysis {
  width: 100%;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
}

.chart-loading .loading-ring {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(232, 85, 78, 0.2);
  border-top-color: #e8554e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.chart-loading p {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-item {
  background: rgba(15, 28, 48, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 16px;
}

.chart-item.full-width {
  grid-column: span 2;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.chart-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 3px 8px;
  border-radius: 3px;
  color: #e8554e;
  background: rgba(232, 85, 78, 0.15);
}

.chart-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.chart-container {
  width: 100%;
  height: 180px;
}

.chart-item.full-width .chart-container {
  height: 200px;
}

@media (max-width: 768px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  .chart-item.full-width {
    grid-column: span 1;
  }
  .chart-container {
    height: 160px;
  }
}
</style>