<template>
  <div class="model-training-overview border-card">
    <div class="row-header">
      <span class="row-index">01</span>
      <h2 class="row-title">Model Training & Pattern Overview (模型训练与频繁模式总览)</h2>
    </div>

    <!-- A. 方法链可视化流程 -->
    <div class="overview-section">
      <h3 class="section-sub-title">1. METHODOLOGY PIPELINE (空间推演方法链)</h3>
      <div class="pipeline-chain">
        <div v-for="(step, idx) in overviewData.method_chain || defaultSteps" :key="idx" class="pipeline-step">
          <div class="step-num">{{ idx + 1 }}</div>
          <div class="step-content">
            <div class="step-label">{{ step }}</div>
          </div>
          <span v-if="idx < (overviewData.method_chain || defaultSteps).length - 1" class="step-arrow">→</span>
        </div>
      </div>
    </div>

    <!-- B. 模型参数与精度面板 -->
    <div class="overview-layout">
      <!-- 样本数据面板 (置顶铺满) -->
      <div class="metric-sub-card training-assets-card">
        <h4 class="card-header-tag">TRAINING ASSETS</h4>
        <div class="training-assets-content">
          <div class="big-stats-row">
            <div class="stat-unit">
              <span class="stat-num">{{ overviewData.training?.num_images || 1200 }}</span>
              <span class="stat-lbl">训练图像样本数</span>
            </div>
            <div class="stat-unit">
              <span class="stat-num">{{ overviewData.training?.num_features || 221 }}</span>
              <span class="stat-lbl">gSpan 提取特征数</span>
            </div>
          </div>
          <div class="stats-table">
            <div class="table-row">
              <span>交叉验证均方根误差 (CV RMSE):</span>
              <span class="monospace text-highlight">{{ formatNum(overviewData.metrics?.cv_rmse_mean) }}</span>
            </div>
            <div class="table-row">
              <span>交叉验证确定系数 (CV R²):</span>
              <span class="monospace text-highlight">{{ formatNum(overviewData.metrics?.cv_r2_mean) }}</span>
            </div>
            <div class="table-row">
              <span>独立测试集 R² (Holdout R²):</span>
              <span class="monospace text-highlight">{{ formatNum(overviewData.metrics?.holdout_r2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 模型拟合曲线与 SHAP 概要图 (下方铺满，大图展示，动态 ECharts 绘制) -->
      <div class="metric-sub-card figures-card">
        <h4 class="card-header-tag">FIT & GLOBAL SHAP SUMMARY (DOUBLED SCATTER & IMPORTANCE BAR)</h4>
        <div class="figures-flex">
          <div class="chart-wrapper">
            <div ref="fitChartRef" class="fit-chart-container"></div>
            <div class="fig-tag-dynamic">预测拟合散点图 (Scatter Plot)</div>
          </div>
          <div class="chart-wrapper">
            <div ref="shapChartRef" class="fit-chart-container"></div>
            <div class="fig-tag-dynamic">SHAP 特征全局重要性排行 (Top 20)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- C. 频繁空间模式排行榜 (正向与负向) -->
    <div class="overview-section patterns-section">
      <h3 class="section-sub-title">2. INFLUENTIAL SPATIAL PATTERNS (核心空间子图模式排行)</h3>
      <p class="pattern-intro-tip">点击下方频繁子图卡片，可将其锁定，联动右侧“单图优化证据链”进行空间缺陷的高亮剖析。</p>
      
      <div class="patterns-grid">
        <!-- C1. 正向提升模式 (Positive Patterns) -->
        <div class="pattern-column">
          <h4 class="column-title positive-title">
            <span class="dot green"></span>
            推动评分提升模式 (Top Positive by SHAP)
          </h4>
          <div class="pattern-list">
            <div 
              v-for="pat in topPositive" 
              :key="pat.feature_name" 
              class="pattern-card positive"
              :class="{ active: activePattern === pat.feature_name }"
              @click="togglePattern(pat.feature_name)"
            >
              <div class="pattern-card-meta">
                <span class="pattern-code">{{ pat.feature_name }}</span>
                <span class="pattern-impact green">SHAP: +{{ formatNum(pat.mean_shap, 4) }}</span>
              </div>
              <div class="pattern-visual">
                <!-- 纯前端轻量拓扑渲染 -->
                <svg viewBox="0 0 260 110" class="pattern-svg">
                  <g v-for="(link, i) in pat.edges" :key="i">
                    <line 
                      :x1="getNodeX(link.source_pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :y1="getNodeY(link.source_pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :x2="getNodeX(link.target_pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :y2="getNodeY(link.target_pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      class="pat-svg-edge"
                    />
                  </g>
                  <g v-for="node in pat.nodes" :key="node.pattern_node_id">
                    <circle 
                      :cx="getNodeX(node.pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :cy="getNodeY(node.pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      r="16"
                      class="pat-svg-node"
                    />
                    <!-- 极简节点图标 -->
                    <text 
                      :x="getNodeX(node.pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :y="(getNodeY(node.pattern_node_id, pat.nodes, pat.layout_type) + 4) + '%'"
                      class="pat-node-letter"
                    >
                      {{ node.label.substring(0, 1).toUpperCase() }}
                    </text>
                    <text 
                      :x="getNodeX(node.pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :y="(getNodeY(node.pattern_node_id, pat.nodes, pat.layout_type) + 26) + '%'"
                      class="pat-node-lbl"
                    >
                      {{ node.label }}
                    </text>
                  </g>
                </svg>
              </div>
              <div class="pattern-stats-row">
                <span>支持度: <span class="monospace">{{ pat.support }}</span></span>
                <span>频数: <span class="monospace">{{ pat.total_pattern_count }}</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- C2. 负向抑制模式 (Negative Patterns) -->
        <div class="pattern-column">
          <h4 class="column-title negative-title">
            <span class="dot red"></span>
            拉低评分抑制模式 (Top Negative by SHAP)
          </h4>
          <div class="pattern-list">
            <div 
              v-for="pat in topNegative" 
              :key="pat.feature_name" 
              class="pattern-card negative"
              :class="{ active: activePattern === pat.feature_name }"
              @click="togglePattern(pat.feature_name)"
            >
              <div class="pattern-card-meta">
                <span class="pattern-code">{{ pat.feature_name }}</span>
                <span class="pattern-impact red">SHAP: {{ formatNum(pat.mean_shap, 4) }}</span>
              </div>
              <div class="pattern-visual">
                <svg viewBox="0 0 260 110" class="pattern-svg">
                  <g v-for="(link, i) in pat.edges" :key="i">
                    <line 
                      :x1="getNodeX(link.source_pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :y1="getNodeY(link.source_pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :x2="getNodeX(link.target_pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :y2="getNodeY(link.target_pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      class="pat-svg-edge"
                    />
                  </g>
                  <g v-for="node in pat.nodes" :key="node.pattern_node_id">
                    <circle 
                      :cx="getNodeX(node.pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :cy="getNodeY(node.pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      r="16"
                      class="pat-svg-node negative"
                    />
                    <text 
                      :x="getNodeX(node.pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :y="(getNodeY(node.pattern_node_id, pat.nodes, pat.layout_type) + 4) + '%'"
                      class="pat-node-letter"
                    >
                      {{ node.label.substring(0, 1).toUpperCase() }}
                    </text>
                    <text 
                      :x="getNodeX(node.pattern_node_id, pat.nodes, pat.layout_type) + '%'"
                      :y="(getNodeY(node.pattern_node_id, pat.nodes, pat.layout_type) + 26) + '%'"
                      class="pat-node-lbl"
                    >
                      {{ node.label }}
                    </text>
                  </g>
                </svg>
              </div>
              <div class="pattern-stats-row">
                <span>支持度: <span class="monospace">{{ pat.support }}</span></span>
                <span>频数: <span class="monospace">{{ pat.total_pattern_count }}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗放大看图 -->
    <div v-if="bigImageSrc" class="img-modal-overlay" @click="bigImageSrc = null">
      <div class="img-modal-content">
        <img :src="bigImageSrc" alt="Big Overview" class="modal-big-img" />
        <p class="modal-hint">点击任意空白处关闭弹窗</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  activePattern: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select-pattern'])

const overviewData = ref({})
const topPositive = ref([])
const topNegative = ref([])

// ECharts 图表容器引用
const fitChartRef = ref(null)
const shapChartRef = ref(null)
let fitChart = null
let shapChart = null

const defaultSteps = [
  "场景原图",
  "OvSGTR 场景结构",
  "gSpan 频繁子图挖掘",
  "Pattern-count 特征化",
  "XGBoost 空间评分",
  "TreeSHAP 贡献度分析"
]

const formatNum = (val, fixed = 3) => {
  if (val === undefined || val === null) return 'N/A'
  return parseFloat(val).toFixed(fixed)
}

const handleImgError = (e) => {
  // 若图片缺失，在容器内添加优雅的降级文字标记，满足不伪造数据的原则
  const el = e.target.parentElement
  el.classList.add('missing-figure')
  el.innerHTML = '<span class="fig-missing-tip">⚠️ 静态分析图表未就位<br/>(File Missing)</span>'
}

const viewBigImage = (src) => {
  bigImageSrc.value = src
}

const togglePattern = (patternName) => {
  const nextPattern = props.activePattern === patternName ? null : patternName
  emit('select-pattern', nextPattern)
}

// 算出前端 SVG 节点百分比位置
const getNodeX = (nodeId, nodes, layoutType) => {
  const index = nodes.findIndex(n => n.pattern_node_id === nodeId)
  if (layoutType === 'closed_triangle') {
    return [50, 25, 75][index] || 50
  }
  if (layoutType === 'center_linked_pair') {
    // 假设 node 1 是中心节点，两端均布
    return [20, 50, 80][index] || 50
  }
  return [25, 50, 75][index] || 50
}

const getNodeY = (nodeId, nodes, layoutType) => {
  const index = nodes.findIndex(n => n.pattern_node_id === nodeId)
  if (layoutType === 'closed_triangle') {
    return [30, 70, 70][index] || 45
  }
  if (layoutType === 'center_linked_pair') {
    return [40, 45, 50][index] || 45
  }
  return [40, 45, 50][index] || 45
}

onMounted(async () => {
  // 1. 读取基本的指标大盘
  try {
    const r1 = await fetch('/cases_data/model_training_overview.json')
    overviewData.value = await r1.json()
  } catch (e) {
    console.error("Error reading model overview json:", e)
  }

  // 2. 读取排行榜正向和负向模式
  try {
    const r2 = await fetch('/cases_data/top_positive_patterns.json')
    const posList = await r2.json()
    topPositive.value = posList.slice(0, 3)
  } catch (e) {
    console.error("Error reading top positive patterns:", e)
  }

  try {
    const r3 = await fetch('/cases_data/top_negative_patterns.json')
    const negList = await r3.json()
    topNegative.value = negList.slice(0, 3)
  } catch (e) {
    console.error("Error reading top negative patterns:", e)
  }

  // 3. 动态绘制预测拟合散点图 (ECharts Scatter)
  try {
    const rFit = await fetch('/cases_data/fit_predictions.json')
    const fitData = await rFit.json()
    
    if (fitChartRef.value) {
      fitChart = echarts.init(fitChartRef.value)
      
      const allVals = fitData.flatMap(d => d)
      const minVal = Math.floor(Math.min(...allVals) * 0.9 * 10) / 10
      const maxVal = Math.ceil(Math.max(...allVals) * 1.1 * 10) / 10
      
      const option = {
        backgroundColor: 'transparent',
        grid: {
          top: 30,
          right: 30,
          bottom: 45,
          left: 45,
          containLabel: false
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(10, 20, 38, 0.95)',
          borderColor: 'rgba(123, 97, 255, 0.4)',
          borderWidth: 1,
          textStyle: { color: '#fff', fontSize: 11, fontFamily: 'Outfit' },
          formatter: (params) => {
            return `真实得分 (True): <b>${params.value[0].toFixed(2)}</b><br/>预测评分 (Pred): <b>${params.value[1].toFixed(2)}</b>`
          }
        },
        xAxis: {
          name: 'True Score',
          nameLocation: 'middle',
          nameGap: 24,
          min: minVal,
          max: maxVal,
          axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'Outfit' },
          axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.03)' } }
        },
        yAxis: {
          name: 'Fitted Prediction',
          nameLocation: 'middle',
          nameGap: 28,
          min: minVal,
          max: maxVal,
          axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'Outfit' },
          axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.03)' } }
        },
        series: [
          {
            type: 'scatter',
            data: fitData,
            symbolSize: 6,
            itemStyle: {
              color: 'rgba(123, 97, 255, 0.65)',
              shadowBlur: 6,
              shadowColor: 'rgba(123, 97, 255, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 0.5
            }
          },
          {
            type: 'line',
            data: [[minVal, minVal], [maxVal, maxVal]],
            symbol: 'none',
            lineStyle: {
              color: 'rgba(232, 85, 78, 0.5)',
              width: 1.5,
              type: 'dashed'
            },
            silent: true,
            label: {
              show: true,
              position: 'end',
              formatter: 'y = x 理想线',
              color: 'rgba(232, 85, 78, 0.7)',
              fontSize: 9,
              fontFamily: 'Outfit',
              offset: [-50, -10]
            }
          }
        ]
      }
      fitChart.setOption(option)
    }
  } catch (e) {
    console.error("Error drawing fit scatter chart:", e)
  }

  // 4. 动态绘制 SHAP 特征全局重要性排行 (ECharts Bar)
  try {
    const rShap = await fetch('/cases_data/raw_shap_importance.json')
    const shapData = await rShap.json()
    
    // 取前 20，并倒序让最大的显示在最上方
    const top20 = shapData.slice(0, 20).reverse()
    const yData = top20.map(d => `${d.feature_display_name} (${d.feature_name})`)
    const xData = top20.map(d => d.mean_abs_shap)
    
    if (shapChartRef.value) {
      shapChart = echarts.init(shapChartRef.value)
      
      const option = {
        backgroundColor: 'transparent',
        grid: {
          top: 15,
          right: 35,
          bottom: 35,
          left: 200,
          containLabel: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: 'rgba(10, 20, 38, 0.95)',
          borderColor: 'rgba(54, 200, 255, 0.4)',
          borderWidth: 1,
          textStyle: { color: '#fff', fontSize: 11, fontFamily: 'Outfit' },
          formatter: (params) => {
            const p = params[0]
            return `特征模式: <b>${p.name}</b><br/>Mean |SHAP|: <span style="color:#36c8ff;font-family:monospace;font-weight:bold">${p.value.toFixed(4)}</span>`
          }
        },
        xAxis: {
          type: 'value',
          name: 'Mean |SHAP| (Feature Importance)',
          nameLocation: 'middle',
          nameGap: 22,
          axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontFamily: 'Outfit' },
          axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.03)' } }
        },
        yAxis: {
          type: 'category',
          data: yData,
          axisLabel: {
            color: 'rgba(255,255,255,0.7)',
            fontSize: 9.5,
            fontFamily: 'Outfit',
            width: 190,
            overflow: 'truncate',
            align: 'right'
          },
          axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
          splitLine: { show: false }
        },
        series: [
          {
            name: 'Mean SHAP',
            type: 'bar',
            data: xData,
            barWidth: '60%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: 'rgba(54, 200, 255, 0.25)' },
                { offset: 1, color: 'rgba(54, 200, 255, 0.85)' }
              ]),
              borderRadius: [0, 4, 4, 0],
              borderColor: 'rgba(54, 200, 255, 0.4)',
              borderWidth: 0.8
            }
          }
        ]
      }
      shapChart.setOption(option)
    }
  } catch (e) {
    console.error("Error drawing shap importance bar chart:", e)
  }

  // 5. 监听 resize 窗口缩放
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  fitChart && fitChart.resize()
  shapChart && shapChart.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  fitChart && fitChart.dispose()
  shapChart && shapChart.dispose()
})
</script>

