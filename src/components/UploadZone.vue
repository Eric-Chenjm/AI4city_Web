<template>
  <div class="upload-zone">
    <div class="upload-row">
      <div class="upload-item" :class="{ hasImage: originalImage }">
        <input
          ref="originalInput"
          type="file"
          accept="image/jpeg,image/png"
          class="file-input"
          @change="(e) => handleFileSelect(e, 'original')"
        />
        <div v-if="!originalImage" class="upload-placeholder" @click="triggerInput('original')">
          <div class="upload-icon-wrapper">
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p class="upload-text">ORIGINAL IMAGE</p>
          <p class="upload-hint">Click to upload</p>
        </div>
        <div v-else class="upload-preview">
          <img :src="originalImage" alt="Original preview" />
          <button class="clear-btn" @click.stop="$emit('upload:original', null)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div class="upload-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      <div class="upload-item" :class="{ hasImage: structureImage }">
        <input
          ref="structureInput"
          type="file"
          accept="image/jpeg,image/png"
          class="file-input"
          @change="(e) => handleFileSelect(e, 'structure')"
        />
        <div v-if="!structureImage" class="upload-placeholder" @click="triggerInput('structure')">
          <div class="upload-icon-wrapper">
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p class="upload-text">STRUCTURE DIAGRAM</p>
          <p class="upload-hint">Click to upload</p>
        </div>
        <div v-else class="upload-preview">
          <img :src="structureImage" alt="Structure preview" />
          <button class="clear-btn" @click.stop="$emit('upload:structure', null)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="originalImage && structureImage" class="upload-footer">
      <button class="btn-clear-all" @click="$emit('clear')">CLEAR ALL</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  originalImage: { type: String, default: null },
  structureImage: { type: String, default: null }
})

const emit = defineEmits(['upload:original', 'upload:structure', 'clear'])

const originalInput = ref(null)
const structureInput = ref(null)

const triggerInput = (type) => {
  if (type === 'original') {
    originalInput.value?.click()
  } else {
    structureInput.value?.click()
  }
}

const handleFileSelect = (event, type) => {
  const file = event.target.files?.[0]
  if (file) processFile(file, type)
}

const processFile = (file, type) => {
  if (file.size > 10 * 1024 * 1024) {
    alert('File size exceeds 10MB limit')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    emit(`upload:${type}`, e.target?.result)
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.upload-zone {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-row {
  display: flex;
  align-items: stretch;
  gap: 12px;
}

.upload-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed rgba(0, 91, 172, 0.3);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-item:hover {
  border-color: rgba(0, 91, 172, 0.6);
  background: rgba(0, 91, 172, 0.05);
}

.upload-item.hasImage {
  border-style: solid;
  border-color: rgba(0, 91, 172, 0.5);
  padding: 0;
  min-height: 150px;
}

.file-input {
  display: none;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon-wrapper {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0, 91, 172, 0.4);
  border-radius: 50%;
  color: rgba(0, 91, 172, 0.8);
  transition: all 0.3s ease;
}

.upload-item:hover .upload-icon-wrapper {
  border-color: #005BAC;
  color: #005BAC;
  transform: scale(1.1);
}

.upload-icon {
  width: 22px;
  height: 22px;
}

.upload-text {
  font-family: 'Syncopate', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}

.upload-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.upload-preview {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 150px;
  border-radius: 8px;
  overflow: hidden;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clear-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(0, 91, 172, 0.8);
  border-color: #005BAC;
}

.clear-btn svg {
  width: 14px;
  height: 14px;
}

.upload-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  color: rgba(255, 255, 255, 0.3);
}

.upload-arrow svg {
  width: 20px;
  height: 20px;
}

.upload-footer {
  display: flex;
  justify-content: center;
}

.btn-clear-all {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear-all:hover {
  border-color: rgba(0, 91, 172, 0.5);
  color: var(--crimson);
}

@media (max-width: 768px) {
  .upload-row {
    flex-direction: column;
  }
  .upload-arrow {
    width: 100%;
    padding: 8px 0;
    transform: rotate(90deg);
  }
}
</style>
