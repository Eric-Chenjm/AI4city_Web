<template>
  <div class="map-container">
    <div class="map-header">
      <div class="map-title-group">
        <span class="section-tag">MAP</span>
        <h2 class="map-title">SHANGHAI CENTRAL AREA</h2>
        <span class="indicator-badge study-area">STUDY AREA · CENTRAL URBAN</span>
        <span v-if="activeLayer !== 'implicit' && currentIndicator" class="indicator-badge">INDICATOR: {{ currentIndicator.name.toUpperCase() }}</span>
      </div>
    </div>
    <div ref="mapChart" class="map-chart"></div>
    <div class="map-legend">
      <div class="legend-bar">
        <div class="legend-gradient" :class="activeLayer"></div>
        <div class="legend-labels">
          <span v-if="activeLayer !== 'implicit'">{{ indicatorRange.min.toFixed(2) }}</span>
          <span v-else>LOW</span>
          <span v-if="activeLayer !== 'implicit'">{{ ((indicatorRange.min + indicatorRange.max) / 2).toFixed(2) }}</span>
          <span v-else>MID</span>
          <span v-if="activeLayer !== 'implicit'">{{ indicatorRange.max.toFixed(2) }}</span>
          <span v-else>HIGH</span>
        </div>
      </div>
      <div v-if="activeLayer !== 'implicit' && currentIndicator" class="legend-scale-label">{{ currentIndicator.name.toUpperCase() }} ({{ currentIndicator.unit || '' }})</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  activeLayer: { type: String, default: 'explicit' },
  indicatorDataCache: { type: Object, default: () => ({}) },
  activeIndicator: { type: String, default: 'x1_bldg_density' },
  boundaryCoords: { type: Array, default: () => [] },
  mapBounds: { type: Object, default: () => ({ center: [121.458, 31.199], zoom: 10 }) },
  explicitIndicators: { type: Array, default: () => [] },
  implicitIndicators: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:activeLayer', 'boundary-loaded'])

const mapChart = ref(null)
let chartInstance = null
const mapReady = ref(false)

const currentIndicator = computed(() => {
  const explicit = props.explicitIndicators.find(i => i.id === props.activeIndicator)
  if (explicit) return { ...explicit, type: 'explicit' }
  const implicit = props.implicitIndicators.find(i => i.id === props.activeIndicator)
  if (implicit) return { ...implicit, type: 'implicit' }
  return null
})

const indicatorRange = computed(() => {
  const cached = props.indicatorDataCache[props.activeIndicator]
  if (cached) return { min: cached.min, max: cached.max }
  return { min: 0, max: 1 }
})

const getIndicatorColor = (normalized, isExplicit) => {
  const t = Math.min(1, Math.max(0, normalized))
  if (isExplicit) {
    if (t < 0.5) {
      const k = t / 0.5
      const r = Math.round(120 + (232 - 120) * k)
      const g = Math.round(40 + (85 - 40) * k)
      const b = Math.round(40 + (78 - 40) * k)
      return `rgba(${r}, ${g}, ${b}, ${0.35 + 0.35 * k})`
    } else {
      const k = (t - 0.5) / 0.5
      const r = Math.round(232 + (255 - 232) * k)
      const g = Math.round(85 + (170 - 85) * k)
      const b = Math.round(78 + (90 - 78) * k)
      return `rgba(${r}, ${g}, ${b}, ${0.7 + 0.25 * k})`
    }
  } else {
    if (t < 0.5) {
      const k = t / 0.5
      const r = Math.round(30 + (60 - 30) * k)
      const g = Math.round(60 + (110 - 60) * k)
      const b = Math.round(120 + (180 - 120) * k)
      return `rgba(${r}, ${g}, ${b}, ${0.35 + 0.35 * k})`
    } else {
      const k = (t - 0.5) / 0.5
      const r = Math.round(60 + (100 - 60) * k)
      const g = Math.round(110 + (170 - 110) * k)
      const b = Math.round(180 + (240 - 180) * k)
      return `rgba(${r}, ${g}, ${b}, ${0.7 + 0.25 * k})`
    }
  }
}

