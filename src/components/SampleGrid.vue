<template>
  <div class="samples-section" :class="{ 'no-border': !bordered }">
    <div class="section-header" v-if="bordered">
      <div class="section-title-group">
        <span class="section-tag">SAMPLES</span>
        <h2 class="section-title">TRAINING DATA SAMPLES</h2>
        <span class="section-count">{{ allSamples.length }} TOTAL</span>
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
          </div>
          <div class="sample-info">
            <span class="sample-location">{{ sample.location }}</span>
            <div class="sample-tags">
              <span v-for="tag in sample.tags.slice(0, 3)" :key="tag.name" class="sample-tag" :class="{ active: tag.active }">
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  color: #e8554e;
  background: rgba(232, 85, 78, 0.1);
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
  border-color: rgba(232, 85, 78, 0.4);
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
  color: #e8554e;
}

.sample-info {
  padding: 10px;
  flex-shrink: 0;
}

.sample-location {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.sample-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.sample-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 2px;
}

.sample-tag.active {
  color: #e8554e;
  background: rgba(232, 85, 78, 0.15);
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
