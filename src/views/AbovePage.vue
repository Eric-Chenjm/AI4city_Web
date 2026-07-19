<template>
  <div class="scroll-container">
    <!-- Section Nav -->
    <nav class="section-nav">
      <div class="nav-brand">
        <span class="brand-tag">{{ t('navBrand') }}</span>
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

    <section class="screen screen-1" ref="section0">
      <div class="hero-bg">
        <div class="grid-lines"></div>
        <div class="particles">
          <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>
      <div class="hero-content">
        <div class="hero-title-wrapper">
          <h1 class="hero-title">{{ t('heroTitle') }}</h1>
          <h2 class="hero-subtitle">{{ t('heroSubtitle') }}</h2>
        </div>
        <p class="hero-desc">{{ t('heroDesc') }}</p>
      </div>
      <button class="explore-btn" @click="scrollToScreen(1)">
        <span>{{ t('exploreBtn') }}</span>
        <span class="arrow">↓</span>
      </button>
    </section>

    <section class="screen screen-2" ref="section1">
      <div class="gallery-header">
        <h2 class="section-title">{{ t('screensTitle') }}</h2>
        <p class="section-desc">{{ t('screensDesc') }}</p>
      </div>
      <div class="gallery-scroll" ref="galleryScroll">
        <div class="gallery-track">
          <div 
            v-for="(item, index) in comparisonData" 
            :key="item.id" 
            class="comparison-item"
            :class="{ active: currentIndex === index }"
          >
            <div class="comparison-slider" ref="sliderRefs">
              <div class="slider-container">
                <div class="before-image">
                  <img :src="item.primary" :alt="t('BEFORE')" draggable="false" />
                </div>
                <div
                  class="after-image"
                  :style="{ clipPath: `inset(0 0 0 ${sliderPositions[index]}%)` }"
                >
                  <img :src="item.optimized" :alt="t('AFTER')" draggable="false" />
                </div>
                <div 
                  class="slider-bar"
                  :style="{ left: sliderPositions[index] + '%' }"
                  @mousedown="startDrag($event, index)"
                  @touchstart="startDrag($event, index)"
                >
                  <div class="slider-handle">
                    <span class="handle-icon">◀▶</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="comparison-info">
              <h3 class="comparison-title">{{ item.title }}</h3>
              <p class="comparison-desc">{{ $t('above.beforeVsRestoration') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="gallery-indicators">
        <span 
          v-for="(_, index) in comparisonData" 
          :key="index" 
          class="indicator"
          :class="{ active: currentIndex === index }"
          @click="scrollToItem(index)"
        ></span>
      </div>
    </section>

    <section class="screen screen-3" ref="section2">
      <div class="scene-container">
        <canvas ref="canvasRef"></canvas>
        <div class="legend-panel">
          <h4>{{ t('sceneLegendTitle') }}</h4>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-color crimson"></span>
              <span>{{ t('legendCore') }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-color blue"></span>
              <span>{{ t('legendActivated') }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-color purple"></span>
              <span>{{ t('legendTrigger') }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-color gray"></span>
              <span>{{ t('legendDevelopment') }}</span>
            </div>
          </div>
        </div>
        <div class="scene-hint">
          <span>{{ t('sceneHint') }}</span>
        </div>
      </div>
    </section>

    <!-- <section class="screen screen-4">
      <div class="dashboard-container">
        <div class="score-section">
          <div class="score-label">INNOVATION VITALITY INDEX</div>
          <div class="score-value">87.3</div>
          <div class="score-unit">/ 100</div>
        </div>
        <div class="radar-section">
          <canvas ref="radarCanvas"></canvas>
          <div class="radar-labels">
            <span>CREATIVITY</span>
            <span>INTERACTION</span>
            <span>INTEGRATION</span>
            <span>ECOLOGY</span>
            <span>CULTURE</span>
            <span>FUTURE</span>
          </div>
        </div>
        <router-link to="/generate" class="enter-btn">
          <span>ENTER TOOL</span>
          <span class="arrow">→</span>
        </router-link>
      </div>
    </section> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useLang } from '../composables/useLang.js'

const { t, currentLang } = useLang()

const canvasRef = ref(null)
const radarCanvas = ref(null)
const galleryScroll = ref(null)
const section0 = ref(null)
const section1 = ref(null)
const section2 = ref(null)
const sliderRefs = ref([])
const currentIndex = ref(0)
const sliderPositions = ref([50, 50, 50, 50, 50, 50])
const isDragging = ref(false)
const dragIndex = ref(0)

const activeSection = ref(0)
const scrollProgress = ref(0)

const sections = computed(() => [
  { label: t('navHero') },
  { label: t('navGallery') },
  { label: t('navScene') }
])

const scrollToSection = (index) => {
  const refs = [section0, section1, section2]
  refs[index]?.value?.scrollIntoView({ behavior: 'smooth' })
}

let scene, camera, renderer, controls
let animationId

const comparisonData = computed(() => [
  {
    id: 1,
    primary: '/gallery/primary/picture_2026_07_17_17_46_53_937.jpg',
    optimized: '/gallery/optimized/picture_2026_07_17_17_46_53_937_street_lock_v2_optimized.png',
    title: currentLang.value === 'en' ? 'STREET SCENE 01' : '街景对比 01',
    description: t('screensDesc')
  },
  {
    id: 2,
    primary: '/gallery/primary/picture_2026_07_17_17_51_25_295.jpg',
    optimized: '/gallery/optimized/picture_2026_07_17_17_51_25_295_street_lock_v2_optimized.png',
    title: currentLang.value === 'en' ? 'STREET SCENE 02' : '街景对比 02',
    description: t('screensDesc')
  },
  {
    id: 3,
    primary: '/gallery/primary/picture_2026_07_17_17_52_11_783.jpg',
    optimized: '/gallery/optimized/picture_2026_07_17_17_52_11_783_street_lock_v2_optimized.png',
    title: currentLang.value === 'en' ? 'STREET SCENE 03' : '街景对比 03',
    description: t('screensDesc')
  },
  {
    id: 4,
    primary: '/gallery/primary/picture_2026_07_17_17_53_34_537.jpg',
    optimized: '/gallery/optimized/picture_2026_07_17_17_53_34_537_street_lock_v2_optimized.png',
    title: currentLang.value === 'en' ? 'STREET SCENE 04' : '街景对比 04',
    description: t('screensDesc')
  },
  {
    id: 5,
    primary: '/gallery/primary/picture_2026_07_17_17_54_50_704.jpg',
    optimized: '/gallery/optimized/picture_2026_07_17_17_54_50_704_street_lock_v2_optimized.png',
    title: currentLang.value === 'en' ? 'STREET SCENE 05' : '街景对比 05',
    description: t('screensDesc')
  },
  {
    id: 6,
    primary: '/gallery/primary/picture_2026_07_17_18_07_26_046.jpg',
    optimized: '/gallery/optimized/picture_2026_07_17_18_07_26_046_street_lock_v2_optimized.png',
    title: currentLang.value === 'en' ? 'STREET SCENE 06' : '街景对比 06',
    description: t('screensDesc')
  }
])

const getParticleStyle = (index) => {
  const left = (index * 7) % 100
  const delay = (index * 0.1) % 5
  const size = Math.random() * 4 + 2
  const duration = Math.random() * 10 + 10
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`
  }
}

const scrollToScreen = (index) => {
  const screens = document.querySelectorAll('.screen')
  if (screens[index]) {
    screens[index].scrollIntoView({ behavior: 'smooth' })
  }
}

const startDrag = (event, index) => {
  event.preventDefault()
  isDragging.value = true
  dragIndex.value = index
  const container = event.currentTarget.closest('.comparison-slider')
  const afterImage = container.querySelector('.after-image')
  const sliderBar = container.querySelector('.slider-bar')
  let rafId = null
  let pendingPercent = sliderPositions.value[index]

  const applyPosition = (percent) => {
    afterImage.style.clipPath = `inset(0 0 0 ${percent}%)`
    sliderBar.style.left = `${percent}%`
  }

  const handleMove = (e) => {
    e.preventDefault()
    if (!isDragging.value) return
    const rect = container.getBoundingClientRect()
    const clientX = e.clientX || e.touches?.[0]?.clientX
    pendingPercent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        rafId = null
        applyPosition(pendingPercent)
      })
    }
  }
  
  const handleEnd = () => {
    isDragging.value = false
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    sliderPositions.value[index] = pendingPercent
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }
  
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove)
  document.addEventListener('touchend', handleEnd)
}

const scrollToItem = (index) => {
  currentIndex.value = index
  const items = document.querySelectorAll('.comparison-item')
  if (items[index]) {
    items[index].scrollIntoView({ behavior: 'smooth', inline: 'center' })
  }
}

// ── Gallery Autoplay ──
const galleryAutoplay = ref(false)
let autoPlayTimer = null
let sliderAnimFrame = null
let galleryObserver = null

const applySliderPosition = (index, percent) => {
  sliderPositions.value[index] = percent
  const refs = sliderRefs.value
  const container = refs?.[index]?.closest('.comparison-slider')
  if (!container) return
  const afterImage = container.querySelector('.after-image')
  const sliderBar = container.querySelector('.slider-bar')
  if (afterImage) afterImage.style.clipPath = `inset(0 0 0 ${percent}%)`
  if (sliderBar) sliderBar.style.left = `${percent}%`
}

const animateSlider = (index, from, to, duration, done) => {
  const start = performance.now()
  const step = (now) => {
    if (!galleryAutoplay.value) return
    const progress = Math.min((now - start) / duration, 1)
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2
    applySliderPosition(index, from + (to - from) * eased)
    if (progress < 1) {
      sliderAnimFrame = requestAnimationFrame(step)
    } else {
      done?.()
    }
  }
  sliderAnimFrame = requestAnimationFrame(step)
}

const stopAutoplay = () => {
  galleryAutoplay.value = false
  clearTimeout(autoPlayTimer)
  cancelAnimationFrame(sliderAnimFrame)
  autoPlayTimer = null
  sliderAnimFrame = null
}

const playCurrentItem = () => {
  if (!galleryAutoplay.value) return
  const idx = currentIndex.value
  const total = comparisonData.value.length

  applySliderPosition(idx, 100)
  autoPlayTimer = setTimeout(() => {
    animateSlider(idx, 100, 0, 2800, () => {
      autoPlayTimer = setTimeout(() => {
        if (!galleryAutoplay.value) return
        const next = (idx + 1) % total
        currentIndex.value = next
        const items = document.querySelectorAll('.comparison-item')
        items[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
        autoPlayTimer = setTimeout(() => playCurrentItem(), 700)
      }, 2000)
    })
  }, 1500)
}

const startAutoplay = () => {
  if (galleryAutoplay.value) return
  galleryAutoplay.value = true
  playCurrentItem()
}

const initThreeScene = async () => {
  if (!canvasRef.value) return
  
  // 若 canvas 处于隐藏状态则 offsetWidth/Height 为 0，使用 clientWidth 或窗口尺寸保底
  const width = canvasRef.value.offsetWidth || canvasRef.value.clientWidth || window.innerWidth
  const height = canvasRef.value.offsetHeight || canvasRef.value.clientHeight || window.innerHeight
  
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x050a14)
  
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.set(0, 10, 14)
  
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value, 
    antialias: true
    // 注意：不使用 alpha: true，避免与 scene.background 冲突导致透明白化
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 2
  controls.maxDistance = 40
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 15, 10)
  scene.add(directionalLight)
  
  // 经纬度投影与缩放映射 (使用标准 Web 墨卡托投影计算像素坐标，实现像素级完全对准)
  let centerLng = 121.558
  let centerLat = 31.2875
  
  // 在 zoom 15 级下的像素投影公式
  const lngToTileX = (lng) => ((lng + 180) / 360) * 32768
  const latToTileY = (lat) => {
    const rad = (lat * Math.PI) / 180
    return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 32768
  }
  
  let centerPx = lngToTileX(centerLng)
  let centerPy = latToTileY(centerLat)
  
  // 缩放因子：确保 3D 模型比例与底图瓦片完全等比例缩放
  const scale = 600.0 * (360 / 32768)
  
  let lngToX = (lng) => (lngToTileX(lng) - centerPx) * scale
  let latToZ = (lat) => -(latToTileY(lat) - centerPy) * scale

  try {
    // 1. 加载并渲染边界底板
    const boundRes = await fetch('/data/BoundryToJSON.geojson')
    const boundGeo = await boundRes.json()
    if (boundGeo.features && boundGeo.features.length > 0) {
      const coords = boundGeo.features[0].geometry.coordinates[0]
      
      // 动态计算真实的边界 bounding box 中心点以实现完美居中
      let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity
      coords.forEach(pt => {
        if (pt[0] < minLng) minLng = pt[0]
        if (pt[0] > maxLng) maxLng = pt[0]
        if (pt[1] < minLat) minLat = pt[1]
        if (pt[1] > maxLat) maxLat = pt[1]
      })
      centerLng = (minLng + maxLng) / 2
      centerLat = (minLat + maxLat) / 2
      
      // 使用精准的几何中心动态更新投影原点和映射函数
      centerPx = lngToTileX(centerLng)
      centerPy = latToTileY(centerLat)
      
      lngToX = (lng) => (lngToTileX(lng) - centerPx) * scale
      latToZ = (lat) => -(latToTileY(lat) - centerPy) * scale
      
      // 1.1 渲染复兴岛陆地底板
      const shape = new THREE.Shape()
      coords.forEach((pt, i) => {
        const x = lngToX(pt[0])
        const z = latToZ(pt[1])
        if (i === 0) shape.moveTo(x, z)
        else shape.lineTo(x, z)
      })
      const islandGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: false })
      const islandMaterial = new THREE.MeshStandardMaterial({
        color: 0x14223b, // 暗沉亮黑色
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8
      })
      const islandMesh = new THREE.Mesh(islandGeometry, islandMaterial)
      islandMesh.rotation.x = -Math.PI / 2
      islandMesh.position.y = -0.15 // 底板顶面在 y = 0
      scene.add(islandMesh)

      // 1.2 加载 CartoDB 暗黑无字瓦片地图底图
      // zoom 15 高精度（每张约 1.2km），31×31 网格 ≈ 37km×37km，覆盖上海研究区核心范围
      try {
        const tileGeometry = new THREE.PlaneGeometry(scale, scale)
        const textureLoader = new THREE.TextureLoader()
        textureLoader.setCrossOrigin('anonymous')
        
        // zoom-15 瓦片中心索引
        const centerTx = Math.floor(centerPx)
        const centerTy = Math.floor(centerPy)
        
        // ±15 半径 → 31×31 = 961 张，浏览器异步加载，不阻塞渲染
        for (let tx = centerTx - 15; tx <= centerTx + 15; tx++) {
          for (let ty = centerTy - 15; ty <= centerTy + 15; ty++) {
            const posX = (tx + 0.5 - centerPx) * scale
            const posZ = (ty + 0.5 - centerPy) * scale
            
            const tileUrl = `https://basemaps.cartocdn.com/dark_nolabels/15/${tx}/${ty}.png`
            
            textureLoader.load(tileUrl, (texture) => {
              // 默认 flipY=true：PlaneGeometry 旋转 -PI/2 后 V=1→-Z（北），图像北部正确对齐北方 ✓
              const tileMat = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 0.85,
                depthWrite: false,
                side: THREE.FrontSide
              })
              const tileMesh = new THREE.Mesh(tileGeometry, tileMat)
              tileMesh.rotation.x = -Math.PI / 2
              tileMesh.position.set(posX, -0.16, posZ)
              scene.add(tileMesh)
            }, undefined, (err) => {
              console.warn(`Tile failed to load: ${tileUrl}`, err)
            })
          }
        }
      } catch (tileErr) {
        console.warn('Map tiles initialization failed:', tileErr)
      }
    }
    // 2. 加载公园绿地
    try {
      const parkRes = await fetch('/data/复兴岛公园ToJSON.geojson')
      const parkGeo = await parkRes.json()
      parkGeo.features.forEach(feat => {
        const geom = feat.geometry
        const coords = geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates[0][0]
        if (!coords) return
        const shape = new THREE.Shape()
        coords.forEach((pt, i) => {
          const x = lngToX(pt[0])
          const z = latToZ(pt[1])
          if (i === 0) shape.moveTo(x, z)
          else shape.lineTo(x, z)
        })
        const parkGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false })
        const parkMaterial = new THREE.MeshStandardMaterial({
          color: 0x1b4332,
          roughness: 0.9,
          transparent: true,
          opacity: 0.8
        })
        const parkMesh = new THREE.Mesh(parkGeometry, parkMaterial)
        parkMesh.rotation.x = -Math.PI / 2
        parkMesh.position.y = 0.005
        scene.add(parkMesh)
      })
    } catch (e) {
      console.warn('Park failed to load:', e)
    }

    // 3. 加载道路
    try {
      const roadRes = await fetch('/data/road_FeaturesToJSON.geojson')
      const roadGeo = await roadRes.json()
      const roadMaterial = new THREE.LineBasicMaterial({
        color: 0x00B5D8,
        transparent: true,
        opacity: 0.4
      })
      roadGeo.features.forEach(feat => {
        const geom = feat.geometry
        const coordsArray = geom.type === 'LineString' ? [geom.coordinates] : geom.coordinates
        if (!coordsArray) return
        coordsArray.forEach(coords => {
          const points = []
          coords.forEach(pt => {
            points.push(new THREE.Vector3(lngToX(pt[0]), 0.005, latToZ(pt[1])))
          })
          const roadGeom = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(roadGeom, roadMaterial)
          scene.add(line)
        })
      })
    } catch (e) {
      console.warn('Roads failed to load:', e)
    }

    // 4. 加载建筑物并分类染色
    const buildRes = await fetch('/data/BuildingsToJSON.geojson')
    const buildGeo = await buildRes.json()
    buildGeo.features.forEach(feat => {
      const geom = feat.geometry
      const props = feat.properties
      const height = props.height || 6
      
      let color = 0x54565A
      if (height >= 12) {
        color = 0x005BAC
      } else if (height >= 8 && height < 12) {
        color = 0x009BB8
      } else if (height >= 5 && height < 8) {
        color = 0x00B5D8
      }
      
      const coords = geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates[0][0]
      if (!coords) return
      
      const shape = new THREE.Shape()
      coords.forEach((pt, i) => {
        const x = lngToX(pt[0])
        const z = latToZ(pt[1])
        if (i === 0) shape.moveTo(x, z)
        else shape.lineTo(x, z)
      })
      
      const extrudeSettings = {
        depth: height * 0.04,
        bevelEnabled: false
      }
      const buildGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const buildMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.7,
        emissive: color,
        emissiveIntensity: 0.15
      })
      const buildMesh = new THREE.Mesh(buildGeom, buildMat)
      buildMesh.rotation.x = -Math.PI / 2
      buildMesh.position.y = 0.005
      buildMesh.castShadow = true
      buildMesh.receiveShadow = true
      scene.add(buildMesh)
    })

  } catch (err) {
    console.error('GeoJSON rendering failed, falling back to mock objects:', err)
    
    const islandGeometry = new THREE.PlaneGeometry(8, 4)
    const islandMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a2a4a,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.5
    })
    const island = new THREE.Mesh(islandGeometry, islandMaterial)
    island.rotation.x = -Math.PI / 2
    scene.add(island)

    const zoneData = [
      { type: 'core', position: [0, 1.5, 0], size: [1.2, 3, 1.2], color: 0x005BAC },
      { type: 'core', position: [1.5, 1, 0.5], size: [0.8, 2, 0.8], color: 0x005BAC },
      { type: 'core', position: [-1.5, 1.2, -0.5], size: [1, 2.4, 1], color: 0x005BAC },
      { type: 'blue', position: [3, 0.8, -1], size: [0.6, 1.6, 0.6], color: 0x00B5D8 },
      { type: 'blue', position: [-2.5, 0.6, 1], size: [0.5, 1.2, 0.5], color: 0x00B5D8 },
      { type: 'purple', position: [2, 0.7, 1.5], size: [0.5, 1.4, 0.5], color: 0x009BB8 },
      { type: 'purple', position: [-3, 0.9, -0.8], size: [0.6, 1.8, 0.6], color: 0x009BB8 },
      { type: 'gray', position: [3.5, 0.4, 0], size: [0.4, 0.8, 0.4], color: 0x54565A },
      { type: 'gray', position: [-2, 0.5, -1.5], size: [0.4, 1, 0.4], color: 0x54565A },
      { type: 'gray', position: [1, 0.3, -2], size: [0.3, 0.6, 0.3], color: 0x54565A },
      { type: 'gray', position: [-3.5, 0.4, 1.5], size: [0.4, 0.8, 0.4], color: 0x54565A }
    ]
    
    zoneData.forEach(data => {
      const geometry = new THREE.BoxGeometry(...data.size)
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.3,
        metalness: 0.7,
        emissive: data.color,
        emissiveIntensity: 0.2
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(...data.position)
      cube.castShadow = true
      cube.receiveShadow = true
      scene.add(cube)
    })
  }
  
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    // Camera flyover animation
    if (cameraAnim.active) {
      const elapsed = performance.now() - cameraAnim.startTime
      const progress = Math.min(elapsed / cameraAnim.duration, 1)
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

      camera.position.x = cameraAnim.fromPos.x + (cameraAnim.toPos.x - cameraAnim.fromPos.x) * eased
      camera.position.y = cameraAnim.fromPos.y + (cameraAnim.toPos.y - cameraAnim.fromPos.y) * eased
      camera.position.z = cameraAnim.fromPos.z + (cameraAnim.toPos.z - cameraAnim.fromPos.z) * eased

      const target = new THREE.Vector3(
        cameraAnim.fromLook.x + (cameraAnim.toLook.x - cameraAnim.fromLook.x) * eased,
        cameraAnim.fromLook.y + (cameraAnim.toLook.y - cameraAnim.fromLook.y) * eased,
        cameraAnim.fromLook.z + (cameraAnim.toLook.z - cameraAnim.fromLook.z) * eased
      )
      camera.lookAt(target)

      if (progress >= 1) {
        cameraAnim.active = false
        controls.enabled = true
        controls.target.copy(target)
        controls.update()
      }
    } else {
      controls.update()
    }

    renderer.render(scene, camera)
  }
  animate()
}

