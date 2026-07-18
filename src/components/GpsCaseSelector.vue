<template>
  <div class="gps-case-selector border-card">
    <div class="row-header">
      <span class="row-index">02</span>
      <h2 class="row-title">{{ t('row02Title') }}</h2>
    </div>

    <div class="case-grid">
      <!-- 1. MapLibre 空白深色点位可视化 -->
      <div class="map-wrapper-box">
        <h4 class="card-header-tag">SPATIAL GPS SITES</h4>
        <div id="gps-map-container" class="map-container"></div>
        <div class="map-legend">
          <span class="map-dot"></span>
          <span class="map-legend-txt">{{ t('gpsSiteLegend') }}</span>
        </div>
      </div>

      <!-- 2. 四大空间类型案例列表 -->
      <div class="case-list-box">
        <h4 class="card-header-tag">SPACE TYPE CATEGORIES</h4>
        
        <div class="space-categories">
          <!-- 滨水空间 -->
          <div class="space-category-block">
            <h5 class="cat-header"><span class="cat-icon waterfront"></span>{{ t('waterfront') }}</h5>
            <div class="cat-list">
              <div 
                v-for="c in waterfrontCases" 
                :key="c.case_id" 
                class="case-inline-card"
                :class="{ active: activeCaseId === c.case_id }"
                @click="onSelectCase(c)"
              >
                <div class="case-card-title">{{ c.case_name }}</div>
                <div class="case-card-gps monospace">GPS: {{ c.gps.lat.toFixed(5) }}, {{ c.gps.lng.toFixed(5) }}</div>
              </div>
            </div>
          </div>

          <!-- 公共空间 -->
          <div class="space-category-block">
            <h5 class="cat-header"><span class="cat-icon public"></span>{{ t('publicSpace') }}</h5>
            <div class="cat-list">
              <div 
                v-for="c in publicCases" 
                :key="c.case_id" 
                class="case-inline-card"
                :class="{ active: activeCaseId === c.case_id }"
                @click="onSelectCase(c)"
              >
                <div class="case-card-title">{{ c.case_name }}</div>
                <div class="case-card-gps monospace">GPS: {{ c.gps.lat.toFixed(5) }}, {{ c.gps.lng.toFixed(5) }}</div>
              </div>
            </div>
          </div>

          <!-- 景观/工业遗存 -->
          <div class="space-category-block">
            <h5 class="cat-header"><span class="cat-icon heritage"></span>{{ t('heritage') }}</h5>
            <div class="cat-list">
              <div 
                v-for="c in heritageCases" 
                :key="c.case_id" 
                class="case-inline-card"
                :class="{ active: activeCaseId === c.case_id }"
                @click="onSelectCase(c)"
              >
                <div class="case-card-title">{{ c.case_name }}</div>
                <div class="case-card-gps monospace">GPS: {{ c.gps.lat.toFixed(5) }}, {{ c.gps.lng.toFixed(5) }}</div>
              </div>
            </div>
          </div>

          <!-- 临时构筑 -->
          <div class="space-category-block">
            <h5 class="cat-header"><span class="cat-icon temporary"></span>{{ t('temporary') }}</h5>
            <div class="cat-list">
              <div 
                v-for="c in temporaryCases" 
                :key="c.case_id" 
                class="case-inline-card"
                :class="{ active: activeCaseId === c.case_id }"
                @click="onSelectCase(c)"
              >
                <div class="case-card-title">{{ c.case_name }}</div>
                <div class="case-card-gps monospace">GPS: {{ c.gps.lat.toFixed(5) }}, {{ c.gps.lng.toFixed(5) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useLang } from '../composables/useLang.js'

const { t, currentLang } = useLang()

const props = defineProps({
  cases: {
    type: Array,
    default: () => []
  },
  activeCaseId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select-case'])

let map = null

// 分类计算属性
const waterfrontCases = computed(() => props.cases.filter(c => c.type === 'waterfront'))
const publicCases = computed(() => props.cases.filter(c => c.type === 'public'))
const heritageCases = computed(() => props.cases.filter(c => c.type === 'heritage'))
const temporaryCases = computed(() => props.cases.filter(c => c.type === 'temporary'))

const onSelectCase = (c) => {
  emit('select-case', c.case_id)
  
  if (map && c.gps) {
    map.flyTo({
      center: [c.gps.lng, c.gps.lat],
      zoom: 16,
      essential: true
    })
  }
}

// 初始化地图
const initMap = () => {
  // 构建空白深色底图 Style，不加载任何瓦片
  const blankStyle = {
    version: 8,
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#050811'
        }
      }
    ]
  }

  // 计算这 8 个点的中心点
  let centerLng = 121.5577
  let centerLat = 31.285
  if (props.cases.length > 0) {
    const lngs = props.cases.map(c => c.gps.lng)
    const lats = props.cases.map(c => c.gps.lat)
    centerLng = lngs.reduce((a, b) => a + b, 0) / props.cases.length
    centerLat = lats.reduce((a, b) => a + b, 0) / props.cases.length
  }

  map = new maplibregl.Map({
    container: 'gps-map-container',
    style: blankStyle,
    center: [centerLng, centerLat],
    zoom: 14.5,
    minZoom: 12,
    maxZoom: 18,
    attributionControl: false
  })

  map.on('load', () => {
    // 组装 GeoJSON
    const geojsonData = {
      type: 'FeatureCollection',
      features: props.cases.map(c => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [c.gps.lng, c.gps.lat]
        },
        properties: {
          case_id: c.case_id,
          case_name: c.case_name,
          type_zh: c.type_zh,
          type: c.type
        }
      }))
    }

    // 添加数据源，支持聚类 (cluster)
    map.addSource('cases-source', {
      type: 'geojson',
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    })

    // 1. 聚类簇渲染 (Cluster Circles)
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'cases-source',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          'rgba(123, 97, 255, 0.4)',
          3,
          'rgba(54, 200, 255, 0.4)'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          3,
          28
        ],
        'circle-stroke-width': 1.5,
        'circle-stroke-color': 'rgba(123, 97, 255, 0.7)'
      }
    })

    // 2. 聚类数量文字
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'cases-source',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12
      },
      paint: {
        'text-color': '#ffffff'
      }
    })

    // 3. 非聚类独立案例点 (底色发光环)
    map.addLayer({
      id: 'unclustered-point-glow',
      type: 'circle',
      source: 'cases-source',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': 'rgba(123, 97, 255, 0.25)',
        'circle-radius': 14,
        'circle-blur': 0.6
      }
    })

    // 4. 非聚类独立案例点 (中心实点)
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'cases-source',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'type'],
          'waterfront', '#60a5fa',
          'public', '#4ade80',
          'heritage', '#f472b6',
          'temporary', '#fb923c',
          '#7b61ff'
        ],
        'circle-radius': 7,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#ffffff'
      }
    })

    // 交互：点击聚合点进行缩放
    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
      const clusterId = features[0].properties.cluster_id
      map.getSource('cases-source').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom + 0.5
        })
      })
    })

    // 交互：点击独立地点选择案例
    map.on('click', 'unclustered-point', (e) => {
      const featProps = e.features[0].properties
      const caseId = featProps.case_id
      const matchedCase = geojsonData.features.find(f => f.properties.case_id === caseId)
      
      // 发射选中事件
      emit('select-case', caseId)

      // 显示Popup气泡
      const coordinates = e.features[0].geometry.coordinates.slice()
      const labelType = currentLang.value === 'en' ? 'Type' : '类型'
      const valType = currentLang.value === 'en' ? featProps.type : featProps.type_zh
      new maplibregl.Popup({ closeButton: false, className: 'map-tech-popup' })
        .setLngLat(coordinates)
        .setHTML(`
          <div style="font-family:'Outfit',sans-serif;font-size:11.5px;color:#fff;padding:4px;">
            <strong style="color:#7b61ff;">${featProps.case_name}</strong><br/>
            ${labelType}: <span style="color:#aab8ff;">${valType}</span>
          </div>
        `)
        .addTo(map)
    })

    // 悬浮手势切换
    map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer' })
    map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = '' })
    map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer' })
    map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = '' })
  })
}

