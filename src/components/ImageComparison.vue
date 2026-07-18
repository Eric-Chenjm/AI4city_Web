<template>
  <div class="image-comparison">
    <!-- 优化前 (Before) -->
    <div class="image-card">
      <div class="image-header">
        <div class="image-label">
          <span class="label-dot before"></span>
          SPATIAL BEFORE (优化前)
        </div>
        <button 
          v-if="originalImage && sceneGraph?.before" 
          class="btn-toggle-graph" 
          :class="{ active: showGraph }"
          @click="showGraph = !showGraph"
        >
          {{ showGraph ? 'HIDE GRAPH' : 'SHOW GRAPH' }}
        </button>
      </div>
      <div class="image-wrapper">
        <img v-if="originalImage" :src="originalImage" alt="Original Scenario" class="scene-img" />
        <div v-else class="image-placeholder">
          <div class="tech-grid"></div>
          <span>Awaiting Image Upload / Selection</span>
        </div>

        <!-- 场景图拓扑层 (Before) -->
        <div v-if="showGraph && originalImage && sceneGraph?.before" class="graph-overlay">
          <svg class="graph-svg">
            <defs>
              <marker id="arrow-before" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.4)" />
              </marker>
            </defs>
            <!-- 关系连线 -->
            <g v-for="(link, i) in sceneGraph.before.links" :key="'link-b-' + i">
              <line
                :x1="getNodeCo(link.source, 'x', sceneGraph.before.nodes) + '%'"
                :y1="getNodeCo(link.source, 'y', sceneGraph.before.nodes) + '%'"
                :x2="getNodeCo(link.target, 'x', sceneGraph.before.nodes) + '%'"
                :y2="getNodeCo(link.target, 'y', sceneGraph.before.nodes) + '%'"
                class="graph-line"
                marker-end="url(#arrow-before)"
              />
              <!-- 关系文本 -->
              <text
                :x="getMidPoint(link.source, link.target, 'x', sceneGraph.before.nodes) + '%'"
                :y="(getMidPoint(link.source, link.target, 'y', sceneGraph.before.nodes) - 1) + '%'"
                class="graph-line-text"
              >
                {{ link.label }}
              </text>
            </g>
            <!-- 节点实体 -->
            <g 
              v-for="node in sceneGraph.before.nodes" 
              :key="'node-b-' + node.id"
              class="graph-node-group"
              :style="{ cursor: 'pointer' }"
            >
              <circle
                :cx="node.x + '%'"
                :cy="node.y + '%'"
                :r="node.size ? node.size / 2.2 : 8"
                class="graph-node"
              />
              <text
                :x="node.x + '%'"
                :y="(node.y + (node.size ? node.size / 1.5 : 12)) + '%'"
                class="graph-node-label"
              >
                {{ node.label }}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- 中间关联指示器 -->
    <div class="vs-divider">
      <div class="divider-glow"></div>
      <div class="divider-text">AIGC<br>OPTIMIZE</div>
      <span class="divider-arrow">→</span>
    </div>

    <!-- 优化后 (After) -->
    <div class="image-card">
      <div class="image-header">
        <div class="image-label">
          <span class="label-dot after"></span>
          SPATIAL AFTER (AI 优化后)
        </div>
        <button 
          v-if="structureImage && sceneGraph?.after" 
          class="btn-toggle-graph" 
          :class="{ active: showGraph }"
          @click="showGraph = !showGraph"
        >
          {{ showGraph ? 'HIDE GRAPH' : 'SHOW GRAPH' }}
        </button>
      </div>
      <div class="image-wrapper">
        <template v-if="isAnalyzing">
          <div class="loading-overlay">
            <div class="loading-ring"></div>
            <p class="loading-text">GENERATING IMAGES</p>
            <p class="loading-hint">Re-evaluating spatial quality index</p>
          </div>
        </template>
        <img v-else-if="structureImage" :src="structureImage" alt="Optimized Scenario" class="scene-img" />
        <div v-else class="image-placeholder pending">
          <div class="tech-grid"></div>
          <span>Awaiting AI Optimization Inference</span>
        </div>

        <!-- 场景图拓扑层 (After) -->
        <div v-if="showGraph && !isAnalyzing && structureImage && sceneGraph?.after" class="graph-overlay">
          <svg class="graph-svg">
            <defs>
              <marker id="arrow-after" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(232,85,78,0.5)" />
              </marker>
            </defs>
            <!-- 关系连线 -->
            <g v-for="(link, i) in sceneGraph.after.links" :key="'link-a-' + i">
              <line
                :x1="getNodeCo(link.source, 'x', sceneGraph.after.nodes) + '%'"
                :y1="getNodeCo(link.source, 'y', sceneGraph.after.nodes) + '%'"
                :x2="getNodeCo(link.target, 'x', sceneGraph.after.nodes) + '%'"
                :y2="getNodeCo(link.target, 'y', sceneGraph.after.nodes) + '%'"
                class="graph-line optimized"
                marker-end="url(#arrow-after)"
              />
              <text
                :x="getMidPoint(link.source, link.target, 'x', sceneGraph.after.nodes) + '%'"
                :y="(getMidPoint(link.source, link.target, 'y', sceneGraph.after.nodes) - 1) + '%'"
                class="graph-line-text optimized"
              >
                {{ link.label }}
              </text>
            </g>
            <!-- 节点实体 -->
            <g 
              v-for="node in sceneGraph.after.nodes" 
              :key="'node-a-' + node.id"
              class="graph-node-group optimized"
            >
              <circle
                :cx="node.x + '%'"
                :cy="node.y + '%'"
                :r="node.size ? node.size / 2.2 : 8"
                class="graph-node optimized"
              />
              <text
                :x="node.x + '%'"
                :y="(node.y + (node.size ? node.size / 1.5 : 12)) + '%'"
                class="graph-node-label"
              >
                {{ node.label }}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  originalImage: { type: String, default: null },
  structureImage: { type: String, default: null },
  isAnalyzing: { type: Boolean, default: false },
  sceneGraph: {
    type: Object,
    default: () => ({ before: null, after: null })
  }
})