// ── 3D Camera Flyover ──
const cameraAnim = {
  active: false,
  startTime: 0,
  duration: 3500,
  fromPos: { x: 0, y: 0, z: 0 },
  toPos: { x: 0, y: 25, z: 0.5 },
  fromLook: { x: 0, y: 0, z: 0 },
  toLook: { x: 0, y: 0, z: 0 }
}
let scene3Observer = null
let hasFlown = false

const playCameraFlyover = () => {
  if (!camera || hasFlown) return
  hasFlown = true

  controls.enabled = false
  cameraAnim.active = true
  cameraAnim.startTime = performance.now()
  cameraAnim.fromPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
  cameraAnim.toPos = { x: 0, y: 28, z: 0.5 }
  cameraAnim.fromLook = { x: 0, y: 0, z: -2 }
  cameraAnim.toLook = { x: 0, y: 0, z: 0 }
}

const resetCameraView = () => {
  if (!camera) return
  hasFlown = false
  controls.enabled = true
  cameraAnim.active = false
  camera.position.set(0, 10, 14)
  controls.target.set(0, 0, 0)
  controls.update()
}

const initRadarChart = () => {
  if (!radarCanvas.value) return
  
  const canvas = radarCanvas.value
  const ctx = canvas.getContext('2d')
  const size = 300
  canvas.width = size
  canvas.height = size
  
  const centerX = size / 2
  const centerY = size / 2
  const radius = 100
  
  const data = [85, 78, 92, 88, 75, 82]
  const labels = ['CREATIVITY', 'INTERACTION', 'INTEGRATION', 'ECOLOGY', 'CULTURE', 'FUTURE']
  const angleStep = (Math.PI * 2) / data.length
  
  ctx.clearRect(0, 0, size, size)
  
  for (let level = 5; level >= 1; level--) {
    const levelRadius = (radius / 5) * level
    ctx.beginPath()
    for (let i = 0; i <= data.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * levelRadius
      const y = centerY + Math.sin(angle) * levelRadius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = level === 5 ? 'rgba(0, 91, 172, 0.3)' : 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.stroke()
  }
  
  for (let i = 0; i < data.length; i++) {
    const angle = i * angleStep - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius
    )
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.stroke()
  }
  
  ctx.beginPath()
  for (let i = 0; i <= data.length; i++) {
    const idx = i % data.length
    const angle = idx * angleStep - Math.PI / 2
    const value = data[idx] / 100
    const x = centerX + Math.cos(angle) * radius * value
    const y = centerY + Math.sin(angle) * radius * value
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  gradient.addColorStop(0, 'rgba(0, 91, 172, 0.6)')
  gradient.addColorStop(0.5, 'rgba(0, 74, 140, 0.4)')
  gradient.addColorStop(1, 'rgba(0, 74, 140, 0.1)')
  ctx.fillStyle = gradient
  ctx.fill()
  
  ctx.strokeStyle = '#005BAC'
  ctx.lineWidth = 2
  ctx.stroke()
  
  data.forEach((value, i) => {
    const angle = i * angleStep - Math.PI / 2
    const valueRadius = (value / 100) * radius
    const x = centerX + Math.cos(angle) * valueRadius
    const y = centerY + Math.sin(angle) * valueRadius
    
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#005BAC'
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.strokeStyle = '#005BAC'
    ctx.lineWidth = 2
    ctx.stroke()
  })
}

const handleGalleryScroll = () => {
  if (!galleryScroll.value) return
  const items = galleryScroll.value.querySelectorAll('.comparison-item')
  const scrollLeft = galleryScroll.value.scrollLeft
  const itemWidth = galleryScroll.value.offsetWidth
  currentIndex.value = Math.round(scrollLeft / itemWidth)
}

const handleResize = () => {
  if (camera && renderer) {
    const width = canvasRef.value.offsetWidth
    const height = canvasRef.value.offsetHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
}

let scrollContainer = null
const handleContainerScroll = () => {
  if (!scrollContainer) return
  const scrollTop = scrollContainer.scrollTop
  const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
  scrollProgress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0

  const sectionRefs = [section0, section1, section2]
  for (let i = 0; i < sectionRefs.length; i++) {
    const rect = sectionRefs[i].value?.getBoundingClientRect()
    if (rect && rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      activeSection.value = i
      break
    }
  }
}

onMounted(() => {
  scrollContainer = document.querySelector('.scroll-container')
  scrollContainer?.addEventListener('scroll', handleContainerScroll)

  nextTick(() => {
    // 使用 IntersectionObserver 延迟到第三屏 canvas 进入视口才初始化
    // 这样可以确保 canvas 处于可见状态，offsetWidth/Height 不为 0
    if (canvasRef.value) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          initThreeScene()
        }
      }, { threshold: 0.1 })
      observer.observe(canvasRef.value)
    }
    initRadarChart()
  })
  
  galleryScroll.value?.addEventListener('scroll', handleGalleryScroll)
  window.addEventListener('resize', handleResize)

  // Gallery autoplay: start when screen-2 is visible
  if (section1.value) {
    galleryObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startAutoplay()
      } else {
        stopAutoplay()
      }
    }, { threshold: 0.3 })
    galleryObserver.observe(section1.value)
  }

  // 3D scene camera flyover: trigger when screen-3 is visible
  if (section2.value) {
    scene3Observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        playCameraFlyover()
      } else {
        resetCameraView()
      }
    }, { threshold: 0.3 })
    scene3Observer.observe(section2.value)
  }

  // Pause autoplay on mouse hover, resume on leave
  if (galleryScroll.value) {
    galleryScroll.value.addEventListener('mouseenter', stopAutoplay)
    galleryScroll.value.addEventListener('mouseleave', () => {
      // Only restart if screen-2 is still visible
      if (section1.value) {
        const rect = section1.value.getBoundingClientRect()
        const visible = rect.top < window.innerHeight && rect.bottom > 0
        if (visible) startAutoplay()
      }
    })
  }
})

