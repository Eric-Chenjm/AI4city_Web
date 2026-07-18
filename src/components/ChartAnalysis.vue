<template>
  <div class="chart-analysis">
    <div v-if="isAnalyzing" class="chart-loading">
      <div class="loading-ring"></div>
      <p class="loading-text">CALCULATING SHAP VALUE & PLOTTING...</p>
    </div>
    <div v-else class="chart-grid">
      <!-- 1. SHAP 模式贡献度双向柱状图 -->
      <div class="chart-item shap-box">
        <div class="chart-header">
          <span class="chart-tag">SHAP EXPLANATION</span>
          <span class="chart-title">Frequent Spatial Subgraph Contribution (Δ SHAP)</span>
        </div>
        <div ref="shapChartRef" class="chart-container shap-container"></div>
        <div class="shap-legend">
          <span class="legend-dot positive"></span><span class="legend-text">推动评分提高 (Positive)</span>
          <span class="legend-dot negative"></span><span class="legend-text">抑制评分提高 (Negative)</span>
        </div>
      </div>

      <!-- 2. 评分提升对比图 -->
      <div class="chart-item score-box">
        <div class="chart-header">
          <span class="chart-tag">SCORE BOOST</span>
          <span class="chart-title">AIGC Quality Scores</span>
        </div>
        <div ref="scoreChartRef" class="chart-container score-container"></div>
      </div>

      <!-- 3. 六维空间品质雷达图 -->
      <div class="chart-item radar-box">
        <div class="chart-header">
          <span class="chart-tag">RADAR SPECTRUM</span>
          <span class="chart-title">Spatial Quality Profile</span>
        </div>
        <div ref="radarChartRef" class="chart-container radar-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  shapData: {
    type: Array,
    default: () => []
  },
  scoreData: {
    type: Object,
    default: () => ({ beforeScore: 0, afterScore: 0 })
  },
  modelName: {
    type: String,
    default: 'EGTR'
  },
  metrics: {
    type: Object,
    default: () => ({})
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  }
})

const shapChartRef = ref(null)
const scoreChartRef = ref(null)
const radarChartRef = ref(null)

let shapChart = null
let scoreChart = null
let radarChart = null

// 绘制双向 SHAP 柱状图
const buildShapOption = () => {
  const data = props.shapData || []
  
  // 提取名称和数值，将数据按数值大小从大到小排序
  const sortedData = [...data].sort((a, b) => a.value - b.value)
  const yData = sortedData.map(item => item.pattern)
  const xData = sortedData.map(item => item.value)
  
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(232, 85, 78, 0.4)',
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'JetBrains Mono' },
      formatter: function (params) {
        const item = sortedData[params[0].dataIndex]
        const color = item.value >= 0 ? '#e8554e' : '#3b82f6'
        return `<div style="font-size:11px; font-family:'JetBrains Mono';">
                  <span style="color:${color}; font-weight:700;">${item.pattern}</span><br/>
                  贡献值: <span style="font-weight:700;">${item.value >= 0 ? '+' : ''}${item.value}</span><br/>
                  <span style="color:rgba(255,255,255,0.7); font-size:10px;">${item.desc || ''}</span>
                </div>`
      }
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { 
        color: 'rgba(255, 255, 255, 0.4)', 
        fontSize: 10,
        fontFamily: 'JetBrains Mono'
      },
      splitLine: { 
        lineStyle: { 
          color: 'rgba(255, 255, 255, 0.05)',
          type: 'dashed'
        } 
      }
    },
    yAxis: {
      type: 'category',
      data: yData,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisLabel: { 
        color: '#fff', 
        fontSize: 10,
        fontFamily: 'Outfit',
        width: 140,
        overflow: 'truncate'
      },
      axisTick: { show: false }
    },
    series: [{
      name: 'SHAP Contribution',
      type: 'bar',
      data: xData.map(val => {
        return {
          value: val,
          itemStyle: {
            color: val >= 0 
              ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: 'rgba(232, 85, 78, 0.2)' },
                  { offset: 1, color: '#e8554e' }
                ])
              : new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#3b82f6' },
                  { offset: 1, color: 'rgba(59, 130, 246, 0.2)' }
                ]),
            borderRadius: val >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4]
          }
        }
      }),
      barWidth: '55%'
    }]
  }
}