const generateHeatPoints = (type) => {
  const points = []
  const centers = {
    explicit: [
      [121.50, 31.24, 95], [121.52, 31.23, 88], [121.48, 31.22, 76], [121.54, 31.25, 92],
      [121.46, 31.21, 65], [121.53, 31.26, 80], [121.49, 31.25, 70], [121.51, 31.20, 60],
      [121.55, 31.23, 85], [121.47, 31.24, 55], [121.52, 31.21, 72], [121.50, 31.27, 68],
      [121.44, 31.23, 45], [121.56, 31.22, 50], [121.48, 31.26, 78], [121.54, 31.20, 62],
      [121.50, 31.22, 90], [121.52, 31.25, 82], [121.46, 31.25, 48], [121.53, 31.22, 75]
    ],
    implicit: [
      [121.50, 31.24, 78], [121.49, 31.23, 85], [121.51, 31.22, 90], [121.48, 31.25, 72],
      [121.53, 31.21, 88], [121.47, 31.24, 80], [121.52, 31.26, 65], [121.50, 31.20, 82],
      [121.54, 31.23, 70], [121.46, 31.22, 76], [121.51, 31.27, 58], [121.49, 31.20, 86],
      [121.55, 31.24, 60], [121.45, 31.23, 68], [121.52, 31.21, 79], [121.48, 31.26, 74],
      [121.53, 31.25, 67], [121.47, 31.21, 81], [121.50, 31.23, 92], [121.54, 31.22, 63]
    ]
  }
  if (type === 'overlay') {
    return [...centers.explicit.map(p => [...p, 'explicit']), ...centers.implicit.map(p => [...p, 'implicit'])]
  }
  return centers[type] || centers.explicit
}

const getCurrentPolygons = () => {
  const cached = props.indicatorDataCache[props.activeIndicator]
  return cached ? cached.polygons : []
}

const updateMap = () => {
  if (!chartInstance || !mapReady.value) return

  const isExplicit = props.activeLayer === 'explicit'
  const isImplicit = props.activeLayer === 'implicit'
  const isOverlay = props.activeLayer === 'overlay'

  const implicitPoints = generateHeatPoints('implicit')
  const explicitPoints = generateHeatPoints('explicit')

  const series = []

  if (props.boundaryCoords.length > 0) {
    series.push({
      name: 'StudyArea',
      type: 'custom',
      coordinateSystem: 'geo',
      renderItem: (params, api) => {
        const pts = props.boundaryCoords.map(c => api.coord(c))
        return {
          type: 'polygon',
          shape: { points: pts },
          style: {
            fill: 'rgba(232, 85, 78, 0.03)',
            stroke: '#e8554e',
            lineWidth: 1.5,
            lineDash: [4, 3]
          },
          silent: true,
          z: 10
        }
      },
      data: [{ value: [props.boundaryCoords[0][0], props.boundaryCoords[0][1]] }],
      zlevel: 1
    })
  }

  const currentPolygons = getCurrentPolygons()
  const range = indicatorRange.value
  const indicator = currentIndicator.value
  const isCurrentExplicit = indicator?.type === 'explicit'

  if ((isExplicit || isOverlay) && currentPolygons.length > 0) {
    series.push({
      name: indicator?.name || 'Indicator',
      type: 'custom',
      coordinateSystem: 'geo',
      renderItem: (params, api) => {
        const item = currentPolygons[params.dataIndex]
        if (!item) return null
        const pts = item.coords.map(c => api.coord(c))
        const normalized = (item.value - range.min) / (range.max - range.min)
        const color = getIndicatorColor(normalized, isCurrentExplicit)
        return {
          type: 'polygon',
          shape: { points: pts },
          style: {
            fill: color,
            stroke: isCurrentExplicit ? 'rgba(232, 85, 78, 0.2)' : 'rgba(74, 158, 218, 0.2)',
            lineWidth: 0.3
          },
          silent: false
        }
      },
      data: currentPolygons.map(p => ({
        value: [p.coords[0][0], p.coords[0][1], p.value],
        coords: p.coords,
        rawValue: p.value
      })),
      zlevel: 2
    })
  }

  if (isImplicit || isOverlay) {
    const implicitIndicator = props.implicitIndicators[0]
    if (implicitIndicator && props.indicatorDataCache[implicitIndicator.id]) {
      const implicitPolygons = props.indicatorDataCache[implicitIndicator.id].polygons
      const implicitRange = { 
        min: props.indicatorDataCache[implicitIndicator.id].min, 
        max: props.indicatorDataCache[implicitIndicator.id].max 
      }
      series.push({
        name: implicitIndicator.name,
        type: 'custom',
        coordinateSystem: 'geo',
        renderItem: (params, api) => {
          const item = implicitPolygons[params.dataIndex]
          if (!item) return null
          const pts = item.coords.map(c => api.coord(c))
          const normalized = (item.value - implicitRange.min) / (implicitRange.max - implicitRange.min)
          const color = getIndicatorColor(normalized, false)
          return {
            type: 'polygon',
            shape: { points: pts },
            style: {
              fill: color,
              stroke: 'rgba(74, 158, 218, 0.2)',
              lineWidth: 0.3
            },
            silent: false
          }
        },
        data: implicitPolygons.map(p => ({
          value: [p.coords[0][0], p.coords[0][1], p.value],
          coords: p.coords,
          rawValue: p.value
        })),
        zlevel: 2
      })
    } else {
      series.push({
        name: 'Implicit',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: implicitPoints.map(p => ({
          value: p,
          itemStyle: {
            color: '#4a9eda',
            shadowBlur: 15,
            shadowColor: 'rgba(74, 158, 218, 0.6)'
          }
        })),
        symbolSize: (val) => val[2] / 4,
        rippleEffect: { brushType: 'stroke', scale: 2, period: 4 },
        hoverAnimation: true,
        zlevel: 3
      })
    }
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(232, 85, 78, 0.3)',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#ffffff',
        fontSize: 12,
        fontFamily: 'Outfit, sans-serif'
      },
      formatter: (params) => {
        if (params.seriesName === 'StudyArea') return null
        if (params.value && params.value.length >= 3) {
          return `<strong>${params.seriesName || 'Indicator'}</strong><br/>Value: ${params.value[2].toFixed(4)}<br/>Coord: ${params.value[0].toFixed(4)}, ${params.value[1].toFixed(4)}`
        }
        return null
      }
    },
    geo: {
      map: 'shanghai',
      roam: true,
      zoom: props.mapBounds.zoom,
      center: props.mapBounds.center,
      label: { show: false },
      itemStyle: {
        areaColor: 'rgba(20, 35, 58, 0.4)',
        borderColor: 'rgba(232, 85, 78, 0.15)',
        borderWidth: 0.8
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(30, 50, 80, 0.7)',
          borderColor: 'rgba(232, 85, 78, 0.4)'
        },
        label: { show: true, color: '#e8554e', fontSize: 10 }
      },
      scaleLimit: { min: 1, max: 20 }
    },
    series
  }

  chartInstance.setOption(option, true)
}