<style scoped>
.model-training-overview {
  margin-bottom: 24px;
}

.border-card {
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(232, 85, 78, 0.15);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.row-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 12px;
}

.row-index {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #e8554e;
  background: rgba(232, 85, 78, 0.1);
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.row-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
}

.overview-section {
  margin-bottom: 20px;
}

.section-sub-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1.5px;
  margin-bottom: 12px;
}

/* 方法链流程 */
.pipeline-chain {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.pipeline-step {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-num {
  width: 20px;
  height: 20px;
  background: rgba(123, 97, 255, 0.15);
  border: 1px solid rgba(123, 97, 255, 0.4);
  border-radius: 4px;
  color: #7b61ff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 6px rgba(123, 97, 255, 0.2);
}

.step-label {
  font-family: 'Outfit', sans-serif;
  font-size: 11.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
}

.step-arrow {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.25);
  margin-left: 4px;
}

/* 大盘栅格 */
.overview-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.training-assets-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 32px;
}

@media (max-width: 768px) {
  .training-assets-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}

.metric-sub-card {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-header-tag {
  font-family: 'Syncopate', sans-serif;
  font-size: 9px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 14px;
}

.big-stats-row {
  display: flex;
  gap: 24px;
}

.stat-unit {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-family: 'Syncopate', sans-serif;
  font-size: 26px;
  font-weight: bold;
  color: #7b61ff;
  text-shadow: 0 0 10px rgba(123, 97, 255, 0.3);
}

.stat-lbl {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  margin-top: 4px;
}

.stats-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  max-width: 600px;
}