onUnmounted(() => {
  stopAutoplay()
  if (galleryObserver) galleryObserver.disconnect()
  if (scene3Observer) scene3Observer.disconnect()

  galleryScroll.value?.removeEventListener('scroll', handleGalleryScroll)
  galleryScroll.value?.removeEventListener('mouseenter', stopAutoplay)
  scrollContainer?.removeEventListener('scroll', handleContainerScroll)
  window.removeEventListener('resize', handleResize)
  
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.scroll-container {
  height: calc(100vh - 80px);
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
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
  border-bottom: 1px solid rgba(0, 91, 172, 0.15);
}

.section-nav .nav-brand {
  display: flex;
  align-items: center;
}

.section-nav .brand-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: #005BAC;
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
  background: #005BAC;
  box-shadow: 0 0 10px rgba(0, 91, 172, 0.3);
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
  color: #005BAC;
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
  background: linear-gradient(90deg, #005BAC, #004A8C);
  transition: width 0.3s ease;
}

.screen {
  height: calc(100vh - 80px);
  width: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  position: relative;
  overflow: hidden;
  background: #050a14;
}

.screen-1 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url('../assets/scene.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 22, 40, 0.3);
  z-index: 1;
}

.grid-lines {
  display: none;
  position: absolute;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(0, 91, 172, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 91, 172, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: rotate(-5deg);
  animation: gridMove 60s linear infinite;
}

@keyframes gridMove {
  0% { transform: rotate(-5deg) translateX(0); }
  100% { transform: rotate(-5deg) translateX(50px); }
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.particle {
  position: absolute;
  top: -20px;
  background: radial-gradient(circle, #005BAC, transparent);
  border-radius: 50%;
  opacity: 0.6;
  animation: particleFall linear infinite;
}

@keyframes particleFall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(100vh) translateX(30px);
    opacity: 0;
  }
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #ffffff;
}

.hero-title-wrapper {
  margin-bottom: 24px;
}

.hero-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 72px;
  font-weight: 900;
  letter-spacing: 12px;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 8px;
  text-shadow: 0 0 40px rgba(0, 91, 172, 0.3);
}

.hero-subtitle {
  font-family: 'Syncopate', sans-serif;
  font-size: 22px;
  font-weight: 300;
  color: #005BAC;
  letter-spacing: 8px;
}

.hero-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin: 0 auto 48px;
  line-height: 1.8;
  font-weight: 300;
}

.explore-btn {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: linear-gradient(135deg, #005BAC, #004A8C);
  border: none;
  border-radius: 40px;
  color: #0a1628;
  font-family: 'Syncopate', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 91, 172, 0.3);
  z-index: 10;
}

.explore-btn:hover {
  transform: translateX(-50%) translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 91, 172, 0.4);
}