// 观察外部激活事件进行联动
watch(() => props.activeCaseId, (newId) => {
  if (newId && map) {
    const c = props.cases.find(item => item.case_id === newId)
    if (c && c.gps) {
      map.flyTo({
        center: [c.gps.lng, c.gps.lat],
        zoom: 16,
        essential: true
      })
    }
  }
})

onMounted(() => {
  // 确保 DOM 渲染完后初始化 MapLibre
  setTimeout(initMap, 200)
})
</script>

<style scoped>
.gps-case-selector {
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

.case-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 20px;
}

.card-header-tag {
  font-family: 'Syncopate', sans-serif;
  font-size: 9px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 12px;
}

/* 地图容器 */
.map-wrapper-box {
  display: flex;
  flex-direction: column;
}

.map-container {
  width: 100%;
  height: 380px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  background: #050811;
}

.map-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.map-dot {
  width: 8px;
  height: 8px;
  background: #7b61ff;
  border-radius: 50%;
  box-shadow: 0 0 6px #7b61ff;
}

.map-legend-txt {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
}

/* 列表展示 */
.case-list-box {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.space-categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 380px;
  overflow-y: auto;
  padding-right: 6px;
}

/* 美化滚动条 */
.space-categories::-webkit-scrollbar {
  width: 4px;
}
.space-categories::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}

.space-category-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cat-header {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 4px 0;
  text-transform: uppercase;
}

.cat-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.cat-icon.waterfront { background: #60a5fa; }
.cat-icon.public { background: #4ade80; }
.cat-icon.heritage { background: #f472b6; }
.cat-icon.temporary { background: #fb923c; }

.cat-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.case-inline-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.case-inline-card:hover {
  background: rgba(123, 97, 255, 0.04);
  border-color: rgba(123, 97, 255, 0.25);
}

.case-inline-card.active {
  background: rgba(123, 97, 255, 0.12);
  border-color: #7b61ff;
  box-shadow: inset 0 0 8px rgba(123, 97, 255, 0.15);
}

.case-card-title {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.case-card-gps {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 4px;
}

.case-inline-card.active .case-card-gps {
  color: rgba(123, 97, 255, 0.7);
}

@media (max-width: 1024px) {
  .case-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* 地图 Popup 样式强制覆盖 */
.maplibregl-popup.map-tech-popup .maplibregl-popup-content {
  background: rgba(10, 22, 40, 0.95) !important;
  border: 1px solid rgba(123, 97, 255, 0.3) !important;
  box-shadow: 0 0 10px rgba(123, 97, 255, 0.2) !important;
  border-radius: 6px !important;
}

.maplibregl-popup.map-tech-popup .maplibregl-popup-tip {
  border-top-color: rgba(10, 22, 40, 0.95) !important;
}
</style>