// 绘制评分对比柱状图
const buildScoreOption = () => {
  const beforeVal = props.scoreData?.beforeScore || 0
  const afterVal = props.scoreData?.afterScore || 0
  
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(232, 85, 78, 0.4)',
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'JetBrains Mono' }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '12%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['优化前 (Before)', 'AI 优化后 (After)'],
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisLabel: { 
        color: 'rgba(255, 255, 255, 0.6)', 
        fontSize: 11,
        fontFamily: 'Outfit'
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 10,
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
      data: [
        { 
          value: beforeVal, 
          itemStyle: { 
            color: 'rgba(255, 255, 255, 0.25)', 
            borderRadius: [6, 6, 0, 0],
            borderColor: 'rgba(255, 255, 255, 0.4)',
            borderWidth: 1
          } 
        },
        { 
          value: afterVal, 
          itemStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#e8554e' },
              { offset: 1, color: '#991b1b' }
            ]), 
            borderRadius: [6, 6, 0, 0],
            shadowBlur: 10,
            shadowColor: 'rgba(232, 85, 78, 0.3)'
          } 
        }
      ],
      barWidth: '40%',
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'JetBrains Mono',
        formatter: '{c}'
      }
    }]
  }
}

// 绘制六维雷达图
const buildRadarOption = () => {
  // 六维基础品质指标，若无则使用默认
  const hasMetrics = props.metrics && Object.keys(props.metrics).length > 0
  
  const indicatorNames = hasMetrics 
    ? Object.keys(props.metrics).map(k => props.metrics[k].label)
    : ['Building Density', 'Green Coverage', 'Openness', 'Height Variance', 'Street Connectivity', 'Facade Diversity']
    
  const values = hasMetrics
    ? Object.keys(props.metrics).map(k => props.metrics[k].value)
    : [65, 40, 55, 45, 70, 50]

  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(232, 85, 78, 0.4)',
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'JetBrains Mono' }
    },
    radar: {
      indicator: indicatorNames.map(name => ({ name, max: 100 })),
      shape: 'polygon',
      radius: '62%',
      center: ['50%', '52%'],
      splitNumber: 4,
      axisName: {
        color: 'rgba(255, 255, 255, 0.55)',
        fontSize: 10,
        fontFamily: 'Outfit'
      },
      splitArea: {
        areaStyle: {
          color: [
            'rgba(255,255,255,0.01)', 
            'rgba(255,255,255,0.03)', 
            'rgba(255,255,255,0.01)', 
            'rgba(255,255,255,0.03)'
          ]
        }
      },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.12)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: 'Quality Matrix',
        lineStyle: { color: '#e8554e', width: 2 },
        areaStyle: { color: 'rgba(232, 85, 78, 0.22)' },
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: { color: '#e8554e', borderColor: '#0a1628', borderWidth: 1.5 }
      }]
    }]
  }
}

const initCharts = () => {
  if (props.isAnalyzing) return

  nextTick(() => {
    if (shapChartRef.value) {
      if (shapChart) shapChart.dispose()
      shapChart = echarts.init(shapChartRef.value)
      shapChart.setOption(buildShapOption())
    }
    if (scoreChartRef.value) {
      if (scoreChart) scoreChart.dispose()
      scoreChart = echarts.init(scoreChartRef.value)
      scoreChart.setOption(buildScoreOption())
    }
    if (radarChartRef.value) {
      if (radarChart) radarChart.dispose()
      radarChart = echarts.init(radarChartRef.value)
      radarChart.setOption(buildRadarOption())
    }
  })
}

const handleResize = () => {
  shapChart?.resize()
  scoreChart?.resize()
  radarChart?.resize()
}

watch(() => props.shapData, () => {
  initCharts()
}, { deep: true })

watch(() => props.scoreData, () => {
  initCharts()
}, { deep: true })

watch(() => props.metrics, () => {
  initCharts()
}, { deep: true })

watch(() => props.isAnalyzing, (val) => {
  if (!val) {
    initCharts()
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  initCharts()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  shapChart?.dispose()
  scoreChart?.dispose()
  radarChart?.dispose()
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
  padding: 80px 20px;
  gap: 16px;
  background: rgba(15, 28, 48, 0.4);
  border: 1px solid rgba(232, 85, 78, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.loading-ring {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(232, 85, 78, 0.1);
  border-top-color: #e8554e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 2px;
  color: #e8554e;
  text-shadow: 0 0 8px rgba(232, 85, 78, 0.4);
  margin: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.chart-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
}

.chart-item {
  background: rgba(15, 28, 48, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(8px);
  transition: border-color 0.3s;
}

.chart-item:hover {
  border-color: rgba(232, 85, 78, 0.25);
}

.chart-item.shap-box {
  grid-row: span 2;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 10px;
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
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.chart-container {
  width: 100%;
  position: relative;
}

.shap-container {
  height: 380px;
}

.score-container {
  height: 180px;
}

.radar-container {
  height: 180px;
}

.shap-legend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.positive {
  background: #e8554e;
  box-shadow: 0 0 6px rgba(232, 85, 78, 0.6);
}

.legend-dot.negative {
  background: #3b82f6;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.6);
}

.legend-text {
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 1024px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  .chart-item.shap-box {
    grid-row: span 1;
  }
}
</style>