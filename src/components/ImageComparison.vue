<template>
  <div class="image-comparison">
    <div class="image-card">
      <div class="image-label">
        <span class="label-dot original"></span>
        ORIGINAL IMAGE
      </div>
      <div class="image-wrapper">
        <img v-if="originalImage" :src="originalImage" alt="Original" />
        <div v-else class="image-placeholder">
          <span>Upload original image</span>
        </div>
      </div>
    </div>
    <div class="vs-divider">
      <span>→</span>
    </div>
    <div class="image-card">
      <div class="image-label">
        <span class="label-dot structure"></span>
        STRUCTURE DIAGRAM
      </div>
      <div class="image-wrapper">
        <template v-if="isAnalyzing">
          <div class="loading-overlay">
            <div class="loading-ring"></div>
            <p class="loading-text">ANALYZING</p>
            <p class="loading-hint">Extracting structure indicators</p>
          </div>
        </template>
        <img v-else-if="structureImage" :src="structureImage" alt="Structure" />
        <div v-else class="image-placeholder pending">
          <span>Upload structure diagram</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  originalImage: { type: String, default: null },
  structureImage: { type: String, default: null },
  isAnalyzing: { type: Boolean, default: false }
})
</script>

<style scoped>
.image-comparison {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.image-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(15, 28, 48, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
}

.image-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.label-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.label-dot.original { background: #5a7a9a; }
.label-dot.structure { background: #e8554e; }

.image-wrapper {
  flex: 1;
  position: relative;
  min-height: 200px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
}

.image-placeholder.pending {
  background: rgba(232, 85, 78, 0.05);
  color: rgba(232, 85, 78, 0.4);
}

.vs-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  font-family: 'Syncopate', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: rgba(232, 85, 78, 0.5);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(10, 22, 40, 0.9);
  gap: 12px;
}

.loading-ring {
  width: 48px;
  height: 48px;
  border: 2px solid rgba(232, 85, 78, 0.2);
  border-top-color: #e8554e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-family: 'Syncopate', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #e8554e;
  letter-spacing: 2px;
  margin: 0;
}

.loading-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

@media (max-width: 768px) {
  .image-comparison {
    flex-direction: column;
  }
  .vs-divider {
    width: 100%;
    padding: 8px 0;
  }
}
</style>