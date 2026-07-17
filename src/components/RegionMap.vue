<template>
  <div class="region-map-container" :class="{ 'no-border': !bordered }">
    <div class="map-header" v-if="bordered">
      <div class="map-title-group">
        <span class="section-tag">REGION</span>
        <h2 class="map-title">FOUR QUADRANT CLASSIFICATION</h2>
        <span class="indicator-badge">EXPLICIT × IMPLICIT</span>
      </div>
    </div>
    <div class="map-body">
      <div ref="mapChart" class="map-chart"></div>
      <div class="region-legend">
        <div class="legend-title">QUADRANTS</div>
        <div class="legend-list">
          <div class="legend-item" v-for="(item, index) in quadrantStats" :key="index"
               :class="{ active: activeQuadrant === item.code }"
               @click="handleQuadrantToggle(item.code)">
            <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
            <div class="legend-info">
              <span class="legend-code">{{ item.code }}</span>
              <span class="legend-label">{{ item.label }}</span>
            </div>
            <span class="legend-count">{{ item.gridCount }}</span>
          </div>
        </div>
        <div class="legend-footer">
          <div class="reset-btn" v-if="activeQuadrant" @click="handleReset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            RESET
          </div>
        </div>
      </div>
    </div>
    <div class="map-footer" v-if="bordered">
      <div class="axis-label x-label">EXPLICIT INDICATORS &rarr;</div>
      <div class="axis-label y-label">IMPLICIT &uarr;</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  regionData: { type: Object, default: null },
  activeQuadrant: { type: String, default: null },
  boundaryCoords: { type: Array, default: () => [] },
  mapBounds: { type: Object, default: () => ({ center: [121.458, 31.199], zoom: 5 }) },
  bordered: { type: Boolean, default: true },
  disableAutoZoom: { type: Boolean, default: false }
})

const emit = defineEmits(['quadrant-click'])

const mapChart = ref(null)
let chartInstance = null
const mapReady = ref(false)
const viewAdjusted = ref(false)

const quadrants = [
  { code: 'HH', label: 'High Explicit · High Implicit', color: 'rgba(232, 85, 78, 0.7)', borderColor: 'rgba(232, 85, 78, 1)' },
  { code: 'HL', label: 'High Explicit · Low Implicit', color: 'rgba(232, 140, 100, 0.6)', borderColor: 'rgba(232, 140, 100, 0.9)' },
  { code: 'LH', label: 'Low Explicit · High Implicit', color: 'rgba(240, 190, 60, 0.7)', borderColor: 'rgba(240, 190, 60, 1)' },
  { code: 'LL', label: 'Low Explicit · Low Implicit', color: 'rgba(100, 160, 200, 0.5)', borderColor: 'rgba(100, 160, 200, 0.8)' }
]

const quadrantStats = computed(() => {
  if (!props.regionData || !props.regionData.features) return []
  return quadrants.map(q => {
    const feature = props.regionData.features.find(f => f.properties.quadrant_code === q.code)
    return {
      ...q,
      gridCount: feature ? feature.properties.grid_count : 0,
      area: feature ? feature.properties.area_km2 : 0
    }
  })
})

const flattenMultiPolygon = (coordinates) => {
  const polygons = []
  coordinates.forEach(poly => {
    polygons.push(poly[0])
  })
  return polygons
}

const getQuadrantPolygons = () => {
  if (!props.regionData || !props.regionData.features) return []
  const result = []
  props.regionData.features.forEach(feature => {
    const code = feature.properties.quadrant_code
    const quadrant = quadrants.find(q => q.code === code)
    if (!quadrant) return
    const geom = feature.geometry
    let rings = []
    if (geom.type === 'Polygon') {
      rings = [geom.coordinates[0]]
    } else if (geom.type === 'MultiPolygon') {
      rings = flattenMultiPolygon(geom.coordinates)
    }
    rings.forEach(ring => {
      result.push({
        code,
        ring,
        properties: feature.properties,
        color: quadrant.color,
        borderColor: quadrant.borderColor
      })
    })
  })
  return result
}

