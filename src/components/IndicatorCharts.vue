<template>
  <div class="indicator-charts" :class="{ 'no-border': !bordered }">
    <div class="charts-header" v-if="bordered">
      <span class="section-tag">CHARTS</span>
      <h2 class="charts-title">INDICATOR DISTRIBUTION ANALYSIS</h2>
      <span class="indicator-badge">{{ currentIndicator?.name?.toUpperCase() || 'NO INDICATOR' }}</span>
    </div>

    <div class="charts-grid" :class="{ 'single-col': !bordered }">
      <!-- Histogram -->
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-tag">HISTOGRAM</span>
          <span class="chart-subtitle">Value distribution across grid cells</span>
        </div>
        <div ref="histChart" class="chart-canvas"></div>
      </div>

      <!-- Trend line (sorted by value) -->
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-tag">TREND</span>
          <span class="chart-subtitle">Sorted values (high → low)</span>
        </div>
        <div ref="trendChart" class="chart-canvas"></div>
      </div>

      <!-- Bar chart by quartile -->
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-tag">QUARTILE</span>
          <span class="chart-subtitle">Grid count per quartile</span>
        </div>
        <div ref="barChart" class="chart-canvas"></div>
      </div>

      <!-- Donut: share by value range -->
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-tag">SHARE</span>
          <span class="chart-subtitle">Grid share per value range</span>
        </div>
        <div ref="pieChart" class="chart-canvas"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  indicatorDataCache: { type: Object, default: () => ({}) },
  activeIndicator: { type: String, default: 'x1_bldg_density' },
  currentIndicator: { type: Object, default: null },
  explicitIndicators: { type: Array, default: () => [] },
  implicitIndicators: { type: Array, default: () => [] },
  bordered: { type: Boolean, default: true }
})

const histChart = ref(null)
const trendChart = ref(null)
const barChart = ref(null)
const pieChart = ref(null)

let histInstance = null
let trendInstance = null
let barInstance = null
let pieInstance = null

const getValues = () => {
  const cached = props.indicatorDataCache[props.activeIndicator]
  if (!cached || !cached.polygons) return []
  return cached.polygons.map(p => p.value).filter(v => !isNaN(v) && isFinite(v))
}

const isExplicit = computed(() => {
  return props.currentIndicator?.type === 'explicit'
})

// 显性指标：暖色系（浅绿 -> 深绿）
// 隐性指标：蓝色系（浅蓝 -> 深蓝）
const explicitPalette = ['#F7FEF0', '#E9F7E5', '#CEEFCC', '#BFE8C1', '#BCF4C5', '#92C2A6', '#519D78', '#8BCF8B']
const implicitPalette = ['#E8F4FD', '#B8DFF7', '#88CAF1', '#58B5EB', '#3AA0E0', '#2A8AC9', '#1E74B2', '#155E9B']

const colorGradient = computed(() => {
  const palette = isExplicit.value ? explicitPalette : implicitPalette
  return [palette[1], palette[4], palette[6]]
})

const piePalette = computed(() => {
  const palette = isExplicit.value ? explicitPalette : implicitPalette
  return [palette[2], palette[4], palette[5], palette[6]]
})