const initMap = () => {
  if (!mapChart.value) return
  chartInstance = echarts.init(mapChart.value)
}

const handleResize = () => {
  if (chartInstance && mapReady.value) {
    chartInstance.resize()
  }
}

const registerMapAndInit = async () => {
  try {
    const shanghaiJson = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/310000_full.json').then(r => r.json())
    echarts.registerMap('shanghai', shanghaiJson)
    mapReady.value = true
    nextTick(() => {
      updateMap()
    })
  } catch (e) {
    console.warn('Failed to load shanghai map:', e)
  }
}

watch(() => props.activeLayer, () => { if (mapReady.value) updateMap() })
watch(() => props.activeIndicator, () => { if (mapReady.value) updateMap() })
watch(() => props.indicatorDataCache, () => { if (mapReady.value) updateMap() }, { deep: true })
watch(() => props.mapBounds, () => { if (mapReady.value) updateMap() }, { deep: true })

onMounted(() => {
  window.addEventListener('resize', handleResize)
  nextTick(() => {
    initMap()
    registerMapAndInit()
  })
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
.map-container {
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.map-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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

.map-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin: 0;
}

.indicator-badge {
  display: inline-block;
  margin-left: 12px;
  padding: 4px 10px;
  background: rgba(232, 85, 78, 0.12);
  border: 1px solid rgba(232, 85, 78, 0.4);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #e8554e;
  letter-spacing: 1px;
  vertical-align: middle;
}

.indicator-badge.study-area {
  background: rgba(232, 85, 78, 0.08);
  border-color: rgba(232, 85, 78, 0.6);
  border-style: dashed;
}

.map-chart {
  width: 100%;
  aspect-ratio: 1 / 1;
  min-height: 420px;
  max-height: 620px;
  border-radius: 8px;
  overflow: hidden;
}

.map-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.legend-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-gradient {
  height: 16px;
  border-radius: 3px;
}

.legend-gradient.explicit,
.legend-gradient.overlay {
  background: linear-gradient(90deg, rgba(120, 40, 40, 0.5), rgba(232, 85, 78, 0.8), rgba(255, 170, 90, 0.9));
}

.legend-gradient.implicit {
  background: linear-gradient(90deg, rgba(30, 60, 100, 0.5), rgba(74, 158, 218, 0.8), rgba(140, 200, 255, 0.9));
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.legend-scale-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

@media (max-width: 1200px) {
  .map-chart {
    min-height: 380px;
  }
}
</style>