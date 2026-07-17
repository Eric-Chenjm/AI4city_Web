<template>
  <div class="scroll-container">
    <section class="screen screen-1">
      <div class="hero-bg">
        <div class="grid-lines"></div>
        <div class="particles">
          <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>
      <div class="hero-content">
        <div class="hero-title-wrapper">
          <h1 class="hero-title">FUXING ISLAND</h1>
          <h2 class="hero-subtitle">INNOVATION GRAVITY FIELD</h2>
        </div>
        <p class="hero-desc">From Data Diagnosis to Spatial Activation — Multi-modal Indicator-based Innovation Space Identification</p>
      </div>
      <button class="explore-btn" @click="scrollToScreen(1)">
        <span>START EXPLORING</span>
        <span class="arrow">↓</span>
      </button>
    </section>

    <section class="screen screen-2">
      <div class="gallery-header">
        <h2 class="section-title">COMPARISON GALLERY</h2>
        <p class="section-desc">BEFORE vs AIGC RESTORATION</p>
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
                  <div class="placeholder-bg before-bg"></div>
                </div>
                <div 
                  class="after-image"
                  :style="{ clipPath: `inset(0 0 0 ${sliderPositions[index]}%)` }"
                >
                  <div class="placeholder-bg after-bg"></div>
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
              <p class="comparison-desc">{{ item.description }}</p>
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

    <section class="screen screen-3">
      <div class="scene-container">
        <canvas ref="canvasRef"></canvas>
        <div class="legend-panel">
          <h4>ZONE LEGEND</h4>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-color crimson"></span>
              <span>CORE INNOVATION</span>
            </div>
            <div class="legend-item">
              <span class="legend-color blue"></span>
              <span>TO BE ACTIVATED</span>
            </div>
            <div class="legend-item">
              <span class="legend-color purple"></span>
              <span>POTENTIAL TRIGGER</span>
            </div>
            <div class="legend-item">
              <span class="legend-color gray"></span>
              <span>UNDER DEVELOPMENT</span>
            </div>
          </div>
        </div>
        <div class="scene-hint">
          <span>DRAG TO ROTATE · SCROLL TO ZOOM</span>
        </div>
      </div>
    </section>

    <section class="screen screen-4">
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
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const canvasRef = ref(null)
const radarCanvas = ref(null)
const galleryScroll = ref(null)
const sliderRefs = ref([])
const currentIndex = ref(0)
const sliderPositions = ref([50, 50, 50])
const isDragging = ref(false)
const dragIndex = ref(0)

let scene, camera, renderer, controls
let animationId