const updateMap = () => {
  if (!chartInstance || !mapReady.value) return

  const quadrantPolygons = getQuadrantPolygons()
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

  if (quadrantPolygons.length > 0) {
    series.push({
      name: 'Quadrants',
      type: 'custom',
      coordinateSystem: 'geo',
      renderItem: (params, api) => {
        const item = quadrantPolygons[params.dataIndex]
        if (!item) return null
        const pts = item.ring.map(c => api.coord(c))
        const isActive = props.activeQuadrant === item.code
        const isDimmed = props.activeQuadrant && props.activeQuadrant !== item.code
        const opacity = isDimmed ? 0.2 : (isActive ? 1 : 0.8)
        return {
          type: 'polygon',
          shape: { points: pts },
          style: {
            fill: item.color.replace(/[\d.]+\)$/, `${opacity})`),
            stroke: isActive ? item.borderColor : 'rgba(255, 255, 255, 0.15)',
            lineWidth: isActive ? 2 : 0.5
          },
          silent: false
        }
      },
      data: quadrantPolygons.map(p => ({
        value: [p.ring[0][0], p.ring[0][1]],
        code: p.code,
        properties: p.properties
      })),
      zlevel: 2
    })
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
        const data = params.data
        if (data && data.properties) {
          const propsData = data.properties
          return `<strong>${propsData.quadrant_zh || propsData.quadrant_en}</strong><br/>
            <span style="opacity:0.7">Code: ${propsData.quadrant_code}</span><br/>
            Grid Count: ${propsData.grid_count}<br/>
            Area: ${propsData.area_km2} km²`
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

  if (!viewAdjusted.value && props.regionData && !props.disableAutoZoom) {
    adjustViewToData()
  }
}

const computeDataBounds = () => {
  let minLng = Infinity, maxLng = -Infinity
  let minLat = Infinity, maxLat = -Infinity

  const extend = (lng, lat) => {
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  }

  if (props.boundaryCoords && props.boundaryCoords.length > 0) {
    props.boundaryCoords.forEach(c => extend(c[0], c[1]))
  } else if (props.regionData && props.regionData.features) {
    const polys = getQuadrantPolygons()
    polys.forEach(p => {
      p.ring.forEach(c => extend(c[0], c[1]))
    })
  }

  if (minLng === Infinity) return null
  return { minLng, maxLng, minLat, maxLat }
}

const adjustViewToData = () => {
  const bounds = computeDataBounds()
  if (!bounds || !chartInstance) return

  const centerLng = (bounds.minLng + bounds.maxLng) / 2
  const centerLat = (bounds.minLat + bounds.maxLat) / 2
  const lngSpan = bounds.maxLng - bounds.minLng
  const latSpan = bounds.maxLat - bounds.minLat

  const containerWidth = mapChart.value?.clientWidth || 600
  const containerHeight = mapChart.value?.clientHeight || 400
  const zoomLng = Math.log2(360 / lngSpan * containerWidth / 256) - 1
  const zoomLat = Math.log2(180 / latSpan * containerHeight / 256) - 1
  const zoom = Math.min(zoomLng, zoomLat, 3.2)

  chartInstance.setOption({
    geo: {
      center: [centerLng, centerLat],
      zoom: Math.max(zoom, 3.2)
    }
  })

  viewAdjusted.value = true
}

const initMap = () => {
  if (!mapChart.value) return
  chartInstance = echarts.init(mapChart.value)
  chartInstance.on('click', (params) => {
    if (params.seriesName === 'Quadrants' && params.data && params.data.code) {
      emit('quadrant-click', params.data.code)
    }
  })
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

const handleQuadrantToggle = (code) => {
  emit('quadrant-click', code === props.activeQuadrant ? null : code)
}

const handleReset = () => {
  emit('quadrant-click', null)
}

watch(() => props.regionData, () => { if (mapReady.value) updateMap() }, { deep: true })
watch(() => props.activeQuadrant, () => { if (mapReady.value) updateMap() })
watch(() => props.mapBounds, () => { if (mapReady.value) updateMap() }, { deep: true })
watch(() => props.boundaryCoords, () => { if (mapReady.value) updateMap() }, { deep: true })

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
.region-map-container {
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.map-header {
  margin-bottom: 16px;
  flex-shrink: 0;
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
  padding: 4px 10px;
  background: rgba(74, 158, 218, 0.12);
  border: 1px solid rgba(74, 158, 218, 0.4);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #4a9eda;
  letter-spacing: 1px;
  vertical-align: middle;
}

.map-body {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.map-chart {
  flex: 1;
  min-width: 0;
  min-height: 280px;
  border-radius: 8px;
  overflow: hidden;
}

.region-legend {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 14px;
}

.legend-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.legend-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
}

.legend-item.active {
  background: rgba(232, 85, 78, 0.08);
  border-color: rgba(232, 85, 78, 0.4);
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.legend-code {
  font-family: 'Syncopate', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
}

.legend-label {
  font-family: 'Outfit', sans-serif;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.2;
}

.legend-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.legend-footer {
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: center;
}

.map-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.axis-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

.x-label {
  color: rgba(232, 85, 78, 0.6);
}

.y-label {
  color: rgba(74, 158, 218, 0.6);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 1px;
}

.reset-btn:hover {
  background: rgba(232, 85, 78, 0.1);
  border-color: rgba(232, 85, 78, 0.3);
  color: #e8554e;
}

.reset-btn svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 1200px) {
  .map-chart {
    min-height: 280px;
  }
}

@media (max-width: 900px) {
  .map-body {
    flex-direction: column;
  }
  
  .region-legend {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .legend-title {
    width: 100%;
  }
  
  .legend-list {
    flex-direction: row;
    flex-wrap: wrap;
    flex: none;
    width: 100%;
  }
  
  .legend-item {
    flex: 1;
    min-width: 45%;
  }
  
  .legend-footer {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .legend-item {
    min-width: 100%;
  }
}

.no-border {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  backdrop-filter: none;
}
</style>