.explore-btn .arrow {
  font-size: 20px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.screen-2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.gallery-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: 4px;
}

.section-desc {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #005BAC;
  letter-spacing: 2px;
}

.gallery-scroll {
  width: 100%;
  max-width: 900px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding-bottom: 20px;
}

.gallery-scroll::-webkit-scrollbar {
  height: 6px;
}

.gallery-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.gallery-scroll::-webkit-scrollbar-thumb {
  background: #005BAC;
  border-radius: 3px;
}

.gallery-track {
  display: flex;
  gap: 20px;
  width: max-content;
}

.comparison-item {
  width: 80vw;
  max-width: 700px;
  flex-shrink: 0;
  scroll-snap-align: center;
}

.comparison-slider {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  user-select: none;
  -webkit-user-select: none;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-select: none;
}

.before-image,
.after-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.before-image img,
.after-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.slider-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #005BAC;
  cursor: ew-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.slider-handle {
  width: 40px;
  height: 40px;
  background: rgba(0, 91, 172, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 91, 172, 0.5);
  outline: none;
  user-select: none;
  -webkit-user-select: none;
}

.handle-icon {
  font-size: 14px;
  color: #0a1628;
}

.comparison-info {
  text-align: center;
  margin-top: 24px;
}

.comparison-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
}

