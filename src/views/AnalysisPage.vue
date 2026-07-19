<template>
  <div class="analysis-page">
    <!-- Section Nav -->
    <nav class="section-nav">
      <div class="nav-brand">
        <span class="brand-tag">{{ t('anaNavBrand') }}</span>
      </div>
      <div class="nav-dots">
        <button
          v-for="(section, i) in sections"
          :key="i"
          class="nav-dot"
          :class="{ active: activeSection === i }"
          @click="scrollToSection(i)"
        >
          <span class="dot-marker"></span>
          <span class="dot-label">{{ section.label }}</span>
        </button>
      </div>
      <div class="nav-progress-bar">
        <div class="nav-progress-fill" :style="{ width: scrollProgress + '%' }"></div>
      </div>
    </nav>

    <!-- Decorative background -->
    <div class="bg-grid"></div>
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>

    <!-- Page Header -->
    <header class="page-header">
      <div class="header-top">
        <div class="header-meta">
          <span class="meta-tag">{{ t('dataIntelligence') }}</span>
          <span class="meta-sep">/</span>
          <span class="meta-time">{{ currentTime }}</span>
        </div>
        <h1 class="page-title">{{ t('spatialTitle') }}</h1>
        <p class="page-subtitle">{{ t('spatialSubtitle') }}</p>
      </div>
    </header>

    <!-- Part 1: Data Source Bar -->
    <section class="stats-section" ref="sectionOverview">
      <div class="data-source-bar">
        <IndicatorSelector 
          v-model:activeIndicator="activeIndicator" 
          :indicatorDataCache="indicatorDataCache"
          ref="indicatorSelectorRef"
        />
        <div class="source-divider"></div>
        <div class="source-item">
          <span class="source-dot explicit"></span>
          <span class="source-text">{{ t('explicitSource') }}</span>
        </div>
        <div class="source-divider"></div>
        <div class="source-item">
          <span class="source-dot implicit"></span>
          <span class="source-text">{{ t('implicitSource') }}</span>
        </div>
      </div>
    </section>

    <!-- Part 2: Spatial Distribution -->
    <section class="spatial-section" ref="sectionSpatial">
      <div class="spatial-layout">
        <!-- Map (Left) -->
        <ShanghaiMap 
          v-model:activeLayer="activeLayer"
          :indicatorDataCache="indicatorDataCache"
          :activeIndicator="activeIndicator"
          :boundaryCoords="boundaryCoords"
          :mapBounds="mapBounds"
          :explicitIndicators="explicitIndicators"
          :implicitIndicators="implicitIndicators"
        />
        
        <!-- Right Panel: Stat List -->
        <StatList :statistics="statistics" :currentIndicator="currentIndicator" />
      </div>
    </section>

    <!-- Part 2.5: Indicator Chart Analysis -->
    <section class="chart-section" ref="sectionCharts">
      <IndicatorCharts
        :indicatorDataCache="indicatorDataCache"
        :activeIndicator="activeIndicator"
        :currentIndicator="currentIndicator"
        :explicitIndicators="explicitIndicators"
        :implicitIndicators="implicitIndicators"
      />
    </section>

    <!-- Part 2.6: Technical Pipeline -->
    <section class="pipeline-section" ref="sectionPipeline">
      <h1 class="page-title pipeline-title">{{ t('pipelineTitle') }}</h1>
      <PipelineFlow />
    </section>

    <!-- Part 3: Region + Samples (Integrated Layout) -->
    <section class="region-samples-section" ref="sectionRegions">
      <div class="region-samples-card">
        <div class="card-header">
          <div class="card-title-group">
            <span class="section-tag">{{ t('spatialAnalysisTag') }}</span>
            <h2 class="section-title">{{ t('quadrantTitle') }}</h2>
          </div>
        </div>
        <div class="card-body">
          <div class="region-col">
            <div class="col-header">
              <span class="col-label">{{ t('quadrantMap') }}</span>
              <span class="col-badge">{{ t('explicitImplicit') }}</span>
            </div>
            <RegionMap
              :regionData="regionData"
              :activeQuadrant="activeQuadrant"
              :boundaryCoords="boundaryCoords"
              :mapBounds="mapBounds"
              :bordered="false"
              @quadrant-click="handleQuadrantClick"
            />
          </div>
          <div class="divider"></div>
          <div class="samples-col">
            <div class="col-header">
              <span class="col-label">{{ activeQuadrant ? t('trainingDataSamples') : t('regionStatistics') }}</span>
              <span class="col-count">{{ filteredSamples.length }} {{ activeQuadrant ? t('samplesBadge') : t('totalBadge') }}</span>
            </div>
            <SampleStats
              v-if="!activeQuadrant"
              :samples="allSamples"
              :regionData="regionData"
              :activeQuadrant="activeQuadrant"
              :bordered="false"
              @quadrant-click="handleQuadrantClick"
            />
            <SampleGrid
              v-else
              :allSamples="filteredSamples"
              :bordered="false"
              @select="openSampleModal"
            />
          </div>
        </div>
      </div>
    </section>

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
import { useI18n } from 'vue-i18n'
import IndicatorSelector from '../components/IndicatorSelector.vue'
import ShanghaiMap from '../components/ShanghaiMap.vue'
import IndicatorCharts from '../components/IndicatorCharts.vue'
import StatList from '../components/StatList.vue'
import SampleGrid from '../components/SampleGrid.vue'
import SampleModal from '../components/SampleModal.vue'
import SampleStats from '../components/SampleStats.vue'
import RegionMap from '../components/RegionMap.vue'
import PipelineFlow from '../components/PipelineFlow.vue'
import { transformGeoJson } from '../utils/coordTransform'
import { useLang } from '../composables/useLang.js'

