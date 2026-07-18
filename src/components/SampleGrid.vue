<template>
  <div class="samples-section" :class="{ 'no-border': !bordered }">
    <div class="section-header" v-if="bordered">
      <div class="section-title-group">
        <span class="section-tag">SAMPLES</span>
        <h2 class="section-title">{{ $t('analyze.streetDataSamples') }}</h2>
        <span class="section-count">{{ allSamples.length }} {{ $t('common.total') }}</span>
      </div>
    </div>
    <div class="samples-body">
      <div class="samples-grid">
        <div
          v-for="sample in allSamples"
          :key="sample.id"
          class="sample-card"
          @click="$emit('select', sample)"
        >
          <div class="sample-image-wrapper">
            <img :src="sample.image" :alt="sample.location" class="sample-image" />
            <div class="sample-overlay">
              <span class="overlay-icon">+</span>
            </div>
            <div class="sample-region-badge" :class="'region-' + sample.region">{{ sample.region }}</div>
          </div>
          <div class="sample-info">
            <span class="sample-location">{{ sample.location }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  allSamples: { type: Array, default: () => [] },
  bordered: { type: Boolean, default: true }
})

defineEmits(['select'])
</script>

<style scoped>
.samples-section {
  position: relative;
  z-index: 1;
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.samples-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-header {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #005BAC;
  background: rgba(0, 91, 172, 0.1);
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 1px;
}

.section-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;
  margin: 0;
}

.section-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.samples-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  flex: 1;
  align-content: stretch;
}

.sample-card {
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.sample-card:hover {
  border-color: rgba(0, 91, 172, 0.4);
  transform: translateY(-2px);
}

.sample-image-wrapper {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.sample-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sample-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.sample-card:hover .sample-overlay {
  opacity: 1;
}

.overlay-icon {
  font-family: 'Syncopate', sans-serif;
  font-size: 32px;
  color: #005BAC;
}

.sample-region-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 8px;
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  z-index: 2;
}

.region-HH {
  background: rgba(0, 91, 172, 0.9);
  color: #fff;
}

.region-HL {
  background: rgba(184, 116, 42, 0.9);
  color: #fff;
}

.region-LH {
  background: rgba(0, 181, 216, 0.9);
  color: #fff;
}

.region-LL {
  background: rgba(84, 86, 90, 0.9);
  color: #fff;
}

.sample-info {
  padding: 8px 10px;
  flex-shrink: 0;
}

.sample-location {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
}

@media (max-width: 1200px) {
  .samples-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .samples-grid {
    grid-template-columns: repeat(2, 1fr);
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