const buildHistogramOption = (values) => {
  if (values.length === 0) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const binCount = Math.min(20, Math.max(5, Math.ceil(Math.sqrt(values.length))))
  const binSize = (max - min) / binCount || 1
  const bins = Array(binCount).fill(0)
  const binLabels = []
  values.forEach(v => {
    let idx = Math.floor((v - min) / binSize)
    if (idx >= binCount) idx = binCount - 1
    bins[idx]++
  })
  for (let i = 0; i < binCount; i++) {
    const lo = min + i * binSize
    binLabels.push(`${lo.toFixed(2)}`)
  }
  const palette = piePalette.value
  return {
    backgroundColor: 'transparent',
    grid: { left: 40, right: 16, top: 24, bottom: 40 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(255,255,255,0.15)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'Outfit, sans-serif' },
      formatter: (params) => {
        const p = params[0]
        const lo = parseFloat(p.axisValue)
        const hi = lo + binSize
        return `<strong>${p.marker} ${p.seriesName}</strong><br/>Range: ${lo.toFixed(3)} – ${hi.toFixed(3)}<br/>Count: ${p.value}`
      }
    },
    xAxis: {
      type: 'category',
      data: binLabels,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace', rotate: 30 },
      name: 'Value',
      nameTextStyle: { color: 'rgba(255,255,255,0.4)', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [{
      name: 'Grids',
      type: 'bar',
      data: bins.map((v, i) => ({
        value: v,
        itemStyle: {
          color: palette[Math.min(Math.floor(i / binCount * palette.length), palette.length - 1)],
          borderRadius: [3, 3, 0, 0]
        }
      })),
      barWidth: '90%'
    }]
  }
}

const buildTrendOption = (values) => {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => b - a)
  const step = Math.max(1, Math.floor(sorted.length / 50))
  const sampled = []
  for (let i = 0; i < sorted.length; i += step) sampled.push(sorted[i])
  if (sampled[sampled.length - 1] !== sorted[sorted.length - 1]) sampled.push(sorted[sorted.length - 1])
  const palette = piePalette.value
  return {
    backgroundColor: 'transparent',
    grid: { left: 40, right: 16, top: 24, bottom: 40 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(255,255,255,0.15)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'Outfit, sans-serif' }
    },
    xAxis: {
      type: 'category',
      data: sampled.map((_, i) => `#${(i * step) + 1}`),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace', interval: Math.floor(sampled.length / 5) }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [{
      name: 'Value',
      type: 'line',
      data: sampled,
      smooth: true,
      showSymbol: false,
      lineStyle: { color: palette[palette.length - 1], width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: palette[palette.length - 1] },
          { offset: 1, color: palette[0] }
        ]),
        opacity: 0.55
      }
    }]
  }
}

const buildBarOption = (values) => {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const q1 = sorted[Math.floor(sorted.length * 0.25)]
  const q2 = sorted[Math.floor(sorted.length * 0.5)]
  const q3 = sorted[Math.floor(sorted.length * 0.75)]
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const data = [
    { name: 'Q1 (Lowest)', count: values.filter(v => v >= min && v <= q1).length, range: `${min.toFixed(2)} – ${q1.toFixed(2)}` },
    { name: 'Q2', count: values.filter(v => v > q1 && v <= q2).length, range: `${q1.toFixed(2)} – ${q2.toFixed(2)}` },
    { name: 'Q3', count: values.filter(v => v > q2 && v <= q3).length, range: `${q2.toFixed(2)} – ${q3.toFixed(2)}` },
    { name: 'Q4 (Highest)', count: values.filter(v => v > q3 && v <= max).length, range: `${q3.toFixed(2)} – ${max.toFixed(2)}` }
  ]
  const barColors = piePalette.value
  return {
    backgroundColor: 'transparent',
    grid: { left: 50, right: 24, top: 32, bottom: 40 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(255,255,255,0.15)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'Outfit, sans-serif' },
      formatter: (params) => {
        const p = params[0]
        return `<strong>${p.name}</strong><br/>Range: ${data[p.dataIndex].range}<br/>Count: ${p.value}`
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'Outfit, sans-serif' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [{
      name: 'Grids',
      type: 'bar',
      data: data.map((d, i) => ({ value: d.count, itemStyle: { color: barColors[i], borderRadius: [4, 4, 0, 0] } })),
      barWidth: '60%',
      label: {
        show: true,
        position: 'top',
        color: 'rgba(255,255,255,0.85)',
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace'
      }
    }]
  }
}

const buildPieOption = (values) => {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const q1 = sorted[Math.floor(sorted.length * 0.25)]
  const q2 = sorted[Math.floor(sorted.length * 0.5)]
  const q3 = sorted[Math.floor(sorted.length * 0.75)]
  const data = [
    { name: 'Lowest 25%', value: values.filter(v => v <= q1).length },
    { name: 'Q2 25-50%', value: values.filter(v => v > q1 && v <= q2).length },
    { name: 'Q3 50-75%', value: values.filter(v => v > q2 && v <= q3).length },
    { name: 'Top 25%', value: values.filter(v => v > q3).length }
  ]
  const palette = piePalette.value
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(255,255,255,0.15)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'Outfit, sans-serif' },
      formatter: (params) => {
        return `<strong>${params.name}</strong><br/>Grids: ${params.value}<br/>Share: ${params.percent.toFixed(1)}%`
      }
    },
    legend: {
      bottom: 8,
      textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'Outfit, sans-serif' },
      itemWidth: 10,
      itemHeight: 10
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: 'rgba(10, 22, 40, 0.9)',
        borderWidth: 2
      },
      label: {
        show: true,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontFamily: 'Outfit, sans-serif',
        formatter: '{d}%'
      },
      labelLine: {
        lineStyle: { color: 'rgba(255,255,255,0.3)' }
      },
      data: data.map((d, i) => ({ ...d, itemStyle: { color: palette[i] } }))
    }]
  }
}