.table-row {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: rgba(255,255,255,0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  padding-bottom: 6px;
}

.text-highlight {
  color: #fff;
  font-weight: bold;
}

.monospace {
  font-family: 'JetBrains Mono', monospace;
}

/* 拟合图与 SHAP 条形图动态渲染 */
.figures-card {
  justify-content: space-between;
}

.figures-flex {
  display: flex;
  gap: 24px;
}

@media (max-width: 992px) {
  .figures-flex {
    flex-direction: column;
  }
}

.chart-wrapper {
  flex: 1;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 330px;
  padding: 12px;
}

.fit-chart-container {
  width: 100%;
  height: 290px;
}

.fig-tag-dynamic {
  font-family: 'Outfit', sans-serif;
  font-size: 9.5px;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  margin-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  padding-top: 6px;
}

/* 频繁模式栏 */
.patterns-section {
  border-top: 1px solid rgba(255,255,255,0.05);
  padding-top: 20px;
}

.pattern-intro-tip {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  margin: -4px 0 16px 0;
}

.patterns-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.pattern-column {
  display: flex;
  flex-direction: column;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 12px;
}

.column-title .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.column-title .dot.green {
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
}

.column-title .dot.red {
  background: #e8554e;
  box-shadow: 0 0 6px #e8554e;
}

.pattern-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pattern-card {
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
  position: relative;
  transition: all 0.25s ease;
}

.pattern-card:hover {
  transform: translateY(-1px);
}

.pattern-card.positive:hover {
  border-color: rgba(74, 222, 128, 0.3);
  background: rgba(20, 42, 28, 0.3);
}

.pattern-card.negative:hover {
  border-color: rgba(232, 85, 78, 0.3);
  background: rgba(42, 20, 20, 0.3);
}

.pattern-card.positive.active {
  border-color: #4ade80;
  background: rgba(20, 42, 28, 0.55);
  box-shadow: 0 0 12px rgba(74, 222, 128, 0.15);
}

.pattern-card.negative.active {
  border-color: #e8554e;
  background: rgba(42, 20, 20, 0.55);
  box-shadow: 0 0 12px rgba(232, 85, 78, 0.15);
}

.pattern-card-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.pattern-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  font-weight: 700;
  color: #fff;
}

