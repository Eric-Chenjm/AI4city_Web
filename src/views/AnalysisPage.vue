<template>
  <div class="analysis-page">
    <!-- Decorative background -->
    <div class="bg-grid"></div>
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>

    <!-- Page Header -->
    <header class="page-header">
      <div class="header-top">
        <div class="header-meta">
          <span class="meta-tag">DATA INTELLIGENCE</span>
          <span class="meta-sep">/</span>
          <span class="meta-time">{{ currentTime }}</span>
        </div>
        <h1 class="page-title">SPATIAL DISTRIBUTION ANALYSIS</h1>
        <p class="page-subtitle">Innovation element collection and clustering visualization across central Shanghai</p>
      </div>
    </header>

    <!-- Part 1: Data Source Bar -->
    <section class="stats-section">
      <div class="data-source-bar">
        <IndicatorSelector 
          v-model:activeIndicator="activeIndicator" 
          :indicatorDataCache="indicatorDataCache"
          ref="indicatorSelectorRef"
        />
        <div class="source-divider"></div>
        <div class="source-item">
          <span class="source-dot explicit"></span>
          <span class="source-text"><strong>EXPLICIT</strong> — 15 indicators: land use, density, accessibility, etc.</span>
        </div>
        <div class="source-divider"></div>
        <div class="source-item">
          <span class="source-dot implicit"></span>
          <span class="source-text"><strong>IMPLICIT</strong> — 6 LLM-derived streetscape perception dimensions</span>
        </div>
      </div>
    </section>

    <!-- Part 2: Spatial Distribution -->
    <section class="spatial-section">
      <div class="spatial-layout">
        <!-- Map (70%) -->
        <ShanghaiMap 
          v-model:activeLayer="activeLayer"
          :indicatorDataCache="indicatorDataCache"
          :activeIndicator="activeIndicator"
          :boundaryCoords="boundaryCoords"
          :mapBounds="mapBounds"
          :explicitIndicators="explicitIndicators"
          :implicitIndicators="implicitIndicators"
        />
        
        <!-- Stat List (30%) -->
        <StatList :statistics="statistics" :currentIndicator="currentIndicator" />
      </div>
    </section>

    <!-- Part 3: Training Samples -->
    <SampleGrid 
      :allSamples="allSamples"
      :currentPage="currentPage"
      :pageSize="12"
      @select="openSampleModal"
      @prev="prevPage"
      @next="nextPage"
      @go="goToPage"
    />

    <!-- Sample Modal -->
    <SampleModal 
      :visible="modalVisible" 
      :sample="selectedSample" 
      @close="closeModal" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import IndicatorSelector from '../components/IndicatorSelector.vue'
import ShanghaiMap from '../components/ShanghaiMap.vue'
import StatList from '../components/StatList.vue'
import SampleGrid from '../components/SampleGrid.vue'
import SampleModal from '../components/SampleModal.vue'

// --- Time ---
const currentTime = ref('')
let timeInterval = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { hour12: false })
}