const renderCharts = () => {
  const values = getValues()
  if (values.length === 0) return
  if (histInstance) histInstance.setOption(buildHistogramOption(values), true)
  if (trendInstance) trendInstance.setOption(buildTrendOption(values), true)
  if (barInstance) barInstance.setOption(buildBarOption(values), true)
  if (pieInstance) pieInstance.setOption(buildPieOption(values), true)
}

const initCharts = () => {
  if (histChart.value) histInstance = echarts.init(histChart.value)
  if (trendChart.value) trendInstance = echarts.init(trendChart.value)
  if (barChart.value) barInstance = echarts.init(barChart.value)
  if (pieChart.value) pieInstance = echarts.init(pieChart.value)
  renderCharts()
}

const handleResize = () => {
  histInstance?.resize()
  trendInstance?.resize()
  barInstance?.resize()
  pieInstance?.resize()
}

watch(() => props.indicatorDataCache, () => {
  nextTick(() => renderCharts())
}, { deep: true })

watch(() => props.activeIndicator, () => {
  nextTick(() => renderCharts())
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  nextTick(() => initCharts())
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  histInstance?.dispose()
  trendInstance?.dispose()
  barInstance?.dispose()
  pieInstance?.dispose()
})
</script>

<style scoped>
.indicator-charts {
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  margin-top: 16px;
}

.charts-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.section-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #009BB8;
  background: rgba(0, 155, 184, 0.12);
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 1px;
}

.charts-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin: 0;
}

.indicator-badge {
  display: inline-block;
  margin-left: auto;
  padding: 4px 10px;
  background: rgba(0, 155, 184, 0.1);
  border: 1px solid rgba(0, 155, 184, 0.4);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #009BB8;
  letter-spacing: 1px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.chart-card {
  background: rgba(10, 22, 40, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 16px;
}

.chart-card-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.chart-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #009BB8;
  background: rgba(0, 155, 184, 0.1);
  padding: 3px 8px;
  border-radius: 3px;
  letter-spacing: 1.2px;
}

.chart-subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.chart-canvas {
  width: 100%;
  height: 200px;
}

@media (max-width: 1100px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.no-border {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  backdrop-filter: none;
  margin-top: 0;
}

.single-col {
  grid-template-columns: 1fr;
  gap: 10px;
}

.single-col .chart-canvas {
  height: 140px;
}

.single-col .chart-card {
  padding: 10px;
}

.single-col .chart-card-header {
  margin-bottom: 6px;
}

</style>