.pattern-impact {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  font-weight: bold;
}

.pattern-impact.green { color: #4ade80; }
.pattern-impact.red { color: #e8554e; }

.pattern-visual {
  background: #050811;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  margin-bottom: 10px;
  padding: 6px;
}

.pattern-svg {
  width: 100%;
  height: 90px;
}

.pat-svg-edge {
  stroke: rgba(123, 97, 255, 0.6);
  stroke-width: 3;
}

.pat-svg-node {
  fill: #101a33;
  stroke: #36c8ff;
  stroke-width: 2;
  filter: drop-shadow(0 0 4px rgba(54, 200, 255, 0.5));
}

.pat-svg-node.negative {
  stroke: #e8554e;
  filter: drop-shadow(0 0 4px rgba(232, 85, 78, 0.5));
}

.pat-node-letter {
  fill: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: bold;
  text-anchor: middle;
}

.pat-node-lbl {
  fill: #aab8ff;
  font-family: 'Outfit', sans-serif;
  font-size: 8px;
  text-anchor: middle;
}

.pattern-stats-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

/* 放大看图遮罩 */
.img-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
}

.img-modal-content {
  text-align: center;
  max-width: 85%;
  max-height: 85%;
}

.modal-big-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border: 1px solid rgba(123, 97, 255, 0.3);
  box-shadow: 0 0 30px rgba(123, 97, 255, 0.2);
  border-radius: 8px;
}

.modal-hint {
  color: rgba(255,255,255,0.4);
  font-size: 11px;
  margin-top: 12px;
  font-family: 'Outfit', sans-serif;
}
</style>