const comparisonData = ref([
  {
    id: 1,
    title: 'RIVERSIDE TRAIL',
    description: 'Industrial waterfront transformed into ecological greenway, creating pleasant public space'
  },
  {
    id: 2,
    title: 'INNOVATION HUB',
    description: 'Old factory buildings repurposed into modern entrepreneurship and innovation spaces'
  },
  {
    id: 3,
    title: 'COMMUNITY CENTER',
    description: 'Integrated public resources to create diverse community service facilities'
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
  isDragging.value = true
  dragIndex.value = index
  
  const handleMove = (e) => {
    if (!isDragging.value) return
    const container = e.currentTarget.parentElement
    const rect = container.getBoundingClientRect()
    const clientX = e.clientX || e.touches?.[0]?.clientX
    const percent = ((clientX - rect.left) / rect.width) * 100
    sliderPositions.value[index] = Math.max(0, Math.min(100, percent))
  }
  
  const handleEnd = () => {
    isDragging.value = false
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
        color: 0x4a7ab0,
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
      
      // 决定建筑颜色（红：核心创新区，紫：潜在触发区，蓝：待活化区，灰：开发中）
      let color = 0x4a4a5a
      if (height >= 12) {
        color = 0xe8554e
      } else if (height >= 8 && height < 12) {
        color = 0x8a5a9a
      } else if (height >= 5 && height < 8) {
        color = 0x4a7ab0
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
      { type: 'core', position: [0, 1.5, 0], size: [1.2, 3, 1.2], color: 0xe8554e },
      { type: 'core', position: [1.5, 1, 0.5], size: [0.8, 2, 0.8], color: 0xe8554e },
      { type: 'core', position: [-1.5, 1.2, -0.5], size: [1, 2.4, 1], color: 0xe8554e },
      { type: 'blue', position: [3, 0.8, -1], size: [0.6, 1.6, 0.6], color: 0x4a7ab0 },
      { type: 'blue', position: [-2.5, 0.6, 1], size: [0.5, 1.2, 0.5], color: 0x4a7ab0 },
      { type: 'purple', position: [2, 0.7, 1.5], size: [0.5, 1.4, 0.5], color: 0x8a5a9a },
      { type: 'purple', position: [-3, 0.9, -0.8], size: [0.6, 1.8, 0.6], color: 0x8a5a9a },
      { type: 'gray', position: [3.5, 0.4, 0], size: [0.4, 0.8, 0.4], color: 0x4a4a5a },
      { type: 'gray', position: [-2, 0.5, -1.5], size: [0.4, 1, 0.4], color: 0x4a4a5a },
      { type: 'gray', position: [1, 0.3, -2], size: [0.3, 0.6, 0.3], color: 0x4a4a5a },
      { type: 'gray', position: [-3.5, 0.4, 1.5], size: [0.4, 0.8, 0.4], color: 0x4a4a5a }
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
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
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
    ctx.strokeStyle = level === 5 ? 'rgba(232, 85, 78, 0.3)' : 'rgba(255, 255, 255, 0.1)'
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
  gradient.addColorStop(0, 'rgba(232, 85, 78, 0.6)')
  gradient.addColorStop(0.5, 'rgba(166, 58, 53, 0.4)')
  gradient.addColorStop(1, 'rgba(166, 58, 53, 0.1)')
  ctx.fillStyle = gradient
  ctx.fill()
  
  ctx.strokeStyle = '#e8554e'
  ctx.lineWidth = 2
  ctx.stroke()
  
  data.forEach((value, i) => {
    const angle = i * angleStep - Math.PI / 2
    const valueRadius = (value / 100) * radius
    const x = centerX + Math.cos(angle) * valueRadius
    const y = centerY + Math.sin(angle) * valueRadius
    
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#e8554e'
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.strokeStyle = '#e8554e'
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

onMounted(() => {
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
})

onUnmounted(() => {
  galleryScroll.value?.removeEventListener('scroll', handleGalleryScroll)
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
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.screen {
  height: 100vh;
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
}

.grid-lines {
  display: none;
  position: absolute;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(232, 85, 78, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232, 85, 78, 0.05) 1px, transparent 1px);
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
}

.particle {
  position: absolute;
  top: -20px;
  background: radial-gradient(circle, #e8554e, transparent);
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
  text-shadow: 0 0 40px rgba(232, 85, 78, 0.3);
}

.hero-subtitle {
  font-family: 'Syncopate', sans-serif;
  font-size: 28px;
  font-weight: 300;
  color: #e8554e;
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
  padding: 16px 32px;
  background: linear-gradient(135deg, #e8554e, #c7453f);
  border: none;
  border-radius: 40px;
  color: #0a1628;
  font-family: 'Syncopate', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(232, 85, 78, 0.3);
}

.explore-btn:hover {
  transform: translateX(-50%) translateY(-3px);
  box-shadow: 0 15px 40px rgba(232, 85, 78, 0.4);
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
  color: #e8554e;
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
  background: #e8554e;
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
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.before-image,
.after-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.placeholder-bg {
  width: 100%;
  height: 100%;
}

.before-bg {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
}

.after-bg {
  background: linear-gradient(135deg, #4a0e0e 0%, #8b0000 50%, #650000 100%);
}

.slider-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #e8554e;
  cursor: ew-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-handle {
  width: 40px;
  height: 40px;
  background: rgba(232, 85, 78, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(232, 85, 78, 0.5);
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
  background: #e8554e;
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
  border: 1px solid rgba(232, 85, 78, 0.4);
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
  color: #e8554e;
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

.legend-color.crimson { background: #e8554e; box-shadow: 0 0 10px rgba(232, 85, 78, 0.5); }
.legend-color.blue { background: #4a7ab0; box-shadow: 0 0 10px rgba(74, 122, 176, 0.5); }
.legend-color.purple { background: #8a5a9a; box-shadow: 0 0 10px rgba(138, 90, 154, 0.5); }
.legend-color.gray { background: #4a4a5a; }

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
  color: #e8554e;
  text-shadow: 0 0 60px rgba(232, 85, 78, 0.4);
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
  background: linear-gradient(135deg, #e8554e, #c7453f);
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
  box-shadow: 0 10px 30px rgba(232, 85, 78, 0.3);
}

.enter-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(232, 85, 78, 0.4);
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
