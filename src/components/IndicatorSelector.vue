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
  { id: 'x2_questionnaire_work_efficiency', name: 'Work Efficiency', field: 'x2_questionnaire_work_efficiency', file: 'implicit/x2_questionnaire_work_efficiency.geojson', desc: 'Perceived work efficiency', unit: '', type: 'implicit' },
  { id: 'x2_questionnaire_work_wellbeing', name: 'Work Wellbeing', field: 'x2_questionnaire_work_wellbeing', file: 'implicit/x2_questionnaire_work_wellbeing.geojson', desc: 'Work wellbeing perception', unit: '', type: 'implicit' }
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