// --- Statistics (computed from indicator data) ---
const statistics = ref([
  { label: 'MEAN VALUE', value: '--', unit: '', color: '#e8554e', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>', spark: '0,18 10,15 20,17 30,10 40,12 50,6 60,4' },
  { label: 'STD DEVIATION', value: '--', unit: '', color: '#e8554e', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/></svg>', spark: '0,12 10,8 20,14 30,6 40,10 50,8 60,5' },
  { label: 'HIGH VALUE', value: '--', unit: '%', color: '#e8554e', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', spark: '0,15 10,14 20,12 30,13 40,9 50,11 60,7' },
  { label: 'LOW VALUE', value: '--', unit: '%', color: '#4a9eda', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>', spark: '0,16 10,13 20,15 30,9 40,11 50,7 60,6' }
])

// --- Map layers ---
const activeLayer = ref('explicit')

// --- Indicators ---
const indicatorSelectorRef = ref(null)

const explicitIndicators = [
  { id: 'shannon_h', name: 'Land Use Diversity', field: 'shannon_h', file: 'shannon_h.geojson', desc: 'Shannon-H entropy', unit: '' },
  { id: 'innovation_ratio', name: 'Innovation Ratio', field: 'Innovation_ratio', file: 'innovation_ratio.geojson', desc: 'Ratio of innovative enterprises', unit: '' },
  { id: 'tech_density', name: 'Tech Enterprise Density', field: 'tech_density', file: 'tech_density.geojson', desc: 'High-tech enterprise density', unit: '/km²' },
  { id: 'poi_density', name: 'POI Density', field: 'poi_density', file: 'poi_density.geojson', desc: 'Point-of-interest density', unit: '/km²' },
  { id: 'road_density', name: 'Road Density', field: 'road_density', file: 'road_density.geojson', desc: 'Road network density', unit: 'km/km²' },
  { id: 'green_ratio', name: 'Green Space Ratio', field: 'green_ratio', file: 'green_ratio.geojson', desc: 'Percentage of green space', unit: '%' },
  { id: 'floor_ratio', name: 'Floor Area Ratio', field: 'floor_ratio', file: 'floor_ratio.geojson', desc: 'Building floor area ratio', unit: '' },
  { id: 'building_height', name: 'Avg Building Height', field: 'building_height', file: 'building_height.geojson', desc: 'Average building height', unit: 'm' },
  { id: 'population', name: 'Population Density', field: 'population', file: 'population.geojson', desc: 'Residential population density', unit: 'p/km²' },
  { id: 'employment', name: 'Employment Density', field: 'employment', file: 'employment.geojson', desc: 'Workforce density', unit: 'p/km²' },
  { id: 'commute_flow', name: 'Commute Flow', field: 'commute_flow', file: 'commute_flow.geojson', desc: 'Daily commuting volume', unit: '' },
  { id: 'night_light', name: 'Night Light Intensity', field: 'night_light', file: 'night_light.geojson', desc: 'Remote sensing night light', unit: 'nW/cm²/sr' },
  { id: 'wifi_coverage', name: 'WiFi Coverage', field: 'wifi_coverage', file: 'wifi_coverage.geojson', desc: 'Public WiFi hotspot coverage', unit: '%' },
  { id: 'traffic_index', name: 'Traffic Index', field: 'traffic_index', file: 'traffic_index.geojson', desc: 'Traffic congestion level', unit: '' },
  { id: 'land_price', name: 'Land Price', field: 'land_price', file: 'land_price.geojson', desc: 'Commercial land value', unit: '¥/m²' }
]

const implicitIndicators = [
  { id: 'creativity', name: 'Creativity', field: 'creativity', file: 'creativity.geojson', desc: 'Creative atmosphere perception', unit: '' },
  { id: 'interaction', name: 'Interaction', field: 'interaction', file: 'interaction.geojson', desc: 'Social interaction density', unit: '' },
  { id: 'integration', name: 'Integration', field: 'integration', file: 'integration.geojson', desc: 'Industry-city integration', unit: '' },
  { id: 'ecology', name: 'Ecology', field: 'ecology', file: 'ecology.geojson', desc: 'Ecological friendliness', unit: '' },
  { id: 'culture', name: 'Culture', field: 'culture', file: 'culture.geojson', desc: 'Cultural identity', unit: '' },
  { id: 'future', name: 'Future', field: 'future', file: 'future.geojson', desc: 'Future-oriented perception', unit: '' }
]

const activeIndicator = ref('shannon_h')
const indicatorDataCache = ref({})

const currentIndicator = computed(() => {
  const explicit = explicitIndicators.find(i => i.id === activeIndicator.value)
  if (explicit) return { ...explicit, type: 'explicit' }
  const implicit = implicitIndicators.find(i => i.id === activeIndicator.value)
  if (implicit) return { ...implicit, type: 'implicit' }
  return null
})

const computeStatistics = () => {
  const indicator = currentIndicator.value
  const cached = indicatorDataCache.value[activeIndicator.value]
  if (!cached || !indicator) return

  const polygons = cached.polygons
  const values = polygons.map(p => p.value)
  const count = values.length
  
  const mean = values.reduce((a, b) => a + b, 0) / count
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count
  const std = Math.sqrt(variance)
  
  const midValue = (cached.min + cached.max) / 2
  const highCount = values.filter(v => v > midValue).length
  const highPercent = ((highCount / count) * 100).toFixed(1)
  
  const lowThreshold = cached.min + (cached.max - cached.min) * 0.25
  const lowCount = values.filter(v => v <= lowThreshold).length
  const lowPercent = ((lowCount / count) * 100).toFixed(1)
  
  const decimals = indicator.unit === '%' || indicator.unit === '' ? 4 : 1

  statistics.value = [
    { label: 'MEAN VALUE', value: mean.toFixed(decimals), unit: indicator.unit, color: '#e8554e', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>', spark: '0,18 10,15 20,17 30,10 40,12 50,6 60,4', desc: `Average ${indicator.name.toLowerCase()} across study area` },
    { label: 'STD DEVIATION', value: std.toFixed(decimals), unit: indicator.unit, color: '#e8554e', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/></svg>', spark: '0,12 10,8 20,14 30,6 40,10 50,8 60,5', desc: 'Spatial variability of the indicator' },
    { label: 'HIGH VALUE', value: highPercent, unit: '%', color: '#e8554e', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', spark: '0,15 10,14 20,12 30,13 40,9 50,11 60,7', desc: `Grids above median (${midValue.toFixed(2)})` },
    { label: 'LOW VALUE', value: lowPercent, unit: '%', color: '#4a9eda', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>', spark: '0,16 10,13 20,15 30,9 40,11 50,7 60,6', desc: `Grids below 25th percentile (${lowThreshold.toFixed(2)})` }
  ]
}

const loadIndicatorData = async (indicatorId) => {
  if (indicatorDataCache.value[indicatorId]) return
  
  const indicator = explicitIndicators.find(i => i.id === indicatorId) || implicitIndicators.find(i => i.id === indicatorId)
  if (!indicator) return
  
  try {
    const res = await fetch(`/data/${indicator.file}`)
    const geojson = await res.json()
    const polygons = []
    let minVal = Infinity, maxVal = -Infinity
    
    geojson.features.forEach(feat => {
      const val = parseFloat(feat.properties[indicator.field])
      if (isNaN(val) || val <= 0) return
      if (val < minVal) minVal = val
      if (val > maxVal) maxVal = val
      
      const geom = feat.geometry
      if (geom.type === 'Polygon') {
        polygons.push({ coords: geom.coordinates[0], value: val })
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach(poly => {
          polygons.push({ coords: poly[0], value: val })
        })
      }
    })
    
    indicatorDataCache.value[indicatorId] = { polygons, min: minVal, max: maxVal }
  } catch (err) {
    indicatorDataCache.value[indicatorId] = generateMockIndicatorData(indicatorId)
  }
  
  computeStatistics()
}

const generateMockIndicatorData = (indicatorId) => {
  const polygons = []
  const baseCoords = [121.458, 31.199]
  const gridSize = 0.008
  const gridCount = 30
  
  for (let i = -gridCount/2; i < gridCount/2; i++) {
    for (let j = -gridCount/2; j < gridCount/2; j++) {
      const lng = baseCoords[0] + i * gridSize
      const lat = baseCoords[1] + j * gridSize
      const distFromCenter = Math.sqrt(i*i + j*j) / (gridCount/2)
      const noise = (Math.random() - 0.5) * 0.3
      let val
      
      if (indicatorId.includes('density')) {
        val = Math.max(0.1, 50 * Math.exp(-distFromCenter * 2) + noise * 20)
      } else if (indicatorId.includes('ratio') || indicatorId.includes('index')) {
        val = Math.max(0.05, 0.8 * Math.exp(-distFromCenter * 1.5) + noise * 0.2)
      } else {
        val = Math.max(0.05, 0.7 * Math.exp(-distFromCenter * 1.8) + noise * 0.2)
      }
      
      const coords = [
        [lng, lat], [lng + gridSize * 0.8, lat], [lng + gridSize * 0.8, lat + gridSize * 0.8], [lng, lat + gridSize * 0.8], [lng, lat]
      ]
      polygons.push({ coords, value: val })
    }
  }
  
  return { polygons, min: Math.min(...polygons.map(p => p.value)), max: Math.max(...polygons.map(p => p.value)) }
}

watch(activeIndicator, (newId) => {
  loadIndicatorData(newId)
})

// --- Study area boundary ---
const boundaryCoords = ref([])
const mapBounds = ref({ center: [121.458, 31.199], zoom: 3.2,  span: 0.2 })

const computeBounds = (geojson) => {
  let allCoords = []
  geojson.features.forEach(feat => {
    const geom = feat.geometry
    if (geom.type === 'Polygon') {
      geom.coordinates.forEach(ring => allCoords.push(...ring))
      boundaryCoords.value = geom.coordinates[0]
    } else if (geom.type === 'MultiPolygon') {
      let largest = []
      geom.coordinates.forEach(poly => {
        if (poly[0].length > largest.length) largest = poly[0]
        allCoords.push(...poly[0])
      })
      boundaryCoords.value = largest
    }
  })
  if (allCoords.length === 0) return
  let lngMin = Infinity, lngMax = -Infinity, latMin = Infinity, latMax = -Infinity
  allCoords.forEach(([lng, lat]) => {
    if (lng < lngMin) lngMin = lng
    if (lng > lngMax) lngMax = lng
    if (lat < latMin) latMin = lat
    if (lat > latMax) latMax = lat
  })
  const center = [(lngMin + lngMax) / 2, (latMin + latMax) / 2]
  const maxSpan = Math.max(lngMax - lngMin, latMax - latMin)
  mapBounds.value = { ...mapBounds.value, center, span: maxSpan }
}

// --- Samples ---
const tagNames = ['Creativity', 'Interaction', 'Integration', 'Ecology', 'Culture', 'Future']
const locations = ['Lujiazui', 'Xintiandi', 'North Bund', 'West Bund', 'M50 District', 'Zhangjiang', 'Hongqiao', 'Jingan', 'Xuhui', 'Yangpu', 'Pudong', 'Putuo']
const stylePrompts = [
  'urban%20street%20with%20modern%20buildings', 'old%20industrial%20area%20with%20brick%20walls', 'riverside%20promenade%20with%20trees',
  'tech%20park%20with%20glass%20facades', 'cultural%20district%20with%20art%20galleries', 'residential%20street%20with%20shops',
  'creative%20hub%20with%20colorful%20murals', 'waterfront%20with%20modern%20architecture'
]

const allSamples = ref(Array.from({ length: 48 }, (_, i) => {
  const tagCount = 2 + Math.floor(Math.random() * 3)
  const shuffled = [...tagNames].sort(() => Math.random() - 0.5)
  return {
    id: i + 1,
    location: locations[i % locations.length],
    image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${stylePrompts[i % stylePrompts.length]}&image_size=square`,
    tags: tagNames.map(name => ({ name: name.toUpperCase().slice(0, 4), active: shuffled.includes(name) })).slice(0, tagCount + 1),
    scores: {
      Creativity: 40 + Math.floor(Math.random() * 55),
      Interaction: 35 + Math.floor(Math.random() * 55),
      Integration: 45 + Math.floor(Math.random() * 50),
      Ecology: 30 + Math.floor(Math.random() * 60),
      Culture: 25 + Math.floor(Math.random() * 65),
      Future: 38 + Math.floor(Math.random() * 55)
    }
  }
}))

const currentPage = ref(1)

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  const total = Math.ceil(allSamples.value.length / 12)
  if (currentPage.value < total) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}

// --- Modal ---
const modalVisible = ref(false)
const selectedSample = ref({})

const openSampleModal = (sample) => {
  selectedSample.value = sample
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
}

// --- Lifecycle ---
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)

  fetch('/data/boudanry.geojson')
    .then(r => r.json())
    .then(boundaryJson => {
      computeBounds(boundaryJson)
      loadIndicatorData('shannon_h')
    })
    .catch(() => {
      loadIndicatorData('shannon_h')
    })
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@300;400;500;600;700&display=swap');

.analysis-page {
  --bg-primary: #0a1628;
  --bg-card: rgba(15, 28, 48, 0.6);
  --border: rgba(255, 255, 255, 0.08);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.4);
  --crimson: #e8554e;
  --crimson-dim: rgba(232, 85, 78, 0.3);
  --blue: #4a9eda;
  --blue-dim: rgba(74, 158, 218, 0.3);
  --font-display: 'Syncopate', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Outfit', sans-serif;
  
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 80px 40px;
  position: relative;
  overflow-x: hidden;
}

.bg-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.bg-glow {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(80px);
}

.glow-1 {
  top: -10%;
  left: -5%;
  background: radial-gradient(circle, rgba(232, 85, 78, 0.06), transparent 70%);
}

.glow-2 {
  bottom: -10%;
  right: -5%;
  background: radial-gradient(circle, rgba(74, 158, 218, 0.06), transparent 70%);
}

.page-header {
  position: relative;
  z-index: 1;
  margin-bottom: 40px;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 2px;
}

.meta-tag {
  color: #e8554e;
}

.meta-sep {
  color: rgba(255, 255, 255, 0.2);
}

.page-title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 4px;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

.stats-section {
  position: relative;
  z-index: 10;
  margin-bottom: 32px;
}

.data-source-bar {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  backdrop-filter: blur(10px);
  flex-wrap: wrap;
}

.source-item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.source-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.source-dot.explicit { background: var(--crimson); box-shadow: 0 0 8px var(--crimson-dim); }
.source-dot.implicit { background: var(--blue); box-shadow: 0 0 8px var(--blue-dim); }

.source-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.source-text strong {
  color: var(--text-primary);
  font-family: var(--font-mono);
  letter-spacing: 1px;
}

.source-divider {
  width: 1px;
  height: 24px;
  background: var(--border);
}

.spatial-section {
  position: relative;
  z-index: 1;
  margin-bottom: 32px;
}

.spatial-layout {
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 16px;
}

@media (max-width: 1200px) {
  .spatial-layout { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .analysis-page { padding: 80px 20px; }
  .page-title { font-size: 24px; }
  .data-source-bar { flex-direction: column; align-items: flex-start; }
  .source-divider { width: 100%; height: 1px; }
}
</style>