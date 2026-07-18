<template>
  <div class="method-page" ref="containerRef">
    <!-- Progress Nav -->
    <nav class="progress-nav">
      <div class="nav-brand">
        <span class="brand-tag">{{ $t('method.methodology') }}</span>
      </div>
      <div class="nav-dots">
        <button
          v-for="(chapter, i) in chapters"
          :key="chapter.id"
          class="nav-dot"
          :class="{ active: activeChapter === i }"
          @click="scrollToChapter(i)"
        >
          <span class="dot-marker"></span>
          <span class="dot-label">{{ $t(chapter.navKey) }}</span>
        </button>
      </div>
      <div class="nav-progress-bar">
        <div class="nav-progress-fill" :style="{ width: scrollProgress + '%' }"></div>
      </div>
    </nav>

    <!-- Chapter 1: Research Framework -->
    <section class="chapter" ref="chapter0">
      <div class="chapter-bg">
        <div class="chapter-number">01</div>
      </div>
      <div class="chapter-content">
        <div class="chapter-header">
          <span class="chapter-tag">{{ $t('method.chapterOne') }}</span>
          <h1 class="chapter-title">{{ $t('method.researchFramework') }}</h1>
          <p class="chapter-desc">{{ $t('method.chapterOneDesc') }}</p>
        </div>

        <!-- Flowchart -->
        <div class="flowchart">
          <div
            v-for="(step, i) in flowSteps"
            :key="step.id"
            class="flow-node-wrapper"
          >
            <div
              class="flow-node"
              :class="{ active: activeFlowNode === i, visited: i < activeFlowNode }"
              @mouseenter="activeFlowNode = i"
              @mouseleave="activeFlowNode = -1"
            >
              <div class="flow-icon" v-html="step.icon"></div>
              <div class="flow-body">
                <span class="flow-step">STEP {{ String(i + 1).padStart(2, '0') }}</span>
                <span class="flow-name">{{ $t(step.nameKey) }}</span>
                <span class="flow-detail">{{ $t(step.detailKey) }}</span>
              </div>
            </div>
            <div v-if="i < flowSteps.length - 1" class="flow-arrow">
              <svg viewBox="0 0 40 20" fill="none">
                <path d="M0 10 L35 10 M30 5 L35 10 L30 15" stroke="currentColor" stroke-width="1.5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Core Idea -->
        <div class="core-idea">
          <div class="idea-bracket left"></div>
          <p class="idea-text">
            {{ $t('method.coreIdea') }}
          </p>
          <div class="idea-bracket right"></div>
        </div>
      </div>
    </section>

    <!-- Chapter 2: Indicator System -->
    <section class="chapter" ref="chapter1">
      <div class="chapter-bg">
        <div class="chapter-number">02</div>
      </div>
      <div class="chapter-content">
        <div class="chapter-header">
          <span class="chapter-tag">{{ $t('method.chapterTwo') }}</span>
          <h1 class="chapter-title">{{ $t('method.indicatorSystem') }}</h1>
          <p class="chapter-desc">{{ $t('method.chapterTwoDesc') }}</p>
        </div>

        <div class="indicators-layout">
          <!-- Explicit Indicators (Left) -->
          <div class="indicator-column">
            <div class="column-header">
              <span class="column-dot explicit"></span>
              <h2 class="column-title">{{ $t('method.explicitIndicators') }}</h2>
              <span class="column-count">{{ $t('method.fifteenDimensions') }}</span>
            </div>
            <div class="indicator-list">
              <div class="indicator-item" v-for="(item, i) in explicitIndicators" :key="item.nameKey" :style="{ animationDelay: (i * 0.05) + 's' }">
                <div class="indicator-icon-wrap">
                  <span class="indicator-icon" v-html="item.icon"></span>
                </div>
                <div class="indicator-body">
                  <span class="indicator-name">{{ $t(item.nameKey) }}</span>
                  <span class="indicator-desc">{{ $t(item.descKey) }}</span>
                </div>
                <span class="indicator-tag">E{{ String(i + 1).padStart(2, '0') }}</span>
              </div>
            </div>
          </div>

          <!-- Implicit Indicators (Right) -->
          <div class="indicator-column">
            <div class="column-header">
              <span class="column-dot implicit"></span>
              <h2 class="column-title">{{ $t('method.implicitIndicators') }}</h2>
              <span class="column-count">{{ $t('method.sixDimensions') }}</span>
            </div>
            <div class="indicator-list">
              <div class="indicator-item" v-for="(item, i) in implicitIndicators" :key="item.nameKey" :style="{ animationDelay: (i * 0.05) + 's' }">
                <div class="indicator-icon-wrap">
                  <span class="indicator-icon" v-html="item.icon"></span>
                </div>
                <div class="indicator-body">
                  <span class="indicator-name">{{ $t(item.nameKey) }}</span>
                  <span class="indicator-desc">{{ $t(item.descKey) }}</span>
                </div>
                <span class="indicator-tag">I{{ String(i + 1).padStart(2, '0') }}</span>
              </div>
            </div>
            <div class="llm-note">
              <span class="note-icon">◈</span>
              <span class="note-text">{{ $t('method.llmNote') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter 3: Technical Implementation -->
    <section class="chapter" ref="chapter2">
      <div class="chapter-bg">
        <div class="chapter-number">03</div>
      </div>
      <div class="chapter-content">
        <div class="chapter-header">
          <span class="chapter-tag">{{ $t('method.chapterThree') }}</span>
          <h1 class="chapter-title">{{ $t('method.phaseOne') }}</h1>
          <p class="chapter-desc">{{ $t('method.chapterThreeDesc') }}</p>
        </div>

        <div class="tech-layout">
          <!-- LLM Pipeline -->
          <div class="tech-card">
            <div class="tech-card-header">
              <span class="tech-tag">{{ $t('method.pipeline') }}</span>
              <h3 class="tech-card-title">{{ $t('method.llmRecognitionFlow') }}</h3>
            </div>
            <div class="llm-pipeline">
              <div class="pipeline-stage">
                <div class="stage-box input">
                  <span class="stage-label">{{ $t('method.input') }}</span>
                  <span class="stage-name">{{ $t('method.streetscapeImage') }}</span>
                </div>
              </div>
              <div class="pipeline-arrow">
                <svg viewBox="0 0 60 12" fill="none">
                  <path d="M0 6 L50 6 M45 2 L50 6 L45 10" stroke="currentColor" stroke-width="1.5" />
                </svg>
              </div>
              <div class="pipeline-stage">
                <div class="stage-box process">
                  <span class="stage-label">{{ $t('method.process') }}</span>
                  <span class="stage-name">{{ $t('method.largeLanguageModel') }}</span>
                  <span class="stage-sub">{{ $t('method.visionLanguageUnderstanding') }}</span>
                </div>
              </div>
              <div class="pipeline-arrow">
                <svg viewBox="0 0 60 12" fill="none">
                  <path d="M0 6 L50 6 M45 2 L50 6 L45 10" stroke="currentColor" stroke-width="1.5" />
                </svg>
              </div>
              <div class="pipeline-stage">
                <div class="stage-box output">
                  <span class="stage-label">{{ $t('method.output') }}</span>
                  <span class="stage-name">{{ $t('method.scoreVector') }}</span>
                </div>
              </div>
            </div>
            <!-- Example -->
            <div class="llm-example">
              <div class="example-image">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20street%20with%20murals%20and%20outdoor%20cafes%20urban%20life&image_size=square" alt="Example" />
              </div>
              <div class="example-scores">
                <div class="example-score-row" v-for="s in exampleScores" :key="s.name">
                  <span class="ex-score-name">{{ s.name }}</span>
                  <div class="ex-score-bar"><div class="ex-score-fill" :style="{ width: s.value + '%' }"></div></div>
                  <span class="ex-score-val">{{ s.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Clustering Scatter -->
          <div class="tech-card">
            <div class="tech-card-header">
              <span class="tech-tag">{{ $t('method.algorithm') }}</span>
              <h3 class="tech-card-title">{{ $t('method.spatialClustering') }}</h3>
            </div>
            <div ref="scatterChart" class="scatter-chart" @click="handleScatterClick"></div>
            <div class="algo-note">
              <p><strong>{{ $t('method.whyDBSCAN') }}</strong> {{ $t('method.dbscanDesc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter 4: AIGC Generation -->
    <section class="chapter" ref="chapter3">
      <div class="chapter-bg">
        <div class="chapter-number">04</div>
      </div>
      <div class="chapter-content">
        <div class="chapter-header">
          <span class="chapter-tag">{{ $t('method.chapterFour') }}</span>
          <h1 class="chapter-title">{{ $t('method.phaseTwo') }}</h1>
          <p class="chapter-desc">{{ $t('method.chapterFourDesc') }}</p>
        </div>

        <!-- Generation Pipeline -->
        <div class="gen-pipeline">
          <div class="gen-step" v-for="(step, i) in genSteps" :key="i">
            <div class="gen-step-header">
              <span class="gen-step-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="gen-step-title">{{ $t(step.titleKey) }}</span>
            </div>
            <p class="gen-step-desc">{{ $t(step.descKey) }}</p>
            <div class="gen-step-tags">
              <span class="gen-tag" v-for="tag in step.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- Evidence Chain -->
        <div class="evidence-section">
          <h3 class="evidence-title">{{ $t('method.evidenceChainArchitecture') }}</h3>
          <p class="evidence-desc">{{ $t('method.evidenceArchitectureDesc') }}</p>
          <div class="evidence-flow">
            <div class="evidence-node" v-for="(node, i) in evidenceNodes" :key="i">
              <div class="evidence-icon" v-html="node.icon"></div>
              <span class="evidence-label">{{ $t(node.labelKey) }}</span>
              <span class="evidence-sub">{{ $t(node.subKey) }}</span>
            </div>
          </div>
        </div>

        <!-- Case Studies -->
        <div class="gen-cases">
          <h3 class="gen-cases-title">{{ $t('method.validationCases') }}</h3>
          <div class="gen-cases-grid">
            <div class="gen-case-card" v-for="(c, i) in genCases" :key="i">
              <span class="gen-case-type">{{ $t(c.typeKey) }}</span>
              <h4 class="gen-case-name">{{ $t(c.nameKey) }}</h4>
              <p class="gen-case-desc">{{ $t(c.descKey) }}</p>
              <div class="gen-case-metrics">
                <div class="gen-metric" v-for="m in c.metrics" :key="m.labelKey">
                  <span class="gen-metric-val">{{ m.value }}</span>
                  <span class="gen-metric-label">{{ $t(m.labelKey) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter 5: Generalization -->
    <section class="chapter" ref="chapter4">
      <div class="chapter-bg">
        <div class="chapter-number">05</div>
      </div>
      <div class="chapter-content">
        <div class="chapter-header">
          <span class="chapter-tag">{{ $t('method.chapterFive') }}</span>
          <h1 class="chapter-title">{{ $t('method.generalizationApplication') }}</h1>
          <p class="chapter-desc">{{ $t('method.chapterFiveDesc') }}</p>
        </div>

        <!-- Transfer Flow -->
        <div class="transfer-flow">
          <div class="transfer-card">
            <div class="transfer-label">{{ $t('method.sourceDomain') }}</div>
            <div class="transfer-visual shanghai">
              <div class="mini-map">
                <div class="map-dot" v-for="i in 20" :key="i" :style="getMapDotStyle(i)"></div>
              </div>
              <span class="transfer-name">{{ $t('method.shanghaiCentral') }}</span>
              <span class="transfer-sub">{{ $t('method.clusteringResult') }}</span>
            </div>
          </div>
          <div class="transfer-middle">
            <div class="transfer-arrow-svg">
              <svg viewBox="0 0 120 40" fill="none">
                <path d="M5 20 L100 20 M90 10 L105 20 L90 30" stroke="currentColor" stroke-width="2" />
              </svg>
            </div>
            <span class="transfer-label-middle">{{ $t('method.modelGeneralization') }}</span>
          </div>
          <div class="transfer-card">
            <div class="transfer-label">{{ $t('method.targetDomain') }}</div>
            <div class="transfer-card target">
              <div class="mini-island">
                <div class="island-shape"></div>
              </div>
              <span class="transfer-name">{{ $t('method.fuxingIsland') }}</span>
              <span class="transfer-sub">{{ $t('method.renewalZoning') }}</span>
            </div>
          </div>
        </div>

        <!-- Fuxing Island Zones -->
        <div class="zones-grid">
          <div class="zone-card" v-for="(zone, i) in fuxingZones" :key="zone.id" :style="{ animationDelay: (i * 0.1) + 's' }">
            <div class="zone-header">
              <span class="zone-marker" :style="{ background: zone.color }"></span>
              <span class="zone-type">{{ $t('method.zone') }} {{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <div class="zone-icon" v-html="zone.icon"></div>
            <h3 class="zone-name">{{ $t(zone.nameKey) }}</h3>
            <p class="zone-feature">{{ $t(zone.featureKey) }}</p>
            <div class="zone-divider"></div>
            <div class="zone-strategy">
              <span class="strategy-label">{{ $t('method.strategy') }}</span>
              <p class="strategy-text">{{ $t(zone.strategyKey) }}</p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <router-link to="/above" class="cta-button">
          <span class="cta-text">{{ $t('method.exploreThePlatform') }}</span>
          <span class="cta-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'

const { t } = useI18n()

const containerRef = ref(null)
const chapter0 = ref(null)
const chapter1 = ref(null)
const chapter2 = ref(null)
const chapter3 = ref(null)
const chapter4 = ref(null)
const scatterChart = ref(null)

const activeChapter = ref(0)
const activeFlowNode = ref(-1)
const scrollProgress = ref(0)

const chapters = [
  { id: 0, navKey: 'method.framework' },
  { id: 1, navKey: 'method.indicators' },
  { id: 2, navKey: 'method.analyze' },
  { id: 3, navKey: 'method.generate' },
  { id: 4, navKey: 'method.application' }
]

const flowSteps = [
  { id: 1, nameKey: 'method.dataCollection', detailKey: 'method.dataCollectionDetail', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>' },
  { id: 2, nameKey: 'method.featureExtraction', detailKey: 'method.featureExtractionDetail', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
  { id: 3, nameKey: 'method.clusterAnalysis', detailKey: 'method.clusterAnalysisDetail', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/></svg>' },
  { id: 4, nameKey: 'method.spatialIdentification', detailKey: 'method.spatialIdentificationDetail', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/></svg>' },
  { id: 5, nameKey: 'method.generalization', detailKey: 'method.generalizationDetail', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12h18M12 3v18M5 5l14 14M19 5L5 19"/></svg>' }
]

const explicitIndicators = [
  { nameKey: 'method.buildingDensity', descKey: 'method.buildingDensityDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg>' },
  { nameKey: 'method.avgBuildingHeight', descKey: 'method.avgBuildingHeightDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20M4 20h16"/></svg>' },
  { nameKey: 'method.cafeCount', descKey: 'method.cafeCountDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v3M10 2v3M14 2v3"/></svg>' },
  { nameKey: 'method.consumerNearest', descKey: 'method.consumerNearestDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' },
  { nameKey: 'method.culturalNearest', descKey: 'method.culturalNearestDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/></svg>' },
  { nameKey: 'method.farProxy', descKey: 'method.farProxyDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
  { nameKey: 'method.gdpGridValue', descKey: 'method.gdpGridValueDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' },
  { nameKey: 'method.highTechCount', descKey: 'method.highTechCountDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>' },
  { nameKey: 'method.housePriceMean', descKey: 'method.housePriceMeanDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { nameKey: 'method.infrastructureNearest', descKey: 'method.infrastructureNearestDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 20h20M4 20V8l8-5 8 5v12M9 20v-6h6v6"/></svg>' },
  { nameKey: 'method.innovationLandShare', descKey: 'method.innovationLandShareDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' },
  { nameKey: 'method.landUseShannon', descKey: 'method.landUseShannonDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>' },
  { nameKey: 'method.metroNearest', descKey: 'method.metroNearestDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16M8 17v4M16 17v4"/></svg>' },
  { nameKey: 'method.naturalNearest', descKey: 'method.naturalNearestDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20M12 2a10 10 0 000 20M12 2a10 10 0 010 20"/></svg>' },
  { nameKey: 'method.socialNearest', descKey: 'method.socialNearestDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' }
]

const implicitIndicators = [
  { nameKey: 'method.identity', descKey: 'method.identityDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.5 0 1-.5 1-1v-1c0-.5.5-1 1-1h2c2.5 0 4-2 4-4.5C20 8 16.5 2 12 2z"/></svg>' },
  { nameKey: 'method.innovationAtmosphere', descKey: 'method.innovationAtmosphereDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' },
  { nameKey: 'method.spatialImage', descKey: 'method.spatialImageDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
  { nameKey: 'method.techInfluence', descKey: 'method.techInfluenceDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>' },
  { nameKey: 'method.workplaceEfficiency', descKey: 'method.workplaceEfficiencyDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>' },
  { nameKey: 'method.workplaceWellbeing', descKey: 'method.workplaceWellbeingDesc', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20M12 2a10 10 0 000 20M12 2a10 10 0 010 20"/></svg>' }
]

const exampleScores = [
  { name: 'IDENT', value: 82 },
  { name: 'INNOV', value: 68 },
  { name: 'SPATL', value: 75 },
  { name: 'TECH', value: 45 },
  { name: 'WORK', value: 88 },
  { name: 'WELL', value: 60 }
]

const fuxingZones = [
  { id: 'core', color: '#005BAC', nameKey: 'method.innovationCore', featureKey: 'method.innovationCoreFeature', strategyKey: 'method.innovationCoreStrategy', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"/></svg>' },
  { id: 'activate', color: '#B8742A', nameKey: 'method.activationZone', featureKey: 'method.activationZoneFeature', strategyKey: 'method.activationZoneStrategy', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
  { id: 'catalyst', color: '#00B5D8', nameKey: 'method.catalystZone', featureKey: 'method.catalystZoneFeature', strategyKey: 'method.catalystZoneStrategy', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
  { id: 'develop', color: '#54565A', nameKey: 'method.developmentZone', featureKey: 'method.developmentZoneFeature', strategyKey: 'method.developmentZoneStrategy', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3h18v18H3z M3 9h18 M9 21V9"/></svg>' }
]

const genSteps = [
  { titleKey: 'method.ovsgtrInference', descKey: 'method.ovsgtrInferenceDesc', tags: ['Scene Graph', 'Topology', 'Structure Prior'] },
  { titleKey: 'method.aigcStructureEditing', descKey: 'method.aigcStructureEditingDesc', tags: ['Graph Editing', 'What-If Scenarios', 'Density Control'] },
  { titleKey: 'method.imageGeneration', descKey: 'method.imageGenerationDesc', tags: ['Diffusion Model', 'Structure-Guided', 'Photorealistic'] },
  { titleKey: 'method.evidenceChain', descKey: 'method.evidenceChainDesc', tags: ['Traceable', 'Reproducible', 'Auditable'] }
]

const evidenceNodes = [
  { labelKey: 'method.original', subKey: 'method.streetViewImage', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' },
  { labelKey: 'method.structure', subKey: 'method.ovsgtrGraph', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v4l6 6M18 8v4l-6 6"/></svg>' },
  { labelKey: 'method.train', subKey: 'method.modelTraining', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>' },
  { labelKey: 'method.edit', subKey: 'method.graphModification', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' },
  { labelKey: 'method.generate', subKey: 'method.aigcOutput', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
  { labelKey: 'method.evaluate', subKey: 'method.metricsScore', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' }
]

const genCases = [
  { typeKey: 'method.densification', nameKey: 'method.highDensityRetrofit', descKey: 'method.highDensityRetrofitDesc', metrics: [{ value: '+38%', labelKey: 'method.density' }, { value: '-12%', labelKey: 'method.greenLoss' }, { value: '0.87', labelKey: 'method.structureScore' }] },
  { typeKey: 'method.greenCorridor', nameKey: 'method.ecologicalNetwork', descKey: 'method.ecologicalNetworkDesc', metrics: [{ value: '+45%', labelKey: 'method.greenCover' }, { value: '+22%', labelKey: 'method.biodiversity' }, { value: '0.92', labelKey: 'method.structureScore' }] },
  { typeKey: 'method.mixedUse', nameKey: 'method.innovationHub', descKey: 'method.innovationHubDesc', metrics: [{ value: '+60%', labelKey: 'method.diversity' }, { value: '+35%', labelKey: 'method.walkability' }, { value: '0.95', labelKey: 'method.structureScore' }] }
]

const getMapDotStyle = (i) => {
  const colors = ['#005BAC', '#B8742A', '#00B5D8', '#54565A']
  const color = colors[i % 4]
  const left = 10 + (i * 37) % 80
  const top = 15 + (i * 53) % 70
  const size = 4 + (i % 3) * 3
  return {
    left: left + '%',
    top: top + '%',
    width: size + 'px',
    height: size + 'px',
    background: color,
    boxShadow: `0 0 ${size * 2}px ${color}`
  }
}

let scatterChartInstance = null

const initScatter = () => {
  if (!scatterChart.value) return
  scatterChartInstance = echarts.init(scatterChart.value)

  const clusterData = {
    core: { color: '#005BAC', data: [] },
    activate: { color: '#B8742A', data: [] },
    catalyst: { color: '#00B5D8', data: [] },
    develop: { color: '#54565A', data: [] }
  }

  // Generate mock scatter data
  const centers = {
    core: [0.7, 0.75],
    activate: [0.72, 0.3],
    catalyst: [0.28, 0.7],
    develop: [0.25, 0.25]
  }

  Object.keys(centers).forEach(key => {
    const [cx, cy] = centers[key]
    for (let i = 0; i < 15; i++) {
      clusterData[key].data.push([
        cx + (Math.random() - 0.5) * 0.2,
        cy + (Math.random() - 0.5) * 0.2,
        clusterData[key].color
      ])
    }
  })

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(10, 22, 40, 0.95)',
      borderColor: 'rgba(0, 91, 172, 0.3)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      formatter: (params) => `Cluster: ${params.seriesName}<br/>Explicit: ${params.value[0].toFixed(2)}<br/>Implicit: ${params.value[1].toFixed(2)}`
    },
    grid: { left: '8%', right: '5%', top: '8%', bottom: '12%' },
    xAxis: {
      type: 'value',
      name: 'EXPLICIT',
      nameLocation: 'middle',
      nameGap: 28,
      nameTextStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
      min: 0, max: 1,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    yAxis: {
      type: 'value',
      name: 'IMPLICIT',
      nameLocation: 'middle',
      nameGap: 32,
      nameTextStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
      min: 0, max: 1,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: Object.keys(clusterData).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      type: 'scatter',
      data: clusterData[key].data,
      symbolSize: 10,
      itemStyle: {
        color: clusterData[key].color,
        opacity: 0.8,
        shadowBlur: 8,
        shadowColor: clusterData[key].color
      },
      emphasis: {
        itemStyle: { shadowBlur: 15, opacity: 1 }
      }
    }))
  }

  scatterChartInstance.setOption(option)
}

const handleScatterClick = () => {
  // Click handler for scatter interaction
}

const scrollToChapter = (index) => {
  const refs = [chapter0, chapter1, chapter2, chapter3, chapter4]
  refs[index]?.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleScroll = () => {
  if (!containerRef.value) return
  const scrollTop = containerRef.value.scrollTop
  const scrollHeight = containerRef.value.scrollHeight - containerRef.value.clientHeight
  scrollProgress.value = (scrollTop / scrollHeight) * 100

  // Determine active chapter
  const sections = [chapter0, chapter1, chapter2, chapter3, chapter4]
  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].value?.getBoundingClientRect()
    if (rect) {
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        activeChapter.value = i
        break
      }
    }
  }
}

const handleResize = () => {
  scatterChartInstance?.resize()
}

onMounted(() => {
  containerRef.value?.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  nextTick(() => initScatter())
})

onUnmounted(() => {
  containerRef.value?.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  scatterChartInstance?.dispose()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@300;400;500;600;700&display=swap');

.method-page {
  --bg-primary: #0a1628;
  --bg-card: rgba(15, 28, 48, 0.6);
  --gold: #005BAC;
  --gold-light: #004A8C;
  --gold-dim: rgba(0, 91, 172, 0.3);
  --crimson: #005BAC;
  --crimson-dim: rgba(0, 91, 172, 0.3);
  --blue: #00B5D8;
  --purple: #00B5D8;
  --gray: #54565A;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.35);
  --border: rgba(0, 91, 172, 0.15);
  --border-active: rgba(0, 91, 172, 0.5);
  --font-display: 'Syncopate', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Outfit', sans-serif;

  height: calc(100vh - 80px);
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  background: var(--bg-primary);
  font-family: var(--font-body);
  color: var(--text-primary);
  position: relative;
}

/* Progress Nav */
.progress-nav {
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
  border-bottom: 1px solid var(--border);
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--gold);
  background: rgba(0, 91, 172, 0.1);
  border: 1px solid var(--gold-dim);
  padding: 4px 12px;
  border-radius: 3px;
  letter-spacing: 2px;
}

.nav-dots {
  display: flex;
  gap: 8px;
}

.nav-dot {
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

.nav-dot:hover { background: rgba(255, 255, 255, 0.05); }

.dot-marker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
  transition: all 0.3s ease;
}

.nav-dot.active .dot-marker {
  background: var(--gold);
  box-shadow: 0 0 10px var(--gold-dim);
  transform: scale(1.3);
}

.dot-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.nav-dot.active .dot-label { color: var(--gold); }

.nav-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
}

.nav-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--crimson));
  transition: width 0.3s ease;
}

/* Chapter */
.chapter {
  height: calc(100vh - 80px);
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 80px 40px 40px;
}

.chapter-bg {
  position: absolute;
  top: 50%;
  right: -5%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 0;
}

.chapter-number {
  font-family: var(--font-display);
  font-size: 280px;
  font-weight: 700;
  color: rgba(0, 91, 172, 0.03);
  letter-spacing: -10px;
  line-height: 1;
}

.chapter-content {
  position: relative;
  z-index: 1;
  max-width: 1300px;
  width: 100%;
}

/* Chapter Header */
.chapter-header {
  text-align: center;
  margin-bottom: 40px;
}

.chapter-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--gold);
  background: rgba(0, 91, 172, 0.1);
  border: 1px solid var(--gold-dim);
  padding: 4px 12px;
  border-radius: 3px;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.chapter-title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 4px;
  margin-bottom: 12px;
}

.chapter-desc {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* === Chapter 1: Flowchart === */
.flowchart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.flow-node-wrapper {
  display: flex;
  align-items: center;
}

.flow-node {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-width: 180px;
}

.flow-node:hover,
.flow-node.active {
  background: rgba(0, 91, 172, 0.08);
  border-color: var(--gold);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 91, 172, 0.15);
}

.flow-node.visited {
  border-color: var(--crimson-dim);
}

.flow-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 91, 172, 0.08);
  border-radius: 8px;
}

.flow-icon svg {
  width: 20px;
  height: 20px;
  color: var(--gold);
}

.flow-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.flow-step {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.flow-name {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.flow-detail {
  font-size: 10px;
  color: var(--text-muted);
}

.flow-arrow {
  color: var(--gold-dim);
  padding: 0 8px;
  flex-shrink: 0;
}

.flow-arrow svg {
  width: 40px;
  height: 20px;
}

/* Core Idea */
.core-idea {
  display: flex;
  align-items: stretch;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.idea-bracket {
  width: 4px;
  background: linear-gradient(180deg, var(--gold), var(--crimson));
  border-radius: 2px;
  flex-shrink: 0;
}

.idea-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  font-style: italic;
  padding: 8px 0;
}

/* === Chapter 2: Indicators === */
.indicators-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.indicator-column {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  position: relative;
  max-height: 60vh;
  overflow-y: auto;
}

.indicator-column::-webkit-scrollbar { width: 4px; }
.indicator-column::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }

.column-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.column-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.column-dot.explicit { background: var(--crimson); box-shadow: 0 0 10px var(--crimson-dim); }
.column-dot.implicit { background: var(--blue); box-shadow: 0 0 10px rgba(0, 181, 216, 0.3); }

.column-title {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 2px;
  flex: 1;
}

.column-count {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--gold);
  background: rgba(0, 91, 172, 0.1);
  padding: 2px 8px;
  border-radius: 3px;
}

.indicator-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.indicator-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
  animation: fadeInLeft 0.5s ease backwards;
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-15px); }
  to { opacity: 1; transform: translateX(0); }
}

.indicator-item:hover {
  background: rgba(0, 91, 172, 0.05);
  border-color: var(--border-active);
}

.indicator-icon-wrap {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 91, 172, 0.06);
  border-radius: 6px;
}

.indicator-icon svg {
  width: 16px;
  height: 16px;
  color: var(--gold);
}

.indicator-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.indicator-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.indicator-desc {
  font-size: 11px;
  color: var(--text-muted);
}

.indicator-tag {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0;
}

.llm-note {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(0, 181, 216, 0.08);
  border: 1px solid rgba(0, 181, 216, 0.2);
  border-radius: 8px;
  margin-top: 12px;
}

.note-icon {
  font-size: 16px;
  color: var(--blue);
  flex-shrink: 0;
}

.note-text {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* === Chapter 3: Tech === */
.tech-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.tech-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  position: relative;
}

.tech-card::before {
  content: '';
  position: absolute;
  top: -1px; left: -1px;
  width: 12px; height: 12px;
  border-top: 2px solid var(--gold);
  border-left: 2px solid var(--gold);
  border-radius: 12px 0 0 0;
}

.tech-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.tech-tag {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  color: var(--crimson);
  background: rgba(0, 91, 172, 0.1);
  border: 1px solid var(--crimson-dim);
  padding: 2px 8px;
  border-radius: 3px;
  letter-spacing: 1px;
}

.tech-card-title {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 2px;
}

/* LLM Pipeline */
.llm-pipeline {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}

.pipeline-stage {
  flex: 1;
}

.stage-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  border-radius: 8px;
  text-align: center;
}

.stage-box.input {
  background: rgba(0, 91, 172, 0.1);
  border: 1px solid var(--crimson-dim);
}

.stage-box.process {
  background: rgba(0, 91, 172, 0.1);
  border: 1px solid var(--gold-dim);
}

.stage-box.output {
  background: rgba(0, 181, 216, 0.1);
  border: 1px solid rgba(0, 181, 216, 0.3);
}

.stage-label {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.stage-name {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
}

.stage-sub {
  font-size: 9px;
  color: var(--text-muted);
}

.pipeline-arrow {
  color: var(--gold);
  flex-shrink: 0;
}

.pipeline-arrow svg {
  width: 60px;
  height: 12px;
}

/* LLM Example */
.llm-example {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.example-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.example-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.example-scores {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.example-score-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ex-score-name {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-muted);
  width: 40px;
}

.ex-score-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.ex-score-fill {
  height: 100%;
  background: var(--gold);
  border-radius: 2px;
}

.ex-score-val {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--gold);
  font-weight: 700;
  width: 24px;
  text-align: right;
}

/* Scatter Chart */
.scatter-chart {
  width: 100%;
  height: 260px;
  margin-bottom: 12px;
}

.algo-note {
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid var(--crimson);
  border-radius: 0 6px 6px 0;
  padding: 10px 14px;
}

.algo-note p {
  font-size: 11px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.algo-note strong {
  color: var(--crimson);
}

/* === Chapter 4: Generalization === */
.transfer-flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
  margin-bottom: 32px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.transfer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.transfer-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 2px;
}

.transfer-visual {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
}

.transfer-visual.shanghai {
  border-color: var(--crimson-dim);
}

.transfer-card.target .transfer-visual {
  border-color: var(--gold-dim);
}

.mini-map {
  width: 120px;
  height: 80px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.map-dot {
  position: absolute;
  border-radius: 50%;
}

.mini-island {
  width: 120px;
  height: 80px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.island-shape {
  width: 60px;
  height: 24px;
  background: radial-gradient(ellipse, var(--gold-dim), transparent);
  border-radius: 50%;
}

.transfer-name {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 2px;
}

.transfer-sub {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

.transfer-middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.transfer-arrow-svg {
  color: var(--gold);
}

.transfer-arrow-svg svg {
  width: 120px;
  height: 40px;
}

.transfer-label-middle {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--gold);
  letter-spacing: 2px;
  font-weight: 600;
}

/* Zones Grid */
.zones-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.zone-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.5s ease backwards;
  transition: transform 0.3s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.zone-card:hover { transform: translateY(-5px); }

.zone-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.zone-marker {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.zone-type {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.zone-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
}

.zone-icon svg {
  width: 100%;
  height: 100%;
  color: var(--gold);
}

.zone-name {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.zone-feature {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

.zone-divider {
  height: 1px;
  background: var(--border);
  margin-bottom: 12px;
}

.zone-strategy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.strategy-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--crimson);
  letter-spacing: 1px;
}

.strategy-text {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* === Chapter 4: Generation === */
.gen-pipeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.gen-step {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.gen-step:hover { transform: translateY(-4px); }

.gen-step-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.gen-step-num {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--crimson);
  background: rgba(0, 91, 172, 0.1);
  padding: 2px 6px;
  border-radius: 3px;
}

.gen-step-title {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.gen-step-desc {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 10px;
}

.gen-step-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.gen-tag {
  font-family: var(--font-mono);
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 3px;
}

.evidence-section {
  margin-bottom: 32px;
}

.evidence-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 8px;
}

.evidence-desc {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.evidence-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.evidence-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  min-width: 100px;
  transition: all 0.3s ease;
}

.evidence-node:hover {
  border-color: var(--crimson);
  transform: translateY(-3px);
}

.evidence-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--crimson);
}

.evidence-icon svg {
  width: 24px;
  height: 24px;
}

.evidence-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.evidence-sub {
  font-size: 9px;
  color: var(--text-muted);
}

.gen-cases {
  margin-bottom: 16px;
}

.gen-cases-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 20px;
}

.gen-cases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.gen-case-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.gen-case-card:hover { transform: translateY(-4px); }

.gen-case-type {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--crimson);
  letter-spacing: 1.5px;
  display: block;
  margin-bottom: 8px;
}

.gen-case-name {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.gen-case-desc {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 14px;
}

.gen-case-metrics {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.gen-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.gen-metric-val {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  color: var(--crimson);
}

.gen-metric-label {
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

/* CTA Button */
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 36px;
  background: linear-gradient(135deg, var(--crimson), #003D73);
  border: none;
  border-radius: 40px;
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 91, 172, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 91, 172, 0.4);
}

.cta-arrow svg {
  width: 18px;
  height: 18px;
}

/* Center CTA */
.chapter:last-child .chapter-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .flowchart { flex-direction: column; gap: 12px; }
  .flow-arrow { transform: rotate(90deg); padding: 4px 0; }
  .indicators-layout { grid-template-columns: 1fr; }
  .tech-layout { grid-template-columns: 1fr; }
  .zones-grid { grid-template-columns: repeat(2, 1fr); }
  .transfer-flow { grid-template-columns: 1fr; }
  .chapter-number { font-size: 160px; }
  .gen-pipeline { grid-template-columns: repeat(2, 1fr); }
  .gen-cases-grid { grid-template-columns: 1fr; }
  .evidence-flow { flex-wrap: wrap; }
}

@media (max-width: 768px) {
  .chapter { padding: 80px 16px 20px; }
  .chapter-title { font-size: 20px; letter-spacing: 2px; }
  .nav-dots { display: none; }
  .progress-nav { padding: 10px 16px; }
  .flow-node { min-width: 140px; padding: 12px; }
  .zones-grid { grid-template-columns: 1fr; }
  .llm-example { grid-template-columns: 1fr; }
  .example-image { width: 100%; height: 140px; }
  .gen-pipeline { grid-template-columns: 1fr; }
}
</style>
