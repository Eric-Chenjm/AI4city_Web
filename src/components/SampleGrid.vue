<template>
  <div class="samples-section">
    <div class="section-header">
      <div class="section-title-group">
        <span class="section-tag">SAMPLES</span>
        <h2 class="section-title">TRAINING DATA SAMPLES</h2>
        <span class="section-count">{{ allSamples.length }} TOTAL</span>
      </div>
    </div>
    <div class="samples-grid">
      <div
        v-for="sample in paginatedSamples"
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
    <div class="pagination-controls">
      <button
        class="pagination-btn"
        :class="{ disabled: currentPage === 1 }"
        :disabled="currentPage === 1"
        @click="$emit('prev')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="pagination-numbers">
        <button
          v-for="page in displayPages"
          :key="page"
          class="pagination-number"
          :class="{ active: currentPage === page }"
          @click="page !== '...' && $emit('go', page)"
        >
          {{ page }}
        </button>
      </div>
      <button
        class="pagination-btn"
        :class="{ disabled: currentPage === totalPages }"
        :disabled="currentPage === totalPages"
        @click="$emit('next')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  allSamples: { type: Array, default: () => [] },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 12 }
})

defineEmits(['select', 'prev', 'next', 'go'])

const totalPages = computed(() => Math.ceil(props.allSamples.length / props.pageSize))

const paginatedSamples = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize
  return props.allSamples.slice(start, start + props.pageSize)
})

const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = props.currentPage
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})
</script>

<style scoped>
.samples-section {
  position: relative;
  z-index: 1;
}

.section-header {
  margin-bottom: 20px;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.sample-card {
  background: rgba(15, 28, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.sample-card:hover {
  border-color: rgba(232, 85, 78, 0.4);
  transform: translateY(-2px);
}

.sample-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%;
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
  padding: 12px;
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
  margin-top: 8px;
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

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.pagination-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 16px;
  height: 16px;
}

.pagination-numbers {
  display: flex;
  gap: 6px;
}

.pagination-number {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-number:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.pagination-number.active {
  color: #ffffff;
  background: rgba(232, 85, 78, 0.2);
}

.pagination-info {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-left: 8px;
}

@media (max-width: 1200px) {
  .samples-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .samples-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>