.comparison-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.gallery-indicators {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #005BAC;
  transform: scale(1.2);
}

.screen-3 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.scene-container canvas {
  width: 100%;
  height: 100%;
}

.legend-panel {
  position: absolute;
  bottom: 80px;
  right: 80px;
  background: rgba(10, 22, 40, 0.85);
  border: 1px solid rgba(0, 91, 172, 0.4);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.legend-panel h4 {
  font-family: 'Syncopate', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #005BAC;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.legend-color.crimson { background: #005BAC; box-shadow: 0 0 10px rgba(0, 91, 172, 0.5); }
.legend-color.blue { background: #00B5D8; box-shadow: 0 0 10px rgba(0, 181, 216, 0.5); }
.legend-color.purple { background: #009BB8; box-shadow: 0 0 10px rgba(0, 155, 184, 0.5); }
.legend-color.gray { background: #54565A; }

.scene-hint {
  position: absolute;
  bottom: 40px;
  left: 40px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.screen-4 {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  max-width: 800px;
  width: 100%;
}

.score-section {
  text-align: center;
}

.score-label {
  font-family: 'Syncopate', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
  margin-bottom: 16px;
}

.score-value {
  font-family: 'Syncopate', sans-serif;
  font-size: 96px;
  font-weight: 900;
  color: #005BAC;
  text-shadow: 0 0 60px rgba(0, 91, 172, 0.4);
  line-height: 1;
}

.score-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.3);
  margin-left: 8px;
}

.radar-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.radar-labels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
  text-align: center;
}

.radar-labels span {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.enter-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 48px;
  background: linear-gradient(135deg, #005BAC, #004A8C);
  border: none;
  border-radius: 40px;
  color: #0a1628;
  font-family: 'Syncopate', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 91, 172, 0.3);
}

.enter-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 91, 172, 0.4);
}

.enter-btn .arrow {
  font-size: 20px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
    letter-spacing: 6px;
  }
  
  .hero-subtitle {
    font-size: 16px;
    letter-spacing: 4px;
  }
  
  .hero-desc {
    font-size: 14px;
    padding: 0 20px;
  }
  
  .explore-btn {
    right: 20px;
    bottom: 40px;
    padding: 12px 24px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .comparison-item {
    width: 90vw;
  }
  
  .score-value {
    font-size: 64px;
  }
  
  .legend-panel {
    right: 20px;
    bottom: 20px;
    padding: 12px;
  }
  
  .enter-btn {
    padding: 16px 32px;
    font-size: 14px;
  }
}
</style>