const showGraph = ref(true)

// 根据节点ID获取坐标
const getNodeCo = (nodeId, coordinate, nodes) => {
  const node = nodes.find(n => n.id === nodeId)
  return node ? node[coordinate] : 50
}

// 计算中间点用于标签渲染
const getMidPoint = (sourceId, targetId, coordinate, nodes) => {
  const sourceCo = getNodeCo(sourceId, coordinate, nodes)
  const targetCo = getNodeCo(targetId, coordinate, nodes)
  return (sourceCo + targetCo) / 2
}
</script>

<style scoped>
.image-comparison {
  display: flex;
  align-items: stretch;
  gap: 20px;
  width: 100%;
}

.image-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(15, 28, 48, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
}

.image-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.image-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.7);
}

.label-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.label-dot.before { 
  background: #60a5fa; 
  box-shadow: 0 0 6px #60a5fa;
}
.label-dot.after { 
  background: #e8554e; 
  box-shadow: 0 0 6px #e8554e;
}

.btn-toggle-graph {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  padding: 4px 8px;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s;
}

.btn-toggle-graph:hover, .btn-toggle-graph.active {
  background: rgba(232, 85, 78, 0.15);
  border-color: rgba(232, 85, 78, 0.4);
  color: #e8554e;
}

.image-wrapper {
  flex: 1;
  position: relative;
  min-height: 460px;
  height: 460px;
  overflow: hidden;
  background: #050a14;
}

.scene-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
}

/* 场景图叠加层 */
.graph-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.graph-svg {
  width: 100%;
  height: 100%;
}

.graph-line {
  stroke: rgba(96, 165, 250, 0.45);
  stroke-width: 1.5;
  stroke-dasharray: 4;
  animation: lineDash 30s linear infinite;
  pointer-events: auto;
}

.graph-line.optimized {
  stroke: rgba(232, 85, 78, 0.55);
}

@keyframes lineDash {
  to { stroke-dashoffset: -500; }
}

.graph-line-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  fill: rgba(255, 255, 255, 0.45);
  text-anchor: middle;
  background: rgba(0, 0, 0, 0.8);
}

.graph-line-text.optimized {
  fill: rgba(232, 85, 78, 0.8);
}

.graph-node {
  fill: #1e3a8a;
  stroke: #60a5fa;
  stroke-width: 2;
  filter: drop-shadow(0 0 6px rgba(96, 165, 250, 0.7));
  transition: r 0.2s, fill 0.2s;
  pointer-events: auto;
}

.graph-node:hover {
  r: 10;
  fill: #3b82f6;
}

.graph-node.optimized {
  fill: #7f1d1d;
  stroke: #e8554e;
  filter: drop-shadow(0 0 6px rgba(232, 85, 78, 0.8));
}

.graph-node.optimized:hover {
  r: 10;
  fill: #b91c1c;
}

.graph-node-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  fill: #fff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.9);
  text-anchor: middle;
}

/* 科技网格背景占位 */
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 1px;
}

.tech-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 1;
}

.image-placeholder span {
  z-index: 2;
  text-transform: uppercase;
}

.vs-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70px;
  position: relative;
}

.divider-glow {
  position: absolute;
  width: 2px;
  height: 80%;
  background: linear-gradient(180deg, transparent, var(--border-active, #e8554e), transparent);
  box-shadow: 0 0 10px #e8554e;
}

.divider-text {
  font-family: 'Syncopate', sans-serif;
  font-size: 8px;
  font-weight: 700;
  color: #e8554e;
  text-align: center;
  letter-spacing: 1px;
  line-height: 1.4;
  background: #0a1628;
  padding: 8px 0;
  z-index: 2;
}

.divider-arrow {
  font-size: 18px;
  color: #e8554e;
  margin-top: 6px;
  z-index: 2;
  animation: moveArrow 1.5s infinite;
}

@keyframes moveArrow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
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
  background: rgba(10, 22, 40, 0.95);
  gap: 12px;
  z-index: 10;
}

.loading-ring {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(232, 85, 78, 0.1);
  border-top-color: #e8554e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 10px rgba(232, 85, 78, 0.3);
}

.loading-text {
  font-family: 'Syncopate', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #e8554e;
  letter-spacing: 2px;
  margin: 0;
}

.loading-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

@media (max-width: 768px) {
  .image-comparison {
    flex-direction: column;
  }
  .vs-divider {
    width: 100%;
    height: 60px;
    flex-direction: row;
    gap: 12px;
  }
  .divider-glow {
    width: 80%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e8554e, transparent);
  }
  .divider-arrow {
    transform: rotate(90deg);
    animation: moveArrowY 1.5s infinite;
  }
}

@keyframes moveArrowY {
  0%, 100% { transform: rotate(90deg) translateX(0); }
  50% { transform: rotate(90deg) translateX(4px); }
}
</style>