const { t, currentLang } = useLang()

// --- Section Nav ---
const sectionOverview = ref(null)
const sectionSpatial = ref(null)
const sectionCharts = ref(null)
const sectionPipeline = ref(null)
const sectionRegions = ref(null)

const activeSection = ref(0)
const scrollProgress = ref(0)

const sections = computed(() => [
  { label: t('anaNavOverview') },
  { label: t('anaNavSpatial') },
  { label: t('anaNavCharts') },
  { label: t('anaNavPipeline') },
  { label: t('anaNavRegions') }
])

const scrollToSection = (index) => {
  const refs = [sectionOverview, sectionSpatial, sectionCharts, sectionPipeline, sectionRegions]
  refs[index]?.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const handlePageScroll = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0

  const refs = [sectionOverview, sectionSpatial, sectionCharts, sectionPipeline, sectionRegions]
  for (let i = refs.length - 1; i >= 0; i--) {
    const el = refs[i]?.value
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= 160) {
      activeSection.value = i
      break
    }
  }
}


// --- Time ---
const currentTime = ref('')
let timeInterval = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { hour12: false })
}

// --- Statistics (computed from indicator data) ---
const statistics = ref([
  { label: 'MEAN VALUE', value: '--', unit: '', color: '#E8D48B', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>', spark: '0,18 10,15 20,17 30,10 40,12 50,6 60,4' },
  { label: 'STD DEVIATION', value: '--', unit: '', color: '#E8D48B', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/></svg>', spark: '0,12 10,8 20,14 30,6 40,10 50,8 60,5' },
  { label: 'HIGH VALUE', value: '--', unit: '%', color: '#E8D48B', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', spark: '0,15 10,14 20,12 30,13 40,9 50,11 60,7' },
  { label: 'LOW VALUE', value: '--', unit: '%', color: '#F0E0A8', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>', spark: '0,16 10,13 20,15 30,9 40,11 50,7 60,6' }
])

// --- Map layers ---
const activeLayer = ref('explicit')

// --- Indicators ---
const indicatorSelectorRef = ref(null)

const explicitIndicators = [
  { id: 'x1_bldg_density', name: 'Building Density', field: 'x1_bldg_density', file: 'explicit/x1_bldg_density.geojson', desc: 'Ratio of building area to total area', unit: '%', type: 'explicit' },
  { id: 'x1_avg_height_m', name: 'Avg Building Height', field: 'x1_avg_height_m', file: 'explicit/x1_avg_height_m.geojson', desc: 'Average building height', unit: 'm', type: 'explicit' },
  { id: 'x1_cafe_count', name: 'Cafe Count', field: 'x1_cafe_count', file: 'explicit/x1_cafe_count.geojson', desc: 'Number of cafes', unit: '', type: 'explicit' },
  { id: 'x1_consumer_nearest_m', name: 'Consumer Nearest', field: 'x1_consumer_nearest_m', file: 'explicit/x1_consumer_nearest_m.geojson', desc: 'Distance to nearest consumer facility', unit: 'm', type: 'explicit' },
  { id: 'x1_cultural_nearest_m', name: 'Cultural Nearest', field: 'x1_cultural_nearest_m', file: 'explicit/x1_cultural_nearest_m.geojson', desc: 'Distance to nearest cultural facility', unit: 'm', type: 'explicit' },
  { id: 'x1_far_proxy', name: 'FAR Proxy', field: 'x1_far_proxy', file: 'explicit/x1_far_proxy.geojson', desc: 'Floor area ratio proxy', unit: '', type: 'explicit' },
  { id: 'x1_gdp_grid_value', name: 'GDP Grid Value', field: 'x1_gdp_grid_value', file: 'explicit/x1_gdp_grid_value.geojson', desc: 'GDP per grid cell', unit: '', type: 'explicit' },
  { id: 'x1_hightech_count', name: 'High-tech Count', field: 'x1_hightech_count', file: 'explicit/x1_hightech_count.geojson', desc: 'Number of high-tech enterprises', unit: '', type: 'explicit' },
  { id: 'x1_house_price_mean', name: 'House Price Mean', field: 'x1_house_price_mean', file: 'explicit/x1_house_price_mean.geojson', desc: 'Average house price', unit: '', type: 'explicit' },
  { id: 'x1_infra_nearest_m', name: 'Infrastructure Nearest', field: 'x1_infra_nearest_m', file: 'explicit/x1_infra_nearest_m.geojson', desc: 'Distance to nearest infrastructure', unit: 'm', type: 'explicit' },
  { id: 'x1_innov_land_share', name: 'Innovation Land Share', field: 'x1_innov_land_share', file: 'explicit/x1_innov_land_share.geojson', desc: 'Share of innovation land use', unit: '%', type: 'explicit' },
  { id: 'x1_landuse_shannon', name: 'Land Use Shannon', field: 'x1_landuse_shannon', file: 'explicit/x1_landuse_shannon.geojson', desc: 'Land use diversity index', unit: '', type: 'explicit' },
  { id: 'x1_metro_nearest_m', name: 'Metro Nearest', field: 'x1_metro_nearest_m', file: 'explicit/x1_metro_nearest_m.geojson', desc: 'Distance to nearest metro station', unit: 'm', type: 'explicit' },
  { id: 'x1_natural_nearest_m', name: 'Natural Nearest', field: 'x1_natural_nearest_m', file: 'explicit/x1_natural_nearest_m.geojson', desc: 'Distance to nearest natural space', unit: 'm', type: 'explicit' },
  { id: 'x1_social_nearest_m', name: 'Social Nearest', field: 'x1_social_nearest_m', file: 'explicit/x1_social_nearest_m.geojson', desc: 'Distance to nearest social facility', unit: 'm', type: 'explicit' }
]

const implicitIndicators = [
  { id: 'x2_questionnaire_identity', name: 'Identity', field: 'x2_questionnaire_identity', file: 'implicit/x2_questionnaire_identity.geojson', desc: 'Sense of place identity', unit: '', type: 'implicit' },
  { id: 'x2_questionnaire_innovation_atmos', name: 'Innovation Atmosphere', field: 'x2_questionnaire_innovation_atmos', file: 'implicit/x2_questionnaire_innovation_atmos.geojson', desc: 'Perceived innovation atmosphere', unit: '', type: 'implicit' },
  { id: 'x2_questionnaire_spatial_image', name: 'Spatial Image', field: 'x2_questionnaire_spatial_image', file: 'implicit/x2_questionnaire_spatial_image.geojson', desc: 'Spatial image perception', unit: '', type: 'implicit' },
  { id: 'x2_questionnaire_tech_influence', name: 'Tech Influence', field: 'x2_questionnaire_tech_influence', file: 'implicit/x2_questionnaire_tech_influence.geojson', desc: 'Technology influence perception', unit: '', type: 'implicit' },
  { id: 'x2_questionnaire_work_efficiency', name: 'Workplace Efficiency', field: 'x2_questionnaire_work_efficiency', file: 'implicit/x2_questionnaire_work_efficiency.geojson', desc: 'Perceived work efficiency', unit: '', type: 'implicit' },
  { id: 'x2_questionnaire_work_wellbeing', name: 'Workplace Wellbeing', field: 'x2_questionnaire_work_wellbeing', file: 'implicit/x2_questionnaire_work_wellbeing.geojson', desc: 'Work wellbeing perception', unit: '', type: 'implicit' }
]

const activeIndicator = ref('x1_bldg_density')
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
    { 
      label: 'MEAN VALUE', 
      value: mean.toFixed(decimals), 
      unit: indicator.unit, 
      color: '#E8D48B', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>', 
      spark: '0,18 10,15 20,17 30,10 40,12 50,6 60,4',
      desc: currentLang.value === 'en' 
        ? `Average ${t(indicator.name).toLowerCase()} across study area` 
        : `研究区域内 ${t(indicator.name)} 的空间平均水平`
    },
    { 
      label: 'STD DEVIATION', 
      value: std.toFixed(decimals), 
      unit: indicator.unit, 
      color: '#E8D48B', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/></svg>', 
      spark: '0,12 10,8 20,14 30,6 40,10 50,8 60,5',
      desc: currentLang.value === 'en'
        ? 'Spatial variability of the indicator'
        : '表明该指标在空间分布上的离散变异程度'
    },
    { 
      label: 'HIGH VALUE', 
      value: highPercent, 
      unit: '%', 
      color: '#E8D48B', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', 
      spark: '0,15 10,14 20,12 30,13 40,9 50,11 60,7',
      desc: currentLang.value === 'en'
        ? `Grids above median (${midValue.toFixed(2)})`
        : `高于区域中位数 (${midValue.toFixed(2)}) 的空间格网所占百分比`
    },
    { 
      label: 'LOW VALUE', 
      value: lowPercent, 
      unit: '%', 
      color: '#F0E0A8', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>', 
      spark: '0,16 10,13 20,15 30,9 40,11 50,7 60,6',
      desc: currentLang.value === 'en'
        ? `Grids below 25th percentile (${lowThreshold.toFixed(2)})`
        : `低于区域25%分位数 (${lowThreshold.toFixed(2)}) 的低值格网百分比`
    }
  ]
}

const loadIndicatorData = async (indicatorId) => {
  if (indicatorDataCache.value[indicatorId]) return
  
  const indicator = explicitIndicators.find(i => i.id === indicatorId) || implicitIndicators.find(i => i.id === indicatorId)
  if (!indicator) return
  
  try {
    const res = await fetch(`/data/${indicator.file}`)
    const geojson = await res.json()
    const transformedGeojson = transformGeoJson(geojson)
    const polygons = []
    let minVal = Infinity, maxVal = -Infinity
    
    transformedGeojson.features.forEach(feat => {
      const val = parseFloat(feat.properties[indicator.field])
      if (isNaN(val)) return
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
    console.warn('Failed to load indicator data:', indicatorId, err)
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

watch(currentLang, () => {
  computeStatistics()
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

// --- Region Data ---
const regionData = ref(null)
const activeQuadrant = ref(null)

const loadRegionData = async () => {
  try {
    const res = await fetch('/data/region/maincity_four_quadrant_regions.geojson')
    regionData.value = await res.json()
  } catch (err) {
    console.warn('Failed to load region data:', err)
  }
}

const handleQuadrantClick = (quadrantCode) => {
  activeQuadrant.value = activeQuadrant.value === quadrantCode ? null : quadrantCode
}

// --- Samples ---
const allSamples = ref([])

const loadSampleData = async () => {
  try {
    const res = await fetch('/pictures/sampled.geojson')
    const geojson = await res.json()
    allSamples.value = geojson.features.map((f, i) => {
      const props = f.properties
      return {
        id: i,
        image_id: props.image_id,
        image: `/pictures/sampled_images/${props.image_id}`,
        location: `${props.x}, ${props.y}`,
        x: parseFloat(props.x),
        y: parseFloat(props.y),
        region: props.quadrant_code,
        scores: {
          'Identity': Math.round(props['Identity'] * 100),
          'Innovation Atmosphere': Math.round(props['Innovation Atmosphere'] * 100),
          'Spatial Image': Math.round(props['Spatial Image'] * 100),
          'Tech Influence': Math.round(props['Tech Influence'] * 100),
          'Workplace Efficiency': Math.round(props['Workplace Efficiency'] * 100),
          'Workplace Wellbeing': Math.round(props['Workplace Wellbeing'] * 100)
        }
      }
    })
  } catch (err) {
    console.warn('Failed to load sample data:', err)
  }
}

const filteredSamples = computed(() => {
  if (!activeQuadrant.value) return allSamples.value
  return allSamples.value.filter(s => s.region === activeQuadrant.value)
})

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
  window.addEventListener('scroll', handlePageScroll)

  updateTime()
  timeInterval = setInterval(updateTime, 1000)

  fetch('/data/boudanry.geojson')
    .then(r => r.json())
    .then(boundaryJson => {
      computeBounds(boundaryJson)
      loadIndicatorData('x1_bldg_density')
    })
    .catch(() => {
      loadIndicatorData('x1_bldg_density')
    })

  loadRegionData()
  loadSampleData()

  window.addEventListener('scroll', handlePageScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handlePageScroll)
  if (timeInterval) clearInterval(timeInterval)
  window.removeEventListener('scroll', handlePageScroll)
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
  --crimson: #005BAC;
  --crimson-dim: rgba(0, 91, 172, 0.3);
  --blue: #00B5D8;
  --blue-dim: rgba(0, 181, 216, 0.3);
  --font-display: 'Syncopate', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Outfit', sans-serif;
  
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 136px 40px 40px;
  position: relative;
  overflow-x: hidden;
}

/* Section Nav */
.section-nav {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  background: rgba(10, 22, 40, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.section-nav .nav-brand {
  display: flex;
  align-items: center;
}

.section-nav .brand-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: var(--crimson);
  background: rgba(0, 91, 172, 0.1);
  border: 1px solid rgba(0, 91, 172, 0.3);
  padding: 4px 12px;
  border-radius: 3px;
  letter-spacing: 2px;
}

.section-nav .nav-dots {
  display: flex;
  gap: 8px;
}

.section-nav .nav-dot {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.section-nav .nav-dot:hover {
  background: rgba(255, 255, 255, 0.05);
}

.section-nav .dot-marker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transition: all 0.3s ease;
}

.section-nav .nav-dot.active .dot-marker {
  background: var(--crimson);
  box-shadow: 0 0 10px var(--crimson-dim);
  transform: scale(1.3);
}

.section-nav .dot-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.section-nav .nav-dot.active .dot-label {
  color: var(--crimson);
}

.section-nav .nav-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
}

.section-nav .nav-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--crimson), var(--blue));
  transition: width 0.3s ease;
}

.stats-section,
.spatial-section,
.chart-section,
.pipeline-section,
.region-samples-section {
  scroll-margin-top: 140px;
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
  background: radial-gradient(circle, rgba(0, 91, 172, 0.06), transparent 70%);
}

.glow-2 {
  bottom: -10%;
  right: -5%;
  background: radial-gradient(circle, rgba(0, 181, 216, 0.06), transparent 70%);
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
  color: #005BAC;
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
  grid-template-columns: 1fr 360px;
  gap: 16px;
  align-items: stretch;
}

.chart-section {
  position: relative;
  z-index: 1;
  margin-bottom: 32px;
}

.pipeline-section {
  position: relative;
  z-index: 1;
  margin-bottom: 32px;
}

.pipeline-title {
  margin-bottom: 24px;
  font-size: 28px;
}

.region-section {
  position: relative;
  z-index: 1;
  margin-bottom: 32px;
}

.region-samples-section {
  position: relative;
  z-index: 1;
  margin-bottom: 32px;
}

.region-samples-card {
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}

.card-header {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.section-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin: 0;
}

.card-body {
  display: grid;
  grid-template-columns: 55% 1px 45%;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.region-col,
.samples-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.col-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
}

.col-badge {
  padding: 3px 8px;
  background: rgba(0, 181, 216, 0.1);
  border: 1px solid rgba(0, 181, 216, 0.3);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #00B5D8;
  letter-spacing: 1px;
}

.col-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.08);
  align-self: stretch;
}

@media (max-width: 1200px) {
  .spatial-layout { grid-template-columns: 1fr; }
  
  .card-body {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1px auto;
  }
  
  .divider {
    width: 100%;
    height: 1px;
  }
}

@media (max-width: 768px) {
  .analysis-page { padding: 136px 20px 20px; }
  .page-title { font-size: 24px; }
  .data-source-bar { flex-direction: column; align-items: flex-start; }
  .source-divider { width: 100%; height: 1px; }
}
</style>