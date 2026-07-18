<template>
  <div class="method-page" ref="containerRef">
    <!-- Progress Nav -->
    <nav class="progress-nav">
      <div class="nav-brand">
        <span class="brand-tag">{{ t('methodBrand') }}</span>
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
          <span class="dot-label">{{ chapter.nav }}</span>
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
          <span class="chapter-tag">{{ t('chapterOne') }}</span>
          <h1 class="chapter-title">{{ t('chapterOneTitle') }}</h1>
          <p class="chapter-desc">{{ t('chapterOneDesc') }}</p>
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
                <span class="flow-step">{{ t('STEP') }} {{ String(i + 1).padStart(2, '0') }}</span>
                <span class="flow-name">{{ step.name }}</span>
                <span class="flow-detail">{{ step.detail }}</span>
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
            {{ t('coreIdeaText') }}
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
          <span class="chapter-tag">{{ t('chapterTwo') }}</span>
          <h1 class="chapter-title">{{ t('chapterTwoTitle') }}</h1>
          <p class="chapter-desc">{{ t('chapterTwoDesc') }}</p>
        </div>

        <div class="indicators-layout">
          <!-- Explicit Indicators (Left) -->
          <div class="indicator-column">
            <div class="column-header">
              <span class="column-dot explicit"></span>
              <h2 class="column-title">{{ t('explicitIndicatorsTitle') }}</h2>
              <span class="column-count">{{ t('dimensionsCount8') }}</span>
            </div>
            <div class="indicator-list">
              <div class="indicator-item" v-for="(item, i) in explicitIndicators" :key="item.name" :style="{ animationDelay: (i * 0.05) + 's' }">
                <div class="indicator-icon-wrap">
                  <span class="indicator-icon" v-html="item.icon"></span>
                </div>
                <div class="indicator-body">
                  <span class="indicator-name">{{ item.name }}</span>
                  <span class="indicator-desc">{{ item.desc }}</span>
                </div>
                <span class="indicator-tag">E{{ String(i + 1).padStart(2, '0') }}</span>
              </div>
            </div>
          </div>

          <!-- Implicit Indicators (Right) -->
          <div class="indicator-column">
            <div class="column-header">
              <span class="column-dot implicit"></span>
              <h2 class="column-title">{{ t('implicitIndicatorsTitle') }}</h2>
              <span class="column-count">{{ t('dimensionsCount6') }}</span>
            </div>
            <div class="indicator-list">
              <div class="indicator-item" v-for="(item, i) in implicitIndicators" :key="item.name" :style="{ animationDelay: (i * 0.05) + 's' }">
                <div class="indicator-icon-wrap">
                  <span class="indicator-icon" v-html="item.icon"></span>
                </div>
                <div class="indicator-body">
                  <span class="indicator-name">{{ item.name }}</span>
                  <span class="indicator-desc">{{ item.desc }}</span>
                </div>
                <span class="indicator-tag">I{{ String(i + 1).padStart(2, '0') }}</span>
              </div>
            </div>
            <div class="llm-note">
              <span class="note-icon">◈</span>
              <span class="note-text">{{ t('llmNoteText') }}</span>
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
          <span class="chapter-tag">{{ t('chapterThree') }}</span>
          <h1 class="chapter-title">{{ t('chapterThreeTitle') }}</h1>
          <p class="chapter-desc">{{ t('chapterThreeDesc') }}</p>
        </div>

        <div class="tech-layout">
          <!-- LLM Pipeline -->
          <div class="tech-card">
            <div class="tech-card-header">
              <span class="tech-tag">{{ t('techPipelineTag') }}</span>
              <h3 class="tech-card-title">{{ t('techPipelineTitle') }}</h3>
            </div>
            <div class="llm-pipeline">
              <div class="pipeline-stage">
                <div class="stage-box input">
                  <span class="stage-label">{{ t('techInput') }}</span>
                  <span class="stage-name">{{ t('techInputVal') }}</span>
                </div>
              </div>
              <div class="pipeline-arrow">
                <svg viewBox="0 0 60 12" fill="none">
                  <path d="M0 6 L50 6 M45 2 L50 6 L45 10" stroke="currentColor" stroke-width="1.5" />
                </svg>
              </div>
              <div class="pipeline-stage">
                <div class="stage-box process">
                  <span class="stage-label">{{ t('techProcess') }}</span>
                  <span class="stage-name">{{ t('techProcessVal') }}</span>
                  <span class="stage-sub">{{ t('techProcessSub') }}</span>
                </div>
              </div>
              <div class="pipeline-arrow">
                <svg viewBox="0 0 60 12" fill="none">
                  <path d="M0 6 L50 6 M45 2 L50 6 L45 10" stroke="currentColor" stroke-width="1.5" />
                </svg>
              </div>
              <div class="pipeline-stage">
                <div class="stage-box output">
                  <span class="stage-label">{{ t('techOutput') }}</span>
                  <span class="stage-name">{{ t('techOutputVal') }}</span>
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
              <span class="tech-tag">{{ t('techClusteringTag') }}</span>
              <h3 class="tech-card-title">{{ t('techClusteringTitle') }}</h3>
            </div>
            <div ref="scatterChart" class="scatter-chart" @click="handleScatterClick"></div>
            <div class="algo-note">
              <p><strong>{{ t('dbscanQuestion') }}</strong> {{ t('dbscanAnswer') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter 4: Generalization -->
    <section class="chapter" ref="chapter3">
      <div class="chapter-bg">
        <div class="chapter-number">04</div>
      </div>
      <div class="chapter-content">
        <div class="chapter-header">
          <span class="chapter-tag">{{ t('chapterFour') }}</span>
          <h1 class="chapter-title">{{ t('chapterFourTitle') }}</h1>
          <p class="chapter-desc">{{ t('chapterFourDesc') }}</p>
        </div>

        <!-- Transfer Flow -->
        <div class="transfer-flow">
          <div class="transfer-card">
            <div class="transfer-label">{{ t('sourceDomain') }}</div>
            <div class="transfer-visual shanghai">
              <div class="mini-map">
                <div class="map-dot" v-for="i in 20" :key="i" :style="getMapDotStyle(i)"></div>
              </div>
              <span class="transfer-name">{{ t('shanghaiCentral') }}</span>
              <span class="transfer-sub">{{ t('clusteringResult') }}</span>
            </div>
          </div>
          <div class="transfer-middle">
            <div class="transfer-arrow-svg">
              <svg viewBox="0 0 120 40" fill="none">
                <path d="M5 20 L100 20 M90 10 L105 20 L90 30" stroke="currentColor" stroke-width="2" />
              </svg>
            </div>
            <span class="transfer-label-middle">{{ t('modelGeneralization') }}</span>
          </div>
          <div class="transfer-card">
            <div class="transfer-label">{{ t('targetDomain') }}</div>
            <div class="transfer-card target">
              <div class="mini-island">
                <div class="island-shape"></div>
              </div>
              <span class="transfer-name">{{ t('fuxingIslandName') }}</span>
              <span class="transfer-sub">{{ t('renewalZoning') }}</span>
            </div>
          </div>
        </div>

        <!-- Fuxing Island Zones -->
        <div class="zones-grid">
          <div class="zone-card" v-for="(zone, i) in fuxingZones" :key="zone.id" :style="{ animationDelay: (i * 0.1) + 's' }">
            <div class="zone-header">
              <span class="zone-marker" :style="{ background: zone.color }"></span>
              <span class="zone-type">{{ t('ZONE') }} {{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <div class="zone-icon" v-html="zone.icon"></div>
            <h3 class="zone-name">{{ zone.name }}</h3>
            <p class="zone-feature">{{ zone.feature }}</p>
            <div class="zone-divider"></div>
            <div class="zone-strategy">
              <span class="strategy-label">{{ t('strategyLabel') }}</span>
              <p class="strategy-text">{{ zone.strategy }}</p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <router-link to="/generate" class="cta-button">
          <span class="cta-text">{{ t('ctaBtnText') }}</span>
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
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { useLang } from '../composables/useLang.js'

const { t, currentLang } = useLang()

const containerRef = ref(null)
const chapter0 = ref(null)
const chapter1 = ref(null)
const chapter2 = ref(null)
const chapter3 = ref(null)
const scatterChart = ref(null)

const activeChapter = ref(0)
const activeFlowNode = ref(-1)
const scrollProgress = ref(0)

const chapters = computed(() => [
  { id: 0, nav: currentLang.value === 'en' ? 'FRAMEWORK' : '分析框架' },
  { id: 1, nav: currentLang.value === 'en' ? 'INDICATORS' : '指标底座' },
  { id: 2, nav: currentLang.value === 'en' ? 'TECHNOLOGY' : '算法实现' },
  { id: 3, nav: currentLang.value === 'en' ? 'APPLICATION' : '推演应用' }
])

const flowSteps = computed(() => [
  { id: 1, name: currentLang.value === 'en' ? 'Data Collection' : '数据收集', detail: currentLang.value === 'en' ? 'POI, roads, streetscapes' : '路网、POI与街景影像', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>' },
  { id: 2, name: currentLang.value === 'en' ? 'Feature Extraction' : '特征提取', detail: currentLang.value === 'en' ? 'Explicit + implicit fusion' : '双域融合指标特征工程', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
  { id: 3, name: currentLang.value === 'en' ? 'Cluster Analysis' : '空间聚类', detail: currentLang.value === 'en' ? 'DBSCAN density clustering' : 'DBSCAN无监督空间聚类', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/></svg>' },
  { id: 4, name: currentLang.value === 'en' ? 'Spatial Identification' : '空间识别', detail: currentLang.value === 'en' ? 'Innovation space typology' : '自动识别创新空间类型', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/></svg>' },
  { id: 5, name: currentLang.value === 'en' ? 'Generalization' : '空间推演', detail: currentLang.value === 'en' ? 'Transfer to Fuxing Island' : '外推至复兴岛更新实践', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12h18M12 3v18M5 5l14 14M19 5L5 19"/></svg>' }
])

const explicitIndicators = computed(() => [
  { name: currentLang.value === 'en' ? 'Tech Institution Density' : '科创科研机构密度', desc: currentLang.value === 'en' ? 'R&D labs, universities, incubators' : '格网内研发实验室、高校和孵化载体数量', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
  { name: currentLang.value === 'en' ? 'High-Tech Enterprise' : '高新技术企业分布', desc: currentLang.value === 'en' ? 'Certified tech company count' : '官方认定及登记的高新技术企业数', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg>' },
  { name: currentLang.value === 'en' ? 'Transit Accessibility' : '公共交通网络可达', desc: currentLang.value === 'en' ? 'Metro/bus network coverage' : '公交站点与地铁口步行可达覆盖范围', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16M8 17v4M16 17v4"/></svg>' },
  { name: currentLang.value === 'en' ? 'Maker Space Count' : '众创空间设施数量', desc: currentLang.value === 'en' ? 'Co-working & maker facilities' : '各类共享联合办公、青年创客空间数', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { name: currentLang.value === 'en' ? 'R&D Investment' : '科学研究资金投入', desc: currentLang.value === 'en' ? 'Research expenditure intensity' : '区域内各单元研发经费支出密集程度', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { name: currentLang.value === 'en' ? 'Patent Output' : '发明专利产出密度', desc: currentLang.value === 'en' ? 'Innovation patent density' : '格网范围内每平方公里专利授权总数', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' },
  { name: currentLang.value === 'en' ? 'Talent Agglomeration' : '科技创新人才集聚', desc: currentLang.value === 'en' ? 'Skilled workforce concentration' : '高等教育背景及技能创新劳动力比例', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { name: currentLang.value === 'en' ? 'Industry Supporting' : '多功能用地混合度', desc: currentLang.value === 'en' ? 'Land-use diversity (Shannon-H entropy)' : '基于香农-威纳指数计算的用地混合度', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 20h20M4 20V8l8-5 8 5v12M9 20v-6h6v6"/></svg>' }
])

const implicitIndicators = computed(() => [
  { name: currentLang.value === 'en' ? 'Creativity Density' : '创意活力视觉感知', desc: currentLang.value === 'en' ? 'Artistic & creative atmosphere' : '艺术彩绘、趣味陈设及创意街区感知', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.5 0 1-.5 1-1v-1c0-.5.5-1 1-1h2c2.5 0 4-2 4-4.5C20 8 16.5 2 12 2z"/></svg>' },
  { name: currentLang.value === 'en' ? 'Interaction Density' : '交往交往活力感知', desc: currentLang.value === 'en' ? 'Social exchange frequency' : '支持人群自发停留与户外交流场景感知', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  { name: currentLang.value === 'en' ? 'City Integration' : '生活功能交融感知', desc: currentLang.value === 'en' ? 'Urban function mixing degree' : '日常商业配套与城市界面的整合度', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
  { name: currentLang.value === 'en' ? 'Eco-Friendliness' : '生态环境友好感知', desc: currentLang.value === 'en' ? 'Green & sustainable perception' : '绿化覆盖茂密程度与生态亲水性视觉感知', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20M12 2a10 10 0 0 0 0 20M12 2a10 10 0 0 1 0 20"/></svg>' },
  { name: currentLang.value === 'en' ? 'Cultural Identity' : '历史风貌认同感知', desc: currentLang.value === 'en' ? 'Heritage & local character' : '工业遗存、历史风貌和地方特色视觉识别', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/></svg>' },
  { name: currentLang.value === 'en' ? 'Future Perception' : '未来科创渗透感知', desc: currentLang.value === 'en' ? 'Tech-forward & visionary feel' : '智慧硬件设备、前瞻科技物理感官体验', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>' }
])

const exampleScores = computed(() => currentLang.value === 'en'
  ? [
      { name: 'CREAT', value: 82 },
      { name: 'INTER', value: 68 },
      { name: 'INTEG', value: 75 },
      { name: 'ECO', value: 45 },
      { name: 'CULT', value: 88 },
      { name: 'FUTUR', value: 60 }
    ]
  : [
      { name: '认同感', value: 82 },
      { name: '创新氛围', value: 68 },
      { name: '空间意象', value: 75 },
      { name: '科技渗透', value: 45 },
      { name: '工作效率', value: 88 },
      { name: '幸福感', value: 60 }
    ])

const fuxingZones = computed(() => [
  { id: 'core', color: '#005BAC', name: currentLang.value === 'en' ? 'Innovation Core' : '核心创新引领区', feature: currentLang.value === 'en' ? 'High explicit + High implicit — dense innovation ecosystem' : '双高空间 (高显性 & 高隐性) —— 创新网络高密度核心', strategy: currentLang.value === 'en' ? 'Upgrade shared workspaces and creative workshops; strengthen tech-transfer platforms.' : '全面提升共享孵化载体与众创空间能级，强化校企技术转移平台。', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"/></svg>' },
  { id: 'activate', color: '#005BAC', name: currentLang.value === 'en' ? 'Activation Zone' : '活力空间唤醒区', feature: currentLang.value === 'en' ? 'High explicit + Low implicit — infrastructure-ready but lacking atmosphere' : '理性空间 (高显性 & 低隐性) —— 设施硬件完备但人本氛围不足', strategy: currentLang.value === 'en' ? 'Inject cultural programming and public art; activate street-level engagement.' : '引入文创策展、公共艺术装置，激活街区底商和人本活动粘性。', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
  { id: 'catalyst', color: '#00B5D8', name: currentLang.value === 'en' ? 'Catalyst Zone' : '催化培育协同区', feature: currentLang.value === 'en' ? 'Low explicit + High implicit — vibrant atmosphere but lacking formal institutions' : '感性空间 (低显性 & 高隐性) —— 自发交流活跃但缺乏龙头企业', strategy: currentLang.value === 'en' ? 'Attract anchor tech tenants; formalize creative clusters with policy support.' : '制定税收返还等精准产业支持导则，吸引头部科技创新载体入驻。', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
  { id: 'develop', color: '#54565A', name: currentLang.value === 'en' ? 'Development Zone' : '生态整备预留区', feature: currentLang.value === 'en' ? 'Dual-low — future potential areas' : '双低空间 (低显性 & 低隐性) —— 长期战略弹性留白区', strategy: currentLang.value === 'en' ? 'Phase long-term development; prioritize infrastructure and land preparation.' : '分期分批推进，优先保障大尺度生态绿带建设和市政基础设施整备。', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3h18v18H3z M3 9h18 M9 21V9"/></svg>' }
])

const getMapDotStyle = (i) => {
  const colors = ['#005BAC', '#005BAC', '#00B5D8', '#54565A']
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
  
  if (scatterChartInstance) {
    scatterChartInstance.dispose()
  }
  
  scatterChartInstance = echarts.init(scatterChart.value)

  const clusterData = {
    core: { 
      name: currentLang.value === 'en' ? 'Innovation Core' : '核心创新区', 
      color: '#005BAC', 
      data: [] 
    },
    activate: { 
      name: currentLang.value === 'en' ? 'Activation Zone' : '潜力激活区', 
      color: '#005BAC', 
      data: [] 
    },
    catalyst: { 
      name: currentLang.value === 'en' ? 'Catalyst Zone' : '催化培育区', 
      color: '#00B5D8', 
      data: [] 
    },
    develop: { 
      name: currentLang.value === 'en' ? 'Development Zone' : '整备开发区', 
      color: '#54565A', 
      data: [] 
    }
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
      formatter: (params) => {
        const clusterName = clusterData[params.seriesId.split('_').slice(-1)[0]]?.name || params.seriesName
        return currentLang.value === 'en'
          ? `Cluster: ${clusterName}<br/>Explicit: ${params.value[0].toFixed(2)}<br/>Implicit: ${params.value[1].toFixed(2)}`
          : `聚类类别: ${clusterName}<br/>显性维度值: ${params.value[0].toFixed(2)}<br/>隐性维度值: ${params.value[1].toFixed(2)}`
      }
    },
    grid: { left: '8%', right: '5%', top: '8%', bottom: '12%' },
    xAxis: {
      type: 'value',
      name: currentLang.value === 'en' ? 'EXPLICIT' : '显性物理底座',
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
      name: currentLang.value === 'en' ? 'IMPLICIT' : '隐性人本感知',
      nameLocation: 'middle',
      nameGap: 32,
      nameTextStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
      min: 0, max: 1,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: Object.keys(clusterData).map(key => ({
      id: `series_${key}`,
      name: clusterData[key].name,
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

watch(currentLang, () => {
  nextTick(() => {
    initScatter()
  })
})

const handleScatterClick = () => {
  // Click handler for scatter interaction
}

const scrollToChapter = (index) => {
  const refs = [chapter0, chapter1, chapter2, chapter3]
  refs[index]?.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleScroll = () => {
  if (!containerRef.value) return
  const scrollTop = containerRef.value.scrollTop
  const scrollHeight = containerRef.value.scrollHeight - containerRef.value.clientHeight
  scrollProgress.value = (scrollTop / scrollHeight) * 100

  // Determine active chapter
  const sections = [chapter0, chapter1, chapter2, chapter3]
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

  height: 100vh;
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
  height: 100vh;
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
}
</style>
