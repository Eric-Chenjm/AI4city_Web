<template>
  <div class="indicator-selector">
    <span class="selector-label">SELECT INDICATOR</span>
    <div class="selector-dropdown" @click="isOpen = !isOpen">
      <div class="selector-display">
        <span class="selector-icon">{{ currentIndicator?.type === 'explicit' ? '◈' : '◉' }}</span>
        <span class="selector-text">{{ currentIndicator?.name || 'Select...' }}</span>
      </div>
      <svg class="selector-arrow" :class="{ open: isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <polyline points="6 9 12 15 18 9" />
      </svg>
      <div v-if="isOpen" class="selector-options">
        <div class="option-group">
          <span class="group-label">EXPLICIT INDICATORS (15)</span>
          <div
            v-for="ind in explicitIndicators"
            :key="ind.id"
            class="option-item"
            :class="{ active: activeIndicator === ind.id }"
            @click.stop="selectIndicator(ind.id)"
          >
            <span class="option-dot explicit"></span>
            <span class="option-name">{{ ind.name }}</span>
            <span v-if="indicatorDataCache[ind.id]" class="option-loaded">✓</span>
          </div>
        </div>
        <div class="option-group">
          <span class="group-label">IMPLICIT INDICATORS (6)</span>
          <div
            v-for="ind in implicitIndicators"
            :key="ind.id"
            class="option-item"
            :class="{ active: activeIndicator === ind.id }"
            @click.stop="selectIndicator(ind.id)"
          >
            <span class="option-dot implicit"></span>
            <span class="option-name">{{ ind.name }}</span>
            <span v-if="indicatorDataCache[ind.id]" class="option-loaded">✓</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  activeIndicator: { type: String, default: 'shannon_h' },
  indicatorDataCache: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:activeIndicator'])

const isOpen = ref(false)

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

const currentIndicator = computed(() => {
  const explicit = explicitIndicators.find(i => i.id === props.activeIndicator)
  if (explicit) return { ...explicit, type: 'explicit' }
  const implicit = implicitIndicators.find(i => i.id === props.activeIndicator)
  if (implicit) return { ...implicit, type: 'implicit' }
  return null
})

const selectIndicator = (indicatorId) => {
  emit('update:activeIndicator', indicatorId)
  isOpen.value = false
}

defineExpose({ explicitIndicators, implicitIndicators })
</script>

<style scoped>
.indicator-selector {
  flex-shrink: 0;
}

.selector-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1.5px;
  display: block;
  margin-bottom: 6px;
}

.selector-dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(20, 40, 65, 0.6);
  border: 1px solid rgba(232, 85, 78, 0.3);
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  min-width: 200px;
  transition: all 0.2s;
}

.selector-dropdown:hover {
  border-color: rgba(232, 85, 78, 0.6);
  background: rgba(20, 40, 65, 0.8);
}

.selector-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selector-icon {
  font-size: 14px;
  color: #e8554e;
}

.selector-text {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selector-arrow {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.4);
  transition: transform 0.2s;
}

.selector-arrow.open {
  transform: rotate(180deg);
}

.selector-options {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(10, 22, 40, 0.98);
  border: 1px solid rgba(232, 85, 78, 0.3);
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.option-group {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.option-group:last-child {
  border-bottom: none;
}

.group-label {
  display: block;
  padding: 6px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1.5px;
  background: rgba(232, 85, 78, 0.05);
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s;
}

.option-item:hover {
  background: rgba(232, 85, 78, 0.1);
}

.option-item.active {
  background: rgba(232, 85, 78, 0.15);
}

.option-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.option-dot.explicit { background: #e8554e; }
.option-dot.implicit { background: #4a9eda; }

.option-name {
  flex: 1;
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.option-item.active .option-name {
  color: #ffffff;
}

.option-loaded {
  font-size: 11px;
  color: #e8554e;
  font-weight: 600;
}
</style>